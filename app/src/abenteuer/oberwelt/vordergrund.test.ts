/** Tests der Ausschnitte für den Vordergrund von Sitz- und Liegemöbeln (vordergrund.ts). */
import { describe, expect, it } from "vitest";
import {
  bettausschnitt,
  moebelschluessel,
  sitzausschnitt,
  sitzunterkante,
  VORGABE_AB,
  VORGABE_KOPF,
  VORGABE_SEITE,
} from "./vordergrund";
import { umrissAusPixeln } from "./sitzumriss";

/** Sichtbarer Teil eines Stuhls von LimeZu im Rahmen 16 × 32. */
const STUHL = { x: 3, y: 1, breite: 12, hoehe: 21 };
/** Sichtbarer Teil eines Betts im Rahmen 32 × 32. */
const BETT = { x: 0, y: 4, breite: 32, hoehe: 20 };

/** Rahmen des nachgebauten Seitenstuhls (wie ein Schulstuhl von LimeZu, Blick nach rechts). */
const RAHMEN = { breite: 16, hoehe: 32 };
/** Zeilen des Seitenstuhls: Lehnenstange, Sitzblock, Querstrebe, Beine. */
const SEITE = { links: 3, rechts: 14, oben: 1, sitzOben: 11, sitzUnten: 13, strebe: 18, unten: 21 };

/** Malt ein Rechteck deckend in ein RGBA-Feld. */
function male(daten: Uint8ClampedArray, x0: number, x1: number, y0: number, y1: number): void {
  for (let y = y0; y <= y1; y += 1) {
    for (let x = x0; x <= x1; x += 1) daten[(y * RAHMEN.breite + x) * 4 + 3] = 255;
  }
}

/**
 * Seitenstuhl: Lehnenstange links von oben bis unten, rechts daneben die Sitzfläche als breiter
 * Block in der Mitte, darunter zwei Beine und eine Querstrebe (eine Zeile, zählt nicht als Sitz).
 */
function seitenstuhl(): Uint8ClampedArray {
  const daten = new Uint8ClampedArray(RAHMEN.breite * RAHMEN.hoehe * 4);
  male(daten, SEITE.links, SEITE.links + 1, SEITE.oben, SEITE.unten);
  male(daten, SEITE.links, SEITE.rechts, SEITE.sitzOben, SEITE.sitzUnten);
  male(daten, SEITE.rechts - 1, SEITE.rechts, SEITE.sitzUnten, SEITE.unten);
  male(daten, SEITE.links, SEITE.rechts, SEITE.strebe, SEITE.strebe);
  return daten;
}

describe("Vordergrund beim Sitzen", () => {
  it("von hinten: die Lehne ab dem Anteil ab bis unten, der Kopf ragt darüber", () => {
    const ab = Math.round(STUHL.y + STUHL.hoehe * (VORGABE_AB.stuhl ?? 0));
    expect(sitzausschnitt(STUHL, "stuhl", "oben")).toEqual({
      x: 3,
      y: ab,
      breite: 12,
      hoehe: 22 - ab,
    });
  });

  it("von der Seite: nur unter der Sitzfläche, Rumpf und Oberschenkel bleiben frei", () => {
    const daten = seitenstuhl();
    const sichtbar = umrissAusPixeln(daten, RAHMEN.breite, RAHMEN.hoehe);
    expect(sichtbar).toEqual(STUHL);
    const unterkante = sitzunterkante(daten, RAHMEN.breite, STUHL);
    expect(unterkante).toBe(SEITE.sitzUnten);
    for (const richtung of ["links", "rechts"] as const) {
      const ausschnitt = sitzausschnitt(STUHL, "stuhl", richtung, undefined, unterkante);
      // Höchstens die unterste Zeile der Sitzfläche als Kante, nichts darüber (Rumpf, Lehne).
      expect(ausschnitt?.y).toBe(SEITE.sitzUnten);
      expect((ausschnitt?.y ?? 0) + (ausschnitt?.hoehe ?? 0)).toBe(STUHL.y + STUHL.hoehe);
    }
  });

  it("von der Seite ohne messbare Sitzfläche: Vorgabe, im Katalog einstellbar", () => {
    const vorgabe = Math.round(STUHL.y + STUHL.hoehe * VORGABE_SEITE);
    expect(sitzausschnitt(STUHL, "stuhl", "links")?.y).toBe(vorgabe);
    expect(sitzausschnitt(STUHL, "stuhl", "rechts", { seite: 0.9 })?.y).toBe(
      Math.round(1 + 21 * 0.9),
    );
    expect(sitzunterkante(new Uint8ClampedArray(RAHMEN.breite * RAHMEN.hoehe * 4), 16, STUHL)).toBe(
      null,
    );
  });

  it("zum Betrachter: kein Vordergrund, die Füße baumeln vor dem Möbel", () => {
    expect(sitzausschnitt(STUHL, "stuhl", "unten")).toBeNull();
  });

  it("von Hand eingestellt: ab 0,8, und ab 1 heißt ohne Vordergrund", () => {
    expect(sitzausschnitt(STUHL, "hocker", "oben", { ab: 0.8 })?.y).toBe(Math.round(1 + 21 * 0.8));
    expect(sitzausschnitt(STUHL, "hocker", "oben", { ab: 1 })).toBeNull();
  });
});

describe("Decke beim Liegen", () => {
  it("lässt die Kopfseite frei und deckt den Rest", () => {
    const frei = Math.round(BETT.breite * VORGABE_KOPF);
    expect(bettausschnitt(BETT, "links")).toEqual({ x: frei, y: 4, breite: 32 - frei, hoehe: 20 });
    expect(bettausschnitt(BETT, "rechts")).toEqual({ x: 0, y: 4, breite: 32 - frei, hoehe: 20 });
  });

  it("ohne Decke, wenn die Kopfseite das ganze Bett ist", () => {
    expect(bettausschnitt(BETT, "links", { kopf: 1 })).toBeNull();
  });

  it("Schlüssel eines Möbels: Name und Lage", () => {
    expect(moebelschluessel("Stuhl", 85, 117)).toBe("Stuhl@85,117");
  });
});
