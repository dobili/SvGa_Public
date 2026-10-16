/** Tests der Fehlerarten (Konzept 8.2) an Stellungen aus dem Buch. */
import { describe, expect, it } from "vitest";
import { fehlerartVon } from "./fehlerart";

/** Abb. 1.8 vor 3... Df6: Schwarz hat Springer g8 und Läufer c8, f8 zu Hause. */
const VOR_DF6 = "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3";
/** Abb. 1.13, Schwarz am Zug nach 2. Dh5. */
const NACH_DH5 = "rnbqkbnr/pppp1ppp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2";

describe("Fehlerart", () => {
  it("verfrühte Dame: 3... Df6 mit drei Leichtfiguren zu Hause", () => {
    expect(fehlerartVon(VOR_DF6, ["d8f6"], 1)).toBe("verfruehteDame");
  });

  it("Figur hängen lassen: Die Antwort schlägt eine Leichtfigur", () => {
    expect(fehlerartVon(NACH_DH5, ["g8f6", "h5e5", "f8e7"], 3)).toBe("ungenau");
    expect(fehlerartVon(NACH_DH5, ["b8c6", "h5f7"], 3)).toBe("ungenau");
    // 2... Sf6 3. Dxf7+? schlägt nur einen Bauern; 2... Lc5 3. Dxe5+ ebenso.
    expect(fehlerartVon(NACH_DH5, ["g8e7", "h5e5"], 1)).toBe("ungenau");
  });

  it("Figur hängen: Läufer nach b4, Dame schlägt ihn nicht, aber ein Springer schon", () => {
    const fen = "rnbqkbnr/pppp1ppp/8/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq - 1 2";
    expect(fehlerartVon(fen, ["f8a3", "b2a3"], 3)).toBe("figurHaengen");
  });

  it("unlesbarer Zug: ungenau", () => {
    expect(fehlerartVon(NACH_DH5, ["zz"], 3)).toBe("ungenau");
  });
});
