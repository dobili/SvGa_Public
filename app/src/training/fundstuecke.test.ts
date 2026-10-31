/**
 * Tests der Fundstücke (Gamifizierung P10 b): höchstens eins am Tag, keine Doppel, das erste
 * sicher in der dritten Runde, sonst selten; Katalog und Texte in Deutsch und Englisch vollständig.
 */
import { describe, expect, it } from "vitest";
import de from "../i18n/de.json";
import en from "../i18n/en.json";
import { leereDaten, type Nutzerdaten } from "../speicher/format";
import {
  CHANCE_JE_RUNDE,
  findeFundstueck,
  FUNDSTUECKARTEN,
  FUNDSTUECKE,
  heuteGefunden,
  offeneFundstuecke,
  sollFinden,
} from "./fundstuecke";

const TAG = (n: number, stunde = 12) => new Date(2026, 9, n, stunde);
const RUNDE = { richtig: 4 };
/** Zufall, der immer findet und das erste offene wählt. */
const FINDET = () => 0;
/** Zufall, der nie findet. */
const NIE = () => 0.99;

/** Daten mit so vielen fertigen Runden im Tagesprotokoll. */
function mitRunden(runden: number): Nutzerdaten {
  return { ...leereDaten(TAG(1)), aktivitaet: { "2026-09-30": { trainerRunde: runden } } };
}

describe("Fundstücke", () => {
  it("legt ein Fundstück ins Album, mit Datum, und höchstens eins am Tag", () => {
    const erst = findeFundstueck(mitRunden(0), RUNDE, TAG(1, 9), FINDET);
    expect(erst.kennung).toBe(FUNDSTUECKE[0]?.kennung);
    expect(erst.daten.fundstuecke).toEqual([erst.kennung]);
    expect(heuteGefunden(erst.daten.verdient, TAG(1, 23))).toBe(true);
    const zweit = findeFundstueck(erst.daten, RUNDE, TAG(1, 18), FINDET);
    expect(zweit.kennung).toBeNull();
    expect(zweit.daten).toBe(erst.daten);
    const morgen = findeFundstueck(erst.daten, RUNDE, TAG(2, 9), FINDET);
    expect(morgen.kennung).not.toBe(erst.kennung);
    expect(new Set(morgen.daten.fundstuecke).size).toBe(2);
  });

  it("findet nie ein Fundstück doppelt und hört auf, wenn alle gefunden sind", () => {
    const liste = FUNDSTUECKE.slice(0, 3);
    let daten = mitRunden(0);
    // Abwechselnd: Fund ja (0), dann das letzte offene wählen (0.99).
    let zug = 0;
    const zufall = () => (zug++ % 2 === 0 ? 0 : 0.99);
    for (let tag = 1; tag <= 5; tag += 1)
      daten = findeFundstueck(daten, RUNDE, TAG(tag), zufall, liste).daten;
    expect(daten.fundstuecke).toHaveLength(3);
    expect(new Set(daten.fundstuecke).size).toBe(3);
    expect(offeneFundstuecke(daten.fundstuecke, liste)).toEqual([]);
  });

  it("schenkt das erste sicher in der dritten Runde, danach nur mit Glück", () => {
    expect(sollFinden(mitRunden(1), RUNDE, TAG(3), NIE())).toBe(false);
    expect(sollFinden(mitRunden(2), RUNDE, TAG(3), NIE())).toBe(true);
    const nachErstem = findeFundstueck(mitRunden(2), RUNDE, TAG(3), NIE).daten;
    expect(sollFinden(nachErstem, RUNDE, TAG(4), NIE())).toBe(false);
    expect(sollFinden(nachErstem, RUNDE, TAG(4), CHANCE_JE_RUNDE / 2)).toBe(true);
  });

  it("gibt nichts für eine Runde ohne richtige Antwort", () => {
    expect(findeFundstueck(mitRunden(5), { richtig: 0 }, TAG(3), FINDET).kennung).toBeNull();
  });

  it("hat 60 bis 100 Fundstücke mit eindeutigen Kennungen, Merksätze mit Kapitel", () => {
    expect(FUNDSTUECKE.length).toBeGreaterThanOrEqual(60);
    expect(FUNDSTUECKE.length).toBeLessThanOrEqual(100);
    expect(new Set(FUNDSTUECKE.map((f) => f.kennung)).size).toBe(FUNDSTUECKE.length);
    for (const f of FUNDSTUECKE.filter((g) => g.art === "merksatz"))
      expect(f.kapitel, f.kennung).not.toBeNull();
  });

  it("hat zu jedem Fundstück und jeder Art Texte in Deutsch und Englisch, ohne übrige", () => {
    const texte: readonly Readonly<Record<string, string>>[] = [de, en];
    const kennungen = FUNDSTUECKE.map((f) => `fundstueck.text.${f.kennung}`).sort();
    for (const sprache of texte) {
      const vorhanden = Object.keys(sprache).filter((k) => k.startsWith("fundstueck.text."));
      expect(vorhanden.sort()).toEqual(kennungen);
      for (const art of FUNDSTUECKARTEN) expect(sprache[`fundstueck.art.${art}`]).toBeTruthy();
    }
  });
});
