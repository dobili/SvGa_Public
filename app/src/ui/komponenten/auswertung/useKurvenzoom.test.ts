/**
 * Tests der Phasenausschnitte für den Zoom der Verlaufskurve (R56).
 */
import { describe, expect, it } from "vitest";
import { phasenausschnitte } from "./useKurvenzoom";

describe("phasenausschnitte", () => {
  it("drei Phasen: Eröffnung bis vor dem Mittelspiel, Mittelspiel bis vor dem Endspiel", () => {
    expect(phasenausschnitte(41, { eroeffnung: 0, mittelspiel: 8, endspiel: 30 })).toEqual({
      eroeffnung: { von: 0, bis: 7 },
      mittelspiel: { von: 8, bis: 29 },
      endspiel: { von: 30, bis: 40 },
    });
  });

  it("ohne Endspiel reicht das Mittelspiel bis zum Schluss; ohne Wechsel nur die Eröffnung", () => {
    expect(phasenausschnitte(20, { eroeffnung: 0, mittelspiel: 6, endspiel: null })).toEqual({
      eroeffnung: { von: 0, bis: 5 },
      mittelspiel: { von: 6, bis: 19 },
    });
    expect(phasenausschnitte(5, undefined)).toEqual({ eroeffnung: { von: 0, bis: 4 } });
  });
});
