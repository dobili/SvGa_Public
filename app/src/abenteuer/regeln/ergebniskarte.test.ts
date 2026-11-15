/**
 * Die offene Ergebniskarte im Spielstand (Spieltest „einstieg“, 15.11.2026, R6) übersteht das
 * Lesen der Nutzerdaten (regeln/spielstand.ts, abenteuerstandAus); Unlesbares fällt still weg.
 */
import { describe, expect, it } from "vitest";
import { abenteuerstandAus, leererAbenteuerstand } from "./spielstand";

const LEER = leererAbenteuerstand(new Date("2026-11-15T05:00:00Z"), "Mia", 600, false);
const RUNDE = {
  art: "runde",
  auftrag: { kennung: "mapleFalls.springerLily@1", runde: "mapleFalls.springerLily" },
  punkte: 1.5,
  moeglich: 3,
  bestanden: false,
  reiheGeschafft: false,
};

describe("abenteuerstandAus mit Ergebniskarte", () => {
  it("behält eine offene Karte der Runde", () => {
    const roh = JSON.parse(JSON.stringify({ ...LEER, ergebniskarte: RUNDE })) as unknown;
    expect(abenteuerstandAus(roh)?.ergebniskarte).toEqual(RUNDE);
  });

  it("lässt eine unlesbare Karte weg und einen Stand ohne Karte unverändert", () => {
    const kaputt = { ...LEER, ergebniskarte: { art: "partie" } };
    expect(abenteuerstandAus(kaputt)?.ergebniskarte).toBeUndefined();
    expect(abenteuerstandAus(LEER)?.ergebniskarte).toBeUndefined();
  });
});
