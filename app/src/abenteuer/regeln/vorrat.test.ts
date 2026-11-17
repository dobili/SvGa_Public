// Auswahl aus dem Vorrat Bot gegen Bot: Band nach Stärke, zufällig ohne Wiederholung, neue Runde.
import { describe, expect, it } from "vitest";
import {
  bandZu,
  genutztNach,
  waehleAusVorrat,
  type Stellungsvorrat,
  type Vorratseintrag,
} from "./vorrat";

function eintrag(kennung: string): Vorratseintrag {
  return { kennung, fen: "8/8/8/8/8/8/8/K6k w - - 0 1", zuege: [], bewertung: 0 };
}

const LEER = { stellungsduell: [], vorteil: [], endspielSieg: [], endspielRemis: [] };
const VORRAT: Stellungsvorrat = {
  baender: [
    {
      kennung: "band1",
      eloVon: 0,
      eloBis: 900,
      formate: { ...LEER, vorteil: [eintrag("band1.vorteil1")] },
    },
    {
      kennung: "band2",
      eloVon: 900,
      eloBis: 1200,
      formate: { ...LEER, vorteil: [eintrag("band2.vorteil1"), eintrag("band2.vorteil2")] },
    },
  ],
};

describe("bandZu", () => {
  it("nimmt das Band der Stärke, außerhalb das am Rand", () => {
    expect(bandZu(VORRAT, 950)?.kennung).toBe("band2");
    expect(bandZu(VORRAT, 5000)?.kennung).toBe("band2");
    expect(bandZu(VORRAT, -10)?.kennung).toBe("band1");
  });
});

describe("waehleAusVorrat", () => {
  it("wählt nur Stellungen, die der Leser noch nicht hatte", () => {
    const gewaehlt = waehleAusVorrat(VORRAT, "vorteil", 1000, ["band2.vorteil1"], () => 0);
    expect(gewaehlt?.kennung).toBe("band2.vorteil2");
  });

  it("beginnt von vorn, wenn alle gespielt sind, und kennt leere Formate", () => {
    const alle = ["band2.vorteil1", "band2.vorteil2"];
    expect(waehleAusVorrat(VORRAT, "vorteil", 1000, alle, () => 0.99)?.kennung).toBe(
      "band2.vorteil2",
    );
    expect(waehleAusVorrat(VORRAT, "endspielSieg", 1000, [], () => 0)).toBeNull();
  });
});

describe("genutztNach", () => {
  it("merkt die Wahl und beginnt eine neue Runde, wenn das Format durch war", () => {
    const alle = VORRAT.baender[1]?.formate.vorteil ?? [];
    const [a, b] = alle;
    if (!a || !b) throw new Error("Vorrat unvollständig");
    expect(genutztNach(["band2.vorteil1"], b, alle)).toEqual(["band2.vorteil1", "band2.vorteil2"]);
    expect(genutztNach(["band1.vorteil1", "band2.vorteil1", "band2.vorteil2"], a, alle)).toEqual([
      "band1.vorteil1",
      "band2.vorteil1",
    ]);
  });
});
