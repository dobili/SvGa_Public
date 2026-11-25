/**
 * Tests der Motiverkennung (taktikmotive.ts): Spätere eigene Züge zählen nur, solange die Folge
 * erzwungen ist (Schach oder Schlag in der Antwort).
 */
import { describe, expect, it } from "vitest";
import { regelstellung } from "../spiel/zuege";
import { erkenneMotive } from "./taktikmotive";

describe("erkenneMotive, spätere Züge", () => {
  it("zählt keinen Doppelangriff nach einer freien Antwort des Gegners", () => {
    // Messlauf der Besprechung (26.11.2026): Txg3 nimmt die Dame, Weiß zieht frei a4, erst Tg4
    // greift zwei Bauern an. Vorher meldete die App eine Gabel.
    const regeln = regelstellung("7k/8/8/4p3/4P3/Pr4Q1/8/R6K b - - 4 28");
    if (!regeln) throw new Error("Stellung");
    const befund = erkenneMotive(regeln, ["Rxg3", "a4", "Rg4", "a5", "Rh4+", "Kg2"]);
    expect(befund?.motive).not.toContain("doppelangriff");
    expect(befund?.motive).not.toContain("gabel");
  });

  it("zählt die Gabel nach einem Schach weiter (Hinlenkung mit Gabel)", () => {
    // Wie Abb. 7.14: Th8+ zwingt den König nach h8, dann gabelt der Springer König und Dame.
    const regeln = regelstellung("3q2k1/5p2/8/6N1/8/8/8/K6R w - - 0 1");
    if (!regeln) throw new Error("Stellung");
    const befund = erkenneMotive(regeln, ["Rh8+", "Kxh8", "Nxf7+"]);
    expect(befund?.motive).toContain("gabel");
  });
});
