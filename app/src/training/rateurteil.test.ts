/** Tests für rateurteil.ts (W12): eigener Zug gegen Partiezug. */
import { describe, expect, it } from "vitest";
import type { Variante } from "../engine/uci";
import { mitMatt, rateurteil } from "./rateurteil";

const variante = (uci: string, bauern: number): Variante => ({
  nummer: 1,
  wert: { art: "bauern", bauern },
  zuege: [uci],
});

describe("rateurteil", () => {
  it("gleichwertig bis 0,3, sonst schwächer oder stärker, aus Sicht der ziehenden Seite", () => {
    const partie = variante("g1f3", 0.5);
    expect(rateurteil([partie, variante("b1c3", 0.4)], "b1c3", "g1f3", true)?.art).toBe(
      "gleichwertig",
    );
    expect(rateurteil([partie, variante("b1c3", -0.5)], "b1c3", "g1f3", true)).toEqual({
      art: "schwaecher",
      unterschied: 1,
      eigenerWert: { art: "bauern", bauern: -0.5 },
      partieWert: { art: "bauern", bauern: 0.5 },
      eigeneFolge: ["b1c3"],
    });
    // Schwarz zieht: Werte aus Sicht von Weiß, also kleiner ist besser für Schwarz.
    expect(rateurteil([partie, variante("b1c3", -0.5)], "b1c3", "g1f3", false)?.art).toBe(
      "staerker",
    );
  });

  it("erkennt ein Matt in einer der beiden Varianten (R46, Studien)", () => {
    const matt: Variante = { nummer: 1, wert: { art: "matt", zuege: 3 }, zuege: ["c6c7"] };
    const urteil = rateurteil([matt, variante("a1a2", 0.1)], "a1a2", "c6c7", true);
    expect(urteil?.art).toBe("schwaecher");
    expect(urteil && mitMatt(urteil)).toBe(true);
  });

  it("ohne einen der beiden Züge kein Urteil", () => {
    expect(rateurteil([variante("g1f3", 0.5)], "b1c3", "g1f3", true)).toBeNull();
  });
});
