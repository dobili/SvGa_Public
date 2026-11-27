/**
 * Tests des Rückwegs in die Oberwelt (zurWelt.ts): Nach Partie oder Runde darf keine beendete
 * Partie und keine zweite Oberwelt im Stapel liegen (Funktionstest N2610, 15.11.2026).
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Ansicht, Stapel } from "../../app/stapel";
import { ANSICHT_ABENTEUER, ANSICHT_AUFGABEN, ANSICHT_PARTIE } from "../schnittstelle/modul";
import { leererAbenteuerstand } from "../regeln/spielstand";
import { sitzungsplatz } from "./spielsitzung";
import { merkeWegInDieWelt, wegZurWelt } from "./zurWelt";

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

describe("merkeWegInDieWelt", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("merkt die Sitzung mit dem gespielten Platz, damit „Weiter“ in die Welt führt (27.11.2026)", () => {
    const speicher = new Map<string, string>();
    vi.stubGlobal("window", {
      sessionStorage: {
        getItem: (k: string) => speicher.get(k) ?? null,
        setItem: (k: string, w: string) => speicher.set(k, w),
        removeItem: (k: string) => speicher.delete(k),
      },
    });
    const stand = leererAbenteuerstand(new Date("2026-11-27T09:00:00.000Z"), "Kim", 800, false);
    merkeWegInDieWelt(null);
    expect(sitzungsplatz()).toBeNull();
    merkeWegInDieWelt(stand);
    expect(sitzungsplatz()).toBe("2026-11-27T09:00:00.000Z");
  });
});
