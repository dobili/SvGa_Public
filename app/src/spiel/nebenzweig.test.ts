/** Tests des Nebenzweigs im Rückblick (0.2.85). */
import { describe, expect, it } from "vitest";
import { zweigzuege } from "./nebenzweig";
import { fenNach } from "./zuege";

const GRUND = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

describe("Nebenzweig", () => {
  it("nach 1. e4 e5 2. Dh5: Variante 2... Sc6 3. Lc4 mit Stellungen", () => {
    const fen = ["e4", "e5", "Qh5"].reduce((f, san) => fenNach(f, san) ?? f, GRUND);
    const zuege = zweigzuege(fen, ["b8c6", "f1c4"]);
    expect(zuege.map((z) => z.text)).toEqual(["2... Sc6", "3. Lc4"]);
    expect(zuege[0]?.vorher).toBe(fen);
    expect(zuege[1]?.vorher).toBe(zuege[0]?.nachher);
  });

  it("bricht beim ersten unmöglichen Zug ab", () => {
    expect(zweigzuege(GRUND, ["e2e4", "e2e4"]).map((z) => z.text)).toEqual(["1. e4"]);
    expect(zweigzuege(GRUND, [])).toEqual([]);
  });
});
