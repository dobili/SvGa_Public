/** Tests der Abenteuerwertung je Zeitklasse (Wunsch des Autors, 19.11.2026). */
import { describe, expect, it } from "vitest";
import { wertungInZeitklasse } from "../../engine/zeitklassenabstand";
import { erwartung } from "../../spiel/wertung";
import {
  abzugDerUhr,
  GEWICHT_DER_KLASSE,
  schnellschachAus,
  schrittInKlasse,
  wertungsklasse,
  type Zeitlage,
} from "./zeitklassenwertung";

const K = 20;
const SCHNELL = { sekunden: 600, zuschlag: 5 };
const BLITZ = { sekunden: 180, zuschlag: 2 };
const STUFEN = { eroeffnung: 3, mittelspiel: 3, endspiel: 3 } as const;

/** Lage mit Zeitwahl; `jeZugSek` genutzt über 25 eigene Züge (Weiß), sonst ohne Bilanz. */
function lage(uhr: Zeitlage["uhr"], jeZugSek?: number, zeitwahl = true): Zeitlage {
  const zuege = 25;
  const bilanz =
    uhr && jeZugSek !== undefined
      ? {
          eigeneZuege: zuege,
          begann: true,
          restMs: (uhr.sekunden + (zuege - 1) * uhr.zuschlag - jeZugSek * zuege) * 1000,
        }
      : null;
  return { zeitwahl, uhr, bilanz, abzug: 0 };
}

describe("Zeitklasse der Wertung", () => {
  it("ohne Uhr, ohne Zeitwahl oder mit Schnellschach in Ruhe: Schnellschach", () => {
    expect(wertungsklasse(lage(null))).toBe("rapid");
    expect(wertungsklasse(lage(BLITZ, undefined, false))).toBe("rapid");
    expect(wertungsklasse(lage(SCHNELL, 20))).toBe("rapid");
  });

  it("Blitz gewählt: Blitz; Schnellschach mit 4 s je Zug: herabgestuft auf Blitz", () => {
    expect(wertungsklasse(lage(BLITZ))).toBe("blitz");
    expect(wertungsklasse(lage(SCHNELL, 4))).toBe("blitz");
  });

  it("Abzug der Uhr nur mit Zeitwahl und Uhr (derzeit überall 0, wie in der App)", () => {
    expect(abzugDerUhr(false, BLITZ, STUFEN)).toBe(0);
    expect(abzugDerUhr(true, null, STUFEN)).toBe(0);
    expect(abzugDerUhr(true, BLITZ, STUFEN)).toBe(0);
  });
});

describe("Elo-Schritt in der Klasse, zurück auf Schnellschach", () => {
  it("Schnellschach rechnet wie bisher: A + K · (s − E)", () => {
    expect(schrittInKlasse(800, 1020, 0, K, "rapid", 0)).toBeCloseTo(
      800 + K * (0 - erwartung(800, 1020)),
      9,
    );
  });

  it("die Umkehrung trifft: Blitz-Zahl hin und zurück", () => {
    for (const a of [500, 1000, 1500, 2000]) {
      expect(schnellschachAus(wertungInZeitklasse(a, "blitz"), "blitz")).toBeCloseTo(a, 1);
      expect(schnellschachAus(wertungInZeitklasse(a, "classical"), "classical")).toBeCloseTo(a, 1);
    }
  });

  it("Clubchef 1 in Maple Falls (A 800, Z 1020): Blitz zählt halb", () => {
    expect(schrittInKlasse(800, 1020, 0, K, "blitz", 0)).toBeCloseTo(797.04, 1);
    expect(schrittInKlasse(800, 1020, 0, K, "rapid", 0)).toBeCloseTo(795.6, 1);
    expect(schrittInKlasse(800, 1020, 1, K, "blitz", 0)).toBeCloseTo(808.6, 1);
    expect(schrittInKlasse(800, 1020, 1, K, "rapid", 0)).toBeCloseTo(815.6, 1);
  });

  it("geblitzte Niederlage senkt A weniger, geblitzter Sieg bringt weniger als in Schnellschach", () => {
    for (const [a, z] of [
      [600, 600],
      [1000, 1000],
      [1500, 1700],
      [2000, 1800],
    ] as const) {
      const vorher = a;
      const niederlage = {
        blitz: schrittInKlasse(a, z, 0, K, "blitz", 0),
        schnell: schrittInKlasse(a, z, 0, K, "rapid", 0),
      };
      const sieg = {
        blitz: schrittInKlasse(a, z, 1, K, "blitz", 0),
        schnell: schrittInKlasse(a, z, 1, K, "rapid", 0),
      };
      expect(vorher - niederlage.blitz).toBeLessThan(vorher - niederlage.schnell);
      expect(sieg.blitz - vorher).toBeLessThan(sieg.schnell - vorher);
    }
  });

  it("gleich starke Gegner bei 1000: Niederlage 993,6, Sieg 1006,4 (Schnellschach 990 und 1010)", () => {
    expect(schrittInKlasse(1000, 1000, 0, K, "blitz", 0)).toBeCloseTo(993.6, 1);
    expect(schrittInKlasse(1000, 1000, 1, K, "blitz", 0)).toBeCloseTo(1006.4, 1);
  });

  it("Klassisch zählt voll (Gewicht 1)", () => {
    expect(GEWICHT_DER_KLASSE.classical).toBe(1);
    expect(GEWICHT_DER_KLASSE.rapid).toBe(1);
    expect(GEWICHT_DER_KLASSE.blitz).toBe(0.5);
  });

  it("ein Abzug der Uhr macht den Bot schwächer: ein Sieg bringt dann weniger", () => {
    const ohne = schrittInKlasse(1000, 1000, 1, K, "blitz", 0);
    const mit = schrittInKlasse(1000, 1000, 1, K, "blitz", -100);
    expect(mit).toBeLessThan(ohne);
  });
});
