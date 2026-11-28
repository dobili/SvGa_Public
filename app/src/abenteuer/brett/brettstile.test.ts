/**
 * Tests der Brettstile: Lesbarkeit jeder Markierung und jeder Figur auf beiden Feldfarben.
 *
 * Regel: docs/spiel/30_Bedienung_und_Brettstile.md, Abschnitt 5 „Lesbarkeit“ – Markierungen
 * bekommen je Stil eine Farbe mit genug Abstand; Weiß und Schwarz klar unterscheidbar.
 */
import { describe, expect, it } from "vitest";
import { BRETTSTILE, figurfarben, STILTABELLE } from "./brettstile";
import { KACHEL_FELDER, STRUKTURPIXEL_JE_FELD, strukturpixel } from "./feldstruktur";
import { kontrast, markeSichtbar, MINDESTKONTRAST } from "./kontrast";

/** Kantenlänge einer Strukturkachel in Strukturpixeln. */
const KACHELPIXEL = STRUKTURPIXEL_JE_FELD * KACHEL_FELDER;

/** Weiße und schwarze Körper sollen sich so deutlich abheben wie Text (WCAG 1.4.3). */
const KOERPERABSTAND = 4.5;
/**
 * Eine helle Kante schwarzer Figuren bleibt deutlich dunkler als der weiße Körper: Mit fast
 * weißer Kante sahen die schwarzen Figuren auf Schiefer aus wie weiße (Übersicht, 14.11.2026).
 */
const KANTENABSTAND = 2;
/** Schiefer: Schwarz war dem Autor zu schwach; der Körper allein soll 3,5:1 erreichen. */
/**
 * Helle und dunkle Felder bleiben klar zu unterscheiden. Der knappste Stil ist Glas (1,79:1, kühles
 * Weiß und Cyan); kein neuer Stil darf darunter liegen.
 */
const FELDABSTAND = 1.75;
const KOERPERABSTAND_SCHIEFER = 3.5;

describe("Brettstile", () => {
  it("hat die zwanzig Stile der Tabelle", () => {
    expect(BRETTSTILE).toHaveLength(20);
    expect(Object.keys(STILTABELLE).sort()).toEqual([...BRETTSTILE].sort());
  });

  for (const kennung of BRETTSTILE) {
    const stil = STILTABELLE[kennung];
    const felder = [stil.hell, stil.dunkel];

    it(`${kennung}: helle und dunkle Felder sind klar zu unterscheiden`, () => {
      expect(kontrast(stil.hell, stil.dunkel)).toBeGreaterThanOrEqual(FELDABSTAND);
    });

    it(`${kennung}: jede Markierung ist auf beiden Feldfarben sichtbar`, () => {
      for (const [farbe, flaeche] of Object.entries(stil.marken)) {
        for (const feld of felder) {
          expect(markeSichtbar(flaeche, stil.kontur, feld), `${farbe} auf ${feld}`).toBe(true);
        }
      }
    });

    it(`${kennung}: der letzte Zug ist auf beiden Feldfarben sichtbar`, () => {
      for (const feld of felder) {
        expect(markeSichtbar(stil.zug.farbe, stil.zug.kante, feld), feld).toBe(true);
      }
    });

    it(`${kennung}: Weiß und Schwarz sind klar zu unterscheiden und auf jedem Feld zu sehen`, () => {
      const weiss = figurfarben(kennung, true);
      const schwarz = figurfarben(kennung, false);
      expect(kontrast(weiss.koerper, schwarz.koerper)).toBeGreaterThanOrEqual(KOERPERABSTAND);
      expect(kontrast(weiss.koerper, schwarz.umriss)).toBeGreaterThanOrEqual(KANTENABSTAND);
      for (const seite of [weiss, schwarz]) {
        for (const feld of felder) {
          const sichtbar = Math.max(kontrast(seite.koerper, feld), kontrast(seite.umriss, feld));
          expect(sichtbar, `${seite.koerper} auf ${feld}`).toBeGreaterThanOrEqual(MINDESTKONTRAST);
        }
      }
    });
  }
});

describe("Schiefer (Rückmeldung des Autors, 14.11.2026)", () => {
  it("die schwarzen Körper heben sich allein schon deutlich von beiden Feldern ab", () => {
    const stil = STILTABELLE.schiefer;
    const schwarz = figurfarben("schiefer", false);
    for (const feld of [stil.hell, stil.dunkel]) {
      expect(kontrast(schwarz.koerper, feld), feld).toBeGreaterThanOrEqual(KOERPERABSTAND_SCHIEFER);
    }
  });
});

describe("Neue Stile der Leitidee (28.11.2026)", () => {
  it("haben eine eigene Struktur, die etwas zeichnet und in der Kachel bleibt", () => {
    for (const kennung of ["kreidetafel", "sternenhimmel", "rotholz", "zypresse"] as const) {
      const pixel = strukturpixel(kennung, STILTABELLE[kennung].struktur);
      expect(pixel.length, kennung).toBeGreaterThan(0);
      for (const p of pixel) {
        expect(p.x, kennung).toBeGreaterThanOrEqual(0);
        expect(p.y, kennung).toBeGreaterThanOrEqual(0);
        expect(p.x + p.breite, kennung).toBeLessThanOrEqual(KACHELPIXEL);
        expect(p.y, kennung).toBeLessThan(KACHELPIXEL);
      }
    }
  });

  it("geben dunklen Feldern eine Kante oder einen dunklen Körper für Schwarz", () => {
    for (const kennung of ["kreidetafel", "sternenhimmel", "grubenlampe"] as const) {
      const schwarz = figurfarben(kennung, false);
      expect(kontrast(schwarz.umriss, STILTABELLE[kennung].dunkel), kennung).toBeGreaterThanOrEqual(
        MINDESTKONTRAST,
      );
    }
  });
});

describe("Kontrast", () => {
  it("rechnet wie WCAG: Schwarz gegen Weiß 21:1, gleiche Farben 1:1", () => {
    expect(kontrast("#000000", "#FFFFFF")).toBeCloseTo(21, 5);
    expect(kontrast("#abc", "#AABBCC")).toBeCloseTo(1, 5);
  });

  it("wirft bei einer Farbe, die keine Hex-Farbe ist", () => {
    expect(() => kontrast("rot", "#FFFFFF")).toThrow();
  });
});
