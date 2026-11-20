/**
 * Kreiserkennung des Planers (planer.ts, merkeDurchgang): Geht der Spieler ohne Fortschritt in
 * den Quests immer wieder durch denselben Ausgang, gilt er als gesperrt, auch wenn sich der übrige
 * Stand bei jedem Durchgang ändert (Übergangsdialoge, Zielpfeile). Warum: Der eilige Spieler
 * pendelte 162-mal zwischen Felsbogen und Desert Springs (20.11.2026).
 */
import { describe, expect, it } from "vitest";
import { leererAbenteuerstand } from "../../src/abenteuer/regeln/spielstand";
import { Planer } from "./planer";
import { ladeSpieldaten } from "./welt";

const AUSGANG = "wegDelacroixDesert.felsbogen.weiterDesert";

describe("Kreiserkennung des Planers", () => {
  it("sperrt einen Ausgang nach vielen Durchgängen im selben Queststand", () => {
    const planer = new Planer(ladeSpieldaten());
    const grund = leererAbenteuerstand(new Date(0), "Kim", null, false);
    for (let i = 0; i < 25; i++) {
      // Jeder Durchgang ändert eine Dialogvariable, wie ein Übergangsdialog es tut.
      const stand = { ...grund, dialogvariablen: { ...grund.dialogvariablen, durchgang: i } };
      planer.merkeDurchgang(stand, "wegDelacroixDesert.felsbogen", "weiterDesert");
    }
    const spaeter = { ...grund, dialogvariablen: { ...grund.dialogvariablen, durchgang: 99 } };
    expect(planer.gesperrteAusgaenge(spaeter).has(AUSGANG)).toBe(true);
  });

  it("sperrt nicht bei wenigen Durchgängen (Umsehen im Ort: rein und raus)", () => {
    const planer = new Planer(ladeSpieldaten());
    const grund = leererAbenteuerstand(new Date(0), "Kim", null, false);
    for (let i = 0; i < 6; i++) {
      const stand = { ...grund, dialogvariablen: { ...grund.dialogvariablen, durchgang: i } };
      planer.merkeDurchgang(stand, "wegDelacroixDesert.felsbogen", "weiterDesert");
    }
    expect(planer.gesperrteAusgaenge(grund).has(AUSGANG)).toBe(false);
  });
});

describe("Reihenfolge der Hinweise", () => {
  it("laufende Nebenquests vor dem Beginn des Epilogs (Mira wartet auf den Brief)", () => {
    const daten = ladeSpieldaten();
    const planer = new Planer(daten);
    const grund = leererAbenteuerstand(new Date(0), "Kim", null, false);
    const quest = (kennung: string, schritt: number, erledigt: boolean) => ({
      kennung,
      schritt,
      erledigt,
      angenommen: "2026-11-20T10:00:00.000Z",
      erledigtAm: erledigt ? "2026-11-20T11:00:00.000Z" : null,
    });
    const haupt = daten.quests.filter((q) => q.haupt && q.kennung !== "mapleFalls.epilog");
    const stand = {
      ...grund,
      position: { karte: "desertSprings.aussen", x: 10, y: 10, richtung: "unten" as const },
      quests: [
        ...haupt.map((q) => quest(q.kennung, 0, q.kennung !== "desertSprings.versoehnung")),
        quest("desertSprings.brief", 0, false),
      ].map((q) => (q.kennung === "desertSprings.versoehnung" ? { ...q, schritt: 4 } : q)),
    };
    const hinweise = (
      planer as unknown as { hinweise: (s: typeof stand, a: string) => { grund: string }[] }
    ).hinweise(stand, "rest");
    const gruende = hinweise.map((h) => h.grund);
    const neben = gruende.indexOf("Zielhinweis Nebenquest");
    const epilog = gruende.indexOf("Beginn von mapleFalls.epilog");
    expect(neben).toBeGreaterThanOrEqual(0);
    expect(epilog).toBeGreaterThan(neben);
  });
});
