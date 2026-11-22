/**
 * Tests für geraeuschraum.ts: Abstandskurve, Anschwellen bei der Ankunft, Pegel in Dezibel und das
 * Lesen der Quellen aus der Tiled-Karte (räumliche Geräusche, 22.11.2026).
 */
import { describe, expect, it } from "vitest";
import {
  abstandZu,
  ankunftsanteil,
  anteilNachAbstand,
  geraeuschquellenAus,
  GRUND_DB,
  naeheZu,
  raumpegel,
  STILL_AB,
  VOLL_BIS,
} from "./geraeuschraum";

const GENAU = 6;
const WASSERFALL = { art: "wasserfall", felder: [[30, 1, 4, 4]] as const };

describe("Abstandskurve", () => {
  it("voll nah, halb in der Mitte, still ab 12 Kacheln", () => {
    expect(anteilNachAbstand(0)).toBe(1);
    expect(anteilNachAbstand(VOLL_BIS)).toBe(1);
    expect(anteilNachAbstand((VOLL_BIS + STILL_AB) / 2)).toBeCloseTo(0.5, GENAU);
    expect(anteilNachAbstand(STILL_AB)).toBe(0);
    expect(anteilNachAbstand(40)).toBe(0);
  });

  it("fällt mit dem Abstand stetig, ohne Sprung zwischen zwei Zehntelkacheln", () => {
    let vorher = 1;
    for (let d = 0; d <= STILL_AB + 1; d += 0.1) {
      const a = anteilNachAbstand(d);
      expect(a).toBeLessThanOrEqual(vorher);
      expect(vorher - a).toBeLessThan(0.02);
      vorher = a;
    }
  });

  it("misst bis zum nächsten Feld eines Rechtecks", () => {
    expect(abstandZu([30, 1, 4, 4], 31, 2)).toBe(0);
    expect(abstandZu([30, 1, 4, 4], 31, 11)).toBe(7);
    expect(abstandZu([30, 1, 4, 4], 36, 8)).toBe(5);
  });
});

describe("Nähe zu mehreren Stellen", () => {
  it("die nächste gleicher Art zählt, mehrere addieren sich nicht", () => {
    const fluss = {
      art: "fluss",
      felder: [
        [0, 0, 10, 1],
        [0, 1, 10, 1],
        [0, 2, 10, 1],
      ] as const,
    };
    expect(naeheZu([fluss], "fluss", 5, 3)).toBe(1);
    expect(naeheZu([fluss], "fluss", 5, 9)).toBeCloseTo(anteilNachAbstand(7), GENAU);
  });

  it("andere Arten zählen nicht", () => {
    expect(naeheZu([WASSERFALL], "bach", 31, 2)).toBe(0);
    expect(naeheZu([WASSERFALL], null, 31, 2)).toBe(0);
  });
});

describe("Ankunft und Pegel", () => {
  it("bleibt 3,5 s oben und sinkt bis 6,5 s weich auf null", () => {
    expect(ankunftsanteil(0)).toBe(1);
    expect(ankunftsanteil(3.5)).toBe(1);
    expect(ankunftsanteil(5)).toBeCloseTo(0.5, GENAU);
    expect(ankunftsanteil(6.5)).toBe(0);
    expect(ankunftsanteil(-1)).toBe(0);
  });

  it("Grundpegel −11 dB, ganz nah wie die Datei, dazwischen in Dezibel", () => {
    expect(raumpegel(0, 0)).toBeCloseTo(10 ** (GRUND_DB / 20), GENAU);
    expect(raumpegel(1, 0)).toBe(1);
    expect(raumpegel(0, 1)).toBe(1);
    expect(raumpegel(0.5, 0)).toBeCloseTo(10 ** (GRUND_DB / 40), GENAU);
    // Das Größere zählt: Nähe und Ankunft addieren sich nicht über die Datei hinaus.
    expect(raumpegel(0.8, 0.8)).toBe(raumpegel(0.8, 0));
  });
});

describe("Quellen aus der Karte", () => {
  it("liest die Eigenschaft der Pipeline und übergeht Kaputtes", () => {
    const karte = {
      properties: [
        { name: "kennung", value: "mapleFalls.park" },
        {
          name: "geraeuschquellen",
          value: JSON.stringify([WASSERFALL, { art: 3 }, { art: "x", felder: [[1, 2]] }]),
        },
      ],
    };
    expect(geraeuschquellenAus(karte)).toEqual([WASSERFALL]);
    expect(geraeuschquellenAus({})).toEqual([]);
    expect(geraeuschquellenAus({ properties: [{ name: "geraeuschquellen", value: "{" }] })).toEqual(
      [],
    );
  });
});
