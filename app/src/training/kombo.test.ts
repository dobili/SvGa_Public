/**
 * Tests der Kombo (Gamifizierung P10 a): sichtbar ab drei, Funkeln bei fünf und zehn, Ton je
 * Antwort einen Halbton höher, eine weitere Stufe ist eine Zeile.
 */
import { describe, expect, it } from "vitest";
import { komboFunkelt, komboHalbtoene, komboSichtbar } from "./kombo";

describe("Kombo", () => {
  it("ist ab drei richtigen Antworten in Folge sichtbar", () => {
    expect(komboSichtbar(2)).toBe(false);
    expect(komboSichtbar(3)).toBe(true);
    expect(komboSichtbar(11)).toBe(true);
  });

  it("funkelt genau beim Erreichen von fünf und zehn", () => {
    expect([3, 4, 5, 6, 9, 10, 11].map((f) => komboFunkelt(f))).toEqual([
      false,
      false,
      true,
      false,
      false,
      true,
      false,
    ]);
  });

  it("steigt je Antwort einen Halbton, höchstens eine Oktave", () => {
    expect(komboHalbtoene(2)).toBeNull();
    expect(komboHalbtoene(3)).toBe(0);
    expect(komboHalbtoene(5)).toBe(2);
    expect(komboHalbtoene(40)).toBe(12);
  });

  it("nimmt eine weitere Stufe aus der Liste", () => {
    const stufen = [
      { ab: 2, funkeln: true },
      { ab: 20, funkeln: true },
    ];
    expect(komboSichtbar(2, stufen)).toBe(true);
    expect(komboFunkelt(20, stufen)).toBe(true);
  });
});
