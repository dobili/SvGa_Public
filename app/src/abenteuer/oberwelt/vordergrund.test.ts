/** Tests der Ausschnitte für den Vordergrund von Sitz- und Liegemöbeln (vordergrund.ts). */
import { describe, expect, it } from "vitest";
import {
  bettausschnitt,
  moebelschluessel,
  sitzausschnitt,
  VORGABE_AB,
  VORGABE_KOPF,
} from "./vordergrund";

/** Sichtbarer Teil eines Stuhls von LimeZu im Rahmen 16 × 32. */
const STUHL = { x: 3, y: 1, breite: 12, hoehe: 21 };
/** Sichtbarer Teil eines Betts im Rahmen 32 × 32. */
const BETT = { x: 0, y: 4, breite: 32, hoehe: 20 };

describe("Vordergrund beim Sitzen", () => {
  it("von hinten und von der Seite: ab der Sitzflächen-Vorderkante bis unten", () => {
    const ab = Math.round(STUHL.y + STUHL.hoehe * (VORGABE_AB.stuhl ?? 0));
    expect(sitzausschnitt(STUHL, "stuhl", "oben")).toEqual({
      x: 3,
      y: ab,
      breite: 12,
      hoehe: 22 - ab,
    });
    expect(sitzausschnitt(STUHL, "stuhl", "links")?.y).toBe(ab);
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
