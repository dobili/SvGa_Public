/** Tests des Startwegs: Reihenfolge der Vorschläge je Weg (Wunsch des Autors, 6.11.2026). */
import { describe, expect, it } from "vitest";
import { rangFuerWeg } from "./startweg";

describe("Startweg", () => {
  it("zieht auf dem Spielweg Partie, Thema und Kurzplan vor, Wiederholungen bleiben vorn", () => {
    expect(rangFuerWeg("partie", 90, "spielen")).toBeLessThan(20);
    expect(rangFuerWeg("faellig", 10, "spielen")).toBeLessThan(rangFuerWeg("partie", 90, "spielen"));
    expect(rangFuerWeg("weiterlesen", 30, "spielen")).toBe(30);
  });

  it("lässt Buchweg und Umsehen bei der Grundreihenfolge", () => {
    expect(rangFuerWeg("partie", 90, "buch")).toBe(90);
    expect(rangFuerWeg("partie", 90, "umsehen")).toBe(90);
  });
});
