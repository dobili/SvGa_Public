/** Tests der Wahlwertung je Zeitklasse (engine/wahlkorrektur.ts, 0.2.131). */
import { describe, expect, it } from "vitest";
import { stufe } from "./stufen";
import { wahlwertung } from "./wahlkorrektur";

describe("Wahlwertung je Zeitklasse", () => {
  it("Schnellschach unverändert, Blitz darunter, Klassisch darüber, Stufe 10 nur umgerechnet", () => {
    for (const n of [2, 3, 4, 5, 6, 7, 8, 9]) {
      const s = stufe(n);
      expect(wahlwertung(s, "rapid")).toBe(s.wertung);
      expect(wahlwertung(s, "blitz"), `Blitz ${n}`).toBeLessThan(s.wertung);
      expect(wahlwertung(s, "classical"), `Klassisch ${n}`).toBeGreaterThan(s.wertung);
    }
  });

  it("mit Maia eigene Reihe in Blitz (0.2.144): Stufe 5 schwächer korrigiert, Stufe 7 stärker", () => {
    const fuenf = stufe(5);
    const sieben = stufe(7);
    expect(wahlwertung(fuenf, "blitz", true)).toBeGreaterThan(wahlwertung(fuenf, "blitz"));
    expect(wahlwertung(sieben, "blitz", true)).toBeLessThan(wahlwertung(sieben, "blitz"));
    expect(wahlwertung(fuenf, "rapid", true)).toBe(fuenf.wertung);
  });
});
