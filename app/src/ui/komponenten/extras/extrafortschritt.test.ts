/**
 * Tests zum Stand bis zu einem gesperrten Extra (Balken auf der Kachel).
 */
import { describe, expect, it } from "vitest";
import type { Extralage } from "../../../training/extras";
import { extrafortschritt } from "./extrafortschritt";

const LAGE: Extralage = {
  stufe: 6,
  volleOrdengruppen: new Set(),
  themenstufen: {
    "taktik:gabel": "gold",
    "taktik:spiess": "silber",
    "endspiel:opposition": "gold",
  },
};

describe("extrafortschritt", () => {
  it("zählt Stufen bis zur Schwelle", () => {
    expect(extrafortschritt({ art: "stufe", ab: 9 }, LAGE)).toEqual({ erreicht: 6, ziel: 9 });
  });
  it("kappt beim Ziel", () => {
    expect(extrafortschritt({ art: "stufe", ab: 3 }, LAGE)).toEqual({ erreicht: 3, ziel: 3 });
  });
  it("zählt Themen der Meisterschaft mit Präfix", () => {
    const b = { art: "meisterschaft", stufe: "gold", anzahl: 5, praefix: "taktik" } as const;
    expect(extrafortschritt(b, LAGE)).toEqual({ erreicht: 1, ziel: 5 });
  });
  it("hat für Orden keinen Balken", () => {
    expect(extrafortschritt({ art: "orden", gruppe: "buchteile" }, LAGE)).toBeNull();
  });
});
