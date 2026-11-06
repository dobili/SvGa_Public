/** Tests der Reichweite der Zielvorschläge (Wunsch des Autors, 6.11.2026, Q15-3). */
import { describe, expect, it } from "vitest";
import { leereDaten, type Nutzerdaten } from "../speicher/format";
import type { Wertungspunkt } from "../spiel/wertung";
import { ANFANG, eigeneZahl, inReichweite, REICHWEITE } from "./zielreichweite";

const JETZT = new Date("2026-11-06T10:00:00Z");

function mitWertung(daten: Nutzerdaten, wertung: number): Nutzerdaten {
  const punkt: Wertungspunkt = {
    partieId: "w",
    zeit: JETZT.toISOString(),
    gegner: wertung,
    ergebnis: 1,
    wertung,
    phasen: { eroeffnung: null, mittelspiel: null, endspiel: null },
    tempo: "rapid",
  };
  return { ...daten, spiel: { ...daten.spiel, wertung: [punkt] } };
}

describe("Reichweite der Zielvorschläge", () => {
  it("nimmt ohne Wertung und Sieg den Einsteiger an", () => {
    expect(eigeneZahl(leereDaten(JETZT))).toBe(ANFANG);
  });

  it("schlägt bei 900 Elo keine Engine-Bots vor, aber das nächste Bündel", () => {
    const grenze = eigeneZahl(mitWertung(leereDaten(JETZT), 900)) + REICHWEITE;
    expect(inReichweite({ art: "ring", ring: "ich-bots-10" }, grenze)).toBe(false);
    expect(inReichweite({ art: "ring", ring: "ich-bots-4-5-einmal" }, grenze)).toBe(true);
    expect(inReichweite({ art: "kapitel", kapitel: 5 }, grenze)).toBe(true);
  });

  it("lässt bei 2400 Elo auch die Engine-Bots zu", () => {
    const grenze = eigeneZahl(mitWertung(leereDaten(JETZT), 2400)) + REICHWEITE;
    expect(inReichweite({ art: "ring", ring: "ich-bots-10" }, grenze)).toBe(true);
  });
});
