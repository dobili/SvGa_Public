/**
 * Tests der gemessenen Bereiche (FIDE und chess.com aus echten Spielerpaaren): Tabelle steigt,
 * Ränder liegen um die Mitte, Zwischenrechnung, Grenzen und null außerhalb.
 */
import { describe, expect, it } from "vitest";
import {
  gemessenerBereich,
  gemessenerVergleichsbereich,
  istGemessen,
  type GemesseneListe,
} from "./plattformvergleich";
import { GEMESSEN } from "./plattformvergleich-daten";

const LISTEN: readonly GemesseneListe[] = ["fide", "chesscom"];
const ZEITKLASSEN = ["blitz", "rapid", "classical"] as const;

describe("Gemessene Bereiche", () => {
  it("hat für FIDE alle drei Zeitklassen und für chess.com Blitz und Schnellschach", () => {
    for (const tempo of ZEITKLASSEN) expect(istGemessen(tempo, "fide")).toBe(true);
    expect(istGemessen("blitz", "chesscom")).toBe(true);
    expect(istGemessen("rapid", "chesscom")).toBe(true);
  });

  it("steigt in jeder Spalte, von ≤ Mitte ≤ bis, mindestens 25 Spieler je Band", () => {
    for (const liste of LISTEN) {
      for (const tempo of ZEITKLASSEN) {
        const baender = GEMESSEN[liste][tempo];
        baender.forEach(([x, von, mitte, bis, anzahl], i) => {
          expect(von).toBeLessThanOrEqual(mitte);
          expect(mitte).toBeLessThanOrEqual(bis);
          expect(anzahl).toBeGreaterThanOrEqual(25);
          const vorher = baender[i - 1];
          if (vorher) {
            expect(x).toBeGreaterThan(vorher[0]);
            for (const stelle of [1, 2, 3] as const) {
              expect(baender[i]?.[stelle] ?? 0).toBeGreaterThanOrEqual(vorher[stelle]);
            }
          }
        });
      }
    }
  });

  it("rechnet zwischen zwei Bändern linear und rundet auf 10", () => {
    const baender = GEMESSEN.fide.blitz;
    const links = baender[10];
    const rechts = baender[11];
    expect(links && rechts).toBeTruthy();
    if (!links || !rechts) return;
    const mitte = (links[0] + rechts[0]) / 2;
    const b = gemessenerBereich("blitz", mitte, "fide");
    expect(b?.mitte).toBe(Math.round((links[2] + rechts[2]) / 2 / 10) * 10);
    expect((b?.von ?? 1) % 10).toBe(0);
    expect(gemessenerBereich("blitz", links[0], "fide")?.mitte).toBe(
      Math.round(links[2] / 10) * 10,
    );
  });

  it("nennt die Grenzen der Messung, außerhalb null", () => {
    const bereich = gemessenerVergleichsbereich("classical", "fide");
    expect(bereich).not.toBeNull();
    if (!bereich) return;
    expect(gemessenerBereich("classical", bereich.von, "fide")).not.toBeNull();
    expect(gemessenerBereich("classical", bereich.bis, "fide")).not.toBeNull();
    expect(gemessenerBereich("classical", bereich.von - 1, "fide")).toBeNull();
    expect(gemessenerBereich("classical", bereich.bis + 1, "fide")).toBeNull();
  });

  it("ist bei FIDE Blitz in der Mitte der Tabelle etwa ±80 bis ±150 breit", () => {
    // Gemessen 26.10.2026: halbe Breite 80 bis 145 bei 50 bis 190 Spielern je Band.
    for (const wert of [1600, 1900, 2200]) {
      const b = gemessenerBereich("blitz", wert, "fide");
      const halb = b ? (b.bis - b.von) / 2 : 0;
      expect(halb).toBeGreaterThanOrEqual(60);
      expect(halb).toBeLessThanOrEqual(170);
    }
  });
});
