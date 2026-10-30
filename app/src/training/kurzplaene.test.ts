/**
 * Tests der Kurzpläne: Schritte, Verfall, Aufgabe des Tages, Serie und Ende der Zeitrunde.
 */
import { describe, expect, it } from "vitest";
import {
  aktuellerKurzschritt,
  geltendeSerie,
  kurzeinheitAus,
  kurzRestMs,
  LEERE_SERIE,
  naechsterKurzschritt,
  serieAus,
  serieNach,
  seriePausiert,
  starteKurzplan,
  tagesaufgabe,
  zeitrundeRestSekunden,
  zeitrundeVorbei,
} from "./kurzplaene";

const MINUTE = 60_000;

describe("Kurzpläne", () => {
  it("mini hat einen Schritt, kurz zwei (5 + 10 Minuten)", () => {
    expect(naechsterKurzschritt(starteKurzplan("mini", 0), 1)).toBeNull();
    const e = starteKurzplan("kurz", 0);
    const zwei = naechsterKurzschritt(e, 5 * MINUTE);
    expect(zwei && aktuellerKurzschritt(zwei)).toEqual({ art: "taktik", minuten: 10 });
    expect(zwei && naechsterKurzschritt(zwei, 15 * MINUTE)).toBeNull();
  });

  it("Restzeit läuft ab und wird negativ", () => {
    const e = starteKurzplan("mini", 0);
    expect(kurzRestMs(e, 2 * MINUTE)).toBe(3 * MINUTE);
    expect(kurzRestMs(e, 6 * MINUTE)).toBe(-MINUTE);
  });

  it("gemerkte Einheit: lesbar, verfallen nach drei Stunden, kaputt → null", () => {
    const e = starteKurzplan("kurz", 1000);
    const text = JSON.stringify(e);
    expect(kurzeinheitAus(text, 2000)).toEqual(e);
    expect(kurzeinheitAus(text, 1000 + 4 * 60 * MINUTE)).toBeNull();
    expect(kurzeinheitAus("kein json", 0)).toBeNull();
    expect(kurzeinheitAus('{"plan":"kurz","schritt":5,"beginn":0,"schrittBeginn":0}', 0)).toBeNull();
    expect(kurzeinheitAus(null, 0)).toBeNull();
  });

  it("Aufgabe des Tages: gleicher Tag gleiche Aufgabe, nächster Tag die nächste", () => {
    const liste = ["a", "b", "c"];
    const heute = new Date(2026, 9, 26, 8, 0);
    const abends = new Date(2026, 9, 26, 22, 0);
    const morgen = new Date(2026, 9, 27, 8, 0);
    expect(tagesaufgabe(liste, heute)).toBe(tagesaufgabe(liste, abends));
    const index = (d: Date) => liste.indexOf(tagesaufgabe(liste, d) ?? "");
    expect(index(morgen)).toBe((index(heute) + 1) % 3);
    expect(tagesaufgabe([], heute)).toBeNull();
  });

  it("Serie: wächst am Folgetag, bleibt am selben Tag, pausiert nach einer Lücke (seit 0.3.13)", () => {
    const tag1 = new Date(2026, 9, 24);
    const tag2 = new Date(2026, 9, 25);
    const tag4 = new Date(2026, 9, 27);
    let s = serieNach(LEERE_SERIE, tag1);
    expect(s.serie).toBe(1);
    s = serieNach(s, tag2);
    expect(s).toMatchObject({ serie: 2, beste: 2 });
    expect(serieNach(s, tag2)).toBe(s);
    expect(geltendeSerie(s)).toBe(2);
    expect(seriePausiert(s, new Date(2026, 9, 26))).toBe(false);
    expect(geltendeSerie(s)).toBe(2);
    expect(seriePausiert(s, tag4)).toBe(true);
    s = serieNach(s, tag4);
    expect(s).toMatchObject({ serie: 3, beste: 3 });
    expect(seriePausiert(s, tag4)).toBe(false);
  });

  it("Serie über Monatswechsel und gemerkter Stand", () => {
    const s = serieNach(serieNach(LEERE_SERIE, new Date(2026, 9, 31)), new Date(2026, 10, 1));
    expect(s.serie).toBe(2);
    expect(serieAus(JSON.stringify(s))).toEqual(s);
    expect(serieAus("kaputt")).toEqual(LEERE_SERIE);
    expect(serieAus(null)).toEqual(LEERE_SERIE);
  });

  it("Zeitrunde endet nach drei Minuten oder drei Fehlern", () => {
    expect(zeitrundeVorbei(0, 100_000, 2)).toBe(false);
    expect(zeitrundeVorbei(0, 100_000, 3)).toBe(true);
    expect(zeitrundeVorbei(0, 3 * MINUTE, 0)).toBe(true);
    expect(zeitrundeRestSekunden(0, 100_000)).toBe(80);
    expect(zeitrundeRestSekunden(0, 4 * MINUTE)).toBe(0);
  });
});
