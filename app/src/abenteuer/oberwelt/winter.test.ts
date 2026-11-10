/**
 * Tests für winter.ts: dieselben Farben wie pipeline/abenteuer/winter.py (Fälle aus Python
 * erzeugt), Umfärben von Bilddaten und Erkennen einer Winterkarte.
 */
import { describe, expect, it } from "vitest";
import { faerbeDaten, istWinter, winterfarbe } from "./winter";

/** r, g, b → Winterfarbe mit Wasser, dann ohne Wasser (Werte aus winter.py). */
const AUS_PYTHON: readonly (readonly number[])[] = [
  [106, 170, 72, 222, 221, 219, 222, 221, 219],
  [150, 110, 70, 130, 110, 90, 130, 110, 90],
  [60, 120, 200, 42, 96, 180, 60, 120, 200],
  [200, 40, 40, 200, 40, 40, 200, 40, 40],
  [20, 60, 20, 202, 200, 197, 202, 200, 197],
  [240, 240, 240, 240, 240, 240, 240, 240, 240],
  [121, 66, 189, 121, 66, 189, 121, 66, 189],
  [242, 33, 6, 242, 33, 6, 242, 33, 6],
  [240, 132, 119, 240, 132, 119, 240, 132, 119],
  [98, 240, 243, 69, 192, 219, 98, 240, 243],
  [203, 77, 118, 203, 77, 118, 203, 77, 118],
  [77, 199, 7, 217, 216, 214, 217, 216, 214],
  [32, 81, 21, 205, 203, 200, 205, 203, 200],
  [154, 15, 137, 154, 15, 137, 154, 15, 137],
  [242, 198, 218, 242, 198, 218, 242, 198, 218],
  [202, 227, 68, 228, 228, 226, 228, 228, 226],
  [187, 49, 18, 187, 49, 18, 187, 49, 18],
  [69, 253, 111, 232, 231, 230, 232, 231, 230],
  [132, 223, 154, 236, 235, 234, 236, 235, 234],
  [215, 197, 179, 206, 197, 188, 206, 197, 188],
  [208, 118, 172, 208, 118, 172, 208, 118, 172],
  [14, 143, 83, 211, 210, 208, 211, 210, 208],
  [167, 53, 108, 167, 53, 108, 167, 53, 108],
  [136, 145, 63, 218, 217, 214, 218, 217, 214],
  [32, 246, 247, 22, 197, 222, 32, 246, 247],
  [45, 176, 34, 218, 217, 215, 218, 217, 215],
  [210, 77, 10, 155, 88, 55, 155, 88, 55],
  [150, 218, 212, 105, 174, 191, 150, 218, 212],
  [60, 22, 23, 60, 22, 23, 60, 22, 23],
  [193, 169, 142, 181, 169, 155, 181, 169, 155],
  [120, 18, 158, 120, 18, 158, 120, 18, 158],
  [3, 39, 55, 2, 31, 50, 3, 39, 55],
  [16, 101, 208, 11, 81, 187, 16, 101, 208],
  [149, 134, 79, 135, 127, 100, 135, 127, 100],
  [21, 173, 160, 15, 138, 144, 21, 173, 160],
  [184, 70, 193, 184, 70, 193, 184, 70, 193],
];

describe("winterfarbe", () => {
  it("rechnet wie die Pipeline", () => {
    for (const [r, g, b, ...erwartet] of AUS_PYTHON) {
      const mit = winterfarbe(r ?? 0, g ?? 0, b ?? 0);
      const ohne = winterfarbe(r ?? 0, g ?? 0, b ?? 0, false);
      expect([...mit, ...ohne]).toEqual(erwartet);
    }
  });

  it("Gras wird Schnee, Rot bleibt", () => {
    expect(winterfarbe(106, 170, 72)).toEqual([222, 221, 219]);
    expect(winterfarbe(200, 40, 40)).toEqual([200, 40, 40]);
  });
});

describe("faerbeDaten und istWinter", () => {
  it("färbt RGBA um und lässt die Transparenz", () => {
    const daten = new Uint8ClampedArray([106, 170, 72, 128, 200, 40, 40, 255]);
    faerbeDaten(daten);
    expect([...daten]).toEqual([222, 221, 219, 128, 200, 40, 40, 255]);
  });

  it("erkennt die Eigenschaft jahreszeit", () => {
    expect(istWinter({ properties: [{ name: "jahreszeit", value: "winter" }] })).toBe(true);
    expect(istWinter({ properties: [{ name: "toenung", value: "nebel" }] })).toBe(false);
    expect(istWinter({})).toBe(false);
  });
});
