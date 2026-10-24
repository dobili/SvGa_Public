/**
 * Tests der Tourdaten: Jedes Ziel gibt es im Code, jeder Text steht in beiden Sprachen, jeder
 * Bildschirm mit Tour findet sie.
 *
 * Warum: Leitlinie des Autors zu R52: Ein Test meldet Schritte, deren Ziel es nicht gibt. Zur
 * Laufzeit überspringt die Tour solche Schritte; ohne diesen Test fiele ein Tippfehler in der
 * Kennung also nie auf. Gesucht wird im Quelltext nach `data-tour="…"`, nach der Eigenschaft
 * `tour="…"` (Nachschlagen) und nach `tour: "…"` in Tabellen (Leiste, Reiter der Einstellungen).
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import de from "../i18n/de.json";
import en from "../i18n/en.json";
import { TRAINER } from "../training/trainer";
import { TOUREN, tourFuerAnsicht, type TourKennung } from "./touren";

const QUELLEN = join(import.meta.dirname, "..");
const MUSTER = [/data-tour="([^"]+)"/g, /\btour="([^"]+)"/g, /\btour: "([^"]+)"/g];

/** Alle Quelldateien der App außer Tests und den Tourdaten selbst. */
function quelldateien(ordner: string): string[] {
  return readdirSync(ordner, { withFileTypes: true }).flatMap((eintrag) => {
    const pfad = join(ordner, eintrag.name);
    if (eintrag.isDirectory()) return quelldateien(pfad);
    const quelle = /\.tsx?$/.test(eintrag.name) && !/\.test\.tsx?$/.test(eintrag.name);
    return quelle && eintrag.name !== "touren.ts" ? [pfad] : [];
  });
}

/** Alle Ziel-Kennungen, die im Code an Elementen stehen. */
function zieleImCode(): Set<string> {
  const ziele = new Set<string>();
  for (const datei of quelldateien(QUELLEN)) {
    const text = readFileSync(datei, "utf8");
    for (const muster of MUSTER) {
      for (const treffer of text.matchAll(muster)) ziele.add(treffer[1] ?? "");
    }
  }
  return ziele;
}

const ALLE = Object.entries(TOUREN) as [TourKennung, (typeof TOUREN)[TourKennung]][];

describe("Touren", () => {
  it("haben nur Ziele, die es im Code gibt", () => {
    const vorhanden = zieleImCode();
    const fehlend = ALLE.flatMap(([kennung, tour]) =>
      tour.schritte.flatMap((s) =>
        s.ziel && !vorhanden.has(s.ziel) ? [`${kennung}: ${s.ziel}`] : [],
      ),
    );
    expect(fehlend).toEqual([]);
  });

  it("haben jeden Text und Titel auf Deutsch und Englisch", () => {
    const deutsch: Readonly<Record<string, string>> = de;
    const englisch: Readonly<Record<string, string>> = en;
    const schluessel = ALLE.flatMap(([, tour]) => [
      tour.titel,
      ...tour.schritte.map((s) => s.text),
    ]);
    expect(schluessel.filter((k) => !deutsch[k] || !englisch[k])).toEqual([]);
  });

  it("hat für jeden Trainer eine Tour mit mindestens zwei Schritten", () => {
    for (const trainer of TRAINER) {
      const tour = TOUREN[`trainer.${trainer.kennung}`];
      expect(tour.schritte.length, trainer.kennung).toBeGreaterThanOrEqual(2);
    }
  });

  it("findet zu jedem Bildschirm die passende Tour, seit Teil B auch für Spielen und Partie", () => {
    expect(tourFuerAnsicht({ bildschirm: "abbildung", nummer: "1.26" })).toBe("abbildung");
    expect(tourFuerAnsicht({ bildschirm: "trainer", kennung: "taktik" })).toBe("trainer.taktik");
    expect(tourFuerAnsicht({ bildschirm: "ich" })).toBe("ich");
    expect(tourFuerAnsicht({ bildschirm: "spielen" })).toBe("spielen");
    expect(tourFuerAnsicht({ bildschirm: "partie", id: "p-1" })).toBe("partie");
    expect(tourFuerAnsicht({ bildschirm: "lizenzen" })).toBeNull();
  });

  it("beginnt die Haupttour mit der Begrüßung und zeigt alle fünf Bereiche der Leiste", () => {
    const ziele = TOUREN.haupt.schritte.map((s) => s.ziel);
    expect(ziele[0]).toBeNull();
    for (const bereich of ["buch", "training", "spielen", "nachschlagen", "einstellungen"]) {
      expect(ziele).toContain(`leiste-${bereich}`);
    }
  });
});
