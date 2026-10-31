/**
 * Tests des Wochenziels (Gamifizierung P4): Wochengrenze Montag in Ortszeit, Lerntage, Ziel mitten
 * in der Woche geändert, erreichte Wochen ohne Zurücksetzen, beste Folge.
 */
import { describe, expect, it } from "vitest";
import { zaehleAktivitaet } from "../speicher/aktivitaet";
import { leereDaten, type Nutzerdaten } from "../speicher/format";
import { mitVerdient } from "../speicher/verdient";
import {
  besteFolge,
  erreichteWochen,
  mitWochenziel,
  neuErreichteWochen,
  wochenlage,
} from "./wochenziel";

/** Samstag, 31.10.2026, 10 Uhr Ortszeit; die Woche beginnt am Montag, 26.10. */
const JETZT = new Date(2026, 9, 31, 10);

/** Daten mit je einer Abbildung an diesen Tagen (Monat 0-basiert wie Date). */
function mitLerntagen(tage: readonly [number, number, number?][], ziel: number | null): Nutzerdaten {
  let d = mitWochenziel(leereDaten(JETZT), ziel);
  for (const [monat, tag, stunde = 12] of tage)
    d = zaehleAktivitaet(d, "abbildung", 1, new Date(2026, monat, tag, stunde));
  return d;
}

describe("Wochenziel", () => {
  it("zeigt die Woche Montag bis Sonntag mit Lerntagen und heute", () => {
    const lage = wochenlage(mitLerntagen([[9, 26], [9, 28]], 3), JETZT);
    expect(lage.montag).toBe("2026-10-26");
    expect(lage.tage.map((t) => t.schluessel)).toEqual([
      "2026-10-26",
      "2026-10-27",
      "2026-10-28",
      "2026-10-29",
      "2026-10-30",
      "2026-10-31",
      "2026-11-01",
    ]);
    expect(lage.tage.map((t) => t.gelernt)).toEqual([true, false, true, false, false, false, false]);
    expect(lage.tage.findIndex((t) => t.heute)).toBe(5);
    expect(lage).toMatchObject({ gelernt: 2, ziel: 3, erreicht: false });
  });

  it("trennt die Wochen um Mitternacht zwischen Sonntag und Montag (Ortszeit)", () => {
    const d = mitLerntagen([[9, 25, 23], [9, 26, 0]], 2);
    expect(wochenlage(d, JETZT).gelernt).toBe(1);
    expect(wochenlage(d, new Date(2026, 9, 25, 23, 59)).gelernt).toBe(1);
  });

  it("zählt bloßes Öffnen nicht als Lerntag", () => {
    const d = zaehleAktivitaet(mitWochenziel(leereDaten(JETZT), 2), "sieg", 1, JETZT);
    expect(wochenlage(d, JETZT).gelernt).toBe(0);
    const mitPartie = zaehleAktivitaet(d, "partie", 1, JETZT);
    expect(wochenlage(mitPartie, JETZT).gelernt).toBe(1);
  });

  it("ein geändertes Ziel gilt sofort, auch mitten in der Woche", () => {
    const d = mitLerntagen([[9, 26], [9, 27]], 3);
    expect(wochenlage(d, JETZT).erreicht).toBe(false);
    expect(wochenlage(mitWochenziel(d, 2), JETZT).erreicht).toBe(true);
    expect(mitWochenziel(d, 6)).toBe(d);
  });

  it("nennt am Sonntag den einen fehlenden Tag, sonst nicht", () => {
    const d = mitLerntagen([[9, 26], [9, 27]], 3);
    expect(wochenlage(d, new Date(2026, 10, 1, 9)).nochEinTag).toBe(true);
    expect(wochenlage(d, JETZT).nochEinTag).toBe(false);
    expect(wochenlage(mitWochenziel(d, 4), new Date(2026, 10, 1, 9)).nochEinTag).toBe(false);
  });

  it("zählt erreichte Wochen ohne Zurücksetzen; ein höheres Ziel nimmt keine weg", () => {
    // Zwei Wochen erreicht (je zwei Tage), eine Woche dazwischen mit nur einem Tag.
    const d = mitLerntagen([[9, 5], [9, 6], [9, 13], [9, 19], [9, 20]], 2);
    expect(erreichteWochen(d)).toEqual(["2026-10-05", "2026-10-19"]);
    const gemerkt = mitVerdient(d, neuErreichteWochen(d), JETZT);
    expect(neuErreichteWochen(gemerkt)).toEqual([]);
    expect(erreichteWochen(mitWochenziel(gemerkt, 5))).toEqual(["2026-10-05", "2026-10-19"]);
    expect(erreichteWochen(mitWochenziel(d, null))).toEqual([]);
  });

  it("findet die beste Folge von Wochen hintereinander, auch über die Zeitumstellung", () => {
    expect(besteFolge([])).toBe(0);
    expect(besteFolge(["2026-10-05", "2026-10-12", "2026-10-19", "2026-11-02"])).toBe(3);
    expect(besteFolge(["2026-10-19", "2026-10-26", "2026-11-02"])).toBe(3);
  });
});
