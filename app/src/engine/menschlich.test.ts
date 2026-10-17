/**
 * Tests der menschlicheren Zugwahl (R4, 0.2.52): Kandidaten mit Verlust, gewichtete Wahl mit
 * Temperatur, Temperatur nach Lage, Strähne und Tagesform.
 */
import { describe, expect, it } from "vitest";
import {
  gewichteteZugwahl,
  kandidatenAus,
  RUHIGER_VERLAUF,
  tagesform,
  temperaturFuer,
} from "./menschlich";
import type { Variante } from "./uci";

/** Abb. 1.13 (nach 2. Dh5), Schwarz am Zug. */
const FEN = "rnbqkbnr/pppp1ppp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2";
/** Weiß im Schach: nach 1. e4 e5 2. f3 Dh4+. */
const IM_SCHACH = "rnb1kbnr/pppp1ppp/8/4p3/4P2q/5P2/PPPP2PP/RNBQKBNR w KQkq - 1 3";
/** Grundstellung: 20 Züge, also keine unübersichtliche Lage. */
const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
/** Viele Züge: beide Damen frei, Weiß am Zug (über 30 legale Züge). */
const VIELE_ZUEGE = "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1Q2/PPP2PPP/RNB1K1NR w KQkq - 0 5";

function variante(nummer: number, bauernWeiss: number, zuege: string[]): Variante {
  return { nummer, wert: { art: "bauern", bauern: bauernWeiss }, zuege };
}

/** Kandidaten aus Sicht von Weiß: Sc6 bester, d6 0,2 dahinter, La3 gibt den Läufer, g6 den Turm. */
const KANDIDATEN = [
  variante(1, 0.3, ["b8c6", "f1c4"]),
  variante(2, 0.5, ["d7d6", "f1c4"]),
  variante(3, 3.2, ["f8a3", "b2a3"]),
  variante(4, 6.0, ["g7g6", "h5e5"]),
];

describe("Kandidaten der menschlichen Zugwahl", () => {
  it("rechnet den Verlust aus Sicht der Seite am Zug und hält den Höchstverlust ein", () => {
    const alle = kandidatenAus(FEN, KANDIDATEN, 9, true);
    expect(alle.map((k) => k.uci)).toEqual(["b8c6", "d7d6", "f8a3", "g7g6"]);
    expect(alle[1]?.verlust).toBeCloseTo(0.2, 5);
    expect(alle[3]?.verlust).toBeCloseTo(5.7, 5);
    // Stufe 3: höchstens eine Leichtfigur → der Turmverlust fällt weg.
    expect(kandidatenAus(FEN, KANDIDATEN, 3, false).map((k) => k.uci)).toEqual([
      "b8c6",
      "d7d6",
      "f8a3",
    ]);
    expect(kandidatenAus(FEN, [], 9, true)).toEqual([]);
  });

  it("ein verbotenes Damenopfer fällt weg, der beste Zug bleibt immer", () => {
    // 2... Dg5 hängt die Dame an die weiße Dame (Dxg5).
    const mitOpfer = [variante(1, 0.3, ["b8c6"]), variante(2, 9.5, ["d8g5", "h5g5"])];
    expect(kandidatenAus(FEN, mitOpfer, 20, false).map((k) => k.uci)).toEqual(["b8c6"]);
    expect(kandidatenAus(FEN, mitOpfer, 20, true).map((k) => k.uci)).toEqual(["b8c6", "d8g5"]);
  });
});

describe("Gewichtete Wahl mit Temperatur", () => {
  const kandidaten = [
    { uci: "a", verlust: 0 },
    { uci: "b", verlust: 0.5 },
    { uci: "c", verlust: 3 },
  ];
  it("Zufall 0 ergibt den besten Zug, hoher Zufall einen schlechteren", () => {
    expect(gewichteteZugwahl(kandidaten, 1, () => 0)?.uci).toBe("a");
    // Gewichte 1, 0,61, 0,05 (Summe 1,66): bis 0,60 „a“, bis 0,97 „b“, darüber „c“.
    expect(gewichteteZugwahl(kandidaten, 1, () => 0.8)?.uci).toBe("b");
    expect(gewichteteZugwahl(kandidaten, 1, () => 0.99)?.uci).toBe("c");
  });
  it("kalt (Temperatur nahe 0) fast immer der beste; ohne Kandidaten null", () => {
    expect(gewichteteZugwahl(kandidaten, 0.01, () => 0.99)?.uci).toBe("a");
    expect(gewichteteZugwahl([], 1, () => 0.5)).toBeNull();
  });
});

describe("Temperatur nach Lage, Strähne und Tagesform", () => {
  it("Grundtemperatur in ruhiger Lage; im Schach die Hälfte; bei vielen Zügen mehr", () => {
    expect(temperaturFuer(GRUNDSTELLUNG, 0.7, RUHIGER_VERLAUF)).toBeCloseTo(0.7, 5);
    expect(temperaturFuer(IM_SCHACH, 0.7, RUHIGER_VERLAUF)).toBeCloseTo(0.35, 5);
    expect(temperaturFuer(VIELE_ZUEGE, 0.7, RUHIGER_VERLAUF)).toBeCloseTo(0.91, 5);
  });
  it("Strähne: je eigenem Fehler ein Viertel mehr; Tagesform als Faktor", () => {
    const straehne = { fehlerAnlauf: 2, tagesform: 1 };
    expect(temperaturFuer(GRUNDSTELLUNG, 0.7, straehne)).toBeCloseTo(1.05, 5);
    const form = { fehlerAnlauf: 0, tagesform: 1.2 };
    expect(temperaturFuer(GRUNDSTELLUNG, 0.7, form)).toBeCloseTo(0.84, 5);
  });
  it("Tagesform: fest je Kennung, zwischen 0,75 und 1,25, verschieden je Partie", () => {
    const a = tagesform("partie-eins");
    expect(a).toBe(tagesform("partie-eins"));
    expect(a).toBeGreaterThanOrEqual(0.75);
    expect(a).toBeLessThanOrEqual(1.25);
    expect(tagesform("partie-zwei")).not.toBe(a);
  });
});
