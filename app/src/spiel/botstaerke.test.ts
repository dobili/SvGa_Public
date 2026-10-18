/**
 * Tests der Spielstärke je Stufe (Rückfrage S23, 0.2.85): Tabelle aufsteigend, Stufen je Phase
 * am Durchschnitt, gerundet auf 50.
 */
import { describe, expect, it } from "vitest";
import type { Stufennummer } from "../engine/stufen";
import { GEGNER } from "../engine/gegner";
import { STAERKE_DER_STUFE, staerkeDerStufe, staerkeDerStufen } from "./botstaerke";

const NUMMERN: readonly Stufennummer[] = [1, 2, 3, 4, 5, 6, 7, 8];
const gleich = (n: Stufennummer) => ({ eroeffnung: n, mittelspiel: n, endspiel: n });

describe("Spielstärke der Stufen", () => {
  it("steigt von Stufe zu Stufe", () => {
    for (let i = 1; i < NUMMERN.length; i += 1) {
      const n = NUMMERN[i] ?? 1;
      const vorher = NUMMERN[i - 1] ?? 1;
      expect(STAERKE_DER_STUFE[n]).toBeGreaterThan(STAERKE_DER_STUFE[vorher]);
    }
  });

  it("gleiche Stufen in allen Phasen: genau die Zahl der Stufe", () => {
    for (const n of NUMMERN) expect(staerkeDerStufen(gleich(n))).toBe(staerkeDerStufe(n));
  });

  it("verschiedene Stufen: Wert am Durchschnitt, linear dazwischen, auf 50 gerundet", () => {
    // Timo (5, 4, 3): Durchschnitt 4.
    expect(staerkeDerStufen({ eroeffnung: 5, mittelspiel: 4, endspiel: 3 })).toBe(
      staerkeDerStufe(4),
    );
    const mitte = staerkeDerStufen({ eroeffnung: 2, mittelspiel: 3, endspiel: 2 });
    expect(mitte).toBeGreaterThan(staerkeDerStufe(2));
    expect(mitte).toBeLessThan(staerkeDerStufe(3));
    expect(mitte % 50).toBe(0);
  });

  it("jeder vorgefertigte Bot hat eine Zahl zwischen Stufe 1 und Stufe 8", () => {
    for (const g of GEGNER) {
      const wert = staerkeDerStufen(g.stufenJePhase);
      expect(wert).toBeGreaterThanOrEqual(staerkeDerStufe(1));
      expect(wert).toBeLessThanOrEqual(staerkeDerStufe(8));
    }
  });
});
