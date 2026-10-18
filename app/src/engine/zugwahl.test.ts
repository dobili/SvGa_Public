/**
 * Tests der Zugwahl (Konzept 8.1 „waehleZug“, 8.2 Stufen) mit vorgegebenen Kandidaten und festem
 * Zufall: Buchzug, Zug mit der Grundstärke der Stufe, Fehlerzug innerhalb der Verlustgrenze,
 * Stärkebegrenzung ab Stufe 4.
 */
import { describe, expect, it } from "vitest";
import type { Bewertung, Staerke } from "./engineDienst";
import { stufe } from "./stufen";
import type { Variante } from "./uci";
import { BUCHTREUE_VORGABE, type Spielbewerter, waehleZug, wertFuer } from "./zugwahl";

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

/** Eine nachgestellte Engine: immer dieselben Kandidaten, mit „nurZuege“ nur die genannten. */
function bewerter(varianten: readonly Variante[], besterZug: string | null = "b8c6") {
  const aufrufe: { varianten: number; staerke?: Staerke }[] = [];
  const b: Spielbewerter = {
    bewerte: (_fen, _ms, anzahl, staerke, nurZuege = []) => {
      aufrufe.push({ varianten: anzahl, staerke });
      const gewaehlt =
        nurZuege.length > 0
          ? varianten.filter((v) => nurZuege.includes(v.zuege[0] ?? ""))
          : varianten;
      const ergebnis: Bewertung = {
        varianten: gewaehlt,
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

  it("mit vorgegebener Eröffnung (Buchtreue 1) immer im Buch, auch bei hohem Wurf", async () => {
    const { b, aufrufe } = bewerter(KANDIDATEN);
    const wahl = await waehleZug(b, FEN, stufe(5), ["b8c6"], folge(0.99, 0.5), BUCHTREUE_VORGABE);
    expect(wahl).toEqual({ uci: "b8c6", quelle: "buch", fehler: null, verlust: 0 });
    expect(aufrufe).toHaveLength(0);
  });

  it("Stufe 1 ohne Fehlerwurf: Kandidaten bis Tiefe 2, gewichtete Wahl (R4, 0.2.52)", async () => {
    const { b, aufrufe } = bewerter(KANDIDATEN);
    // Fehlerwurf 0,9 trifft nicht; Wahl 0 → der beste Zug.
    const wahl = await waehleZug(b, FEN, stufe(1), [], folge(0.9, 0));
    expect(wahl).toEqual({ uci: "b8c6", quelle: "engine", fehler: null, verlust: 0 });
    expect(aufrufe).toEqual([{ varianten: 6, staerke: { art: "tiefe", tiefe: 2 } }]);
    // Hoher Wurf: ein schlechterer Kandidat mit seinem Verlust (Schwarz am Zug: d6 kostet 0,2).
    const zweite = await waehleZug(b, FEN, stufe(1), [], folge(0.9, 0.7));
    expect(zweite?.uci).toBe("d7d6");
    expect(zweite?.verlust).toBeCloseTo(0.2, 5);
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

  it("Fehlerwurf ohne passenden Fehler: der normale Zug der Stufe", async () => {
    const { b, aufrufe } = bewerter([variante(1, 0.3, ["b8c6"])], "d7d6");
    const wahl = await waehleZug(b, FEN, stufe(3), [], folge(0.01, 0.5));
    expect(wahl).toEqual({ uci: "b8c6", quelle: "engine", fehler: null, verlust: 0 });
    expect(aufrufe.at(-1)).toEqual({ varianten: 6, staerke: { art: "tiefe", tiefe: 5 } });
    // Ab Stufe 4 weiter der beste Zug der Grundstärke.
    const { b: b4, aufrufe: a4 } = bewerter([variante(1, 0.3, ["b8c6"])], "d7d6");
    const wahl4 = await waehleZug(b4, FEN, stufe(4), [], folge(0.01, 0.5));
    expect(wahl4).toEqual({ uci: "d7d6", quelle: "engine", fehler: null, verlust: 0 });
    expect(a4.at(-1)).toEqual({ varianten: 1, staerke: { art: "skill", stufe: 4 } });
  });

  it("ab Stufe 5 nur die Grundstärke, kein Fehlerwurf", async () => {
    const { b, aufrufe } = bewerter(KANDIDATEN, "d7d6");
    const wahl = await waehleZug(b, FEN, stufe(6), [], folge(0.0001));
    expect(wahl).toEqual({ uci: "d7d6", quelle: "engine", fehler: null, verlust: 0 });
    expect(aufrufe).toEqual([{ varianten: 1, staerke: { art: "skill", stufe: 10 } }]);
  });

  it("Stufe 8 spielt voll", async () => {
    const { b, aufrufe } = bewerter(KANDIDATEN, "b8c6");
    await waehleZug(b, FEN, stufe(8), [], folge(0.5));
    expect(aufrufe[0]?.staerke).toEqual({ art: "voll" });
  });

  // Eigene Gegner (0.2.42): Profil mit Fehlerarten und Stil.
  it("Profil ohne Fehlerarten: nie ein Fehlerwurf; nur erlaubte Arten zählen", async () => {
    const { b, aufrufe } = bewerter(KANDIDATEN);
    const keine = { fehlerarten: [], stil: 0, blindeFlecken: [] };
    const wahl = await waehleZug(b, FEN, stufe(1), [], folge(0.1, 0), BUCHTREUE_VORGABE, keine);
    expect(wahl?.quelle).toBe("engine");
    expect(aufrufe).toEqual([{ varianten: 6, staerke: { art: "tiefe", tiefe: 2 } }]);
    const nurRaub = { fehlerarten: ["bauernraub" as const], stil: 0, blindeFlecken: [] };
    const ohne = await waehleZug(b, FEN, stufe(1), [], folge(0.1, 0), BUCHTREUE_VORGABE, nurRaub);
    expect(ohne?.fehler).toBeNull();
  });

  it("Profil mit Stil: mehrere Kandidaten der Stufe, Wahl nach dem Stil", async () => {
    const { b, aufrufe } = bewerter(KANDIDATEN);
    const profil = { fehlerarten: null, stil: 2, blindeFlecken: [] };
    const wahl = await waehleZug(b, FEN, stufe(6), [], folge(0.9), BUCHTREUE_VORGABE, profil);
    expect(wahl).toEqual({ uci: "b8c6", quelle: "engine", fehler: null, verlust: 0 });
    expect(aufrufe).toEqual([{ varianten: 4, staerke: { art: "skill", stufe: 10 } }]);
  });

  it("Stufe 1 mit Stil (0.2.78): der schwache Zug der Stufe bleibt, der Stil hebt ihn nicht an", async () => {
    const { b } = bewerter(KANDIDATEN);
    const profil = { fehlerarten: [], stil: 2, blindeFlecken: [] };
    // Hoher Wurf: Die gewichtete Wahl nimmt einen der schwachen Züge (La3 oder g6).
    const wahl = await waehleZug(b, FEN, stufe(1), [], folge(0.999), BUCHTREUE_VORGABE, profil);
    expect(wahl?.uci).not.toBe("b8c6");
    expect(wahl?.uci).not.toBe("d7d6");
    expect(wahl?.verlust ?? 0).toBeGreaterThan(2);
  });

  it("Profil mit blindem Fleck: übersieht den besten Zug und spielt den nächsten anderer Art", async () => {
    // Bester Zug Sc6 (b8c6) ist ein Springerzug vorwärts; blind für „bauer“: d6 ist still.
    const { b, aufrufe } = bewerter(KANDIDATEN);
    const blind = { fehlerarten: null, stil: 0, blindeFlecken: ["bauer" as const] };
    const gesehen = await waehleZug(b, FEN, stufe(6), [], folge(0.9), BUCHTREUE_VORGABE, blind);
    expect(gesehen).toEqual({ uci: "b8c6", quelle: "engine", fehler: null, verlust: 0 });
    expect(aufrufe[0]?.varianten).toBe(4);
    // Bester Zug d6 (still), Gegner blind dafür, niedriger Wurf: der nächste Zug anderer Art.
    // Werte aus Sicht von Weiß; Schwarz am Zug: d6 (0,3) ist besser als Sc6 (0,5).
    const { b: b2 } = bewerter([variante(1, 0.3, ["d7d6"]), variante(2, 0.5, ["b8c6"])]);
    const uebersehen = await waehleZug(b2, FEN, stufe(6), [], folge(0.1), BUCHTREUE_VORGABE, blind);
    expect(uebersehen).toEqual({
      uci: "b8c6",
      quelle: "fehler",
      fehler: "blindBauer",
      verlust: 0.2,
    });
  });

  it("ohne legalen Zug: null", async () => {
    const { b } = bewerter([], null);
    expect(await waehleZug(b, FEN, stufe(8), [], folge(0.5))).toBeNull();
  });
});
