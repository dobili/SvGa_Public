/** Tests des Elo-Modells der App (0.2.124): Kennzahlen, Schätzung je Zeitklasse, Spanne, Phasen. */
import { describe, expect, it } from "vitest";
import {
  istSchmal,
  kennzahlenAus,
  kennzahlenMittel,
  schaetzung,
  wertungstempo,
  type Kennzahlzug,
} from "./elomodell";

/** Eine Partie mit n Zügen, davon ein Anteil Fehler mit festem Verlust, alle im Mittelspiel. */
function zuege(n: number, fehleranteil: number, verlust: number): Kennzahlzug[] {
  return Array.from({ length: n }, (_, i) => {
    const fehler = i < Math.round(n * fehleranteil);
    return {
      verlust: fehler ? verlust : 0,
      genauigkeit: fehler ? 40 : 100,
      nachher: 0,
      phase: i < 6 ? "eroeffnung" : "mittelspiel",
    };
  });
}

describe("Elo-Modell", () => {
  it("Kennzahlen: Zahl der Züge, Fehlerrate, Klassen, Verlust je Fehler, je Phase", () => {
    const k = kennzahlenAus(zuege(30, 0.3, 2), 80);
    expect(k).not.toBeNull();
    expect(k?.n).toBe(30);
    expect(k?.acc_lichess).toBe(80);
    expect(k?.fehlerrate).toBeCloseTo(0.3, 6);
    expect(k?.k_fehler).toBeCloseTo(0.3, 6);
    expect(k?.k_patzer).toBe(0);
    expect(k?.verlust_je_fehler).toBe(2);
    expect(k?.ph_eroeffnung_n).toBe(6);
    expect(k?.ph_eroeffnung_fehler).toBe(1);
    expect(k?.ph_endspiel_n).toBe(0);
    expect(k?.ph_endspiel_verlust).toBeNull();
    expect(kennzahlenAus([], 80)).toBeNull();
    // Klar gewonnen danach: ein Patzer zählt nur als Ungenauigkeit (Regel der Eichung).
    const klar = kennzahlenAus([{ verlust: 4, genauigkeit: 50, nachher: 6, phase: null }], 50);
    expect(klar?.k_patzer).toBe(0);
    expect(klar?.k_ungenau).toBe(1);
  });

  it("Mittel über Partien je Kennzahl, fehlende übergangen", () => {
    const m = kennzahlenMittel([
      { n: 20, fehlerrate: 0.2, ph_endspiel_verlust: null },
      { n: 40, fehlerrate: 0.4, ph_endspiel_verlust: 0.5 },
    ]);
    expect(m.n).toBe(30);
    expect(m.fehlerrate).toBeCloseTo(0.3, 6);
    expect(m.ph_endspiel_verlust).toBe(0.5);
  });

  it("Schätzung: fehlerfreie Partie hoch, fehlerreiche niedrig, Spanne enger über zehn Partien", () => {
    const gut = kennzahlenAus(zuege(30, 0, 0), 100);
    const schlecht = kennzahlenAus(zuege(30, 0.5, 3), 45);
    if (!gut || !schlecht) throw new Error("Kennzahlen");
    const sGut = schaetzung("rapid", gut, 1);
    const sSchlecht = schaetzung("rapid", schlecht, 1);
    expect(sGut.mitte).toBeGreaterThan(sSchlecht.mitte + 600);
    expect(sSchlecht.mitte).toBeLessThan(1200);
    expect(sGut.von).toBeLessThan(sGut.mitte);
    expect(sGut.bis).toBeGreaterThan(sGut.mitte);
    expect(sGut.mitte % 50).toBe(0);
    const zehn = schaetzung("rapid", gut, 10);
    expect(zehn.bis - zehn.von).toBeLessThan(sGut.bis - sGut.von);
    expect(zehn.partien).toBe(10);
    expect(schaetzung("rapid", gut, 25).partien).toBe(10);
    // Jede Zeitklasse liefert eine Zahl.
    expect(schaetzung("blitz", gut, 1).mitte).toBeGreaterThan(1000);
    expect(schaetzung("classical", gut, 1).mitte).toBeGreaterThan(1000);
  });

  it("Phasen: Teilmodell liefert eine Zahl, einzelne Partie nie schmal", () => {
    const k = kennzahlenAus(zuege(30, 0.2, 1.5), 85);
    if (!k) throw new Error("Kennzahlen");
    const ph = schaetzung("rapid", k, 1, "mittelspiel");
    expect(ph.mitte).toBeGreaterThan(0);
    expect(istSchmal(ph)).toBe(false);
    expect(istSchmal({ tempo: "rapid", mitte: 1500, von: 1200, bis: 1800, partien: 10 })).toBe(
      true,
    );
  });

  it("Zeitklasse wie Lichess; ohne Uhr Schnellschach", () => {
    expect(wertungstempo(null)).toBe("rapid");
    expect(wertungstempo({ grundzeitMs: 300_000, zuschlagMs: 0 })).toBe("blitz");
    expect(wertungstempo({ grundzeitMs: 900_000, zuschlagMs: 10_000 })).toBe("rapid");
    expect(wertungstempo({ grundzeitMs: 3_600_000, zuschlagMs: 0 })).toBe("classical");
  });
});
