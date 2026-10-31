/**
 * Der Maia-Worker: rechnet das Netz (onnxruntime-web, WebAssembly, ein Thread) in einem eigenen
 * Thread des Browsers.
 *
 * Rolle im Gesamtbild: Befund des Autors (31.10.2026, sechs Jahre altes Handy, Maia an, schnelles
 * Spiel): Die Zuganimation hing, weil Maia im selben Thread wie die Oberfläche rechnete. Hier
 * läuft dieselbe Rechnung wie zuvor in engine/maia-web.ts, nur abseits der Oberfläche; die App
 * schickt Laufzeit und Netz einmal (Nachricht „lade“) und danach je Zug das Brett („rechne“).
 * Die Nachrichten stehen in engine/maiaNachrichten.ts.
 * Sonderfall: Ein Fehler (Netz fehlt, zu wenig Speicher) geht als Antwort „fehler“ zurück; die
 * Zugwahl spielt dann ohne Maia weiter (engine/maia.ts, maiaabfrage).
 * Abhängigkeiten: onnxruntime-web, engine/maia.ts, engine/maiaNachrichten.ts.
 */
import type { InferenceSession } from "onnxruntime-web";
import type { Maiamodell } from "./maia";
import type { AnMaia, VonMaia } from "./maiaNachrichten";

type Ort = typeof import("onnxruntime-web");

/** Was der Worker von seiner Umgebung braucht (ohne die Typen der Fensterumgebung). */
interface Arbeitsumgebung {
  onmessage: ((ereignis: MessageEvent<AnMaia>) => void) | null;
  postMessage(nachricht: VonMaia, uebergabe: Transferable[]): void;
}

/** Felder je Brettebene (8 × 8); die Zahl der Ebenen ergibt sich aus der Länge der Eingabe, damit
 * der Worker engine/maia.ts (mit chessops und der Zugliste) nicht mitladen muss. */
const FELDER = 64;
const SEITE = 8;

const umgebung = self as unknown as Arbeitsumgebung;
let ort: Promise<Ort> | null = null;
const sitzungen = new Map<Maiamodell, Promise<InferenceSession>>();

/** onnxruntime-web einmal laden und auf die mitgeschickte Laufzeit stellen. */
function ortLaden(laufzeit: ArrayBuffer): Promise<Ort> {
  ort ??= (async () => {
    const modul = await import("onnxruntime-web");
    modul.env.wasm.numThreads = 1;
    modul.env.wasm.wasmBinary = laufzeit;
    return modul;
  })();
  ort.catch(() => {
    ort = null;
  });
  return ort;
}

/** Lädt das Netz eines Modells (einmal je Modell; ein Fehlschlag darf neu versucht werden). */
async function lade(auftrag: Extract<AnMaia, { art: "lade" }>): Promise<void> {
  const modul = await ortLaden(auftrag.laufzeit);
  let sitzung = sitzungen.get(auftrag.modell);
  if (!sitzung) {
    sitzung = modul.InferenceSession.create(new Uint8Array(auftrag.netz), {
      executionProviders: ["wasm"],
    });
    sitzung.catch(() => sitzungen.delete(auftrag.modell));
    sitzungen.set(auftrag.modell, sitzung);
  }
  await sitzung;
}

/** Rechnet die Logits; eine Kopie, damit sie ohne Bezug auf den Speicher der Laufzeit reist. */
async function rechne(auftrag: Extract<AnMaia, { art: "rechne" }>): Promise<Float32Array> {
  const sitzung = sitzungen.get(auftrag.modell);
  if (!ort || !sitzung) throw new Error(`Maia: Netz ${auftrag.modell} nicht geladen`);
  const modul = await ort;
  const aus = await (
    await sitzung
  ).run({
    brett: new modul.Tensor("float32", auftrag.brett, [
      1,
      auftrag.brett.length / FELDER,
      SEITE,
      SEITE,
    ]),
    elo_selbst: new modul.Tensor("int64", BigInt64Array.from([BigInt(auftrag.eloSelbst)]), [1]),
    elo_gegner: new modul.Tensor("int64", BigInt64Array.from([BigInt(auftrag.eloGegner)]), [1]),
  });
  const logits = aus.logits;
  if (!logits) throw new Error("Maia: kein Ausgang „logits“");
  return Float32Array.from(logits.data as Float32Array);
}

umgebung.onmessage = (ereignis) => {
  const auftrag = ereignis.data;
  const arbeit: Promise<Float32Array | undefined> =
    auftrag.art === "lade" ? lade(auftrag).then(() => undefined) : rechne(auftrag);
  arbeit.then(
    (logits) =>
      umgebung.postMessage(
        logits ? { nr: auftrag.nr, art: "fertig", logits } : { nr: auftrag.nr, art: "fertig" },
        logits ? [logits.buffer] : [],
      ),
    (grund: unknown) =>
      umgebung.postMessage(
        {
          nr: auftrag.nr,
          art: "fehler",
          meldung: grund instanceof Error ? grund.message : String(grund),
        },
        [],
      ),
  );
};
