/**
 * Tests für rochade.ts: „rochiert haben“ aus dem Standort des Königs und aus dem Verlauf (S17).
 */
import { describe, expect, it } from "vitest";
import { stellungVon, verlaufBis } from "./buchabbildungen.testhilfe";
import { hatRochiert } from "./rochade";

describe("hatRochiert", () => {
  it("Abb. 11.18 (Lasker–Thomas): Der gejagte schwarze König hat rochiert, Weiß nicht", () => {
    const stellung = stellungVon("11.18");
    const verlauf = verlaufBis("11.18");
    expect(hatRochiert(stellung, "black", verlauf)).toBe(true);
    expect(hatRochiert(stellung, "white", verlauf)).toBe(false);
  });

  it("ohne Verlauf zählt nur der Standort: Abb. 11.18 Schwarz nein, Abb. 12.1 beide ja", () => {
    expect(hatRochiert(stellungVon("11.18"), "black")).toBe(false);
    expect(hatRochiert(stellungVon("12.1"), "white")).toBe(true);
    expect(hatRochiert(stellungVon("12.1"), "black")).toBe(true);
  });
});
