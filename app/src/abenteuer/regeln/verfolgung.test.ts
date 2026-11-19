/**
 * Tests der verfolgten Quest (regeln/verfolgung.ts): Antippen im Tagebuch verfolgt, noch einmal
 * Antippen hört auf, eine andere Quest wechselt; erledigte oder unbekannte Quests gelten nicht.
 */
import { describe, expect, it } from "vitest";
import type { Abenteuerstand, Queststand } from "../schnittstelle/spielstand";
import { abenteuerstandAus, leererAbenteuerstand } from "./spielstand";
import { schalteVerfolgung, verfolgteLaufendeQuest } from "./verfolgung";

const JETZT = new Date("2026-11-19T12:00:00Z");

function quest(kennung: string, erledigt = false): Queststand {
  return { kennung, schritt: 0, erledigt, angenommen: JETZT.toISOString(), erledigtAm: null };
}

function stand(quests: Queststand[]): Abenteuerstand {
  return { ...leererAbenteuerstand(JETZT, "Kim", 600, false), quests };
}

describe("verfolgung", () => {
  it("ein neuer Spielstand verfolgt nichts (Pfeil standardmäßig aus)", () => {
    expect(verfolgteLaufendeQuest(leererAbenteuerstand(JETZT, "Kim", 600, false))).toBe(null);
  });

  it("Antippen verfolgt, noch einmal Antippen hört auf", () => {
    const s = stand([quest("mapleFalls.dasBrett")]);
    const an = schalteVerfolgung(s, "mapleFalls.dasBrett");
    expect(verfolgteLaufendeQuest(an)).toBe("mapleFalls.dasBrett");
    expect(verfolgteLaufendeQuest(schalteVerfolgung(an, "mapleFalls.dasBrett"))).toBe(null);
  });

  it("eine andere Quest antippen wechselt die Verfolgung", () => {
    const s = stand([quest("mapleFalls.dasBrett"), quest("mapleFalls.lilysSpringer")]);
    const an = schalteVerfolgung(s, "mapleFalls.dasBrett");
    expect(verfolgteLaufendeQuest(schalteVerfolgung(an, "mapleFalls.lilysSpringer"))).toBe(
      "mapleFalls.lilysSpringer",
    );
  });

  it("eine erledigte Quest gilt nicht mehr als verfolgt", () => {
    const s = {
      ...stand([quest("mapleFalls.dasBrett", true)]),
      verfolgteQuest: "mapleFalls.dasBrett",
    };
    expect(verfolgteLaufendeQuest(s)).toBe(null);
  });

  it("übersteht Speichern und Lesen; ältere Stände ohne Feld verfolgen nichts", () => {
    const s = schalteVerfolgung(stand([quest("mapleFalls.dasBrett")]), "mapleFalls.dasBrett");
    const gelesen = abenteuerstandAus(JSON.parse(JSON.stringify(s)));
    expect(gelesen && verfolgteLaufendeQuest(gelesen)).toBe("mapleFalls.dasBrett");
    const alt = { ...JSON.parse(JSON.stringify(stand([quest("mapleFalls.dasBrett")]))) };
    delete alt.verfolgteQuest;
    const altGelesen = abenteuerstandAus(alt);
    expect(altGelesen && verfolgteLaufendeQuest(altGelesen)).toBe(null);
  });
});
