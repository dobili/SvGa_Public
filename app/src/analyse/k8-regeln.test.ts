/**
 * Referenztests für k8-regeln an Kapitel 8 (Abb. 8.1, 8.2, 8.19, 8.27, 8.47, 8.66) und
 * Kalibrierung der Kapitel-8-Werkzeuge an den Übungen 8.55 bis 8.68: Welches Werkzeug nennt den
 * Lösungszug des Buches?
 */
import { describe, expect, it } from "vitest";
import { stellungVon } from "../schach/buchabbildungen.testhilfe";
import { elementarmattWerkzeug } from "./k8-elementarmatt";
import { opposition } from "./k8-opposition";
import { quadratregel } from "./k8-quadrat";
import { regeln } from "./k8-regeln";

function regel(nummer: string, nr: number): readonly string[] {
  const s = stellungVon(nummer);
  return regeln(s, s.amZug).befunde[nr - 1]?.zeilen ?? [];
}

describe("k8-regeln", () => {
  it("Abb. 8.1 (Damen getauscht): Regel 1 und 5, der König g1 gehört nach vorn, Weg ins Zentrum", () => {
    expect(regel("8.1", 1)).toEqual([
      "Der König steht auf g1 (eigene 1. Reihe).",
      "Sicherer Weg nach d4 in 4 Züge: f1–e2–d3–d4 (goldene Pfeile).",
    ]);
    expect(regel("8.1", 5)).toEqual([
      "Der König g1 steht noch hinter den Bauern: Im Endspiel gehört er nach vorn.",
    ]);
    const s = stellungVon("8.1");
    expect(regeln(s, "white").markierungen[0]).toEqual({
      typ: "pfeil",
      farbe: "gold",
      von: "g1",
      nach: "f1",
    });
  });

  it("Abb. 8.2 (Damen am Brett): Regel 1 mahnt, Regel 4 zählt den Mehrbauern", () => {
    expect(regel("8.2", 1)[1]).toMatch(/^Noch sind Damen am Brett/);
    expect(regel("8.2", 4)[0]).toMatch(/^Weiß hat einen Punkt mehr: Tausche Figuren/);
  });

  it("Abb. 8.19: Regel 2 meldet die Opposition, Regel 6 den Freibauern e3 mit Schlüsselfeldern", () => {
    expect(regel("8.19", 2)).toEqual([
      "Direkte Opposition auf der Linie: ein Feld dazwischen (e5)",
      "Die Opposition hat Schwarz (die Seite, die nicht am Zug ist).",
    ]);
    expect(regel("8.19", 6)).toEqual([
      "Weiß: Freibauer e3, 5 Züge bis e8. Schlüsselfelder: d5, e5 und f5.",
    ]);
  });

  it("Abb. 8.47: Regel 3 nennt den entfernten Freibauern a5 als zweite Schwäche", () => {
    expect(regel("8.47", 3)[0]).toMatch(/^Zweite Schwäche: der entfernte Freibauer a5/);
  });

  it("Abb. 8.66: Regel 3 und 6 zum entfernten Freibauern h4", () => {
    expect(regel("8.66", 3)[0]).toMatch(/^Zweite Schwäche: der entfernte Freibauer h4/);
    expect(regel("8.66", 6)[0]).toBe(
      "Weiß: Freibauer h4, 4 Züge bis h8. Schlüsselfelder: g7 und g8.",
    );
  });
});

/**
 * Kalibrierung an den Übungen des Kapitels: Welches Werkzeug nennt den Lösungszug? Übungen, die
 * kein Werkzeug des Pflichtenhefts trifft, stehen als Grenze in FORTSCHRICHT (8.57 Freigabezug
 * Tb6, 8.65 Freibauer bilden, 8.67 Durchbruch, 8.68 Reserve-Tempo).
 */
describe("Kalibrierung Kapitel 8 (Übungen 8.55 bis 8.66)", () => {
  const ersteZeile = (nummer: string, werkzeug: (n: string) => readonly string[]) =>
    werkzeug(nummer)[0] ?? "";
  const elementar = (n: string) => elementarmattWerkzeug(stellungVon(n)).befunde[1]?.zeilen ?? [];
  const oppo = (n: string) => opposition(stellungVon(n)).befunde[1]?.zeilen ?? [];

  it("8.55 Db6?? und 8.56 Dg6?? sind Pattfallen", () => {
    expect(ersteZeile("8.55", elementar)).toContain("Db6");
    expect(ersteZeile("8.56", elementar)).toContain("Dg6");
  });

  it("8.58 und 8.59: 1... Kf6! nimmt die Opposition", () => {
    expect(ersteZeile("8.58", oppo)).toMatch(/^Kf6/);
    expect(ersteZeile("8.59", oppo)).toMatch(/^Kf6/);
  });

  it("8.60: 1. Kc3! ist der erste Schritt zum Schlüsselfeld c5", () => {
    expect(regel("8.60", 1)[1]).toBe("Sicherer Weg nach c5 in 3 Züge: c3–c4–c5 (goldene Pfeile).");
  });

  it("8.61: 1. Kb6 führt zum Schlüsselfeld b7 des Randbauern", () => {
    expect(regel("8.61", 1)[1]).toBe("Sicherer Weg nach b7 in 2 Züge: b6–b7 (goldene Pfeile).");
  });

  it("8.62: Regel 4 rät mit Mehrmaterial zum Figurentausch (1. Txe8!)", () => {
    expect(regel("8.62", 4)[0]).toMatch(/^Weiß hat einen Punkt mehr: Tausche Figuren/);
  });

  it("8.63: Quadrat mit Doppelschritt, 1. a4! gewinnt", () => {
    const s = stellungVon("8.63");
    expect(quadratregel(s, "white").fazit).toBe(
      "Der Bauer a2 läuft durch: Schwarz erreicht das Quadrat nicht.",
    );
  });

  it("8.64: Bauernrennen, Regel 3 nennt es", () => {
    expect(regel("8.64", 3)).toEqual([
      "Beide Seiten haben Freibauern: Laufen sie um die Wette, zählt jedes Tempo (Bauernrennen, vier Fragen).",
    ]);
  });

  it("8.66: der entfernte Freibauer h4 (1. h5)", () => {
    expect(regel("8.66", 3)[0]).toMatch(/entfernte Freibauer h4/);
  });
});
