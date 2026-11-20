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
