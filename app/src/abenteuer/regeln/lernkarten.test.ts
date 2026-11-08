// Lernkarten und Kartentasche (docs/spiel/11, Abschnitt 5 und I2).
import { describe, expect, it } from "vitest";
import kartendatei from "../../../../inhalte/abenteuer/karten.json";
import type { Kartensorte } from "../schnittstelle/karten";
import { deckErlaubt, deckgroesse, mitLernkarten, neueLernkarten } from "./karten";
import { leererAbenteuerstand } from "./spielstand";

const SORTEN = kartendatei.karten as unknown as Kartensorte[];
const JETZT = new Date("2026-11-08T12:00:00Z");
const stand = () => leererAbenteuerstand(JETZT, "Kim", null, false);

describe("Lernkarten aus dem Buch", () => {
  it("Kapitel 1 fertig schenkt Abzählen, einmal", () => {
    const { stand: neu, neu: karten } = mitLernkarten(stand(), [1], SORTEN, JETZT);
    expect(karten.map((k) => k.kennung)).toEqual(["abzaehlen"]);
    expect(neu.karten.map((k) => k.kennung)).toContain("abzaehlen");
    expect(neueLernkarten(neu, [1], SORTEN)).toEqual([]);
  });

  it("jede Lernkarte gehört zu genau einem Kapitel", () => {
    const kapitel = SORTEN.flatMap((s) => (s.kapitel === undefined ? [] : [s.kapitel]));
    expect(new Set(kapitel).size).toBe(kapitel.length);
  });

  it("ohne fertiges Kapitel nichts", () => {
    expect(mitLernkarten(stand(), [], SORTEN, JETZT).neu).toEqual([]);
  });
});

describe("Kartentasche", () => {
  it("vier statt drei Karten", () => {
    expect(deckgroesse([])).toBe(3);
    expect(deckgroesse(["kartentasche"])).toBe(4);
    const drei = ["fingerzeig", "gefahrenradar", "waage"];
    expect(deckErlaubt(drei, "abzaehlen", SORTEN)).toBe(false);
    expect(deckErlaubt(drei, "abzaehlen", SORTEN, 4)).toBe(true);
  });
});
