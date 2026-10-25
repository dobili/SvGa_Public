/**
 * Laufzeit von Maia-2 für Messung und Prüfung in Node (onnxruntime-node, nur Entwicklung).
 *
 * Rolle im Gesamtbild: Die Messläufe (engine/stufen.messung.ts) und der Abgleich mit dem Original
 * (engine/maia.messung.ts) rechnen dasselbe Netz wie die App (engine/maia-web.ts), nur schneller.
 * Die Modelle liegen zerlegt in public/maia/ (Teile zu 15 MB, Grenze von Cloudflare 25 MiB je
 * Datei); hier werden die Teile wieder zusammengesetzt.
 * Abhängigkeiten: engine/maia.ts, onnxruntime-node, public/maia/maia.json.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as ort from "onnxruntime-node";
import { BRETTLAENGE, type Maialaufzeit, type Maiamodell } from "./maia";

const ORDNER = join(import.meta.dirname, "../../public/maia");

interface Verzeichnis {
  readonly modelle: Readonly<Record<Maiamodell, { readonly teile: readonly string[] }>>;
}

function modellBytes(modell: Maiamodell): Uint8Array {
  const verzeichnis = JSON.parse(readFileSync(join(ORDNER, "maia.json"), "utf8")) as Verzeichnis;
  const teile = verzeichnis.modelle[modell].teile.map((t) => readFileSync(join(ORDNER, t)));
  return new Uint8Array(Buffer.concat(teile));
}

/** Eine Laufzeit mit beiden Netzen, beim ersten Gebrauch geladen (ein Thread wie im Browser). */
export function maiaNode(): Maialaufzeit {
  const sitzungen = new Map<Maiamodell, Promise<ort.InferenceSession>>();
  const sitzung = (modell: Maiamodell) => {
    const da = sitzungen.get(modell);
    if (da) return da;
    const neu = ort.InferenceSession.create(modellBytes(modell), { intraOpNumThreads: 1 });
    sitzungen.set(modell, neu);
    return neu;
  };
  return {
    async rechne(modell, brett, eloSelbst, eloGegner) {
      const s = await sitzung(modell);
      const aus = await s.run({
        brett: new ort.Tensor("float32", brett, [1, BRETTLAENGE / 64, 8, 8]),
        elo_selbst: new ort.Tensor("int64", BigInt64Array.from([BigInt(eloSelbst)]), [1]),
        elo_gegner: new ort.Tensor("int64", BigInt64Array.from([BigInt(eloGegner)]), [1]),
      });
      const logits = aus.logits;
      if (!logits) throw new Error("Maia: kein Ausgang „logits“");
      return logits.data as Float32Array;
    },
  };
}
