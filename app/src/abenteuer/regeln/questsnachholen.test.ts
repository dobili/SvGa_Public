/**
 * Tests zu schonEingetreten und dem Nachholen in werteEreignisAus (regeln/quests.ts): Ein Schritt,
 * dessen Runde oder Partie der Spieler schon vorher erledigt hat, zählt, sobald die Quest bei ihm
 * ankommt (Auftrag „Quests verfehlen“, 20.11.2026; der Aufschieber fand riverton.parkclub hängend
 * bei Schritt 4, wenn Tamsins Reihe vor dem Gespräch mit Slick gelöst war).
 */
import { describe, expect, it } from "vitest";
import questdatei from "../../../../inhalte/abenteuer/quests.json";
import type { Questdaten } from "../daten/laden";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { schonEingetreten, werteEreignisAus } from "./quests";
import { leererAbenteuerstand } from "./spielstand";

const QUESTS = questdatei.quests as unknown as Questdaten[];
const JETZT = new Date("2026-11-20T20:00:00Z");
const START = leererAbenteuerstand(JETZT, "Kim", 800, true);
/** Schritt 3 von riverton.parkclub (Index 2): das Gespräch mit Slick. */
const BEI_SLICK = 2;

/** Stand mit riverton.parkclub vor dem Gespräch mit Slick und den gegebenen Runden. */
function standMit(runden: Abenteuerstand["runden"]): Abenteuerstand {
  return {
    ...START,
    runden,
    quests: [
      {
        kennung: "riverton.parkclub",
        schritt: BEI_SLICK,
        erledigt: false,
        angenommen: JETZT.toISOString(),
        erledigtAm: null,
      },
    ],
  };
}

const runde = (kennung: string, bestanden: boolean) => ({
  kennung,
  bestanden,
  versuche: 1,
  punkte: 5,
  moeglich: 6,
});

describe("Schritte, deren Ereignis schon eingetreten ist", () => {
  it("Tamsins Reihe vor Slick gelöst: nach Slick steht die Quest bei Rays Reihe", () => {
    const stand = standMit([runde("riverton.reiheTamsin", true)]);
    const q = werteEreignisAus(
      stand,
      QUESTS,
      { art: "dialog", knoten: "riverton-pavillon.slick" },
      JETZT,
    );
    expect(q.stand.quests[0]?.schritt).toBe(BEI_SLICK + 2);
    expect(q.fortgeschritten).toEqual(["riverton.parkclub"]);
  });

  it("nicht bestanden oder nie gespielt: die Quest wartet beim nächsten Schritt", () => {
    const stand = standMit([runde("riverton.reiheTamsin", false)]);
    const q = werteEreignisAus(
      stand,
      QUESTS,
      { art: "dialog", knoten: "riverton-pavillon.slick" },
      JETZT,
    );
    expect(q.stand.quests[0]?.schritt).toBe(BEI_SLICK + 1);
  });

  it("erkennt Runden und Partien mit passendem Ausgang", () => {
    const stand = {
      ...START,
      runden: [runde("riverton.reiheRay", true)],
      dialogvariablen: { ausgangRivertonClubkampf: "remis" },
    };
    expect(schonEingetreten({ art: "aufgaben", runde: "riverton.reiheRay" }, stand)).toBe(true);
    expect(
      schonEingetreten(
        { art: "partie", begegnung: "riverton.clubkampf", ausgang: ["sieg", "remis"] },
        stand,
      ),
    ).toBe(true);
    expect(
      schonEingetreten(
        { art: "partie", begegnung: "riverton.clubkampf", ausgang: ["sieg"] },
        stand,
      ),
    ).toBe(false);
    expect(schonEingetreten({ art: "dialog", knoten: "riverton-pavillon.slick" }, stand)).toBe(
      false,
    );
  });
});
