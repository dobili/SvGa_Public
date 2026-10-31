/**
 * Tests der Karte „Deine Rekorde“ (Profil neu, Entwurf R1): Einteilung in aufgestellte Rekorde,
 * zwei Vorschläge und weitere; „Höchste Wertung“ erst ab zehn Partien; ein Satz je Rekordart.
 */
import { describe, expect, it } from "vitest";
import de from "../../../i18n/de.json";
import en from "../../../i18n/en.json";
import { leereDaten, type Nutzerdaten } from "../../../speicher/format";
import type { Wertungspunkt } from "../../../spiel/wertung";
import { REKORDARTEN } from "../../../training/rekordarten";
import { partienBisWertung, rekordstand, VORSCHLAEGE } from "./rekordvorschlaege";

const HEUTE = new Date("2026-10-31T10:00:00.000Z");

/** Daten mit gewerteten Schnellschach-Partien. Beispiel: mitPartien(3). */
function mitPartien(anzahl: number): Nutzerdaten {
  const leer = leereDaten(HEUTE);
  const punkte: Wertungspunkt[] = Array.from({ length: anzahl }, (_, i) => ({
    partieId: `p${i}`,
    zeit: HEUTE.toISOString(),
    gegner: 1500,
    ergebnis: 1,
    wertung: 1500 + i,
    phasen: { eroeffnung: null, mittelspiel: null, endspiel: null },
    tempo: "rapid",
  }));
  return { ...leer, spiel: { ...leer.spiel, wertung: punkte } };
}

describe("Karte „Deine Rekorde“", () => {
  it("schlägt beim frischen Start zwei Rekorde vor, die übrigen zum Aufklappen", () => {
    const stand = rekordstand(leereDaten(HEUTE), REKORDARTEN);
    expect(stand.aufgestellt).toEqual([]);
    expect(stand.vorschlaege).toHaveLength(VORSCHLAEGE);
    expect(stand.vorschlaege.every((a) => a.versuchen !== null)).toBe(true);
    expect(stand.vorschlaege.length + stand.weitere.length).toBe(REKORDARTEN.length);
  });

  it("zeigt aufgestellte Rekorde groß und schlägt die nächsten vor", () => {
    const leer = leereDaten(HEUTE);
    const erste = REKORDARTEN[0]?.kennung ?? "";
    const daten = { ...leer, rekorde: { [erste]: { wert: 7, datum: HEUTE.toISOString() } } };
    const stand = rekordstand(daten, REKORDARTEN);
    expect(stand.aufgestellt.map((a) => a.kennung)).toEqual([erste]);
    expect(stand.vorschlaege.map((a) => a.kennung)).not.toContain(erste);
  });

  it("schlägt „Höchste Wertung“ erst ab zehn Partien vor und zählt die fehlenden", () => {
    expect(partienBisWertung(leereDaten(HEUTE))).toBe(10);
    expect(partienBisWertung(mitPartien(3))).toBe(7);
    expect(partienBisWertung(mitPartien(12))).toBe(0);
    const wenige = REKORDARTEN.filter((a) => a.kennung !== "wertung").map((a) => a.kennung);
    const daten = mitPartien(3);
    const alleAusser = {
      ...daten,
      rekorde: Object.fromEntries(wenige.map((k) => [k, { wert: 1, datum: HEUTE.toISOString() }])),
    };
    expect(rekordstand(alleAusser, REKORDARTEN).vorschlaege).toEqual([]);
    expect(rekordstand(alleAusser, REKORDARTEN).weitere.map((a) => a.kennung)).toEqual(["wertung"]);
  });

  it("hat zu jeder Rekordart einen Satz in beiden Sprachen", () => {
    for (const art of REKORDARTEN) {
      const schluessel = `profil.rekorde.vorschlag.${art.kennung}`;
      expect(de, schluessel).toHaveProperty([schluessel]);
      expect(en, schluessel).toHaveProperty([schluessel]);
    }
  });
});
