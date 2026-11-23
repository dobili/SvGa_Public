/** Tests der Spieluhr (regeln/spieluhr.ts): ungleichmäßige Phasen, Warten, Angaben aus Ink. */
import { describe, expect, it } from "vitest";
import {
  MINUTEN_JE_TAG,
  naechsteStunde,
  phase,
  rueckeVor,
  spieltag,
  START_SPIELMINUTE,
  stundeAus,
  stundeJetzt,
  uhrNachAngabe,
} from "./spieluhr";

const MIN = 60_000;
const um = (stunde: number, tag = 1) => (tag - 1) * MINUTEN_JE_TAG + stunde * 60;

describe("Spieluhr", () => {
  it("neuer Stand: erster Morgen, 8 Uhr", () => {
    expect(stundeJetzt({})).toBe(8);
    expect(spieltag({})).toBe(1);
    expect(stundeJetzt({ spieluhr: START_SPIELMINUTE })).toBe(8);
  });

  it("Phasen nach Stunden", () => {
    expect([6, 8, 9, 17, 18, 20, 21, 0, 5].map(phase)).toEqual([
      "morgen", "morgen", "tag", "tag", "abend", "abend", "nacht", "nacht", "nacht",
    ]); // prettier-ignore
  });

  it("ein Spieltag dauert 2 echte Stunden, ungleichmäßig verteilt", () => {
    expect(rueckeVor(um(6), 15 * MIN)).toBeCloseTo(um(9));
    expect(rueckeVor(um(9), 50 * MIN)).toBeCloseTo(um(18));
    expect(rueckeVor(um(18), 15 * MIN)).toBeCloseTo(um(21));
    expect(rueckeVor(um(21), 40 * MIN)).toBeCloseTo(um(6, 2));
    expect(rueckeVor(um(6), 120 * MIN)).toBeCloseTo(um(6, 2));
  });

  it("über Phasengrenzen hinweg im jeweiligen Tempo", () => {
    // 8 Uhr: noch 5 echte Minuten Morgen (12 Spielminuten je Minute), dann 5 Minuten Tag (10,8).
    expect(rueckeVor(um(8), 10 * MIN)).toBeCloseTo(um(9) + 5 * 10.8);
  });

  it("Warten: nächste solche Stunde, nie zurück", () => {
    expect(naechsteStunde(um(14), 22)).toBe(um(22));
    expect(naechsteStunde(um(23), 7)).toBe(um(7, 2));
    expect(naechsteStunde(um(7), 7)).toBe(um(7, 2));
    expect(stundeAus(um(1, 2))).toBe(1);
  });

  it("Angabe aus Ink: Name oder Stunde, gleiche Phase bleibt", () => {
    expect(uhrNachAngabe(um(14), "abend")).toBe(um(19));
    expect(uhrNachAngabe(um(19) + 30, "abend")).toBe(um(19) + 30);
    expect(uhrNachAngabe(um(22) + 10, "22")).toBe(um(22) + 10);
    expect(uhrNachAngabe(um(23), "morgen")).toBe(um(7, 2));
    expect(uhrNachAngabe(um(10), "unsinn")).toBeNull();
  });
});
