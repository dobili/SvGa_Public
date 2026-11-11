/**
 * Tests der Testhilfe des Autors (testende.ts): Sieg, Remis und Niederlage aus Sicht des Lesers.
 */
import { describe, expect, it } from "vitest";
import type { Partie } from "../../spiel/partie";
import { ausgangAus } from "./partieergebnis";
import { mitTestende, testantworten } from "./testende";

/** Eine laufende Partie ohne Uhr, der Leser spielt die angegebene Farbe. */
function partie(eigeneFarbe: "white" | "black"): Partie {
  return { einstellung: { eigeneFarbe }, zuege: [], uhr: null, ende: null } as unknown as Partie;
}

describe("mitTestende", () => {
  it("beendet mit dem gewünschten Ausgang aus Sicht des Lesers, auch mit Schwarz", () => {
    for (const farbe of ["white", "black"] as const) {
      for (const ausgang of ["sieg", "remis", "niederlage"] as const) {
        expect(ausgangAus(mitTestende(partie(farbe), ausgang, 0))).toBe(ausgang);
      }
    }
  });

  it("lässt eine beendete Partie unverändert", () => {
    const beendet = mitTestende(partie("white"), "niederlage", 0);
    expect(mitTestende(beendet, "sieg", 0)).toBe(beendet);
  });
});

describe("testantworten", () => {
  it("füllt die ganze Runde mit richtigen oder falschen Antworten", () => {
    expect(testantworten(3, true)).toEqual(["richtig", "richtig", "richtig"]);
    expect(testantworten(2, false)).toEqual(["falsch", "falsch"]);
  });

  it("gibt für eine leere Runde eine leere Liste", () => {
    expect(testantworten(0, true)).toEqual([]);
  });
});
