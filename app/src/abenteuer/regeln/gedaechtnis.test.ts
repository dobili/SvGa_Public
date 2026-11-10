/** Tests für gedaechtnis.ts: Vergleich der aufgebauten mit der gezeigten Stellung (Runde 6). */
import { describe, expect, it } from "vitest";
import { vergleicheStellung } from "./gedaechtnis";

const SOLL = "6k1/5pp1/8/8/8/8/5PP1/3R2K1 w - - 0 1";

describe("vergleicheStellung", () => {
  it("besteht bei genau gleicher Figurenstellung, wer am Zug ist, zählt nicht", () => {
    expect(vergleicheStellung(SOLL, "6k1/5pp1/8/8/8/8/5PP1/3R2K1 b - - 0 1")).toEqual({
      richtig: 7,
      falsch: 0,
      gesamt: 7,
      bestanden: true,
    });
  });

  it("zählt fehlende, falsche und überzählige Steine", () => {
    expect(vergleicheStellung(SOLL, "6k1/5pp1/8/8/8/8/5PP1/6K1 w - - 0 1")).toMatchObject({
      richtig: 6,
      falsch: 0,
      bestanden: false,
    });
    // Turm auf e1 statt d1, dazu ein Bauer zu viel auf h2.
    expect(vergleicheStellung(SOLL, "6k1/5pp1/8/8/8/8/5PPP/4R1K1 w - - 0 1")).toMatchObject({
      richtig: 6,
      falsch: 2,
      bestanden: false,
    });
  });
});
