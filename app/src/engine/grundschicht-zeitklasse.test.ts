/** Tests des Zeitklassenfaktors der Grundschicht (engine/grundschicht-zeitklasse.ts, 0.2.131). */
import { describe, expect, it } from "vitest";
import { tauFaktor } from "./grundschicht-zeitklasse";

describe("Grundschicht je Zeitklasse", () => {
  it("Blitz streut breiter, Klassisch enger, Schnellschach wie geeicht", () => {
    for (const n of [2, 3, 4, 5, 6, 7, 8, 9] as const) {
      expect(tauFaktor(n, "rapid")).toBe(1);
      expect(tauFaktor(n, "blitz"), `Blitz ${n}`).toBeGreaterThan(1);
      expect(tauFaktor(n, "classical"), `Klassisch ${n}`).toBeLessThan(1);
    }
    expect(tauFaktor(10, "blitz")).toBe(1);
  });
});
