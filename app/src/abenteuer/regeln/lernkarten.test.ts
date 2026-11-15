// Kartentasche, Mentor-Zug und freie Karte (docs/spiel/11, I2; R29). Die Lernkarten aus Buchkapiteln
// gibt es seit RO11 (15.11.2026) nicht mehr; ihre Wege im Spiel prüft pipeline/tests/test_abenteuer.py.
import { describe, expect, it } from "vitest";
import kartendatei from "../../../../inhalte/abenteuer/karten.json";
import type { Kartensorte } from "../schnittstelle/karten";
import {
  deckErlaubt,
  deckgroesse,
  kartenstufeDerPartie,
  mentorzugGesperrt,
  mitGespielterKarte,
} from "./karten";
import { leererAbenteuerstand } from "./spielstand";

const SORTEN = kartendatei.karten as unknown as Kartensorte[];
const JETZT = new Date("2026-11-08T12:00:00Z");
const stand = () => leererAbenteuerstand(JETZT, "Kim", null, false);

describe("Kartentasche", () => {
  it("vier statt drei Karten", () => {
    expect(deckgroesse([])).toBe(3);
    expect(deckgroesse(["kartentasche"])).toBe(4);
    const drei = ["fingerzeig", "gefahrenradar", "waage"];
    expect(deckErlaubt(drei, "abzaehlen", SORTEN)).toBe(false);
    expect(deckErlaubt(drei, "abzaehlen", SORTEN, 4)).toBe(true);
  });
});

describe("Mentor-Zug in Akt 3 (R29)", () => {
  it("ist zwischen Tiefpunkt und Versöhnung gesperrt", () => {
    expect(mentorzugGesperrt({})).toBe(false);
    expect(mentorzugGesperrt({ tiefpunktGesehen: true })).toBe(true);
    expect(mentorzugGesperrt({ tiefpunktGesehen: true, versoehnungGesehen: true })).toBe(false);
  });
});

describe("Freie Karte im Halbfinale (R29)", () => {
  it("kostet nichts, zählt nicht für die Nadel und merkt sich das Spielen", () => {
    const mentor = SORTEN.find((k) => k.kennung === "mentorzug");
    if (!mentor) throw new Error("Mentor-Zug fehlt");
    const s = {
      ...stand(),
      partiekarten: {
        deck: ["mentorzug"],
        gespielt: [],
        wiedereinstieg: false,
        letzterHalbzug: null,
        frei: ["mentorzug"],
      },
    };
    const nach = mitGespielterKarte(s, mentor, 30);
    expect(nach.dialogvariablen.mentorzugFreiGespielt).toBe(true);
    expect(kartenstufeDerPartie(nach.partiekarten?.gespielt ?? [])).toBe("gold");
  });
});
