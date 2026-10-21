/**
 * Tests der Zugwahl (Konzept 8.1 „waehleZug“, 8.2 Stufen) mit vorgegebenen Kandidaten und festem
 * Zufall: Buchzug, menschliche Zugwahl der Stufen 1 bis 7 (seit 0.2.116: Fehler je Gelegenheit,
 * blinde Flecken, Höchstverlust je Art), volle Stärke der Stufe 8.
 */
import { describe, expect, it } from "vitest";
import type { Bewertung, Staerke } from "./engineDienst";
import { ALLE_ZUEGE, stufe } from "./stufen";
import type { Variante } from "./uci";
import { FEHLERARTEN } from "./fehlerart";
import {
  BESONDERS_BLIND,
  BUCHTREUE_VORGABE,
  menschenwerteAus,
  REINES_PROFIL,
  STANDARDPROFIL,
  type Spielbewerter,
  waehleZug,
  wertFuer,
} from "./zugwahl";

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
  it("Spaß-Bot (0.2.88): mit seinem Anteil ein Zufallszug ohne Engine, sonst wie die Stufe", async () => {
    const profil = { ...STANDARDPROFIL, zufallszuege: 0.5 };
    const { b, aufrufe } = bewerter(KANDIDATEN);
    const zufaellig = await waehleZug(b, FEN, stufe(1), [], folge(0.1, 0), 0, profil);
    expect(zufaellig?.quelle).toBe("fehler");
    expect(zufaellig?.fehler).toBeNull();
    expect(aufrufe).toHaveLength(0);
    const normal = await waehleZug(b, FEN, stufe(5), [], folge(0.9), 0, profil);
    expect(normal?.quelle).toBe("engine");
  });

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

  it("mit Zusatzfehlern: zuerst die Fehlersuche mit Kandidaten der Suchtiefe 10 (0.2.116)", async () => {
    const { b, aufrufe } = bewerter(KANDIDATEN);
    const wahl = await waehleZug(b, FEN, stufe(1), [], () => 0.5);
    expect(aufrufe[0]).toEqual({ varianten: 6, staerke: { art: "tiefe", tiefe: 10 } });
    expect(wahl?.quelle).toBe("engine");
    expect(["b8c6", "d7d6"]).toContain(wahl?.uci);
  });

  it("trifft der Wurf eine Gelegenheit, spielt Stufe 1 einen Fehler dieser Art", async () => {
    const { b } = bewerter(KANDIDATEN);
    const wahl = await waehleZug(b, FEN, stufe(1), [], () => 0);
    expect(wahl?.quelle).toBe("fehler");
    expect(wahl?.fehler).not.toBeNull();
    expect(wahl?.verlust ?? 0).toBeGreaterThanOrEqual(0.5);
  });

  it("ohne erlaubte Fehlerarten kein Fehler, auch wenn jeder Wurf trifft", async () => {
    const { b } = bewerter(KANDIDATEN);
    const profil = { ...STANDARDPROFIL, fehlerarten: [] };
    const wahl = await waehleZug(b, FEN, stufe(1), [], () => 0, 0, profil);
    expect(wahl).toMatchObject({ uci: "b8c6", quelle: "engine", fehler: null, verlust: 0 });
  });

  it("reine Stufe (0.2.117): nur die Grundschicht, alle Züge in kleiner Tiefe bewertet", async () => {
    const { b, aufrufe } = bewerter(KANDIDATEN);
    const wahl = await waehleZug(b, FEN, stufe(1), [], () => 0, 0, REINES_PROFIL);
    expect(aufrufe).toEqual([{ varianten: ALLE_ZUEGE, staerke: { art: "tiefe", tiefe: 1 } }]);
    expect(wahl).toMatchObject({ uci: "b8c6", quelle: "engine", fehler: null });
    // Hoher Zufall: Stufe 1 (großes tau) zieht auch den Turmverlust g6
    const schlecht = await waehleZug(b, FEN, stufe(1), [], () => 0.999, 0, REINES_PROFIL);
    expect(schlecht?.uci).toBe("g7g6");
  });

  it("Höchstverlust je Art: kleiner als jeder Fehlerzug, also kein Fehler", async () => {
    const { b } = bewerter(KANDIDATEN);
    const klein = Object.fromEntries(FEHLERARTEN.map((a) => [a, 0.6]));
    const wahl = await waehleZug(b, FEN, stufe(1), [], () => 0, 0, {
      ...STANDARDPROFIL,
      hoechstverlust: klein,
    });
    expect(wahl?.quelle).toBe("engine");
  });

  it("blinder Fleck: übersieht den besten ruhigen Zug, wenn ein Schlag möglich ist", async () => {
    const nachD5 = "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2";
    const { b } = bewerter(
      [variante(1, 0.4, ["e4e5"]), variante(2, 0.3, ["e4d5"]), variante(3, 0.0, ["g1f3"])],
      "e4e5",
    );
    const profil = { ...STANDARDPROFIL, fehlerarten: [] };
    const wahl = await waehleZug(b, nachD5, stufe(4), [], () => 0, 0, profil);
    expect(wahl?.uci).toBe("e4d5");
  });

  it("Gewichte aus dem Profil: Fleck des Bots dreifach, nicht erlaubte Arten aus", () => {
    const werte = menschenwerteAus({
      ...STANDARDPROFIL,
      fehlerarten: ["figurHaengen"],
      blindeFlecken: ["rueckzug"],
      gewichte: { dame: 0 },
    });
    expect(werte.gewichte.rueckzug).toBe(BESONDERS_BLIND);
    expect(werte.gewichte.dame).toBe(0);
    expect(werte.erlaubt).toEqual(["figurHaengen"]);
  });

  it("Stufe 10 ohne Zusatzfehler spielt voll", async () => {
    const { b, aufrufe } = bewerter(KANDIDATEN, "b8c6");
    await waehleZug(b, FEN, stufe(10), [], folge(0.5), 0, REINES_PROFIL);
    expect(aufrufe[0]?.staerke).toEqual({ art: "voll" });
  });

  it("ohne legalen Zug: null", async () => {
    const { b } = bewerter([], null);
    expect(await waehleZug(b, FEN, stufe(10), [], folge(0.5), 0, REINES_PROFIL)).toBeNull();
  });
});
