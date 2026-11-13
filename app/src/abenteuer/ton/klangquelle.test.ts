/** Tests für klangquelle.ts: Klangquellen mit Reichweite (T28). */
import { describe, expect, it } from "vitest";
import { anteilNachAbstand, klangorte, naehe } from "./klangquelle";

const KARTE = {
  layers: [
    { objects: [{ name: "start", x: 0, y: 0 }] },
    { objects: [{ name: "rosiesWagen", x: 320, y: 160 }] },
  ],
};

describe("Klangquellen", () => {
  it("findet das Objekt in jeder Ebene und rechnet in Felder um", () => {
    expect(klangorte(KARTE, [{ objekt: "rosiesWagen", musik: "rosie" }], 16)).toEqual([
      { musik: "rosie", x: 20, y: 10, reichweite: 20 },
    ]);
    expect(klangorte(KARTE, [{ objekt: "fehlt", musik: "x" }], 16)).toEqual([]);
  });

  it("klingt voll bis zur halben Reichweite, dann leiser bis still", () => {
    expect(anteilNachAbstand(5, 20)).toBe(1);
    expect(anteilNachAbstand(15, 20)).toBe(0.5);
    expect(anteilNachAbstand(25, 20)).toBe(0);
  });

  it("nimmt die lauteste Quelle", () => {
    const orte = [
      { musik: "rosie", x: 20, y: 10, reichweite: 20 },
      { musik: "remy", x: 0, y: 10, reichweite: 10 },
    ];
    expect(naehe(orte, 35, 10)).toEqual({ musik: "rosie", anteil: 0.5 });
    expect(naehe(orte, 2, 10)).toEqual({ musik: "remy", anteil: 1 });
    expect(naehe(orte, 80, 80)).toEqual({ musik: null, anteil: 0 });
  });
});
