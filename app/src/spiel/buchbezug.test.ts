/** Tests der Tabelle „Fehler mit Buchbezug“: vollständig, Trainer spielbar, Themen öffnen den Trainer. */
import { describe, expect, it } from "vitest";
import { t } from "../i18n/sprache";
import { TRAINER } from "../training/trainer";
import { trainerZumThema } from "../training/themennamen";
import {
  BUCHBEZUG,
  FINDE_REIHENFOLGE,
  istWarumkennung,
  WARUM_REIHENFOLGE,
  type Buchkennung,
} from "./buchbezug";

const KENNUNGEN = Object.keys(BUCHBEZUG) as Buchkennung[];
const ANZAHL = 20;
const JE_RICHTUNG = 10;

describe("Tabelle Buchbezug", () => {
  it("hat zwanzig Kategorien, je mit Kennung, Anzeige, Fundstelle und spielbarem Trainer", () => {
    expect(KENNUNGEN).toHaveLength(ANZAHL);
    for (const kennung of KENNUNGEN) {
      const b = BUCHBEZUG[kennung];
      expect(b.kennung).toBe(kennung);
      expect(t(b.anzeige)).not.toBe(b.anzeige);
      expect(t(b.quelle)).toMatch(/^Kapitel/);
      expect(b.kapitel.length).toBeGreaterThan(0);
      expect(TRAINER.find((tr) => tr.kennung === b.trainer)?.fertig).toBe(true);
    }
  });

  it("ein Thema gehört immer zum Trainer der Kategorie", () => {
    for (const b of Object.values(BUCHBEZUG)) {
      if (b.thema !== null) expect(trainerZumThema(b.thema)).toBe(b.trainer);
    }
  });

  it("die Reihenfolge nennt jede Kategorie ihrer Richtung (Konzept 4.1)", () => {
    expect(new Set(WARUM_REIHENFOLGE).size).toBe(JE_RICHTUNG);
    expect(WARUM_REIHENFOLGE.every(istWarumkennung)).toBe(true);
    expect(FINDE_REIHENFOLGE).toHaveLength(JE_RICHTUNG);
    expect(FINDE_REIHENFOLGE.some(istWarumkennung)).toBe(false);
    // Genaues vor Faustregel: Matt und Drohung vorn, Todsünde und Bauernzug hinten.
    expect(WARUM_REIHENFOLGE.indexOf("W2")).toBeLessThan(WARUM_REIHENFOLGE.indexOf("W8"));
    expect(WARUM_REIHENFOLGE.indexOf("W7")).toBeLessThan(WARUM_REIHENFOLGE.indexOf("W9"));
  });

  it("Beispiel W3: Drohung stehen gelassen, Kapitel 1, Schach-Röntgen-Trainer", () => {
    expect(t(BUCHBEZUG.W3.anzeige)).toBe("Drohung stehen gelassen");
    expect(BUCHBEZUG.W3.kapitel[0]).toBe(1);
    expect(BUCHBEZUG.W3.trainer).toBe("roentgen");
    expect(BUCHBEZUG.F6.thema).toBe("endspiel:opposition");
  });
});
