/**
 * Abgleich der Maia-Vorbereitung (engine/maia.ts) und des ONNX-Netzes mit dem Original in
 * PyTorch: je Stellung, Wertung und Netz die drei wahrscheinlichsten Züge (maia-pruefwerte.json,
 * erzeugt am 25.10.2026 mit maia2 0.10). Nicht in der CI (braucht onnxruntime-node).
 * Aufruf: npx vitest run --config vitest.messung.config.ts src/engine/maia.messung.ts
 */
import { describe, expect, it } from "vitest";
import pruefwerte from "./maia-pruefwerte.json";
import {
  eloKlasse,
  maiaEingabe,
  maiamodellFuer,
  wahrscheinlichkeitenAus,
  type Maiamodell,
} from "./maia";
import { maiaNode } from "./messung/maia-node.testhilfe";

/** fp16 weicht vom Original um höchstens ein paar Tausendstel ab (Bericht maia-onnx). */
const TOLERANZ = 0.01;

describe("Maia-2 wie im Original", () => {
  const laufzeit = maiaNode();
  for (const modell of ["blitz", "rapid"] as Maiamodell[]) {
    it(`${modell}: dieselben drei wahrscheinlichsten Züge`, async () => {
      for (const fall of pruefwerte[modell]) {
        const eingabe = maiaEingabe(fall.fen);
        if (!eingabe) throw new Error(`keine Eingabe: ${fall.fen}`);
        const logits = await laufzeit.rechne(
          modell,
          eingabe.brett,
          eloKlasse(fall.elo),
          eloKlasse(fall.elo),
        );
        const p = wahrscheinlichkeitenAus(logits, eingabe);
        for (const [uci, wert] of fall.top as [string, number][]) {
          expect(p.get(uci) ?? 0, `${fall.fen} ${fall.elo} ${uci}`).toBeCloseTo(wert, 1);
          expect(Math.abs((p.get(uci) ?? 0) - wert)).toBeLessThan(TOLERANZ);
        }
      }
    });
  }
  it("Zeitklasse → Netz", () => expect(maiamodellFuer("classical")).toBe("rapid"));
});
