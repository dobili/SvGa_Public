/** Tests des Endspieltrainers (reine Logik): Runde, Kippen, Ergebnis aus dem Partieende. */
import { describe, expect, it } from "vitest";
import type { Endspielaufgabe } from "../daten/trainerdaten";
import {
  anzahlJeGruppe,
  endspielrunde,
  ergebnisAusEnde,
  gekippt,
  istUmwandlung,
} from "./endspieltrainer";
import { festerZufall } from "./zufall";

const MASSSTAB = { gewinnAb: 2, remisBis: 0.8 };

function aufgabe(
  nummer: string,
  thema: Endspielaufgabe["thema"],
  schwierigkeit: number,
  ziel: Endspielaufgabe["ziel"] = "gewinn",
): Endspielaufgabe {
  return {
    id: `endspiel-b-${nummer}`,
    fen: "8/8/8/8/8/8/8/K6k w - - 0 1",
    leser: "w",
    ziel,
    thema,
    stichwort: null,
    schwierigkeit,
    herkunft: { quelle: "buch", abbildung: nummer },
    pruefung: { wert: 5, mattIn: null, bester: "Kb1", einzigerZug: false, tiefe: 24 },
  };
}

const AUFGABEN = [
  aufgabe("8.4", "damenmatt", 1),
  aufgabe("8.13", "turmmatt", 2),
  aufgabe("8.19", "opposition", 2, "remis"),
  aufgabe("8.27", "schluesselfelder", 3),
  aufgabe("9.3", "turmendspiel", 4, "remis"),
  aufgabe("9.8", "turmendspiel", 5),
  aufgabe("9.28", "dameGegenBauer", 4),
];

describe("Endspieltrainer", () => {
  it("zählt je Gruppe und wählt eine Runde nahe der Stufe, leichteste zuerst", () => {
    const anzahl = anzahlJeGruppe(AUFGABEN);
    expect(anzahl.get("alle")).toBe(7);
    expect(anzahl.get("matt")).toBe(2);
    expect(anzahl.get("turm")).toBe(2);
    expect(anzahl.get("leichtfiguren")).toBe(0);
    const runde = endspielrunde(AUFGABEN, { gruppe: "turm", stufe: 5 }, 6, festerZufall(1));
    expect(runde.map((a) => a.id)).toEqual(["endspiel-b-9.3", "endspiel-b-9.8"]);
    const leicht = endspielrunde(AUFGABEN, { gruppe: "alle", stufe: 1 }, 3, festerZufall(1));
    expect(leicht.map((a) => a.schwierigkeit)).toEqual([1, 2, 2]);
  });

  it("kippt mit Spielraum: Gewinn unter 1,5, Remis unter −1,5", () => {
    expect(gekippt("gewinn", 3, MASSSTAB)).toBe(false);
    expect(gekippt("gewinn", 1.6, MASSSTAB)).toBe(false);
    expect(gekippt("gewinn", 0.3, MASSSTAB)).toBe(true);
    expect(gekippt("remis", -1.2, MASSSTAB)).toBe(false);
    expect(gekippt("remis", -2, MASSSTAB)).toBe(true);
    expect(gekippt("remis", 4, MASSSTAB)).toBe(false);
  });

  it("Ergebnis aus dem Partieende: Matt des Lesers erreicht, Remis je nach Ziel", () => {
    expect(ergebnisAusEnde("gewinn", "w", { art: "matt", sieger: "white" })).toEqual({
      art: "erreicht",
      grund: "matt",
    });
    expect(ergebnisAusEnde("gewinn", "b", { art: "matt", sieger: "white" })).toEqual({
      art: "verfehlt",
      grund: "matt",
      gehalten: null,
    });
    expect(ergebnisAusEnde("remis", "b", { art: "patt" })).toEqual({
      art: "erreicht",
      grund: "remis",
    });
    expect(ergebnisAusEnde("gewinn", "w", { art: "patt" })).toEqual({
      art: "verfehlt",
      grund: "remis",
      gehalten: null,
    });
    expect(ergebnisAusEnde("gewinn", "w", null)).toBeNull();
    expect(istUmwandlung("e8=Q+")).toBe(true);
    expect(istUmwandlung("Kd7")).toBe(false);
  });
});
