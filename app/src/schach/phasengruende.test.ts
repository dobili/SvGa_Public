/** Tests der Gründe für das Ende der Eröffnung und der Materialgrenze fürs Endspiel (0.3.14). */
import { parseFen } from "chessops/fen";
import { describe, expect, it } from "vitest";
import {
  ausweg,
  durchmischung,
  figurenanzahl,
  grundreiheDuenn,
  wenigMaterialFuerEndspiel,
} from "./phasengruende";

const brett = (fen: string) => parseFen(fen).unwrap().board;
const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

describe("Phasengründe", () => {
  it("Grundstellung: 14 Figuren, Grundreihen voll, Lager getrennt, kein Ausweg", () => {
    const b = brett(START);
    expect(figurenanzahl(b)).toBe(14);
    expect(grundreiheDuenn(b)).toBe(false);
    expect(durchmischung(b)).toBe(0);
    expect(ausweg(b)).toBeNull();
  });

  it("Abtausch und ausgedünnte Grundreihe", () => {
    expect(ausweg(brett("r2qk2r/ppp2ppp/2n5/3pp3/3PP3/2N5/PPP2PPP/R2QK2R w KQkq - 0 10"))).toBe(
      "abtausch",
    );
    // Weiß: nur Ta1, Ke1, Th1 auf der Grundreihe.
    expect(
      grundreiheDuenn(brett("rnbqkbnr/pppppppp/8/8/8/2NBBN2/PPPPQPPP/R3K2R w KQkq - 0 6")),
    ).toBe(true);
  });

  it("Kontakt: Steine beider Seiten ineinander ergeben eine hohe Durchmischung", () => {
    const gemischt = brett("r1b1k2r/pp1n1ppp/2pBpn2/q2pP3/1bPP4/2NB1N2/PP3PPP/R2QK2R w KQkq - 0 9");
    expect(durchmischung(gemischt)).toBeGreaterThan(durchmischung(brett(START)));
  });

  it("Materialgrenze fürs Endspiel", () => {
    expect(wenigMaterialFuerEndspiel(brett("5rk1/pp3ppp/4b3/8/8/4B3/PP3PPP/5RK1 w - - 0 30"))).toBe(
      true,
    );
    expect(
      wenigMaterialFuerEndspiel(brett("2r2rk1/pp3ppp/2n1b3/8/8/2N1B3/PP3PPP/2R2RK1 w - - 0 20")),
    ).toBe(false);
  });
});
