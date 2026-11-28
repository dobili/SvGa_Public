/**
 * Test zum Neuaufbau derselben Karte (neuaufbau.ts): Ein Gespräch, nach dem die Karte sich neu
 * aufstellt, versetzt den Helden nicht (Befund des Autors 28.11.2026, Juno an der Haltestelle).
 */
import { describe, expect, it } from "vitest";
import { leererAbenteuerstand } from "../regeln/spielstand";
import type { Abenteuerstand, Weltposition } from "../schnittstelle/spielstand";
import { standFuerNeuaufbau } from "./neuaufbau";

const JETZT = new Date("2026-11-28T10:00:00Z");

/** Ein Stand, dessen Position noch auf dem Feld steht, auf dem der Held die Karte betrat. */
function standAnDerHaustuer(): Abenteuerstand {
  const leer = leererAbenteuerstand(JETZT, "Kim", null, false);
  return { ...leer, position: { karte: "mapleFalls.aussen", x: 23, y: 19, richtung: "unten" } };
}

describe("Neuaufbau derselben Karte", () => {
  it("nimmt das Feld aus der Szene: der Held bleibt bei Juno stehen", () => {
    const beiJuno: Weltposition = { karte: "mapleFalls.aussen", x: 53, y: 24, richtung: "rechts" };
    const neu = standFuerNeuaufbau(standAnDerHaustuer(), beiJuno);
    expect(neu.position).toEqual(beiJuno);
  });

  it("lässt den Stand ohne laufende Szene unverändert", () => {
    const stand = standAnDerHaustuer();
    expect(standFuerNeuaufbau(stand, null)).toBe(stand);
  });

  it("übernimmt keine Szene einer anderen Karte", () => {
    const stand = standAnDerHaustuer();
    const anderswo: Weltposition = { karte: "mapleFalls.clubraum", x: 4, y: 4, richtung: "oben" };
    expect(standFuerNeuaufbau(stand, anderswo)).toBe(stand);
  });

  it("gibt dasselbe Objekt zurück, wenn der Held noch auf seinem Feld steht", () => {
    const stand = standAnDerHaustuer();
    expect(standFuerNeuaufbau(stand, { ...stand.position })).toBe(stand);
  });
});
