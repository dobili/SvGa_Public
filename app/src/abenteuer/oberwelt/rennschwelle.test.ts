/**
 * Tests der Rennschwelle am Rand (rennschwelle.ts): Rennen ist in jede Richtung erreichbar, bei den
 * Lagen des Kreuzes auf üblichen Handys (Befund des Autors 24.11.2026: nach rechts im Hochformat
 * nicht auslösbar).
 */
import { describe, expect, it } from "vitest";
import { gangartZu, TASTENABSTAND_PX } from "./gangart";
import { KLEINSTE_SCHWELLE, RAND_RESERVE_PX, randabstand, rennenAbZumRand } from "./rennschwelle";

const T = TASTENABSTAND_PX;
/** Mitte des Kreuzes bis zu seinem Rand: 3 Tasten à 48 px, 2 Fugen à 8 px, halbiert. */
const HALBES_KREUZ = 80;
/** Abstand des Kreuzes zum Rand (bedienung.css, --daumen-rand). */
const DAUMEN_RAND = 16;
/** Untere Lage des Kreuzes (Daumenrand + Leiste 44 px + Raster 8 px). */
const KREUZ_UNTEN = DAUMEN_RAND + 44 + 8;

/** Rennt der Finger, der in Richtung (rx, ry) bis kurz vor den Rand gezogen wird? */
function erreichbar(mitte: { x: number; y: number }, bild: { breite: number; hoehe: number }) {
  return [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ].map(([rx = 0, ry = 0]) => {
    const rand = randabstand(rx, ry, mitte, bild);
    // Der Finger kommt bis RAND_RESERVE_PX vor den Rand, nicht weiter.
    const weit = rand - RAND_RESERVE_PX;
    return gangartZu(rx * weit, ry * weit, "gehen", T, rennenAbZumRand(rand)) === "rennen";
  });
}

const HANDYS = [
  { breite: 360, hoehe: 740 },
  { breite: 390, hoehe: 844 },
  { breite: 412, hoehe: 915 },
];

describe("Rennschwelle am Rand", () => {
  it("Hochformat (Kreuz rechts): alle vier Richtungen erreichbar", () => {
    for (const h of HANDYS) {
      const mitte = {
        x: h.breite - DAUMEN_RAND - HALBES_KREUZ,
        y: h.hoehe - KREUZ_UNTEN - HALBES_KREUZ,
      };
      expect(erreichbar(mitte, h)).toEqual([true, true, true, true]);
    }
  });

  it("Querformat (Kreuz links): alle vier Richtungen erreichbar, auch mit Aussparung links", () => {
    for (const h of HANDYS) {
      const quer = { breite: h.hoehe, hoehe: h.breite };
      for (const aussparung of [0, 44]) {
        const mitte = {
          x: aussparung + DAUMEN_RAND + HALBES_KREUZ,
          y: quer.hoehe - KREUZ_UNTEN - HALBES_KREUZ,
        };
        expect(erreichbar(mitte, quer)).toEqual([true, true, true, true]);
      }
    }
  });

  it("ein Druck auf die Mitte der Pfeiltaste rennt nie, auch direkt am Rand", () => {
    expect(gangartZu(T, 0, "gehen", T, rennenAbZumRand(0))).toBe("gehen");
    expect(rennenAbZumRand(0)).toBe(KLEINSTE_SCHWELLE);
  });

  it("mit genug Platz bleibt die Schwelle wie bisher", () => {
    expect(rennenAbZumRand(500)).toBe(1.4);
  });

  it("vorher (feste Schwelle 1,4) war rechts im Hochformat nicht erreichbar", () => {
    const h = { breite: 390, hoehe: 844 };
    const rand = h.breite - (h.breite - DAUMEN_RAND - HALBES_KREUZ);
    expect(gangartZu(rand - RAND_RESERVE_PX, 0, "gehen")).toBe("gehen");
  });
});
