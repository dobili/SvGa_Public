/**
 * Tests der Motiverkennung der Partiebesprechung: Begriffe aus Fehlerbefunden und aus der besseren
 * Folge (Kapitel 1 und 7), und die Einzelheiten eines Moments aus einem gespeicherten Eintrag.
 */
import { describe, expect, it } from "vitest";
import { fehlerbegriff, folgebegriff, momentmotiv } from "./besprechungsmotiv";
import { folgetext } from "./besprechungsdaten";

/** Weißer Springer b5, schwarzer König e8 und Turm a8: Sc7+ ist eine Gabel. */
const GABEL = "r3k3/8/8/1N6/8/8/8/4K3 w - - 0 1";
/** Weiße Dame h5 und Läufer c4 gegen f7: Dxf7 ist Matt (Schäfermatt). */
const SCHAEFER = "r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4";

describe("Begriffe der Besprechung", () => {
  it("erkennt die Gabel in der besseren Folge", () => {
    expect(folgebegriff(GABEL, ["b5c7", "e8d7", "c7a8"])).toBe("gabel");
  });

  it("erkennt das Matt", () => {
    expect(folgebegriff(SCHAEFER, ["h5f7"])).toBe("matt");
  });

  it("ordnet Fehlerbefunde Begriffen zu", () => {
    const ohne = { drohung: null, haengt: null, taktik: null };
    expect(fehlerbegriff({ art: "figurHaengen", ...ohne })).toBe("haengend");
    expect(fehlerbegriff({ art: "verfruehteDame", ...ohne })).toBe("eroeffnung");
    expect(fehlerbegriff({ art: "ungenau", ...ohne })).toBeNull();
  });

  it("findet die verpasste Gabel eines Moments", () => {
    const g = {
      fens: [GABEL],
      sans: ["Kd2"],
      beste: ["b5c7"],
      varianten: [["b5c7", "e8d7", "c7a8"]],
      verluste: [2],
    };
    expect(momentmotiv(g, { index: 0, kategorie: "verpasst" })).toEqual({
      begriff: "gabel",
      richtung: "fuer",
    });
  });

  it("schreibt die Folge in deutscher Notation", () => {
    expect(folgetext(GABEL, ["b5c7", "e8d7", "c7a8"], 2)).toBe("Sc7+ Kd7");
  });
});
