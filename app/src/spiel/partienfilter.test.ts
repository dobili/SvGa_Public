/** Tests des Filters der Partienliste (0.2.99): Ergebnis aus Sicht des Lesers und Wertung. */
import { describe, expect, it } from "vitest";
import { gibAuf, neuePartie, type Partie } from "./partie";
import { OHNE_FILTER, passtZumFilter } from "./partienfilter";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** Eine beendete Partie gegen die Engine (aufgegeben) oder gegen einen Menschen. */
function partie(gewertet: boolean, gewonnen: boolean, mensch = false): Partie {
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
      bot: null,
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

  it("trennt gewonnen und verloren aus Sicht des Lesers", () => {
    const sieg = partie(true, true);
    expect(passtZumFilter(sieg, { ergebnis: "gewonnen", wertung: "alle" })).toBe(true);
    expect(passtZumFilter(sieg, { ergebnis: "verloren", wertung: "alle" })).toBe(false);
  });

  it("trennt gewertete und ungewertete Partien", () => {
    const uebung = partie(false, false);
    expect(passtZumFilter(uebung, { ergebnis: "alle", wertung: "ungewertet" })).toBe(true);
    expect(passtZumFilter(uebung, { ergebnis: "alle", wertung: "gewertet" })).toBe(false);
  });

  it("Mensch gegen Mensch mit Sieger ist weder gewonnen noch verloren", () => {
    const zuZweit = partie(false, true, true);
    expect(passtZumFilter(zuZweit, { ergebnis: "gewonnen", wertung: "alle" })).toBe(false);
    expect(passtZumFilter(zuZweit, OHNE_FILTER)).toBe(true);
  });
});
