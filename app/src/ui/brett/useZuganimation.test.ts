/** Tests für die Bewegungen der Zuganimation (R37). */
import { describe, expect, it } from "vitest";
import { figurenAusFen } from "./geometrie";
import { bewegungen } from "./useZuganimation";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const NACH_E4 = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1";

describe("Bewegungen der Zuganimation", () => {
  it("lässt nach 1. e4 den Bauern von e2 nach e4 gleiten", () => {
    expect(
      bewegungen(figurenAusFen(GRUNDSTELLUNG), figurenAusFen(NACH_E4), { von: "e2", nach: "e4" }),
    ).toEqual([{ zeichen: "P", von: "e2", nach: "e4", geschlagen: null }]);
  });

  it("lässt bei der Rochade den Turm mitgleiten", () => {
    const vorher = figurenAusFen("4k3/8/8/8/8/8/8/4K2R w K - 0 1");
    const nachher = figurenAusFen("4k3/8/8/8/8/8/8/5RK1 b - - 1 1");
    expect(bewegungen(vorher, nachher, { von: "e1", nach: "g1" })).toEqual([
      { zeichen: "K", von: "e1", nach: "g1", geschlagen: null },
      { zeichen: "R", von: "h1", nach: "f1", geschlagen: null },
    ]);
  });

  it("zeigt die geschlagene Figur und lässt die Umwandlung als neue Figur gleiten", () => {
    const vorher = figurenAusFen("1n2k3/P7/8/8/8/8/8/4K3 w - - 0 1");
    const nachher = figurenAusFen("1Q2k3/8/8/8/8/8/8/4K3 b - - 0 1");
    expect(bewegungen(vorher, nachher, { von: "a7", nach: "b8" })).toEqual([
      { zeichen: "Q", von: "a7", nach: "b8", geschlagen: "n" },
    ]);
  });

  it("lässt nach en passant nur den schlagenden Bauern gleiten", () => {
    const vorher = figurenAusFen("4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1");
    const nachher = figurenAusFen("4k3/8/3P4/8/8/8/8/4K3 b - - 0 1");
    expect(bewegungen(vorher, nachher, { von: "e5", nach: "d6" })).toEqual([
      { zeichen: "P", von: "e5", nach: "d6", geschlagen: null },
    ]);
  });

  it("lässt nichts gleiten beim Zurückblättern oder Springen", () => {
    // Zurück von 1. e4 zur Grundstellung: Der „letzte Zug“ passt nicht zu dieser Änderung.
    expect(
      bewegungen(figurenAusFen(NACH_E4), figurenAusFen(GRUNDSTELLUNG), { von: "e2", nach: "e4" }),
    ).toEqual([]);
    const sprung = "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2";
    expect(
      bewegungen(figurenAusFen(GRUNDSTELLUNG), figurenAusFen(sprung), { von: "g1", nach: "f3" }),
    ).toEqual([]);
  });
});
