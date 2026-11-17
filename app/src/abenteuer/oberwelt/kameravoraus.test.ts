/** Tests für kameravoraus.ts: vorausschauende Kamera (Spieltest 17.11.2026, Befunde 5 und 6). */
import { describe, expect, it } from "vitest";
import {
  hoechsterVersatz,
  naehere,
  VORAUS_KACHELN,
  zielVersatz,
  type Versatz,
} from "./kameravoraus";

const K = 16;
/** Querformat 800 × 420 bei Zoom 3: sichtbar 267 × 140, Ränder wie kamera.ts. */
const QUER = { x: 267, y: 140 };
const QUER_RAENDER = { oben: 19, unten: 0, links: 61, rechts: 32 };
/** Hochformat 420 × 800 bei Zoom 3: sichtbar 140 × 267. */
const HOCH = { x: 140, y: 267 };
const HOCH_RAENDER = { oben: 19, unten: 80, links: 0, rechts: 0 };
const HELD: Versatz = { x: 400, y: 400 };

describe("hoechsterVersatz", () => {
  it("lässt den Helden zwei Kacheln vom Rand der freien Fläche", () => {
    expect(hoechsterVersatz(QUER, QUER_RAENDER, K)).toEqual({ x: 55, y: 28.5 });
    expect(hoechsterVersatz(HOCH, HOCH_RAENDER, K)).toEqual({ x: 38, y: 52 });
  });
});

describe("zielVersatz", () => {
  it("steht der Held, schaut die Kamera nicht voraus", () => {
    expect(zielVersatz(null, HELD, [], QUER, QUER_RAENDER, K)).toEqual({ x: 0, y: 0 });
  });

  it("schaut beim Laufen in Laufrichtung voraus, quer nach oben höchstens bis zur Grenze", () => {
    expect(zielVersatz("oben", HELD, [], QUER, QUER_RAENDER, K).y).toBe(-28.5);
    expect(zielVersatz("rechts", HELD, [], QUER, QUER_RAENDER, K)).toEqual({
      x: VORAUS_KACHELN * K,
      y: 0,
    });
    expect(zielVersatz("unten", HELD, [], HOCH, HOCH_RAENDER, K)).toEqual({
      x: 0,
      y: VORAUS_KACHELN * K,
    });
  });

  it("nimmt eine Tür voraus samt Gebäude ins Bild, höchstens bis zur Grenze", () => {
    const tuer = { x: 400, y: 400 - 2 * K };
    // Quer: gebraucht 35,5, Grenze 28,5 (Befund 6).
    expect(zielVersatz("oben", HELD, [tuer], QUER, QUER_RAENDER, K).y).toBe(-28.5);
    // Hoch nach unten zur Haustür, 4 Kacheln voraus (Befund 5): 64 + 56 − (84 − 8) = 44.
    const haustuer = { x: 400, y: 400 + 4 * K };
    expect(zielVersatz("unten", HELD, [haustuer], HOCH, HOCH_RAENDER, K).y).toBe(44);
  });

  it("übersieht Auslöser hinter dem Helden, weit weg oder seitlich daneben", () => {
    const ziele = [
      { x: 400, y: 400 + 2 * K },
      { x: 400, y: 400 - 10 * K },
      { x: 400 + 3 * K, y: 400 - 2 * K },
    ];
    expect(zielVersatz("oben", HELD, ziele, HOCH, HOCH_RAENDER, K).y).toBe(-VORAUS_KACHELN * K);
  });
});

describe("naehere", () => {
  it("folgt weich: beim Laufen schneller als beim Stehen, ohne zu überschießen", () => {
    const laufen = naehere({ x: 0, y: 0 }, { x: 32, y: 0 }, 350, true);
    const stehen = naehere({ x: 32, y: 0 }, { x: 0, y: 0 }, 350, false);
    expect(laufen.x).toBeCloseTo(32 * (1 - Math.exp(-1)), 5);
    expect(32 - stehen.x).toBeLessThan(laufen.x);
    expect(naehere({ x: 0, y: 0 }, { x: 32, y: 0 }, 100000, true).x).toBeCloseTo(32, 5);
  });

  it("ruckt beim Richtungswechsel nicht: ein Bild ändert den Versatz nur wenig", () => {
    const vorher = { x: 32, y: 0 };
    const danach = naehere(vorher, { x: -32, y: 0 }, 16, true);
    expect(Math.abs(danach.x - vorher.x)).toBeLessThan(3);
  });
});
