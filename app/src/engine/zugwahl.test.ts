/**
 * Tests der Zugwahl (Konzept 8.1 „waehleZug“, 8.2 Stufen) mit vorgegebenen Kandidaten und festem
 * Zufall: Buchzug, bester Zug, Fehlerzug innerhalb der Verlustgrenze, Stärkebegrenzung ab Stufe 4.
 */
import { describe, expect, it } from "vitest";
import type { Bewertung, Staerke } from "./engineDienst";
import { stufe } from "./stufen";
import type { Variante } from "./uci";
import { waehleZug, wertFuer, type Spielbewerter } from "./zugwahl";

/** Abb. 1.13 (nach 2. Dh5), Schwarz am Zug. */
const FEN = "rnbqkbnr/pppp1ppp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2";

function variante(nummer: number, bauernWeiss: number, zuege: string[]): Variante {
  return { nummer, wert: { art: "bauern", bauern: bauernWeiss }, zuege };
}

/** Kandidaten aus Sicht von Weiß: Sc6 gut, La3 lässt den Läufer hängen, g6 verliert einen Turm. */
const KANDIDATEN = [
  variante(1, 0.3, ["b8c6", "f1c4"]),
  variante(2, 0.5, ["d7d6", "f1c4"]),
  variante(3, 3.2, ["f8a3", "b2a3"]),
  variante(4, 6.0, ["g7g6", "h5e5"]),
];

function bewerter(varianten: readonly Variante[], besterZug: string | null = "b8c6") {
  const aufrufe: { varianten: number; staerke?: Staerke }[] = [];
  const b: Spielbewerter = {
    bewerte: (_fen, _ms, anzahl, staerke) => {
      aufrufe.push({ varianten: anzahl, staerke });
      const ergebnis: Bewertung = {
        varianten,
        tiefe: 10,
        knotenJeSekunde: 0,
        rechenzeitMs: 0,
        startzeitMs: 0,
        besterZug,
      };
      return Promise.resolve(ergebnis);
    },
  };
  return { b, aufrufe };
}

/** Zufall, der nacheinander die gegebenen Zahlen liefert. */
function folge(...zahlen: number[]): () => number {
  let stelle = 0;
  return () => zahlen[stelle++ % zahlen.length] ?? 0;
}

describe("Zugwahl", () => {
  it("rechnet Matt als großen Wert aus Sicht der Seite am Zug", () => {
    expect(wertFuer({ art: "bauern", bauern: 1.5 }, false)).toBe(-1.5);
    expect(wertFuer({ art: "matt", zuege: 2 }, true)).toBe(98);
    expect(wertFuer({ art: "matt", zuege: -3 }, true)).toBe(-97);
  });

  it("bleibt meist im Buch", async () => {
    const { b, aufrufe } = bewerter(KANDIDATEN);
    const wahl = await waehleZug(b, FEN, stufe(5), ["b8c6", "g8f6"], folge(0.1, 0.9));
    expect(wahl).toEqual({ uci: "g8f6", quelle: "buch", fehler: null, verlust: 0 });
    expect(aufrufe).toHaveLength(0);
  });

  it("Stufe 1 ohne Fehlerwurf: der beste Zug", async () => {
    const { b } = bewerter(KANDIDATEN);
    const wahl = await waehleZug(b, FEN, stufe(1), [], folge(0.9));
    expect(wahl?.uci).toBe("b8c6");
    expect(wahl?.quelle).toBe("engine");
  });

  it("Stufe 1 mit Fehlerwurf: ein typischer Fehler bis zum Höchstverlust", async () => {
    const { b, aufrufe } = bewerter(KANDIDATEN);
    const wahl = await waehleZug(b, FEN, stufe(1), [], folge(0.1, 0));
    expect(wahl?.quelle).toBe("fehler");
    expect(wahl?.fehler).toBe("figurHaengen");
    expect(wahl?.verlust).toBeGreaterThanOrEqual(0.5);
    expect(aufrufe[0]?.staerke).toEqual({ art: "voll" });
  });

  it("Stufe 3 erlaubt höchstens eine Leichtfigur Verlust: kein Turmverlust", async () => {
    const { b } = bewerter(KANDIDATEN);
    for (const wurf of [0, 0.5, 0.99]) {
      const wahl = await waehleZug(b, FEN, stufe(3), [], folge(0.01, wurf));
      expect(wahl?.uci).not.toBe("g7g6");
    }
  });

  it("ab Stufe 4 begrenzt sich die Engine selbst", async () => {
    const { b, aufrufe } = bewerter(KANDIDATEN, "d7d6");
    const wahl = await waehleZug(b, FEN, stufe(6), [], folge(0.5));
    expect(wahl).toEqual({ uci: "d7d6", quelle: "engine", fehler: null, verlust: 0 });
    expect(aufrufe[0]).toEqual({ varianten: 1, staerke: { art: "elo", elo: 1600 } });
  });

  it("ohne legalen Zug: null", async () => {
    const { b } = bewerter([], null);
    expect(await waehleZug(b, FEN, stufe(8), [], folge(0.5))).toBeNull();
  });
});
