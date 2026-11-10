/**
 * Tests für dialogwirkungen.ts: `zahle` zieht den Fahrpreis vom Spielstand ab und schreibt bei zu
 * wenig Münzen nichts (der Dialog fragt vorher `muenzen` ab).
 */
import { describe, expect, it } from "vitest";
import { leererAbenteuerstand } from "../regeln/spielstand";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { dialogwirkungen, type Nachdialogmerker } from "./dialogwirkungen";

const JETZT = new Date("2026-11-10T11:00:00Z");

/** Wirkungen über einem Stand mit so vielen Münzen; `geschrieben` sammelt jedes Schreiben. */
function mitMuenzen(muenzen: number) {
  let stand: Abenteuerstand = { ...leererAbenteuerstand(JETZT, "Kim", null, false), muenzen };
  const geschrieben: Abenteuerstand[] = [];
  const w = dialogwirkungen({
    stand: () => stand,
    welt: null,
    schreibe: (neu) => {
      stand = neu;
      geschrieben.push(neu);
    },
    meldung: () => undefined,
    toenung: () => undefined,
    merker: () => ({}) as Nachdialogmerker,
  });
  return { w, geschrieben };
}

describe("dialogwirkungen: zahle", () => {
  it("zieht den Fahrpreis ab", () => {
    const { w, geschrieben } = mitMuenzen(12);
    w.zahle(5);
    expect(geschrieben.map((s) => s.muenzen)).toEqual([7]);
  });

  it("schreibt bei zu wenig Münzen nichts", () => {
    const { w, geschrieben } = mitMuenzen(3);
    w.zahle(5);
    expect(geschrieben).toEqual([]);
  });
});
