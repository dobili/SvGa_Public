/** Tests der Erinnerung nach einer Pause (regeln/wiedereinstieg.ts, 20.11.2026). */
import { describe, expect, it } from "vitest";
import type { Questdaten } from "../daten/laden";
import type { Abenteuerstand, Queststand } from "../schnittstelle/spielstand";
import { abenteuerstandAus, leererAbenteuerstand } from "./spielstand";
import { erinnerungNachPause, erinnerungsquest, PAUSE_MS } from "./wiedereinstieg";

const JETZT = new Date("2026-11-20T18:00:00Z");
const ZWEI_TAGE = new Date(JETZT.getTime() - 2 * PAUSE_MS).toISOString();
const EINE_STUNDE = new Date(JETZT.getTime() - PAUSE_MS / 24).toISOString();

/** Kleine Questdaten: Hauptquest mit zwei Schritten, Nebenquest mit einem. */
const QUESTS = [
  {
    kennung: "mapleFalls.ersterAbend",
    titel: "quest.ersterAbend.titel",
    haupt: true,
    schritte: [{ text: "quest.ersterAbend.schritt1" }, { text: "quest.ersterAbend.schritt2" }],
  },
  {
    kennung: "mapleFalls.samsDame",
    titel: "quest.samsDame.titel",
    haupt: false,
    schritte: [{ text: "quest.samsDame.schritt1" }],
  },
] as unknown as readonly Questdaten[];

function quest(kennung: string, schritt: number, angenommen: string): Queststand {
  return { kennung, schritt, erledigt: false, angenommen, erledigtAm: null };
}

function stand(quests: Queststand[], zuletzt?: string): Abenteuerstand {
  const s = { ...leererAbenteuerstand(JETZT, "Kim", 600, false), quests };
  return zuletzt ? { ...s, zuletztGespielt: zuletzt } : s;
}

const BEIDE = [
  quest("mapleFalls.ersterAbend", 1, "2026-11-18T10:00:00Z"),
  quest("mapleFalls.samsDame", 0, "2026-11-18T11:00:00Z"),
];

describe("erinnerungNachPause", () => {
  it("erinnert nach zwei Tagen an die Hauptquest und ihren nächsten Schritt", () => {
    expect(erinnerungNachPause(stand(BEIDE, ZWEI_TAGE), QUESTS, JETZT)).toEqual({
      titel: "quest.ersterAbend.titel",
      schritt: "quest.ersterAbend.schritt2",
    });
  });

  it("schweigt nach kurzer Pause und in alten Ständen ohne Zeitstempel", () => {
    expect(erinnerungNachPause(stand(BEIDE, EINE_STUNDE), QUESTS, JETZT)).toBeNull();
    expect(erinnerungNachPause(stand(BEIDE), QUESTS, JETZT)).toBeNull();
  });

  it("schweigt ohne laufende Aufgabe", () => {
    expect(erinnerungNachPause(stand([], ZWEI_TAGE), QUESTS, JETZT)).toBeNull();
  });
});

describe("erinnerungsquest", () => {
  it("nimmt die verfolgte Quest vor der Hauptquest", () => {
    const s = { ...stand(BEIDE), verfolgteQuest: "mapleFalls.samsDame" };
    expect(erinnerungsquest(s, QUESTS)?.kennung).toBe("mapleFalls.samsDame");
  });

  it("der Zeitstempel übersteht das Laden des Spielstands", () => {
    const geladen = abenteuerstandAus(JSON.parse(JSON.stringify(stand(BEIDE, ZWEI_TAGE))));
    expect(geladen?.zuletztGespielt).toBe(ZWEI_TAGE);
  });
});
