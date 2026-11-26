/** Tests für regeln/figurbedingung.ts: Figuren mit `wenn` stehen nur, wenn die Bedingung gilt. */
import { describe, expect, it } from "vitest";
import { bedingteFigurUmgeschlagen, ohneFigurenNachBedingung } from "./figurbedingung";

const karte = {
  layers: [
    { type: "tilelayer" },
    {
      type: "objectgroup",
      objects: [
        { name: "tessa", type: "figur" },
        { name: "ada", type: "figur" },
        { name: "tessa", type: "ausloeser" },
      ],
    },
  ],
};
const bedingungen: Record<string, string> = { tessa: "tessaStufe >= 2" };
const bedingungZu = (name: string) => bedingungen[name];

function namen(k: typeof karte): string[] {
  return (k.layers[1]?.objects ?? []).map((o) => `${o.type}:${o.name}`);
}

describe("ohneFigurenNachBedingung", () => {
  it("nimmt eine Figur weg, deren Bedingung nicht gilt", () => {
    const ergebnis = ohneFigurenNachBedingung(karte, bedingungZu, { tessaStufe: 1 });
    expect(namen(ergebnis)).toEqual(["figur:ada", "ausloeser:tessa"]);
  });

  it("lässt die Karte unverändert, wenn alle Bedingungen gelten", () => {
    expect(ohneFigurenNachBedingung(karte, bedingungZu, { tessaStufe: 2 })).toBe(karte);
  });

  it("meldet eine fehlerhafte Bedingung", () => {
    expect(() => ohneFigurenNachBedingung(karte, () => "((", {})).toThrow();
  });
});

describe("bedingte Möbel", () => {
  const mitMoebel = {
    layers: [
      {
        type: "objectgroup",
        objects: [
          {
            name: "ccTisch",
            type: "moebel",
            properties: [{ name: "wenn", value: "lilyGeholfen" }],
          },
          { name: "ccStuhl", type: "moebel", properties: [{ name: "tiefe", value: 3 }] },
        ],
      },
    ],
  };
  const namenDerMoebel = (k: typeof mitMoebel) => (k.layers[0]?.objects ?? []).map((o) => o.name);

  it("nimmt ein Möbel weg, dessen Eigenschaft wenn nicht gilt", () => {
    const ergebnis = ohneFigurenNachBedingung(mitMoebel, () => undefined, {});
    expect(namenDerMoebel(ergebnis)).toEqual(["ccStuhl"]);
  });

  it("lässt es stehen, wenn die Bedingung gilt", () => {
    const ergebnis = ohneFigurenNachBedingung(mitMoebel, () => undefined, { lilyGeholfen: true });
    expect(ergebnis).toBe(mitMoebel);
  });
});

describe("bedingteFigurUmgeschlagen", () => {
  const hale = "nadelMapleFalls > 0 und nicht kenntHale";
  it("meldet, wenn Hale nach dem Gespräch gehen muss", () => {
    const vorher = { nadelMapleFalls: 1, kenntHale: false };
    const nachher = { nadelMapleFalls: 1, kenntHale: true };
    expect(bedingteFigurUmgeschlagen([undefined, hale], vorher, nachher)).toBe(true);
  });
  it("bleibt still, wenn sich nichts ändert", () => {
    const stand = { nadelMapleFalls: 1, kenntHale: false };
    expect(bedingteFigurUmgeschlagen([hale], stand, { ...stand, andere: 3 })).toBe(false);
  });
});
