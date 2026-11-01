/**
 * Tests der Engine-Werte im PGN der Varianten (Stufe 3): „[%eval]“ wie bei Lichess, Matt, der
 * eigene Befehl „%svgb“, Hin und zurück über Export und Import, fremde PGN nur mit „%eval“.
 */
import { describe, expect, it } from "vitest";
import { mitWerten } from "../training/variationswerte";
import { baumstellungen } from "../training/variationswerte";
import { alsEvaluation, ausEvaluation, evalbefehle, werteAusKommentar } from "./variationseval";
import { variationAlsPgn, variationAusPgn } from "./variationspgn";

const JETZT = new Date("2026-11-01T10:00:00.000Z");

describe("Werte im PGN-Kommentar", () => {
  it("rechnet Bauern und Matt um", () => {
    expect(alsEvaluation(35)).toEqual({ pawns: 0.35 });
    expect(alsEvaluation(9700)).toEqual({ mate: 3 });
    expect(alsEvaluation(-9800)).toEqual({ mate: -2 });
    expect(ausEvaluation({ mate: -2 })).toBe(-9800);
    expect(ausEvaluation({ pawns: 1.5 })).toBe(150);
  });

  it("schreibt %eval und %svgb und liest sie zurück", () => {
    expect(evalbefehle({ w: -40, b: "g8f6", a: 25 })).toBe("[%eval -0.40] [%svgb g8f6,25]");
    expect(evalbefehle({ w: 1000 })).toBe("[%eval 10.00]");
    expect(evalbefehle({})).toBe("");
    const gelesen = werteAusKommentar("gut [%eval -0.40] [%svgb g8f6,25]");
    expect(gelesen.werte).toEqual({ w: -40, b: "g8f6", a: 25 });
    expect(gelesen.rest).toContain("gut");
  });

  it("eine ganze Variante mit Werten hin und zurück; Lichess-PGN nur mit %eval", () => {
    const roh = variationAusPgn("1. e4 e5 (1... c5 { Sizilianisch }) 2. Nf3 *", "Test", JETZT);
    if (!roh.ok) throw new Error("PGN");
    const ergebnisse = new Map(
      baumstellungen(roh.variation).map((s, i) => [s.fen, { w: i * 10 - 20, b: "g1f3", a: i }]),
    );
    const v = mitWerten(roh.variation, ergebnisse);
    const pgn = variationAlsPgn(v);
    expect(pgn).toContain("[%eval -0.20]");
    expect(pgn).toContain("{ Sizilianisch [%eval 0.20] [%svgb g1f3,4] }");
    const zurueck = variationAusPgn(pgn, "Test", JETZT);
    if (!zurueck.ok) throw new Error("PGN");
    expect(zurueck.variation.start).toEqual(v.start);
    expect(zurueck.variation.zuege).toEqual(v.zuege);
    // Lichess schreibt nur %eval: Wert ja, bester Zug nein.
    const lichess = variationAusPgn("1. e4 { [%eval 0.3] } e5 { [%eval #-4] } *", "L", JETZT);
    if (!lichess.ok) throw new Error("PGN");
    expect(lichess.variation.zuege[0]).toMatchObject({ zug: "e4", w: 30 });
    expect(lichess.variation.zuege[0]?.b).toBeUndefined();
    expect(lichess.variation.zuege[0]?.weiter[0]).toMatchObject({ w: -9600 });
  });
});
