/**
 * Tests der reinen Rechnungen des Zielhinweises: Pfeil am Bildrand (zielmarker.ts) und das Feld,
 * auf dem eine Figur im Dialog erscheint (geistfigur.ts, R8).
 */
import { describe, expect, it } from "vitest";
import { erscheinungsfeld } from "./geistfigur";
import { randpunkt } from "./zielmarker";

describe("randpunkt", () => {
  it("setzt den Pfeil an den rechten Rand, wenn das Ziel weit rechts liegt", () => {
    const p = randpunkt(130, 201, { x: 500, y: 100.5 });
    expect(p.x).toBeCloseTo(120);
    expect(p.y).toBeCloseTo(100.5);
    expect(p.winkel).toBeCloseTo(0);
  });

  it("setzt ihn an den unteren Rand der freien Fläche, wenn das Ziel tief unten liegt", () => {
    const p = randpunkt(130, 201, { x: 65, y: 900 });
    expect(p.y).toBeCloseTo(191);
    expect(p.winkel).toBeCloseTo(Math.PI / 2);
  });
});

describe("erscheinungsfeld", () => {
  it("liegt zwei Felder in Blickrichtung (Dachboden: über dem Brett)", () => {
    // Held auf Feld 7,7 schaut nach oben auf das Brett (7,6): Ambrose erscheint auf 7,5.
    expect(erscheinungsfeld({ x: 120, y: 120 }, "oben", 16)).toEqual({ x: 120, y: 88 });
    expect(erscheinungsfeld({ x: 120, y: 120 }, "rechts", 16)).toEqual({ x: 152, y: 120 });
  });
});
