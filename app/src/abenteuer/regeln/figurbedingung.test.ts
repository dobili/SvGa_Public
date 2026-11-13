/** Tests für regeln/figurbedingung.ts: Figuren mit `wenn` stehen nur, wenn die Bedingung gilt. */
import { describe, expect, it } from "vitest";
import { ohneFigurenNachBedingung } from "./figurbedingung";

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
