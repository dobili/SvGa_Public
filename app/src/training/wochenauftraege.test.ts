/**
 * Tests der Wochenaufträge (Gamifizierung P6): gleiche Woche gibt gleiche Aufträge, Fortschritt
 * zählt nur ab Montag, Tauschen einmal je Stelle, erledigte Aufträge bleiben über den
 * Wochenwechsel, Monatszählung für das Abzeichen.
 */
import { describe, expect, it } from "vitest";
import { zaehleAktivitaet } from "../speicher/aktivitaet";
import { leereDaten, type Nutzerdaten } from "../speicher/format";
import {
  AUFTRAEGE_JE_WOCHE,
  auftraegeDerWoche,
  auftragszeilen,
  besterMonat,
  erledigteAuftraege,
  mitAuftraegen,
  mitTausch,
  saatDerWoche,
  tauschauftrag,
  waehleAuftraege,
  type Auftragsart,
  type Auftragslage,
  type Auftragsstand,
} from "./wochenauftraege";

/** Samstag, 31.10.2026, 10 Uhr; die Woche beginnt am Montag, 26.10. */
const JETZT = new Date(2026, 9, 31, 10);
const MONTAG = "2026-10-26";

/** Eine einfache Art, die immer passt und eine Art des Tagesprotokolls zählt. */
function art(kennung: string, zaehlt: Auftragsart["zaehlt"], anzahl = 3): Auftragsart {
  return {
    kennung,
    text: "auftrag.text.partien",
    knopf: "auftrag.knopf.partien",
    zaehlt,
    waehle: () => ({ anzahl, wert: null }),
    ziel: () => ({ art: "ansicht", ansicht: { bildschirm: "spielen" } }),
  };
}

const ARTEN: readonly Auftragsart[] = [
  art("abbildungen", "abbildung"),
  art("uebungen", "uebungGeloest"),
  art("partien", "partie", 2),
  art("warum", "warum"),
  art("karten", "karte"),
];

function lage(daten: Nutzerdaten, jetzt: Date = JETZT): Auftragslage {
  return { daten, kapitel: [], jetzt };
}

describe("Wochenaufträge", () => {
  it("wählt in derselben Woche dieselben drei Aufträge verschiedener Arten", () => {
    const d = leereDaten(JETZT);
    const montags = waehleAuftraege(lage(d, new Date(2026, 9, 26, 8)), ARTEN);
    const samstags = waehleAuftraege(lage(d), ARTEN);
    expect(samstags).toEqual(montags);
    expect(montags).toHaveLength(AUFTRAEGE_JE_WOCHE);
    expect(new Set(montags.map((a) => a.art)).size).toBe(AUFTRAEGE_JE_WOCHE);
  });

  it("nimmt die Saat aus dem Montag; eine andere Woche darf anders wählen", () => {
    expect(saatDerWoche(MONTAG)).toBe(20261026);
    const wochen = [0, 7, 14, 21, 28].map((tage) =>
      waehleAuftraege(lage(leereDaten(JETZT), new Date(2026, 9, 26 + tage, 9)), ARTEN)
        .map((a) => a.art)
        .join(","),
    );
    expect(new Set(wochen).size).toBeGreaterThan(1);
  });

  it("lässt Arten weg, die nicht passen", () => {
    const nie: Auftragsart = { ...art("nie", "sieg"), waehle: () => null };
    const liste = waehleAuftraege(lage(leereDaten(JETZT)), [nie, ...ARTEN]);
    expect(liste.map((a) => a.art)).not.toContain("nie");
  });

  it("behält die festgehaltene Liste der Woche und wählt in der nächsten neu", () => {
    const fest: Auftragsstand = {
      woche: MONTAG,
      liste: [{ art: "partien", anzahl: 2, wert: null }],
      getauscht: [],
    };
    expect(auftraegeDerWoche(fest, lage(leereDaten(JETZT)), ARTEN)).toBe(fest);
    const naechste = auftraegeDerWoche(fest, lage(leereDaten(JETZT), new Date(2026, 10, 2)), ARTEN);
    expect(naechste.woche).toBe("2026-11-02");
    expect(naechste.liste).toHaveLength(AUFTRAEGE_JE_WOCHE);
  });

  it("zählt den Fortschritt nur ab Montag dieser Woche", () => {
    let d = leereDaten(JETZT);
    d = zaehleAktivitaet(d, "partie", 1, new Date(2026, 9, 25, 20)); // Sonntag davor
    d = zaehleAktivitaet(d, "partie", 1, new Date(2026, 9, 27, 18));
    const stand: Auftragsstand = {
      woche: MONTAG,
      liste: [{ art: "partien", anzahl: 2, wert: null }],
      getauscht: [],
    };
    expect(auftragszeilen(stand, d, ARTEN)[0]).toMatchObject({ erreicht: 1, erledigt: false });
    d = zaehleAktivitaet(d, "partie", 2, new Date(2026, 9, 31, 9));
    expect(auftragszeilen(stand, d, ARTEN)[0]).toMatchObject({ erreicht: 2, erledigt: true });
  });

  it("tauscht je Stelle einmal gegen eine Art, die noch nicht in der Liste steht", () => {
    const d = leereDaten(JETZT);
    const stand = auftraegeDerWoche(null, lage(d), ARTEN);
    const neu = tauschauftrag(stand, 1, lage(d), ARTEN);
    expect(neu).not.toBeNull();
    expect(stand.liste.map((a) => a.art)).not.toContain(neu?.art);
    const getauscht = mitTausch(stand, 1, lage(d), ARTEN);
    expect(getauscht.liste[1]).toEqual(neu);
    expect(getauscht.getauscht).toEqual([1]);
    expect(tauschauftrag(getauscht, 1, lage(d), ARTEN)).toBeNull();
    expect(mitTausch(getauscht, 1, lage(d), ARTEN)).toBe(getauscht);
    expect(tauschauftrag(getauscht, 0, lage(d), ARTEN)).not.toBeNull();
  });

  it("tauscht keinen erledigten Auftrag", () => {
    const d = zaehleAktivitaet(leereDaten(JETZT), "partie", 2, JETZT);
    const stand: Auftragsstand = {
      woche: MONTAG,
      liste: [{ art: "partien", anzahl: 2, wert: null }],
      getauscht: [],
    };
    expect(tauschauftrag(stand, 0, lage(d), ARTEN)).toBeNull();
  });

  it("hält Erledigte in `verdient` fest, auch die der alten Woche beim Wechsel", () => {
    const alt: Auftragsstand = {
      woche: "2026-10-19",
      liste: [{ art: "partien", anzahl: 2, wert: null }],
      getauscht: [],
    };
    let d = zaehleAktivitaet(leereDaten(JETZT), "partie", 2, new Date(2026, 9, 21, 12));
    d = { ...d, wochen: { ...d.wochen, auftraege: alt } };
    const neu = auftraegeDerWoche(d.wochen.auftraege, lage(d), ARTEN);
    const gespeichert = mitAuftraegen(d, neu, JETZT, ARTEN);
    expect(gespeichert.wochen.auftraege).toBe(neu);
    expect(Object.keys(gespeichert.verdient)).toEqual(["auftrag:2026-10-19:0"]);
    expect(gespeichert.verdient["auftrag:2026-10-19:0"]?.startsWith("2026-10-25")).toBe(true);
    expect(erledigteAuftraege(gespeichert.verdient)).toBe(1);
    // Ein zweites Festhalten ändert nichts mehr.
    expect(mitAuftraegen(gespeichert, neu, JETZT, ARTEN)).toBe(gespeichert);
  });

  it("zählt den besten Monat für das Abzeichen", () => {
    const verdient: Record<string, string> = { "abzeichen:erstesMatt": "2026-10-01T10:00:00.000Z" };
    for (let i = 0; i < 5; i += 1) verdient[`auftrag:2026-10-0${i}:0`] = new Date(2026, 9, 5 + i).toISOString();
    for (let i = 0; i < 8; i += 1) verdient[`auftrag:2026-11-0${i}:0`] = new Date(2026, 10, 2 + i).toISOString();
    expect(besterMonat(verdient)).toBe(8);
    expect(besterMonat({})).toBe(0);
    expect(erledigteAuftraege(verdient)).toBe(13);
  });
});
