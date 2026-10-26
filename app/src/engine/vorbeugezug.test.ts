/** Tests für den Vorbeugezug (Vorschlag D4) mit einer vorgegebenen Engine. */
import { describe, expect, it } from "vitest";
import type { Bewertung } from "./engineDienst";
import type { Bewerter } from "./gegnerplan";
import { rechneVorbeugezug } from "./vorbeugezug";

const GRUND = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** Eine Bewertung mit den angegebenen ersten Zügen (alle Werte 0). */
function bewertung(zuege: readonly string[]): Bewertung {
  return {
    varianten: zuege.map((zug, i) => ({
      nummer: i + 1,
      wert: { art: "bauern", bauern: 0 },
      zuege: [zug],
    })),
    tiefe: 1,
    knotenJeSekunde: 1,
    rechenzeitMs: 1,
    startzeitMs: 0,
    besterZug: zuege[0] ?? null,
  };
}

/** Engine, die je Stellung (nach dem Zug von Weiß) eine feste Antwort von Schwarz gibt. */
function engineMit(antworten: Readonly<Record<string, string>>): Bewerter {
  return {
    bewerte: (fen) => {
      if (fen === GRUND) return Promise.resolve(bewertung(["e2e4", "d2d4", "g1f3"]));
      const feld = Object.keys(antworten).find((teil) => fen.startsWith(teil));
      return Promise.resolve(bewertung([feld === undefined ? "a7a6" : (antworten[feld] ?? "")]));
    },
  };
}

describe("Vorbeugezug", () => {
  it("nimmt den ersten Kandidaten, nach dem der Gegner seinen Plan nicht mehr spielt", async () => {
    // Nach 1. e4 spielt Schwarz weiter seinen Plan …d5, nach 1. d4 nicht mehr.
    const engine = engineMit({
      "rnbqkbnr/pppppppp/8/8/4P3": "d7d5",
      "rnbqkbnr/pppppppp/8/8/3P4": "g8f6",
    });
    const vorbeugung = await rechneVorbeugezug(engine, GRUND, "d7d5", 1, 1);
    expect(vorbeugung).toEqual({ zug: "d2d4", antwort: "g8f6", verhindert: true });
  });

  it("findet sich keiner, bleibt der beste Zug mit „nicht verhindert“", async () => {
    const engine = engineMit({ "": "d7d5" });
    const vorbeugung = await rechneVorbeugezug(engine, GRUND, "d7d5", 1, 1);
    expect(vorbeugung).toEqual({ zug: "e2e4", antwort: "d7d5", verhindert: false });
  });
});
