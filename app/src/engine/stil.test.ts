/** Tests des Spielstils (0.2.42): Stilwert je Merkmal und Wahl innerhalb der Toleranz. */
import { describe, expect, it } from "vitest";
import { stilwahl, stilwert } from "./stil";
import type { Variante } from "./uci";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
/** Nach 1. e4 e5 2. Sf3 Sc6 3. Lc4: Schwarz am Zug; Lxf2+ wäre Schlag und Schach. */
const ITALIENISCH = "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3";

function v(nummer: number, bauernWeiss: number, uci: string): Variante {
  return { nummer, wert: { art: "bauern", bauern: bauernWeiss }, zuege: [uci] };
}

describe("Spielstil", () => {
  it("aggressiv: gegnerische Hälfte, Viertel des gegnerischen Königs, Schlag, Schach", () => {
    // e4 liegt noch in der eigenen Hälfte und nicht im Viertel des Königs e8 → 0.
    expect(stilwert(GRUNDSTELLUNG, "e2e4", 2)).toBe(0);
    // Schwarz: Dh4 geht in die weiße Hälfte und ins Viertel des Königs e1 → 2; Sd4 nur Hälfte → 1.
    expect(stilwert(ITALIENISCH, "d8h4", 2)).toBe(2);
    expect(stilwert(ITALIENISCH, "c6d4", 2)).toBe(1);
    expect(stilwert(GRUNDSTELLUNG, "e2e4", 0)).toBe(0);
  });

  it("defensiv: eigene Hälfte, Viertel des eigenen Königs, kein Schlag", () => {
    expect(stilwert(GRUNDSTELLUNG, "e2e4", -2)).toBe(2.5);
    expect(stilwert(GRUNDSTELLUNG, "a2a3", -2)).toBe(1.5);
    expect(stilwert(ITALIENISCH, "g8f6", -2)).toBe(2.5);
  });

  it("wählt innerhalb der Toleranz den Zug mit dem höchsten Stilwert, sonst den besten", () => {
    // Schwarz am Zug: Werte aus Sicht von Weiß, Sf6 ist der beste Zug, Dh4 0,1 dahinter.
    const kandidaten = [v(1, -0.3, "g8f6"), v(2, -0.2, "d8h4"), v(3, 0.5, "a7a6")];
    expect(stilwahl(ITALIENISCH, kandidaten, 2)).toBe("d8h4");
    expect(stilwahl(ITALIENISCH, kandidaten, -2)).toBe("g8f6");
    // Toleranz bei Stil 1 ist 0,3 (S13): Dh4 0,3 dahinter zählt mit, 0,4 dahinter nicht.
    expect(stilwahl(ITALIENISCH, [v(1, -0.3, "g8f6"), v(2, 0, "d8h4")], 1)).toBe("d8h4");
    expect(stilwahl(ITALIENISCH, [v(1, -0.3, "g8f6"), v(2, 0.1, "d8h4")], 1)).toBe("g8f6");
    expect(stilwahl(ITALIENISCH, [], 2)).toBeNull();
  });
});
