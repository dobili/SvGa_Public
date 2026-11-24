/**
 * Tests zur Liegelage im Bett (liegelage.ts): Kopf ans Kopfende, aufs Kissen.
 */
import { describe, expect, it } from "vitest";
import { kopfabstand, liegemitte } from "./liegelage";

const RAHMEN = { breite: 32, hoehe: 32 };

describe("kopfabstand", () => {
  it("gekippt: vom oberen Rand des Standbilds (Oma Ruth ohne Liegebild)", () => {
    const sichtbar = { x: 8, y: 2, breite: 16, hoehe: 29 };
    expect(kopfabstand(sichtbar, RAHMEN, 0.7, "links", true)).toBeCloseTo(9.8);
  });
  it("Liegebild: vom Rand der Kopfseite", () => {
    const sichtbar = { x: 3, y: 10, breite: 26, hoehe: 12 };
    expect(kopfabstand(sichtbar, RAHMEN, 1, "links", false)).toBe(13);
    expect(kopfabstand(sichtbar, RAHMEN, 1, "rechts", false)).toBe(13);
    expect(kopfabstand({ ...sichtbar, x: 1 }, RAHMEN, 1, "rechts", false)).toBe(11);
  });
});

describe("liegemitte", () => {
  it("Kopf links: zwei Pixel vom linken Rand des Betts", () => {
    expect(liegemitte({ links: 128, rechts: 168 }, "links", 9.8)).toBeCloseTo(139.8);
  });
  it("Kopf rechts: zwei Pixel vom rechten Rand", () => {
    expect(liegemitte({ links: 192, rechts: 240 }, "rechts", 10)).toBe(228);
  });
});
