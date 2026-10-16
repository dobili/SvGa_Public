/** Tests für eigene Züge und die Skelett-Ansicht. */
import { describe, expect, it } from "vitest";
import {
  eigeneAlsText,
  fenNachZuegen,
  legaleZiele,
  skelettFen,
  spieleZug,
  zugFelder,
} from "./weiterspielen";

const GRUND = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const ABB_1_26 = "r1b1kbnr/pp3ppp/1qn1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1R w KQkq - 4 6";

describe("Weiterspielen", () => {
  it("kennt die legalen Ziele einer Figur", () => {
    expect(legaleZiele(GRUND, "g1").sort()).toEqual(["f3", "h3"]);
    expect(legaleZiele(GRUND, "e7")).toEqual([]);
  });

  it("spielt 6. Ld3 in Abb. 1.26 und lehnt Unmögliches ab", () => {
    const zug = spieleZug(ABB_1_26, "f1", "d3");
    expect(zug.art === "gespielt" && zug.san).toBe("Bd3");
    expect(spieleZug(ABB_1_26, "f1", "f5").art).toBe("ungueltig");
  });

  it("rochiert über das Zielfeld des Königs, nicht über den Turm (wie Chess.com)", () => {
    const rochade = "r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1";
    const ziele = legaleZiele(rochade, "e1");
    expect(ziele).toEqual(expect.arrayContaining(["g1", "c1"]));
    expect(ziele).not.toContain("h1");
    expect(ziele).not.toContain("a1");
    const kurz = spieleZug(rochade, "e1", "g1");
    expect(kurz).toMatchObject({ art: "gespielt", san: "O-O" });
    expect(spieleZug(rochade, "e1", "c1")).toMatchObject({ art: "gespielt", san: "O-O-O" });
    expect(spieleZug(rochade, "e1", "h1")).toEqual({ art: "ungueltig" });
    expect(zugFelder(rochade, "O-O")).toEqual({ von: "e1", nach: "g1" });
  });

  it("fragt bei der Umwandlung nach der Figur", () => {
    const fen = "8/4P1k1/8/8/8/8/8/4K3 w - - 0 1";
    expect(spieleZug(fen, "e7", "e8").art).toBe("umwandlung");
    const zug = spieleZug(fen, "e7", "e8", "knight");
    expect(zug.art === "gespielt" && zug.san).toBe("e8=N+");
  });

  it("schreibt eigene Züge mit Nummern und findet die Felder des letzten Zuges", () => {
    expect(eigeneAlsText(GRUND, ["e4", "e5", "Nf3"], "de")).toEqual(["1. e4", "e5", "2. Sf3"]);
    expect(fenNachZuegen(GRUND, ["e4", "e5"], 1)).toBe(
      "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
    );
    expect(zugFelder(GRUND, "Nf3")).toEqual({ von: "g1", nach: "f3" });
  });

  it("blendet in der Skelett-Ansicht alle Figuren außer Bauern und Königen aus", () => {
    expect(skelettFen(GRUND).split(" ")[0]).toBe("4k3/pppppppp/8/8/8/8/PPPPPPPP/4K3");
  });
});
