/**
 * Tests des Fehlerprofils eigener Gegner (DS38): Stufen setzen und lesen, Höchstverlust.
 * Gruppen, Vorlagen und Speicherweg prüft fehlergruppen.test.ts.
 */
import { describe, expect, it } from "vitest";
import { FEHLERARTEN } from "../../../engine/fehlerart";
import type { EigenerGegner } from "../../../engine/gegner";
import { STIL_NEUTRAL } from "../../../engine/stil";
import { hatStufen, setzeStufe, setzeVerlust, stufeVon, verlustVon } from "./fehlerprofil";

const STUFE = 3;

function gegner(): EigenerGegner {
  return {
    kennung: "g-test",
    name: "Test",
    stufenJePhase: { eroeffnung: STUFE, mittelspiel: STUFE, endspiel: STUFE },
    fehlerarten: FEHLERARTEN,
    stil: STIL_NEUTRAL,
    blindeFlecken: [],
  };
}

describe("Stufen setzen und lesen", () => {
  it("neuer Gegner: alle Fehlerarten normal, Flecken aus", () => {
    const g = gegner();
    expect(stufeVon(g, "figurHaengen")).toBe(0);
    expect(stufeVon(g, "rueckzug")).toBeNull();
  });

  it("„aus“ entfernt die Art, eine Stufe schaltet sie wieder ein", () => {
    const aus = setzeStufe(gegner(), "figurHaengen", null);
    expect(aus.fehlerarten).not.toContain("figurHaengen");
    expect(stufeVon(aus, "figurHaengen")).toBeNull();
    const oft = setzeStufe(aus, "figurHaengen", 1);
    expect(oft.fehlerarten).toContain("figurHaengen");
    expect(stufeVon(oft, "figurHaengen")).toBe(1);
    // Die Reihenfolge der Arten bleibt die feste (Speicher vergleicht Listen).
    expect(oft.fehlerarten).toEqual(FEHLERARTEN);
  });

  it("blinder Fleck: an mit Stufe, ohne die Fehlerarten zu ändern", () => {
    const g = setzeStufe(gegner(), "zwischenzug", -1);
    expect(g.blindeFlecken).toEqual(["zwischenzug"]);
    expect(stufeVon(g, "zwischenzug")).toBe(-1);
    expect(g.fehlerarten).toEqual(FEHLERARTEN);
  });

  it("Arten ohne Daten der Spieler kennen nur an und aus", () => {
    expect(hatStufen("pattGesetzt")).toBe(false);
    expect(stufeVon(setzeStufe(gegner(), "pattGesetzt", 0), "pattGesetzt")).toBe(0);
  });
});

describe("Höchstverlust", () => {
  it("fehlt: unbegrenzt; gesetzt und wieder entfernt", () => {
    const g = gegner();
    expect(verlustVon(g, "figurHaengen")).toBeNull();
    const zwei = setzeVerlust(g, "figurHaengen", 2);
    expect(verlustVon(zwei, "figurHaengen")).toBe(2);
    expect(verlustVon(setzeVerlust(zwei, "figurHaengen", null), "figurHaengen")).toBeNull();
  });
});
