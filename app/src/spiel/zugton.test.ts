/** Tests der Tonart je Zug: Matt, Patt, Schach, Schlag, Zug. */
import { describe, expect, it } from "vitest";
import { tonartNach } from "./zugton";

describe("Tonart nach einem Zug", () => {
  it("Matt, Patt, Schach, Schlag, Zug in dieser Rangfolge", () => {
    // Schäfermatt: nach 4. Dxf7#.
    expect(
      tonartNach("r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4", true),
    ).toBe("matt");
    // Patt: Schwarz am Zug, Kh8 gegen Dg6 und Kf7? Klassisch: k7/2Q5/1K6 → Schwarz patt.
    expect(tonartNach("k7/2Q5/1K6/8/8/8/8/8 b - - 0 1", false)).toBe("remis");
    // Nur Könige: Remis durch Material.
    expect(tonartNach("4k3/8/8/8/8/8/8/4K3 w - - 0 1", true)).toBe("remis");
    // Schach ohne Matt: Lxf7+.
    expect(tonartNach("rnbqkbnr/pppp1Bpp/8/4p3/4P3/8/PPPP1PPP/RNBQK1NR b KQkq - 0 2", true)).toBe(
      "schach",
    );
    expect(tonartNach("rnbqkbnr/pppp1ppp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2", false)).toBe(
      "zug",
    );
    expect(tonartNach("rnbqkbnr/pppp1ppp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2", true)).toBe(
      "schlag",
    );
    expect(tonartNach("unsinn", false)).toBe("zug");
  });
});
