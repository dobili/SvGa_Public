/** Tests der Endspiel- und Mittelspieltypen (Wunsch des Autors, 6.11.2026, Q15-1). */
import { describe, expect, it } from "vitest";
import { endspieltyp, mittelspielmerkmale } from "./phasentypen";
import { stellungAusFen } from "./stellung";

function brett(fen: string) {
  const s = stellungAusFen(fen);
  if (!s.ok) throw new Error(s.fehler);
  return s.wert.brett;
}

describe("Endspieltypen", () => {
  it("ordnet nach Material", () => {
    expect(endspieltyp(brett("8/5pk1/6p1/8/8/6P1/5PK1/8 w - - 0 1"))).toBe("bauern");
    expect(endspieltyp(brett("8/5pk1/r5p1/8/8/R5P1/5PK1/8 w - - 0 1"))).toBe("turm");
    expect(endspieltyp(brett("8/5pk1/b5p1/8/8/B5P1/5PK1/8 w - - 0 1"))).toBe("laeuferUngleich");
    expect(endspieltyp(brett("8/5pk1/1b4p1/8/8/B5P1/5PK1/8 w - - 0 1"))).toBe("laeuferGleich");
    expect(endspieltyp(brett("8/5pk1/n5p1/8/8/B5P1/5PK1/8 w - - 0 1"))).toBe("laeuferSpringer");
    expect(endspieltyp(brett("8/5pk1/n5p1/8/8/R5P1/5PK1/8 w - - 0 1"))).toBe("turmLeichtfigur");
  });
});

describe("Mittelspielmerkmale", () => {
  it("erkennt Karlsbad nach der Abtauschvariante", () => {
    const fen = "r1bq1rk1/pp2bppp/2n2n2/2pp4/3P4/2N1PN2/PP3PPP/R1BQKB1R w KQ - 0 1";
    expect(mittelspielmerkmale(brett(fen))).not.toContain("karlsbad");
    const karlsbad = "r1bq1rk1/pp2bppp/2p2n2/3p4/3P4/2N1PN2/PP3PPP/R1BQKB1R w KQ - 0 1";
    expect(mittelspielmerkmale(brett(karlsbad))).toContain("karlsbad");
  });

  it("erkennt Isolani und entgegengesetzte Rochaden", () => {
    const fen = "2kr3r/pp3ppp/8/8/3P4/8/PP3PPP/R4RK1 w - - 0 1";
    const m = mittelspielmerkmale(brett(fen));
    expect(m).toContain("isolani");
    expect(m).toContain("entgegengesetzteRochaden");
  });

  it("erkennt die französische Kette", () => {
    const fen = "r1bqkb1r/pp1n1ppp/2n1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1R w KQkq - 0 1";
    expect(mittelspielmerkmale(brett(fen))).toContain("franzoesischeKette");
  });
});
