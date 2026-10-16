/**
 * Tests für das Fallenurteil (ohne Engine): Schlag gegen besten anderen Zug.
 */
import { describe, expect, it } from "vitest";
import { beurteile, wertFuer } from "./fallenurteil";

describe("Fallenurteil", () => {
  it("Matt gegen den Schlagenden ist eine Falle (Abb. 4.11: Lxf3?? Sxc7#)", () => {
    const urteil = beurteile({ art: "matt", zuege: 1 }, { art: "bauern", bauern: 0.3 }, "black");
    expect(urteil.art).toBe("falle");
  });

  it("gleich gut wie der beste andere Zug: Geschenk", () => {
    const urteil = beurteile(
      { art: "bauern", bauern: 2.8 },
      { art: "bauern", bauern: 3.0 },
      "white",
    );
    expect(urteil.art).toBe("geschenk");
  });

  it("eine Bauerneinheit schlechter ist schon eine Falle, aus Sicht von Schwarz gerechnet", () => {
    const urteil = beurteile(
      { art: "bauern", bauern: 0.5 },
      { art: "bauern", bauern: -0.6 },
      "black",
    );
    expect(urteil).toEqual({ art: "falle", verlust: expect.closeTo(1.1, 5) as number });
  });

  it("ohne anderen Zug: einziger Zug; schnelleres Matt zählt mehr", () => {
    expect(beurteile({ art: "bauern", bauern: 0 }, null, "white").art).toBe("einzigerZug");
    expect(wertFuer({ art: "matt", zuege: 1 }, "white")).toBeGreaterThan(
      wertFuer({ art: "matt", zuege: 3 }, "white"),
    );
  });
});
