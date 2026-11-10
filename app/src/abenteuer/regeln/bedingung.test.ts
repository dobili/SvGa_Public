/** Tests für bedingung.ts: Sprache der Bedingungen an Übergängen und Zuständen (Runde 8). */
import { describe, expect, it } from "vitest";
import { erfuellt } from "./bedingung";

const V = {
  musikhausOffen: true,
  nadelMapleFalls: 2,
  hatLaterne: false,
  ausgang: "sieg",
  leer: "",
};

describe("erfuellt", () => {
  it("Variable allein: wahr, Zahl ungleich 0, nicht leerer Text", () => {
    expect(erfuellt("musikhausOffen", V)).toBe(true);
    expect(erfuellt("nadelMapleFalls", V)).toBe(true);
    expect(erfuellt("hatLaterne", V)).toBe(false);
    expect(erfuellt("leer", V)).toBe(false);
    expect(erfuellt("unbekannt", V)).toBe(false);
  });

  it("Vergleiche mit Zahl, Text und wahr/falsch", () => {
    expect(erfuellt("nadelMapleFalls >= 1", V)).toBe(true);
    expect(erfuellt("nadelMapleFalls > 2", V)).toBe(false);
    expect(erfuellt("nadelMapleFalls == 2", V)).toBe(true);
    expect(erfuellt('ausgang == "sieg"', V)).toBe(true);
    expect(erfuellt('ausgang != "sieg"', V)).toBe(false);
    expect(erfuellt("hatLaterne == falsch", V)).toBe(true);
  });

  it("fehlende Variable zählt als leerer Wert der Vergleichsart", () => {
    expect(erfuellt("nadelCedarCreek < 1", V)).toBe(true);
    expect(erfuellt("nadelCedarCreek >= 1", V)).toBe(false);
    expect(erfuellt('ausgangJo == ""', V)).toBe(true);
  });

  it("nicht, und, oder und Klammern; und bindet stärker", () => {
    expect(erfuellt("nicht hatLaterne", V)).toBe(true);
    expect(erfuellt("musikhausOffen und hatLaterne", V)).toBe(false);
    expect(erfuellt("hatLaterne oder musikhausOffen", V)).toBe(true);
    expect(erfuellt("hatLaterne und musikhausOffen oder nadelMapleFalls >= 2", V)).toBe(true);
    expect(erfuellt("hatLaterne und (musikhausOffen oder nadelMapleFalls >= 2)", V)).toBe(false);
  });

  it("wirft bei fehlerhaften Bedingungen", () => {
    expect(() => erfuellt("", V)).toThrow();
    expect(() => erfuellt("a >=", V)).toThrow();
    expect(() => erfuellt("a b", V)).toThrow();
    expect(() => erfuellt("(a", V)).toThrow();
    expect(() => erfuellt("a == b", V)).toThrow();
    expect(() => erfuellt("a && b", V)).toThrow();
  });
});
