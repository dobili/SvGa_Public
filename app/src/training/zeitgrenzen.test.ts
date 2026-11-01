/**
 * Grenzfälle der Zeitrechnung im Fehlertest f3 (01.11.2026): Ende der Sommerzeit (Sonntag,
 * 25.10.2026, 3 Uhr wird 2 Uhr), Wochen- und Monatswechsel um Mitternacht und der Jahreswechsel,
 * jeweils in der Ortszeit Berlin. Betroffen sind Tagesprotokoll, Wochenziel, Tagesserie,
 * Monatsrückblick, der Rekord „Lerntage in einer Woche“ und das Neuzeichnen um Mitternacht
 * (app/tageswechsel.ts); alle rechnen mit Tagesschlüsseln der Ortszeit (training/kurzplaene.ts).
 */
process.env.TZ = "Europe/Berlin";

import { describe, expect, it } from "vitest";
import { lerntage, wochentage, zaehleAktivitaet } from "../speicher/aktivitaet";
import { leereDaten, type Nutzerdaten } from "../speicher/format";
import { msBisMorgen } from "../app/tageswechsel";
import { LEERE_SERIE, serieNach, seriePausiert, tagesschluessel } from "./kurzplaene";
import { meisteLerntageInEinerWoche } from "./rekordwerte";
import {
  imMonat,
  kalenderwochen,
  monatVon,
  rueckblickkarteSichtbar,
  rueckblickMonate,
  vormonat,
} from "./rueckblick";
import { besteFolge, erreichteWochen, mitWochenziel, wochenlage } from "./wochenziel";

/** Ortszeit Berlin, Monat 1-basiert wie im Kalender. */
function ort(jahr: number, monat: number, tag: number, stunde = 12, minute = 0): Date {
  return new Date(jahr, monat - 1, tag, stunde, minute);
}

/** Daten mit je einer Abbildung zu diesen Zeitpunkten und dem Wochenziel. */
function mitLerntagen(zeiten: readonly Date[], ziel: number | null = null): Nutzerdaten {
  let daten = mitWochenziel(leereDaten(ort(2026, 10, 1)), ziel);
  for (const zeit of zeiten) daten = zaehleAktivitaet(daten, "abbildung", 1, zeit);
  return daten;
}

describe("Ende der Sommerzeit (25.10.2026)", () => {
  it("die Zeitzone der Tests ist wirklich Berlin (eine Stunde mehr am 25.10.)", () => {
    const vorher = ort(2026, 10, 25, 0).getTime();
    const nachher = ort(2026, 10, 26, 0).getTime();
    expect((nachher - vorher) / 3_600_000).toBe(25);
  });

  it("Tage um die Umstellung bekommen ihren eigenen Schlüssel", () => {
    expect(tagesschluessel(ort(2026, 10, 25, 0, 30))).toBe("2026-10-25");
    expect(tagesschluessel(ort(2026, 10, 25, 2, 30))).toBe("2026-10-25");
    expect(tagesschluessel(ort(2026, 10, 25, 23, 59))).toBe("2026-10-25");
    expect(tagesschluessel(ort(2026, 10, 26, 0, 0))).toBe("2026-10-26");
  });

  it("Woche, Kalender und Rekord zählen die Umstellungswoche mit sieben Tagen", () => {
    expect(wochentage(ort(2026, 10, 25, 23, 30))).toEqual([
      "2026-10-19",
      "2026-10-20",
      "2026-10-21",
      "2026-10-22",
      "2026-10-23",
      "2026-10-24",
      "2026-10-25",
    ]);
    const oktober = kalenderwochen(monatVon(ort(2026, 10, 1))).flat();
    expect(oktober.filter((t) => t !== null)).toHaveLength(31);
    const daten = mitLerntagen([
      ort(2026, 10, 19),
      ort(2026, 10, 25, 1),
      ort(2026, 10, 25, 23, 59),
      ort(2026, 10, 26, 0, 1),
    ]);
    expect(lerntage(daten.aktivitaet, "2026-10-19", "2026-10-25")).toEqual([
      "2026-10-19",
      "2026-10-25",
    ]);
    expect(meisteLerntageInEinerWoche(daten)).toBe(2);
    expect(besteFolge(["2026-10-19", "2026-10-26", "2026-11-02"])).toBe(3);
  });
});

describe("Wochengrenze um Mitternacht", () => {
  it("Sonntag 23:59 zählt zur alten Woche, Montag 0:00 beginnt die neue bei null", () => {
    const daten = mitLerntagen(
      [ort(2026, 10, 26), ort(2026, 10, 28), ort(2026, 11, 1, 23, 59)],
      3,
    );
    const sonntag = wochenlage(daten, ort(2026, 11, 1, 23, 59));
    expect(sonntag).toMatchObject({ montag: "2026-10-26", gelernt: 3, erreicht: true });
    const montag = wochenlage(daten, ort(2026, 11, 2, 0, 0));
    expect(montag).toMatchObject({ montag: "2026-11-02", gelernt: 0, erreicht: false });
    // Die erreichte Woche bleibt erreicht, auch wenn die neue noch leer ist.
    expect(erreichteWochen(daten)).toEqual(["2026-10-26"]);
  });

  it("Woche über den Jahreswechsel: Montag 28.12.2026 bis Sonntag 3.1.2027", () => {
    expect(wochentage(ort(2027, 1, 1))).toEqual([
      "2026-12-28",
      "2026-12-29",
      "2026-12-30",
      "2026-12-31",
      "2027-01-01",
      "2027-01-02",
      "2027-01-03",
    ]);
    const daten = mitLerntagen([ort(2026, 12, 30), ort(2027, 1, 2), ort(2027, 1, 3)], 3);
    expect(wochenlage(daten, ort(2027, 1, 3, 20))).toMatchObject({ gelernt: 3, erreicht: true });
    expect(meisteLerntageInEinerWoche(daten)).toBe(3);
  });

  it("Tagesserie: Sonntag auf Montag wächst sie, ein Tag Pause pausiert sie nur", () => {
    const sonntag = serieNach(LEERE_SERIE, ort(2026, 11, 1, 23, 59));
    const montag = serieNach(sonntag, ort(2026, 11, 2, 0, 1));
    expect(montag).toMatchObject({ serie: 2, beste: 2, letzterTag: "2026-11-02" });
    expect(seriePausiert(montag, ort(2026, 11, 3, 23))).toBe(false);
    expect(seriePausiert(montag, ort(2026, 11, 4, 0, 1))).toBe(true);
    // Über den Jahreswechsel: 31.12. und 1.1. sind zwei Tage in Folge.
    const silvester = serieNach(LEERE_SERIE, ort(2026, 12, 31, 23, 50));
    expect(seriePausiert(silvester, ort(2027, 1, 1, 0, 10))).toBe(false);
  });
});

describe("Monatsrückblick an den Grenzen", () => {
  it("31.10. 23:59 gehört zum Oktober, 1.11. 0:00 zum November (Ortszeit, nicht UTC)", () => {
    const oktober = monatVon(ort(2026, 10, 15));
    expect(imMonat(ort(2026, 10, 31, 23, 59).toISOString(), oktober)).toBe(true);
    expect(imMonat(ort(2026, 11, 1, 0, 0).toISOString(), oktober)).toBe(false);
    // In UTC ist 1.11. 0:30 Berlin noch der 31.10.; für den Leser zählt die Ortszeit.
    expect(ort(2026, 11, 1, 0, 30).toISOString().startsWith("2026-10-31")).toBe(true);
    expect(imMonat(ort(2026, 11, 1, 0, 30).toISOString(), oktober)).toBe(false);
  });

  it("erster Monat: Startkarte ab dem 1. bis zum 7., der laufende Monat fehlt im Profil", () => {
    const daten = mitLerntagen([ort(2026, 10, 20)]);
    expect(rueckblickkarteSichtbar(daten.aktivitaet, ort(2026, 11, 1, 0, 0), null)).toBe(true);
    expect(rueckblickkarteSichtbar(daten.aktivitaet, ort(2026, 11, 7, 23, 59), null)).toBe(true);
    expect(rueckblickkarteSichtbar(daten.aktivitaet, ort(2026, 11, 8, 0, 0), null)).toBe(false);
    expect(rueckblickkarteSichtbar(daten.aktivitaet, ort(2026, 10, 31, 23, 59), null)).toBe(false);
    expect(rueckblickMonate(daten.aktivitaet, ort(2026, 10, 31, 23, 59))).toEqual([]);
    expect(rueckblickMonate(daten.aktivitaet, ort(2026, 11, 1, 0, 0)).map((m) => m.schluessel)).toEqual(
      ["2026-10"],
    );
  });

  it("Monat ohne Daten: keine Startkarte; Jahreswechsel: Dezember im Januar", () => {
    const nurSeptember = mitLerntagen([ort(2026, 9, 10)]);
    expect(rueckblickkarteSichtbar(nurSeptember.aktivitaet, ort(2026, 11, 2), null)).toBe(false);
    expect(rueckblickMonate(nurSeptember.aktivitaet, ort(2026, 11, 2)).map((m) => m.schluessel)).toEqual(
      ["2026-09"],
    );
    const dezember = mitLerntagen([ort(2026, 12, 31, 23, 30)]);
    expect(vormonat(monatVon(ort(2027, 1, 3))).schluessel).toBe("2026-12");
    expect(rueckblickkarteSichtbar(dezember.aktivitaet, ort(2027, 1, 3), null)).toBe(true);
    expect(rueckblickkarteSichtbar(dezember.aktivitaet, ort(2027, 1, 3), "2026-12")).toBe(false);
  });
});

describe("Neuzeichnen um Mitternacht (app/tageswechsel.ts)", () => {
  it("wartet bis kurz nach Mitternacht, am Tag der Umstellung 25 Stunden", () => {
    expect(msBisMorgen(ort(2026, 10, 31, 23, 59))).toBe(61_000);
    expect(msBisMorgen(ort(2026, 10, 25, 0, 0))).toBe(25 * 3_600_000 + 1000);
    expect(tagesschluessel(new Date(ort(2026, 12, 31, 23, 59).getTime() + msBisMorgen(ort(2026, 12, 31, 23, 59))))).toBe(
      "2027-01-01",
    );
  });
});
