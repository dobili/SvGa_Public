/** Tests des Wahlmodells (0.2.121): Merkmale, Gewichte, Wahrscheinlichkeiten, Zeitklasse. */
import { describe, expect, it } from "vitest";
import { lageVon } from "./fehlerart";
import { stilmerkmale } from "./stilmerkmale";
import {
  gewichte,
  merkmale,
  OHNE_VERSCHIEBUNG,
  wahltempo,
  wahrscheinlichkeiten,
  ziehe,
  type Wahlkandidat,
} from "./wahlmodell";
import { WAHL_MERKMALE } from "./wahlmodell-daten";
import { parseUci } from "chessops/util";
import { normalizeMove } from "chessops/chess";

/** Abb. 1.13 nach 2. Dh5, Schwarz am Zug: Sc6 deckt, Sf6?? lässt Dxe5+ zu. */
const NACH_DH5 = "rnbqkbnr/pppp1ppp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2";
const SC6: Wahlkandidat = { uci: "b8c6", verlust: 0, antwort: ["f1c4"], art: null };
const SF6: Wahlkandidat = {
  uci: "g8f6",
  verlust: 3,
  antwort: ["h5e5", "f8e7"],
  art: "drohungIgnoriert",
};
const G6: Wahlkandidat = { uci: "g7g6", verlust: 6, antwort: ["h5e5"], art: "drohungIgnoriert" };

function lage(fen: string) {
  const l = lageVon(fen);
  if (!l) throw new Error("Stellung");
  return l;
}

describe("Wahlmodell", () => {
  it("Merkmale: Verlustkurve, bester Zug, Fehlerart, Stil", () => {
    const l = lage(NACH_DH5);
    const m = merkmale(l, NACH_DH5, SF6, "b8c6", "eroeffnung");
    const i = (name: string) => WAHL_MERKMALE.indexOf(name as (typeof WAHL_MERKMALE)[number]);
    expect(m[i("verlust_3.0")]).toBe(1);
    expect(m[i("eroeffnung_verlust_3.0")]).toBe(1);
    expect(m[i("art_drohungIgnoriert")]).toBe(1);
    expect(m[i("bester")]).toBe(0);
    expect(m[i("stil_vorwaerts")]).toBe(1);
    expect(m[i("eroeffnung")]).toBe(1);
    const b = merkmale(l, NACH_DH5, SC6, "b8c6", "eroeffnung");
    expect(b[i("bester")]).toBe(1);
    expect(b[i("verlust_0.5")]).toBe(0);
  });

  it("Gewichte: schlechte Züge werden mit der Wertung unwahrscheinlicher", () => {
    const l = lage(NACH_DH5);
    const p400 = wahrscheinlichkeiten(l, NACH_DH5, [SC6, SF6, G6], "b8c6", "rapid", 400);
    const p2200 = wahrscheinlichkeiten(l, NACH_DH5, [SC6, SF6, G6], "b8c6", "rapid", 2200);
    expect(p400.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 6);
    expect(p400[0]).toBeGreaterThan(p400[1] ?? 0);
    expect(p2200[0]).toBeGreaterThan(p400[0] ?? 0);
    expect(p2200[2]).toBeLessThan(p400[2] ?? 0);
  });

  it("Verschiebung: eine ausgeschlossene Art hat Wahrscheinlichkeit 0, Temperatur glättet", () => {
    const l = lage(NACH_DH5);
    const aus = wahrscheinlichkeiten(l, NACH_DH5, [SC6, SF6, G6], "b8c6", "rapid", 800, {
      arten: { drohungIgnoriert: Number.NEGATIVE_INFINITY },
      flecken: {},
      stil: {},
    });
    expect(aus[1]).toBe(0);
    expect(aus[2]).toBe(0);
    expect(aus[0]).toBe(1);
    const warm = wahrscheinlichkeiten(
      l,
      NACH_DH5,
      [SC6, SF6],
      "b8c6",
      "rapid",
      800,
      OHNE_VERSCHIEBUNG,
      3,
    );
    const kalt = wahrscheinlichkeiten(
      l,
      NACH_DH5,
      [SC6, SF6],
      "b8c6",
      "rapid",
      800,
      OHNE_VERSCHIEBUNG,
      1,
    );
    expect(warm[1]).toBeGreaterThan(kalt[1] ?? 0);
  });

  it("Ziehen folgt den Wahrscheinlichkeiten; Zeitklasse wie Lichess", () => {
    expect(ziehe(["a", "b"], [0.3, 0.7], () => 0.1)).toBe("a");
    expect(ziehe(["a", "b"], [0.3, 0.7], () => 0.5)).toBe("b");
    expect(wahltempo(null)).toBe("rapid");
    expect(wahltempo({ grundzeitMs: 180_000, zuschlagMs: 2_000 })).toBe("blitz");
    expect(wahltempo({ grundzeitMs: 600_000, zuschlagMs: 0 })).toBe("rapid");
    expect(wahltempo({ grundzeitMs: 1_800_000, zuschlagMs: 0 })).toBe("classical");
    expect(gewichte("rapid", 1500)).toHaveLength(WAHL_MERKMALE.length);
  });
});

describe("Stilmerkmale", () => {
  it("Sxf7 im Zweispringerspiel: Schlag, vorwärts, nah am König (kein Schach: der Springer gabelt Dame und Turm)", () => {
    const fen = "r1bqkb1r/ppp2ppp/2n2n2/3np1N1/2B5/8/PPPP1PPP/RNBQK2R w KQkq - 0 6";
    const l = lage(fen);
    const roh = parseUci("g5f7");
    if (!roh) throw new Error("Zug");
    const zug = normalizeMove(l.regeln, roh);
    if (!("from" in zug)) throw new Error("Zug");
    const s = stilmerkmale(l.regeln, zug);
    expect(s).toEqual({
      schlag: true,
      schach: false,
      vorwaerts: true,
      koenigsnaehe: true,
      bauernsturm: false,
      rueckzug: false,
      tausch: false,
    });
  });

  it("Rückzug und Bauernsturm", () => {
    const l = lage("r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 3");
    const zurueck = normalizeMove(l.regeln, { from: 21, to: 6 }); // Sf3–g1
    if (!("from" in zurueck)) throw new Error("Zug");
    expect(stilmerkmale(l.regeln, zurueck).rueckzug).toBe(true);
    const sturm = normalizeMove(l.regeln, { from: 15, to: 31 }); // h2–h4, König e8: nicht nah genug an der Linie
    if (!("from" in sturm)) throw new Error("Zug");
    expect(stilmerkmale(l.regeln, sturm).bauernsturm).toBe(false);
    const f4 = normalizeMove(l.regeln, { from: 13, to: 29 }); // f2–f4: Linie f, König e8 → Sturm
    if (!("from" in f4)) throw new Error("Zug");
    expect(stilmerkmale(l.regeln, f4).bauernsturm).toBe(true);
  });
});
