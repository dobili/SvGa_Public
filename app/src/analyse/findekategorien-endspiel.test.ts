/**
 * Tests der Finde-Kategorien des Endspiels (F6 Opposition und Schlüsselfelder, F7 Freibauer und
 * Quadrat) an Abbildungen des Kapitels 8: je ein Treffer und ein Nichttreffer.
 */
import { describe, expect, it } from "vitest";
import { stellungVon } from "../schach/buchabbildungen.testhilfe";
import { alleFindeKategorien, findeKategorie } from "./findekategorien";
import { eingabe } from "./findekategorien.testhilfe";

const fen = (abb: string) => stellungVon(abb).fen;
/** Gewonnen gegen remis, wie es die Engine bei König und Bauer gegen König meldet. */
const GEWINN_VERSPIELT = { vorher: 6, best: 6, gespielt: 0 };

describe("F6 Opposition und Schlüsselfelder", () => {
  it("Abb. 8.23: Nur 1. Kf3! (Fernopposition) gewinnt, 1. Kg3 nicht (Datenbank)", () => {
    const fall = {
      fen: fen("8.23"),
      best: ["Kf3", "Ke6", "Ke4"],
      gespielt: ["Kg3", "Ke6"],
      werte: GEWINN_VERSPIELT,
      phase: "endspiel" as const,
    };
    expect(findeKategorie(eingabe(fall))).toEqual({
      kennung: "F6",
      details: { zug: "Kf3", feld: "f3", idee: "opposition", datenbank: true },
    });
  });

  it("Abb. 8.19: Beide Züge halten nur remis, die Datenbank entscheidet nichts", () => {
    const fall = {
      fen: fen("8.19"),
      best: ["Kd4", "Kd6"],
      gespielt: ["Kf4", "Kf6"],
      werte: { vorher: 0, best: 0, gespielt: -0.6 },
      phase: "endspiel" as const,
    };
    expect(alleFindeKategorien(eingabe(fall)).map((t) => t.kennung)).not.toContain("F6");
  });
});

describe("F7 Freibauer und Quadrat", () => {
  it("Abb. 8.35: 1. b5 läuft durch, der König g5 holt ihn nicht mehr ein", () => {
    const fall = {
      fen: fen("8.35"),
      best: ["b5", "Kf6", "b6"],
      gespielt: ["Kg2", "Kf6"],
      werte: GEWINN_VERSPIELT,
      phase: "endspiel" as const,
    };
    expect(findeKategorie(eingabe(fall))).toEqual({
      kennung: "F7",
      details: { zug: "b5", feld: "b5", idee: "freibauer" },
    });
  });

  it("Abb. 8.36: 1... Kf6 betritt das Quadrat, 1... Kh4 nicht", () => {
    const fall = {
      fen: fen("8.36"),
      best: ["Kf6", "b5", "Ke7"],
      gespielt: ["Kh4", "b5"],
      werte: { vorher: 0, best: 0, gespielt: -6 },
      phase: "endspiel" as const,
    };
    expect(findeKategorie(eingabe(fall))).toEqual({
      kennung: "F7",
      details: { zug: "Kf6", feld: "b4", idee: "quadrat" },
    });
  });

  it("Abb. 8.36: Betritt auch der gespielte Zug das Quadrat (1... Kf5), gibt es keinen Hinweis", () => {
    const fall = {
      fen: fen("8.36"),
      best: ["Kf6", "b5", "Ke7"],
      gespielt: ["Kf5", "b5"],
      werte: { vorher: 0, best: 0, gespielt: -0.6 },
      phase: "endspiel" as const,
    };
    expect(findeKategorie(eingabe(fall))).toBeNull();
  });

  it("außerhalb des Endspiels schweigt F7", () => {
    const fall = {
      fen: fen("8.35"),
      best: ["b5", "Kf6", "b6"],
      gespielt: ["Kg2", "Kf6"],
      werte: GEWINN_VERSPIELT,
      phase: "mittelspiel" as const,
    };
    expect(findeKategorie(eingabe(fall))).toBeNull();
  });
});
