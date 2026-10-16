/** Tests der Umrechnung zwischen UCI (Engine) und SAN (Daten), mit Rochade. */
import { describe, expect, it } from "vitest";
import { fenNach, sanZuUci, uciZuSan } from "./zuege";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
/** Abb. 1.26 (Französisch Vorstoß nach 5... Db6): Weiß darf kurz rochieren, sobald f1 frei ist. */
const VOR_ROCHADE = "r1b1kbnr/pp3ppp/1qn1p3/2ppP3/3P4/2PB1N2/PP3PPP/RNBQK2R w KQkq - 4 6";

describe("Züge umrechnen", () => {
  it("UCI → SAN", () => {
    expect(uciZuSan(GRUNDSTELLUNG, "g1f3")).toBe("Nf3");
    expect(uciZuSan(VOR_ROCHADE, "e1g1")).toBe("O-O");
  });

  it("SAN → UCI, Rochade wie Stockfish als Königszug um zwei Felder", () => {
    expect(sanZuUci(GRUNDSTELLUNG, "e4")).toBe("e2e4");
    expect(sanZuUci(VOR_ROCHADE, "O-O")).toBe("e1g1");
  });

  it("illegale Züge ergeben null", () => {
    expect(uciZuSan(GRUNDSTELLUNG, "e2e5")).toBeNull();
    expect(sanZuUci(GRUNDSTELLUNG, "Ke2")).toBeNull();
    expect(fenNach(GRUNDSTELLUNG, "Qh5")).toBeNull();
  });

  it("Umwandlung", () => {
    const fen = "8/4P1k1/8/8/8/8/8/4K3 w - - 0 1";
    expect(uciZuSan(fen, "e7e8q")).toBe("e8=Q");
    expect(sanZuUci(fen, "e8=N")).toBe("e7e8n");
  });
});
