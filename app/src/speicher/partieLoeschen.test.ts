/**
 * Tests zum Löschen von Partien und zum Porträt eigener Gegner: Nur ungewertete Partien
 * lassen sich löschen; ein Porträt kommt nur aus der Liste zur Wahl durch die Rohdaten.
 */
import { describe, expect, it } from "vitest";
import { gibAuf, neuePartie, type Partie } from "../spiel/partie";
import { eigenerGegnerAus } from "./gegner";
import { legeAb, LEERER_SPIELSTAND, ohnePartien } from "./partien";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

function partie(id: string, gewertet: boolean): Partie {
  const neu = neuePartie(
    {
      startFen: GRUNDSTELLUNG,
      eigeneFarbe: "white",
      stufe: 1,
      uhr: null,
      ruecknahmeErlaubt: !gewertet,
      abbildung: null,
      eroeffnung: null,
      stufenJePhase: { eroeffnung: 1, mittelspiel: 1, endspiel: 1 },
      gegner: "engine",
      bot: null,
      hilfen: { symbole: true, werkzeuge: true },
      gewertet,
    },
    id,
    "2026-10-19T08:00:00.000Z",
  );
  if (!neu) throw new Error("nicht spielbar");
  return gibAuf(neu);
}

describe("Partie löschen", () => {
  it("löscht ungewertete Partien, gewertete bleiben", () => {
    const stand = [partie("a", false), partie("b", true), partie("c", false)].reduce(
      legeAb,
      LEERER_SPIELSTAND,
    );
    const ids = (s: typeof stand) => s.partien.map((e) => e.partie.id);
    expect(ids(ohnePartien(stand, new Set(["a"])))).toEqual(["c", "b"]);
    expect(ids(ohnePartien(stand, new Set(["a", "b", "c"])))).toEqual(["b"]);
  });
});

describe("Porträt eigener Gegner", () => {
  const roh = { kennung: "eigen-1", name: "Tante Erna" };
  it("übernimmt ein Porträt aus der Liste zur Wahl", () => {
    expect(eigenerGegnerAus({ ...roh, portraet: "wahl-25" })?.portraet).toBe("wahl-25");
  });

  it("verwirft Unbekanntes und alte Gegner ohne Porträt", () => {
    expect(eigenerGegnerAus({ ...roh, portraet: "lotta" })?.portraet).toBeUndefined();
    expect(eigenerGegnerAus(roh)?.portraet).toBeUndefined();
  });
});
