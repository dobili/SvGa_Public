/** Tests der einmaligen Hinweise zur Steuerung (oberwelt/steuerhinweise.ts, 20.11.2026). */
import { describe, expect, it } from "vitest";
import { leererAbenteuerstand } from "../regeln/spielstand";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { faelligerHinweis, hakeAb, hinweisvariable, type Hinweislage } from "./steuerhinweise";

const LEER = leererAbenteuerstand(new Date("2026-11-20T05:00:00Z"), "Mia", 600, false);
const FREI: Hinweislage = { frei: true, erinnerung: false, aktionSichtbar: false };
const QUEST = {
  kennung: "mapleFalls.ankunft",
  schritt: 0,
  erledigt: false,
  angenommen: "2026-11-20T05:00:00Z",
  erledigtAm: null,
};

/** Hakt der Reihe nach ab, was fällig ist, und gibt die Folge zurück. */
function folge(stand: Abenteuerstand, lage: Hinweislage): string[] {
  const gezeigt: string[] = [];
  let s = stand;
  for (let h = faelligerHinweis(s, lage); h !== null; h = faelligerHinweis(s, lage)) {
    gezeigt.push(h);
    s = hakeAb(s, h);
  }
  return gezeigt;
}

describe("faelligerHinweis", () => {
  it("schweigt, solange die Welt nicht frei ist", () => {
    expect(faelligerHinweis(LEER, { ...FREI, frei: false })).toBeNull();
  });

  it("nennt zuerst das Steuerkreuz und danach nichts ohne Aktionsknopf und Quest", () => {
    expect(folge(LEER, FREI)).toEqual(["steuerkreuz"]);
  });

  it("erklärt den Aktionsknopf, sobald er erscheint", () => {
    expect(folge(LEER, { ...FREI, aktionSichtbar: true })).toEqual(["steuerkreuz", "aktion"]);
  });

  it("zeigt Tagebuch und Menü erst mit der ersten Quest, nie in einer Erinnerung", () => {
    const mitQuest = { ...LEER, quests: [QUEST] };
    expect(folge(mitQuest, FREI)).toEqual(["steuerkreuz", "tagebuch", "menue"]);
    expect(folge(mitQuest, { ...FREI, erinnerung: true })).toEqual(["steuerkreuz"]);
  });

  it("erklärt das Rennen zuletzt, erst ab Akt 2 und nur draußen (21.11.2026)", () => {
    const mitQuest = { ...LEER, quests: [QUEST] };
    const akt2 = { ...mitQuest, handlung: { ...mitQuest.handlung, akt: 2 } };
    const draussen = { ...FREI, draussen: true };
    expect(folge(akt2, draussen)).toEqual(["steuerkreuz", "tagebuch", "menue", "rennen"]);
    expect(folge(mitQuest, draussen)).toEqual(["steuerkreuz", "tagebuch", "menue"]);
    expect(folge(akt2, FREI)).toEqual(["steuerkreuz", "tagebuch", "menue"]);
  });

  it("merkt sich jeden Hinweis in einer Dialogvariablen", () => {
    expect(hinweisvariable("tagebuch")).toBe("hinweisTagebuch");
    expect(hakeAb(LEER, "menue").dialogvariablen["hinweisMenue"]).toBe(true);
  });
});
