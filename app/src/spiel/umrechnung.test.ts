/** Tests der Umrechnung „entspricht etwa“ und der Kurvenrechnung. */
import { describe, expect, it } from "vitest";
import { entsprichtEtwa, kurvenwert, umgerechnet, vergleichsbereich } from "./umrechnung";

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

  it("Bereich: für jede Zeitklasse auf beide Listen, breiter, wenn zwei Streuungen zusammenkommen", () => {
    const blitz = umgerechnet("blitz", 1500, "chesscom");
    const rapid = umgerechnet("rapid", 1680, "chesscom");
    expect(blitz?.ziel).toBe("chesscomBlitz");
    expect(rapid?.ziel).toBe("chesscomRapid");
    // Blitz → chess.com Blitz: nur die Streuung von Lichess Blitz (±70).
    expect((blitz?.bis ?? 0) - (blitz?.von ?? 0)).toBeLessThan(
      (rapid?.bis ?? 0) - (rapid?.von ?? 0),
    );
    expect(rapid?.von).toBeLessThan(rapid?.mitte ?? 0);
    expect(rapid?.bis).toBeGreaterThan(rapid?.mitte ?? 0);
    // Klassisch auf chess.com über Schnellschach, Blitz auf FIDE über chess.com Blitz.
    expect(umgerechnet("classical", 2120, "chesscom")?.ziel).toBe("chesscomRapid");
    expect(umgerechnet("blitz", 1900, "fide")?.ziel).toBe("fide");
    expect(umgerechnet("rapid", 1500, "fide")).toBeNull();
    expect(vergleichsbereich("classical", "fide")).toEqual({ von: 1730, bis: 2465 });
    expect(vergleichsbereich("blitz", "chesscom")?.von).toBe(1090);
  });
});
