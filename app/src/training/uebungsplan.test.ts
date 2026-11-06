/**
 * Tests des Übungsplans mit Dauer (Gamifizierung P11, neu gefasst am 6.11.2026, Q15-2): Wochentag,
 * heutiger Übungstag, Stand der geschafften Minuten, nur gültige Pläne.
 */
import { describe, expect, it } from "vitest";
import { leereDaten } from "../speicher/format";
import { heuteGeplant, mitUebungsplan, plantag, planstandHeute } from "./uebungsplan";
import { tagesschluessel } from "./kurzplaene";

/** Samstag, 31.10.2026, 10 Uhr Ortszeit. */
const JETZT = new Date(2026, 9, 31, 10);
const PLAN = { tage: [0, 2, 5], minuten: 20, satz: "nach dem Abendessen" };

describe("Übungsplan", () => {
  it("kennt den Wochentag mit Montag = 0 und den heutigen Übungstag", () => {
    expect(plantag(JETZT)).toBe(5);
    expect(plantag(new Date(2026, 10, 1))).toBe(6);
    expect(heuteGeplant(PLAN, JETZT)).toBe(true);
    expect(heuteGeplant({ ...PLAN, tage: [0] }, JETZT)).toBe(false);
    expect(heuteGeplant(null, JETZT)).toBe(false);
  });

  it("zählt die geschafften Minuten von heute", () => {
    const d = mitUebungsplan(leereDaten(JETZT), PLAN);
    const mitZeit = { ...d, aktivitaet: { [tagesschluessel(JETZT)]: { minuten: 7 } } };
    expect(planstandHeute(mitZeit, JETZT)).toEqual({ geplant: 20, geschafft: 7, fertig: false });
    const fertig = { ...d, aktivitaet: { [tagesschluessel(JETZT)]: { minuten: 25 } } };
    expect(planstandHeute(fertig, JETZT)?.fertig).toBe(true);
    expect(planstandHeute(d, new Date(2026, 10, 1))).toBeNull();
  });

  it("speichert nur gültige Pläne, sortiert und ohne Doppel", () => {
    const d = leereDaten(JETZT);
    expect(mitUebungsplan(d, { tage: [4, 0, 4], minuten: 15, satz: " vor der Schule " }).uebungsplan).toEqual({
      tage: [0, 4],
      minuten: 15,
      satz: "vor der Schule",
    });
    expect(mitUebungsplan(d, { tage: [], minuten: 15, satz: "" })).toBe(d);
    expect(mitUebungsplan(d, { tage: [1], minuten: 17, satz: "" })).toBe(d);
    expect(mitUebungsplan(mitUebungsplan(d, PLAN), null).uebungsplan).toBeNull();
  });
});
