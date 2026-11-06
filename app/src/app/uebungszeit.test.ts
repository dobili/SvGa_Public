/** Tests der Übungszeit (Wunsch des Autors, 6.11.2026, Q15-2). */
import { describe, expect, it } from "vitest";
import { RUHE_ERLAUBT_MS, zaehltAlsUebung } from "./uebungszeit";

describe("Übungszeit", () => {
  it("zählt nur sichtbare Minuten mit Eingabe in den letzten drei Minuten", () => {
    const jetzt = 10 * RUHE_ERLAUBT_MS;
    expect(zaehltAlsUebung(true, jetzt - 1000, jetzt)).toBe(true);
    expect(zaehltAlsUebung(true, jetzt - RUHE_ERLAUBT_MS - 1, jetzt)).toBe(false);
    expect(zaehltAlsUebung(false, jetzt, jetzt)).toBe(false);
  });
});
