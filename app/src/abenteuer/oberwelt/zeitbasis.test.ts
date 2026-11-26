/**
 * Tests: Zeitbasis der Oberwelt (zeitbasis.ts; Befund des Autors 26.11.2026, Zeitlupe nach dem
 * Kartenwechsel). Gerechnet wird mit Phasers echtem Takt (TimeStep aus dem Paket): Nach dem Start
 * eines Spiels dauern die ersten Bilder 40 ms; die Welt soll die echte Zeit bekommen, nicht ein
 * Sechzigstel Sekunde je Bild.
 */
import { createRequire } from "node:module";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { ZEITBASIS } from "./zeitbasis";

/** Die Teile von Phasers TimeStep, die der Test benutzt. */
interface Takt {
  deltaHistory: number[];
  deltaSmoothingMax: number;
  callback: (zeit: number, delta: number) => void;
  resetDelta(): void;
  step(zeit: number): void;
}
type TaktKlasse = new (spiel: object, einstellung: object) => Takt;

const laden = createRequire(import.meta.url);
/** Quelle von Phasers Takt; das Paket gibt sie nicht frei, darum über den Ordner des Pakets. */
const TAKTQUELLE = join(laden.resolve("phaser"), "..", "..", "src", "core", "TimeStep.js");
/** Bildzeit eines langsamen Handys beim Aufbau der Karte (25 Bilder je Sekunde). */
const LANGES_BILD_MS = 40;
/** So viele Bilder nach dem Start (Phasers Anlaufbegrenzung gilt für 120). */
const BILDER = 75;
const fenster = globalThis as { window?: unknown };

beforeAll(() => {
  // TimeStep liest window.performance; in Node gibt es performance am globalen Objekt.
  fenster.window = globalThis;
});
afterAll(() => {
  delete fenster.window;
});

/** Summe der Zeit, die Phaser der Welt in den ersten BILDER Bildern gibt. */
function weltzeit(einstellung: object): number {
  const TimeStep = laden(TAKTQUELLE) as TaktKlasse;
  const takt = new TimeStep({}, einstellung);
  // Wie TimeStep.start, ohne den Bildtakt des Browsers zu starten.
  takt.deltaHistory = new Array<number>(takt.deltaSmoothingMax).fill(1000 / 60);
  takt.resetDelta();
  let summe = 0;
  takt.callback = (_zeit, delta) => {
    summe += delta;
  };
  const anfang = performance.now();
  for (let i = 1; i <= BILDER; i++) takt.step(anfang + i * LANGES_BILD_MS);
  return summe;
}

describe("Zeitbasis nach dem Start eines Phaser-Spiels", () => {
  it("Phasers Vorgabe gibt der Welt nur ein Sechzigstel Sekunde je Bild (Zeitlupe)", () => {
    const echt = BILDER * LANGES_BILD_MS;
    expect(weltzeit({})).toBeLessThan(echt * 0.5);
  });

  it("mit der Zeitbasis der Oberwelt läuft die Welt in echter Zeit", () => {
    const echt = BILDER * LANGES_BILD_MS;
    // Die Glättung über zehn Bilder holt die ersten Bilder verzögert nach: bis auf zehn Bilder.
    expect(weltzeit(ZEITBASIS)).toBeGreaterThan(echt - 10 * LANGES_BILD_MS);
    expect(weltzeit(ZEITBASIS)).toBeLessThanOrEqual(echt + 1);
  });
});
