/** Tests der offenen Stufen in der Gegnerwahl (0.2.85): aus dem Merker oder die Stufe des Gegners. */
import { describe, expect, it } from "vitest";
import { GEGNER, durchschnitt } from "../../engine/gegner";
import { offeneStufenAnfangs } from "./gegnerportraet";

describe("offene Stufen beim ersten Zeigen", () => {
  it("aus dem Merker, unbekannte Nummern fallen weg; leerer Merker: alle zu", () => {
    expect([...offeneStufenAnfangs("2,5,9,x", null)]).toEqual([2, 5]);
    expect(offeneStufenAnfangs("", "egal").size).toBe(0);
  });

  it("ohne Merker die Stufe des gewählten Gegners, ohne Gegner keine", () => {
    const g = GEGNER[0];
    if (!g) throw new Error("keine Gegner");
    expect([...offeneStufenAnfangs(null, g.kennung)]).toEqual([Math.round(durchschnitt(g))]);
    expect(offeneStufenAnfangs(null, null).size).toBe(0);
  });
});
