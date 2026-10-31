/**
 * Tests der Rekordtafel (Gamifizierung P5): nur echte Verbesserungen zählen, Datum und „verdient“,
 * Quellen der Rekordarten, Texte in beiden Sprachen, Übernahme der Merker.
 */
import { describe, expect, it } from "vitest";
import de from "../i18n/de.json";
import en from "../i18n/en.json";
import { leereDaten, type Nutzerdaten } from "../speicher/format";
import { mitMerkerRekorden, REKORD_TAKTIKZEIT } from "../speicher/rekordmerker";
import { REKORDARTEN } from "./rekordarten";
import { ALLE_QUELLEN, pruefeRekorde, rekordwert, type Rekordart } from "./rekorde";

const HEUTE = new Date("2026-10-31T10:00:00.000Z");
const MORGEN = new Date("2026-11-01T10:00:00.000Z");
const ZEITRUNDE: Rekordart = { kennung: "zeit", quellen: ["zeitrunde"], versuchen: null };
const AUS_DATEN: Rekordart = {
  kennung: "partien",
  quellen: ["partie"],
  ausDaten: (d) => d.spiel.partien.length + 3,
  versuchen: null,
};
const ARTEN = [ZEITRUNDE, AUS_DATEN];

function mitRekord(kennung: string, wert: number): Nutzerdaten {
  const leer = leereDaten(HEUTE);
  return { ...leer, rekorde: { [kennung]: { wert, datum: HEUTE.toISOString() } } };
}

describe("pruefeRekorde", () => {
  it("schreibt einen ersten Wert mit Datum und „verdient“", () => {
    const { daten, neue } = pruefeRekorde(
      leereDaten(HEUTE),
      { quelle: "zeitrunde", wert: 11 },
      HEUTE,
      ARTEN,
    );
    expect(neue).toEqual([{ kennung: "zeit", wert: 11, vorher: null }]);
    expect(daten.rekorde.zeit).toEqual({ wert: 11, datum: HEUTE.toISOString() });
    expect(daten.verdient["rekord:zeit"]).toBe(HEUTE.toISOString());
  });

  it("zählt nur echte Verbesserungen: gleich, kleiner und 0 sind kein Rekord", () => {
    const alt = mitRekord("zeit", 11);
    for (const wert of [11, 9]) {
      const ergebnis = pruefeRekorde(alt, { quelle: "zeitrunde", wert }, MORGEN, ARTEN);
      expect(ergebnis.daten).toBe(alt);
      expect(ergebnis.neue).toEqual([]);
    }
    const null0 = leereDaten(HEUTE);
    expect(pruefeRekorde(null0, { quelle: "zeitrunde", wert: 0 }, HEUTE, ARTEN).daten).toBe(null0);
  });

  it("Verbesserung: neuer Wert, neues Datum, vorher; das erste Verdient-Datum bleibt", () => {
    const alt = { ...mitRekord("zeit", 11), verdient: { "rekord:zeit": HEUTE.toISOString() } };
    const { daten, neue } = pruefeRekorde(alt, { quelle: "zeitrunde", wert: 14 }, MORGEN, ARTEN);
    expect(neue).toEqual([{ kennung: "zeit", wert: 14, vorher: 11 }]);
    expect(daten.rekorde.zeit).toEqual({ wert: 14, datum: MORGEN.toISOString() });
    expect(daten.verdient["rekord:zeit"]).toBe(HEUTE.toISOString());
  });

  it("prüft nur Arten der Quelle; „alle“ prüft nur Werte aus den Nutzerdaten", () => {
    const leer = leereDaten(HEUTE);
    expect(rekordwert(ZEITRUNDE, leer, { quelle: "partie", wert: 5 })).toBeNull();
    expect(rekordwert(AUS_DATEN, leer, { quelle: "zeitrunde", wert: 5 })).toBeNull();
    expect(rekordwert(AUS_DATEN, leer, { quelle: "partie" })).toBe(3);
    expect(rekordwert(ZEITRUNDE, leer, { quelle: ALLE_QUELLEN, wert: 5 })).toBeNull();
    const { neue } = pruefeRekorde(leer, { quelle: ALLE_QUELLEN }, HEUTE, ARTEN);
    expect(neue.map((v) => v.kennung)).toEqual(["partien"]);
  });
});

describe("REKORDARTEN", () => {
  it("eindeutige Kennungen, Name und Wert in beiden Sprachen, Platzhalter {wert}", () => {
    const kennungen = REKORDARTEN.map((a) => a.kennung);
    expect(new Set(kennungen).size).toBe(kennungen.length);
    for (const sprache of [de, en] as Record<string, string>[]) {
      for (const k of kennungen) {
        expect(sprache[`rekorde.art.${k}`], k).toBeTruthy();
        expect(sprache[`rekorde.wert.${k}`], k).toContain("{wert}");
      }
    }
  });

  it("leere Daten haben keinen Rekord, auch nicht beim Öffnen der Tafel", () => {
    const leer = leereDaten(HEUTE);
    const { daten, neue } = pruefeRekorde(leer, { quelle: ALLE_QUELLEN }, HEUTE, REKORDARTEN);
    expect(neue).toEqual([]);
    expect(daten).toBe(leer);
  });

  it("übernimmt den Merker der Zeitrunde und zählt danach nur Verbesserungen", () => {
    const geladen = mitMerkerRekorden(leereDaten(HEUTE), "11", null, HEUTE);
    expect(geladen.rekorde[REKORD_TAKTIKZEIT]?.wert).toBe(11);
    const gleich = pruefeRekorde(geladen, { quelle: "zeitrunde", wert: 11 }, MORGEN, REKORDARTEN);
    expect(gleich.neue).toEqual([]);
    const besser = pruefeRekorde(geladen, { quelle: "zeitrunde", wert: 14 }, MORGEN, REKORDARTEN);
    expect(besser.neue).toEqual([{ kennung: REKORD_TAKTIKZEIT, wert: 14, vorher: 11 }]);
  });
});
