// Kartenwissen des Durchlaufs nach der Uhr (uhrwelt.ts): wer nachts schläft, steht nicht an seinem Platz.
import { describe, expect, it } from "vitest";
import { leererAbenteuerstand } from "../../src/abenteuer/regeln/spielstand";
import { MINUTEN_JE_STUNDE } from "../../src/abenteuer/regeln/spieluhr";
import { kartenwissen, ladeSpieldaten } from "./welt";

const MITTAG = 12;
const MITTERNACHT = 24;

/** Namen der Figuren im Kartenwissen einer Karte zur Stunde (neuer Stand). */
function figurenAuf(karte: string, stunde: number): string[] {
  const stand = {
    ...leererAbenteuerstand(new Date(0), "Kim", null, false),
    spieluhr: stunde * MINUTEN_JE_STUNDE,
  };
  const wissen = kartenwissen(ladeSpieldaten(), karte, stand);
  return wissen.dinge.filter((d) => d.typ === "figur").map((d) => d.name);
}

describe("Kartenwissen nach der Uhr", () => {
  it("stellt die Gegnerin mittags an die Landstraße und nimmt sie nachts heraus", () => {
    expect(figurenAuf("wegMapleCedar.landstrasse", MITTAG)).toContain("gegnerin");
    expect(figurenAuf("wegMapleCedar.landstrasse", MITTERNACHT)).not.toContain("gegnerin");
  });

  it("hält eine Figur fest, die eine Hauptquest braucht (Regel 1, wie im Spiel)", () => {
    expect(figurenAuf("mapleFalls.clubraum", MITTERNACHT)).toContain("coachDelgado");
  });
});
