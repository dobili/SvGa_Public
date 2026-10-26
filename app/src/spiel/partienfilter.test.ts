/**
 * Tests des Filters der Partienliste (mehrere Filter zugleich und Sortierung):
 * Ergebnis aus Sicht des Lesers, Wertung, Farbe, Art des Gegners, Sortierung.
 */
import { describe, expect, it } from "vitest";
import { gibAuf, neuePartie, type Partie } from "./partie";
import {
  aktiveFilter,
  OHNE_FILTER,
  passtZumFilter,
  sortiere,
  umschalten,
  type Sortierwerte,
} from "./partienfilter";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** Eine beendete Partie gegen die Engine (aufgegeben) oder gegen einen Menschen. */
function partie(
  gewertet: boolean,
  gewonnen: boolean,
  mensch = false,
  bot: string | null = null,
): Partie {
  const neu = neuePartie(
    {
      startFen: GRUNDSTELLUNG,
      eigeneFarbe: "white",
      stufe: 1,
      uhr: null,
      ruecknahmeErlaubt: true,
      abbildung: null,
      eroeffnung: null,
      stufenJePhase: { eroeffnung: 1, mittelspiel: 1, endspiel: 1 },
      gegner: mensch ? "mensch" : "engine",
      bot,
      hilfen: { symbole: true, werkzeuge: true },
      gewertet,
    },
    "p",
    "2026-10-19T08:00:00.000Z",
  );
  if (!neu) throw new Error("nicht spielbar");
  const ende = gibAuf(neu);
  if (!ende.ende || !("sieger" in ende.ende)) throw new Error("kein Ende");
  return gewonnen ? { ...ende, ende: { ...ende.ende, sieger: "white" } } : ende;
}

describe("Filter der Partienliste", () => {
  it("ohne Filter passt alles", () => {
    expect(passtZumFilter(partie(true, true), OHNE_FILTER)).toBe(true);
  });

  it("trennt gewonnen und verloren aus Sicht des Lesers, mehrere Ergebnisse mit „oder“", () => {
    const sieg = partie(true, true);
    expect(passtZumFilter(sieg, { ...OHNE_FILTER, ergebnis: ["gewonnen"] })).toBe(true);
    expect(passtZumFilter(sieg, { ...OHNE_FILTER, ergebnis: ["verloren"] })).toBe(false);
    expect(passtZumFilter(sieg, { ...OHNE_FILTER, ergebnis: ["remis", "gewonnen"] })).toBe(true);
  });

  it("verbindet Gruppen mit „und“: Wertung, Farbe, Art des Gegners", () => {
    const uebung = partie(false, false, false, "lotta");
    expect(passtZumFilter(uebung, { ...OHNE_FILTER, wertung: ["ungewertet"] })).toBe(true);
    expect(passtZumFilter(uebung, { ...OHNE_FILTER, wertung: ["gewertet"] })).toBe(false);
    const filter = { ...OHNE_FILTER, farbe: ["white" as const], gegner: ["bot" as const] };
    expect(passtZumFilter(uebung, filter)).toBe(true);
    expect(passtZumFilter(uebung, { ...filter, gegner: ["stufe" as const] })).toBe(false);
  });

  it("Zeitklasse (R51): aus der Bedenkzeit, ohne Uhr als „ohne“", () => {
    const ohne = partie(false, true);
    expect(passtZumFilter(ohne, { ...OHNE_FILTER, zeit: ["ohne"] })).toBe(true);
    expect(passtZumFilter(ohne, { ...OHNE_FILTER, zeit: ["schnell"] })).toBe(false);
    const schnell = {
      ...ohne,
      einstellung: { ...ohne.einstellung, uhr: { grundzeitMs: 600_000, zuschlagMs: 0 } },
    };
    expect(passtZumFilter(schnell, { ...OHNE_FILTER, zeit: ["schnell", "blitz"] })).toBe(true);
    expect(passtZumFilter(schnell, { ...OHNE_FILTER, zeit: ["klassisch"] })).toBe(false);
  });

  it("Mensch gegen Mensch mit Sieger ist weder gewonnen noch verloren und hat keine Farbe", () => {
    const zuZweit = partie(false, true, true);
    expect(passtZumFilter(zuZweit, { ...OHNE_FILTER, ergebnis: ["gewonnen"] })).toBe(false);
    expect(passtZumFilter(zuZweit, { ...OHNE_FILTER, farbe: ["white"] })).toBe(false);
    expect(passtZumFilter(zuZweit, { ...OHNE_FILTER, gegner: ["mensch"] })).toBe(true);
  });

  it("schaltet Symbole an und aus und zählt aktive Gruppen", () => {
    expect(umschalten(["gewonnen"], "remis")).toEqual(["gewonnen", "remis"]);
    expect(umschalten(["gewonnen"], "gewonnen")).toEqual([]);
    expect(aktiveFilter({ ...OHNE_FILTER, farbe: ["black"], wertung: ["gewertet"] })).toBe(2);
  });
});

describe("Sortierung der Partienliste", () => {
  const werte: Sortierwerte[] = [
    { begonnen: "2026-10-17", staerke: 1400, gegner: 1200 },
    { begonnen: "2026-10-19", staerke: null, gegner: 1500 },
    { begonnen: "2026-10-18", staerke: 1600, gegner: null },
  ];
  const nach = (s: "datum" | "staerke" | "gegner", auf = false) =>
    sortiere(werte, s, (w) => w, auf).map((w) => w.begonnen);

  it("Datum neueste zuerst, umgekehrt älteste zuerst", () => {
    expect(nach("datum")).toEqual(["2026-10-19", "2026-10-18", "2026-10-17"]);
    expect(nach("datum", true)).toEqual(["2026-10-17", "2026-10-18", "2026-10-19"]);
  });

  it("Stärken höchste zuerst, unbekannte immer am Ende", () => {
    expect(nach("staerke")).toEqual(["2026-10-18", "2026-10-17", "2026-10-19"]);
    expect(nach("staerke", true)).toEqual(["2026-10-17", "2026-10-18", "2026-10-19"]);
    expect(nach("gegner")).toEqual(["2026-10-19", "2026-10-17", "2026-10-18"]);
  });
});
