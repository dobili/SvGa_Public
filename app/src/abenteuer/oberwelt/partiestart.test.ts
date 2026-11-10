/**
 * Tests für partiestart.ts: Bauernvorgabe ändert die Startstellung und zählt als gespielt, die
 * Verbrauchskarte wird abgezogen, Position und laufende Partie stehen im Stand (R24, R26).
 */
import { describe, expect, it } from "vitest";
import karten from "../../../../inhalte/abenteuer/karten.json";
import { GRUNDSTELLUNG } from "../anbindung/partiestart";
import { leererAbenteuerstand } from "../regeln/spielstand";
import type { Gegnerprofil } from "../schnittstelle/gegnerprofil";
import type { Kartensorte } from "../schnittstelle/karten";
import type { Partieauftrag } from "../schnittstelle/partie";
import { partiestart } from "./partiestart";

const SORTEN = karten.karten as unknown as readonly Kartensorte[];
const JETZT = new Date("2026-11-10T11:00:00Z");
const PROFIL: Gegnerprofil = {
  kennung: "mapleFalls.jo",
  name: "figur.jo.name",
  rolle: "strasse",
  portraet: "portraets/jo.webp",
  staerke: { art: "aktuell", versatz: 0 },
  gewichte: {},
  stil: "angreifer",
  eroeffnung: { art: "frei" },
  steckbrief: [],
};
const AUFTRAG: Partieauftrag = {
  kennung: "mapleFalls.jo#1",
  begegnung: "mapleFalls.jo",
  profil: PROFIL,
  zustand: { haeufigkeitsfaktor: 1, grund: null, analysiert: false, ueberheblich: 1 },
  staerke: {
    zielElo: 800,
    stufenJePhase: { eroeffnung: 3, mittelspiel: 3, endspiel: 3 },
    haeufigkeit: 1,
  },
  farbe: "black",
  format: { art: "partie" },
  startstellung: { art: "grundstellung" },
  deck: { karten: [] },
  kartenErlaubt: true,
  zaehltFuerApp: true,
  uhr: null,
};
const STAND = {
  ...leererAbenteuerstand(JETZT, "Kim", null, false),
  karten: [{ kennung: "bauernvorgabe", anzahl: 1, erhalten: JETZT.toISOString() }],
};
const POSITION = { karte: "mapleFalls.aussen", x: 3, y: 4, richtung: "unten" as const };

describe("partiestart", () => {
  it("Bauernvorgabe: Startstellung ohne Bauern f2 des Gegners, Karte verbraucht und gespielt", () => {
    const r = partiestart(STAND, AUFTRAG, ["bauernvorgabe"], [], SORTEN, POSITION);
    expect(r.auftrag.startstellung).toEqual({
      art: "fen",
      fen: GRUNDSTELLUNG.replace("PPPPPPPP", "PPPPP1PP"),
    });
    expect(r.auftrag.deck).toEqual({ karten: ["bauernvorgabe"] });
    expect(r.stand.karten).toEqual([]);
    expect(r.stand.partiekarten?.gespielt).toEqual([
      { kennung: "bauernvorgabe", stufe: "stark", halbzug: 0 },
    ]);
    expect(r.stand.partiekarten?.deck).toEqual([]);
    expect(r.stand.laufendePartie).toBe("mapleFalls.jo#1");
    expect(r.stand.position).toEqual(POSITION);
  });

  it("ohne Deck bleibt alles wie in der Begegnung", () => {
    const r = partiestart(STAND, AUFTRAG, [], [], SORTEN, POSITION);
    expect(r.auftrag.startstellung).toEqual({ art: "grundstellung" });
    expect(r.stand.karten).toEqual(STAND.karten);
    expect(r.stand.partiekarten?.gespielt).toEqual([]);
  });
});
