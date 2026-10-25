/**
 * Tests der Zahlen in der Partienliste (Wunsch des Autors, 25.10.2026): Spielstärke nur, wenn
 * beide Seiten eine haben, sonst stets die Genauigkeit beider Seiten.
 */
import { describe, expect, it } from "vitest";
import type { Seitenbilanz } from "../../spiel/genauigkeit";
import { partiezahlen } from "./partiezahlen";

function seite(spielstaerke: number | null, genauigkeit: number | null): Seitenbilanz {
  return {
    zuege: 20,
    genauigkeit,
    innen: genauigkeit,
    gewertet: 20,
    verlustJeZug: 0,
    spielstaerke,
  } as Seitenbilanz;
}

describe("Zahlen der Partienliste", () => {
  it("zeigt die Spielstärke, wenn beide Seiten eine haben", () => {
    expect(partiezahlen(seite(1450, 80), seite(1520, 85))).toEqual({
      ich: "≈ 1450",
      gegner: "≈ 1520",
    });
  });

  it("zeigt sonst die Genauigkeit beider Seiten, nie gemischt", () => {
    expect(partiezahlen(seite(1450, 78.4), seite(null, 64))).toEqual({
      ich: "78 %",
      gegner: "64 %",
    });
    expect(partiezahlen(seite(null, 90), seite(null, null))).toEqual({ ich: "90 %", gegner: "–" });
  });

  it("ohne jede Zahl nichts", () => {
    expect(partiezahlen(seite(null, null), seite(null, null))).toBeNull();
  });
});
