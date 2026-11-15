/**
 * Tests des Rückwegs in die Oberwelt (zurWelt.ts): Nach Partie oder Runde darf keine beendete
 * Partie und keine zweite Oberwelt im Stapel liegen (Funktionstest N2610, 15.11.2026).
 */
import { describe, expect, it } from "vitest";
import type { Ansicht, Stapel } from "../../app/stapel";
import { ANSICHT_ABENTEUER, ANSICHT_AUFGABEN, ANSICHT_PARTIE } from "../schnittstelle/modul";
import { wegZurWelt } from "./zurWelt";

const SPIELEN: Ansicht = { bildschirm: "spielen" };
const WELT: Ansicht = { bildschirm: "zusatz", kennung: ANSICHT_ABENTEUER };
const PARTIE: Ansicht = { bildschirm: "zusatz", kennung: ANSICHT_PARTIE, wert: "p1" };
const RUNDE: Ansicht = { bildschirm: "zusatz", kennung: ANSICHT_AUFGABEN, wert: "r1" };

function stapel(...ansichten: [Ansicht, ...Ansicht[]]): Stapel {
  return { bereich: "spielen", ansichten };
}

describe("wegZurWelt", () => {
  it("geht zurück, wenn die Oberwelt direkt unter der Partie liegt", () => {
    expect(wegZurWelt(stapel(SPIELEN, WELT, PARTIE))).toBe("zurueck");
  });

  it("geht auch aus der Aufgabenrunde zurück", () => {
    expect(wegZurWelt(stapel(SPIELEN, WELT, RUNDE))).toBe("zurueck");
  });

  it("ersetzt die Partie, wenn keine Oberwelt darunter liegt (etwa nach dem Neuladen)", () => {
    expect(wegZurWelt(stapel(SPIELEN, PARTIE))).toBe("ersetze");
    expect(wegZurWelt(stapel(PARTIE))).toBe("ersetze");
  });
});
