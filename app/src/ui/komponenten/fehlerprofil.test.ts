/**
 * Tests des Fehlerprofils eigener Gegner (DS38, 0.2.129): Stufen setzen und lesen, Höchstverlust,
 * Vorlagen und das Weiterschalten der blinden Flecken.
 */
import { describe, expect, it } from "vitest";
import { FEHLERARTEN } from "../../engine/fehlerart";
import type { EigenerGegner } from "../../engine/gegner";
import { STIL_NEUTRAL } from "../../engine/stil";
import {
  FEHLERGRUPPEN,
  hatStufen,
  istVorlage,
  mitVorlage,
  naechsterFleckstand,
  setzeStufe,
  setzeVerlust,
  stufeVon,
  verlustVon,
} from "./fehlerprofil";

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

describe("Gruppen", () => {
  it("enthalten jede Fehlerart genau einmal", () => {
    const alle = FEHLERGRUPPEN.flatMap((gruppe) => gruppe.arten);
    expect([...alle].sort()).toEqual([...FEHLERARTEN].sort());
  });
});

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

describe("Vorlagen", () => {
  it("„leichtsinnig“ setzt Figur hängen auf sehr oft und wird erkannt", () => {
    const g = mitVorlage(setzeStufe(gegner(), "figurHaengen", null), "leichtsinnig");
    expect(stufeVon(g, "figurHaengen")).toBe(2);
    expect(stufeVon(g, "koenigMitte")).toBe(0);
    expect(istVorlage(g, "leichtsinnig")).toBe(true);
    expect(istVorlage(g, "wieMenschen")).toBe(false);
  });

  it("eine geänderte Zeile hebt die Vorlage auf", () => {
    const g = setzeStufe(mitVorlage(gegner(), "solide"), "koenigMitte", 1);
    expect(istVorlage(g, "solide")).toBe(false);
  });

  it("„taktisch blind“ schaltet nur seine Flecken ein", () => {
    const g = mitVorlage(gegner(), "taktischBlind");
    expect([...g.blindeFlecken].sort()).toEqual(["abzug", "roentgen", "zwischenzug"]);
  });

  it("„keine Fehler“ schaltet alle Fehlerarten und Flecken aus", () => {
    const g = mitVorlage(setzeStufe(gegner(), "rueckzug", 1), "fehlerfrei");
    expect(g.fehlerarten).toEqual([]);
    expect(g.blindeFlecken).toEqual([]);
    expect(istVorlage(g, "fehlerfrei")).toBe(true);
  });
});

describe("blinde Flecken weiterschalten", () => {
  it("aus → selten → normal → oft → sehr oft → aus; Unbekanntes springt auf aus", () => {
    const folge = [null, -1, 0, 1, 2, null];
    for (let i = 0; i < folge.length - 1; i += 1) {
      expect(naechsterFleckstand(folge[i] ?? null)).toBe(folge[i + 1]);
    }
    expect(naechsterFleckstand(-4)).toBeNull();
  });
});
