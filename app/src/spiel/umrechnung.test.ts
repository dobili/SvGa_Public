/** Tests der Umrechnung „entspricht etwa“ (0.2.124) und der Kurvenrechnung. */
import { describe, expect, it } from "vitest";
import { entsprichtEtwa, kurvenwert } from "./umrechnung";

describe("Umrechnung", () => {
  it("Kurvenwert: linear zwischen Stützstellen, außerhalb der Randwert", () => {
    const kurve = [
      [0, 100],
      [10, 200],
    ] as const;
    expect(kurvenwert(kurve, 5)).toBe(150);
    expect(kurvenwert(kurve, -3)).toBe(100);
    expect(kurvenwert(kurve, 30)).toBe(200);
    expect(kurvenwert([], 1)).toBeNaN();
  });

  it("Lichess → chess.com und FIDE nach den Tabellen von chessgoals.com", () => {
    // Schnellschach 1680 Lichess ≈ 1340 chess.com Schnellschach; Klassisch 2120 ≈ FIDE 1965.
    expect(entsprichtEtwa("rapid", 1680)).toBeGreaterThanOrEqual(1300);
    expect(entsprichtEtwa("rapid", 1680)).toBeLessThanOrEqual(1380);
    expect(entsprichtEtwa("classical", 2120)).toBeGreaterThanOrEqual(1930);
    expect(entsprichtEtwa("classical", 2120)).toBeLessThanOrEqual(2000);
    expect(entsprichtEtwa("blitz", 1500)).toBeGreaterThan(900);
    expect(entsprichtEtwa("blitz", 1500)).toBeLessThan(1200);
    // Außerhalb der Tabellen keine Entsprechung: FIDE erst ab etwa 1730 Lichess Klassisch.
    expect(entsprichtEtwa("classical", 1500)).toBeNull();
    expect(entsprichtEtwa("rapid", 900)).toBeNull();
    expect((entsprichtEtwa("rapid", 2000) ?? 1) % 10).toBe(0);
  });
});
