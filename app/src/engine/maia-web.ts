/**
 * Laufzeit von Maia-2 in der App (onnxruntime-web, WebAssembly, ein Thread), 0.2.141.
 *
 * Rolle im Gesamtbild: Rechnet das Netz für engine/maia.ts, wenn der Leser das Zusatzpaket geladen
 * und eingeschaltet hat (app/maiapaket.ts). onnxruntime-web wird erst beim ersten Zug mit Maia
 * nachgeladen (eigenes Bündel, etwa 0,5 MB); die Laufzeit-Datei und die Netze kommen aus dem
 * Speicher des Pakets, also auch ohne Netz. Ein Thread genügt (etwa 150 ms je Zug in Chromium,
 * gemessen am 25.10.2026) und braucht keine Cross-Origin-Isolation der Seite.
 * Sonderfall: Schlägt etwas fehl (Paket gelöscht, zu wenig Speicher), wirft rechne(); die Zugwahl
 * spielt dann ohne Maia weiter (engine/maia.ts, maiaabfrage).
 * Abhängigkeiten: engine/maia.ts, app/maiapaket.ts, onnxruntime-web.
 */
import type { InferenceSession } from "onnxruntime-web";
import { maialaufzeitBytes, maiamodellBytes } from "../app/maiapaket";
import { BRETTLAENGE, type Maialaufzeit, type Maiamodell } from "./maia";

type Ort = typeof import("onnxruntime-web");

let ort: Promise<Ort> | null = null;
const sitzungen = new Map<Maiamodell, Promise<InferenceSession>>();

/** onnxruntime-web einmal laden und auf die gespeicherte Laufzeit stellen. */
function ortLaden(): Promise<Ort> {
  ort ??= (async () => {
    const modul = await import("onnxruntime-web");
    modul.env.wasm.numThreads = 1;
    modul.env.wasm.wasmBinary = await maialaufzeitBytes();
    return modul;
  })();
  return ort;
}

function sitzung(modell: Maiamodell): Promise<InferenceSession> {
  const da = sitzungen.get(modell);
  if (da) return da;
  const neu = (async () => {
    const modul = await ortLaden();
    const bytes = new Uint8Array(await maiamodellBytes(modell));
    return modul.InferenceSession.create(bytes, { executionProviders: ["wasm"] });
  })();
  // Fehlgeschlagen: beim nächsten Zug neu versuchen (etwa nach erneutem Laden des Pakets).
  neu.catch(() => sitzungen.delete(modell));
  sitzungen.set(modell, neu);
  return neu;
}

/** Die Laufzeit der App (eine für alle Bots; die Netze werden beim ersten Gebrauch geladen). */
export const MAIA_WEB: Maialaufzeit = {
  async rechne(modell, brett, eloSelbst, eloGegner) {
    const modul = await ortLaden();
    const s = await sitzung(modell);
    const aus = await s.run({
      brett: new modul.Tensor("float32", brett, [1, BRETTLAENGE / 64, 8, 8]),
      elo_selbst: new modul.Tensor("int64", BigInt64Array.from([BigInt(eloSelbst)]), [1]),
      elo_gegner: new modul.Tensor("int64", BigInt64Array.from([BigInt(eloGegner)]), [1]),
    });
    const logits = aus.logits;
    if (!logits) throw new Error("Maia: kein Ausgang „logits“");
    return logits.data as Float32Array;
  },
};

/** Gibt die geladenen Netze frei (nach dem Löschen des Pakets). */
export function maiaFreigeben(): void {
  sitzungen.clear();
  ort = null;
}
