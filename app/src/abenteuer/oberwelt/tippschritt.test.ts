/** Tests des Tippschritts (oberwelt/tippschritt.ts, Spieltest „einstieg“, R7). */
import { describe, expect, it } from "vitest";
import { kachelVon, tippschrittBeimLoslassen, zielErreicht } from "./tippschritt";

const KACHEL = 16;

describe("tippschrittBeimLoslassen", () => {
  it("läuft nach kurzem Antippen bis zur Mitte der Nachbarkachel", () => {
    // Held auf Kachel 4,5 (Mitte 72, 88), 80 ms „rechts“: ein paar Pixel weiter, noch auf 4,5.
    const schritt = tippschrittBeimLoslassen("rechts", "4,5", { x: 75, y: 88 }, KACHEL);
    expect(schritt).toEqual({ richtung: "rechts", ziel: { x: 88, y: 88 } });
  });

  it("geht auch nach oben und links genau ein Feld", () => {
    expect(tippschrittBeimLoslassen("oben", "4,5", { x: 72, y: 86 }, KACHEL)?.ziel).toEqual({
      x: 72,
      y: 72,
    });
    expect(tippschrittBeimLoslassen("links", "4,5", { x: 70, y: 88 }, KACHEL)?.ziel).toEqual({
      x: 56,
      y: 88,
    });
  });

  it("läuft nicht nach, wenn der Held seine Kachel schon verlassen hat", () => {
    expect(tippschrittBeimLoslassen("rechts", "4,5", { x: 81, y: 88 }, KACHEL)).toBeNull();
  });
});

describe("zielErreicht", () => {
  it("meldet das Ziel erst, wenn es erreicht oder überschritten ist", () => {
    const schritt = { richtung: "rechts" as const, ziel: { x: 88, y: 88 } };
    expect(zielErreicht(schritt, { x: 87, y: 88 })).toBe(false);
    expect(zielErreicht(schritt, { x: 88.4, y: 88 })).toBe(true);
    const hoch = { richtung: "oben" as const, ziel: { x: 72, y: 72 } };
    expect(zielErreicht(hoch, { x: 72, y: 73 })).toBe(false);
    expect(zielErreicht(hoch, { x: 72, y: 71.5 })).toBe(true);
  });
});

describe("kachelVon", () => {
  it("nennt die Kachel eines Punktes", () => {
    expect(kachelVon({ x: 72, y: 88 }, KACHEL)).toBe("4,5");
  });
});
