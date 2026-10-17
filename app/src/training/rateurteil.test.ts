/** Tests für rateurteil.ts (W12): eigener Zug gegen Partiezug. */
import { describe, expect, it } from "vitest";
import type { Variante } from "../engine/uci";
import { rateurteil } from "./rateurteil";

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
    });
    // Schwarz zieht: Werte aus Sicht von Weiß, also kleiner ist besser für Schwarz.
    expect(rateurteil([partie, variante("b1c3", -0.5)], "b1c3", "g1f3", false)?.art).toBe(
      "staerker",
    );
  });

  it("ohne einen der beiden Züge kein Urteil", () => {
    expect(rateurteil([variante("g1f3", 0.5)], "b1c3", "g1f3", true)).toBeNull();
  });
});
