/** Tests der Spielstärke-Bewertung: Gewinnwahrscheinlichkeit, Genauigkeit, Schätzung, Bilanz je Seite. */
import { describe, expect, it } from "vitest";
import { zugurteile } from "./auswertung";
import {
  gewinnwahrscheinlichkeit,
  partiegenauigkeit,
  phasenurteil,
  spielstaerke,
  spielstaerkeImMittelspiel,
  zuggenauigkeit,
  zuggewichte,
} from "./genauigkeit";
import { leserzug, neuePartie, ziehe, type Partie, type Partiezug } from "./partie";
import type { Phase } from "./phasen";
import type { Zugart } from "./taktik";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

function enginezug(san: string): Partiezug {
  return { san, von: "engine", quelle: "engine", fehler: null, verlust: 0 };
}

/** 1. e4 e5 2. Dh5 Sc6 3. Lc4 Sf6?? 4. Dxf7#, Leser Weiß. */
function partie(): Partie {
  const start = neuePartie(
    {
      startFen: GRUNDSTELLUNG,
      eigeneFarbe: "white",
      stufe: 1,
      uhr: null,
      ruecknahmeErlaubt: true,
      abbildung: null,
      eroeffnung: null,
      stufenJePhase: { eroeffnung: 1, mittelspiel: 1, endspiel: 1 },
      gegner: "engine",
      bot: null,
      hilfen: { symbole: true, werkzeuge: true },
      gewertet: true,
    },
    "p",
    "2026-10-15T08:00:00.000Z",
  );
  const zuege = [
    leserzug("e4"),
    enginezug("e5"),
    leserzug("Qh5"),
    enginezug("Nc6"),
    leserzug("Bc4"),
    enginezug("Nf6"),
    leserzug("Qxf7#"),
  ];
  const fertig = zuege.reduce<Partie | null>((p, z) => (p ? ziehe(p, z) : null), start);
  if (!fertig) throw new Error("Zug geht nicht");
  return fertig;
}

describe("Genauigkeit und Spielstärke", () => {
  it("Gewinnwahrscheinlichkeit: 0 → 50 %, +1 → etwa 59 %, Matt → nahe 100 %", () => {
    expect(gewinnwahrscheinlichkeit(0)).toBeCloseTo(50, 5);
    expect(gewinnwahrscheinlichkeit(1)).toBeCloseTo(59.1, 0);
    expect(gewinnwahrscheinlichkeit(10)).toBeGreaterThan(97);
    expect(gewinnwahrscheinlichkeit(-10)).toBeLessThan(3);
  });

  it("Genauigkeit eines Zuges: ohne Verlust 100, bei 10 Prozentpunkten etwa 64, nie unter 0", () => {
    expect(zuggenauigkeit(0)).toBeCloseTo(100, 3);
    expect(zuggenauigkeit(10)).toBeCloseTo(63.6, 0);
    expect(zuggenauigkeit(100)).toBe(0);
  });

  it("Gewichte (Lichess): ruhige Züge 0,5, Züge im Kampf bis 12; je Zug ein Gewicht", () => {
    // 20 Halbzüge, Fenster 2: Das Gewicht ist die Schwankung der Gewinnwahrscheinlichkeit
    // zwischen der Stellung vor und nach dem Zug (mindestens 0,5, höchstens 12).
    const ruhig = Array.from({ length: 21 }, () => 0.2);
    expect(zuggewichte(ruhig)).toHaveLength(20);
    expect(zuggewichte(ruhig).every((g) => g === 0.5)).toBe(true);
    const kampf = [...ruhig];
    kampf[5] = 6;
    const gewichte = zuggewichte(kampf);
    expect(gewichte[4]).toBe(12);
    expect(gewichte[5]).toBe(12);
    expect(gewichte[6]).toBe(0.5);
    expect(zuggewichte([0])).toEqual([]);
  });

  it("Genauigkeit der Partie (Lichess): ein Patzer drückt stärker als das einfache Mittel", () => {
    const zuege = [
      { genauigkeit: 100, gewicht: 0.5 },
      { genauigkeit: 100, gewicht: 0.5 },
      { genauigkeit: 100, gewicht: 0.5 },
      { genauigkeit: 20, gewicht: 12 },
    ];
    // Einfaches Mittel wäre 80; gewichtet (150 + 240) / 13,5 = 28,9; harmonisch 4 / 0,08 = 50.
    expect(partiegenauigkeit(zuege)).toBeCloseTo((28.9 + 50) / 2, 0);
    expect(partiegenauigkeit([])).toBeNull();
    // Eine Zuggenauigkeit 0 zählt im harmonischen Mittel als 1, nicht als Division durch 0.
    expect(partiegenauigkeit([{ genauigkeit: 0, gewicht: 1 }])).toBeCloseTo(0.5, 5);
  });

  it("Polster (0.2.83): Züge in entschiedener Stellung zählen weniger", () => {
    const zuege = [
      { genauigkeit: 40, gewicht: 1, entschieden: false },
      { genauigkeit: 100, gewicht: 1, entschieden: true },
    ];
    const voll = partiegenauigkeit(zuege) ?? 0;
    const kaum = partiegenauigkeit(zuege, 0.1) ?? 0;
    expect(kaum).toBeLessThan(voll);
    expect(partiegenauigkeit([{ genauigkeit: 90, gewicht: 1, entschieden: true }], 0)).toBeNull();
  });

  it("Urteilswort je Phase: 96 hervorragend, 90 sehr gut, 80 gut, 70 ungenau, 60 fehlerhaft, 40 schwach", () => {
    expect(phasenurteil(96)).toBe("hervorragend");
    expect(phasenurteil(90)).toBe("sehrGut");
    expect(phasenurteil(80)).toBe("gut");
    expect(phasenurteil(70)).toBe("ungenau");
    expect(phasenurteil(60)).toBe("fehlerhaft");
    expect(phasenurteil(40)).toBe("schwach");
  });

  it("Bilanz je Seite: Zeichen, beste Züge, Genauigkeit; Schätzung erst ab zehn Zügen", () => {
    const p = partie();
    const werte = [0.3, 0.3, 0.3, -0.3, -0.3, -0.3, 10, 10];
    const beste = ["e2e4", "e7e5", "g1f3", "b8c6", "g1f3", "g8f6", "h5f7", ""];
    const abstaende = [0, 0, 0, 0, 0, 0, 5, 0];
    const urteile = zugurteile(p, werte, beste, abstaende);
    const gespielte = ["e2e4", "e7e5", "d1h5", "b8c6", "f1c4", "g8f6", "h5f7"];
    const s = spielstaerke(p, werte, urteile, beste, gespielte);
    expect(s.white.zuege).toBe(4);
    expect(s.white.beste).toBe(2);
    // 4. Dxf7# ist einziger Zug, aber danach klar gewonnen: kein „!“ (0.2.51).
    expect(s.white.zeichen).toEqual({ "!!": 0, "!": 0, "?!": 1, "?": 0, "??": 0 });
    expect(s.white.spielstaerke).toBeNull();
    expect(s.black.zeichen["??"]).toBe(1);
    expect(s.black.genauigkeit).toBeLessThan(s.white.genauigkeit ?? 0);
    expect(s.black.verlustJeZug).toBeCloseTo(10.3 / 3, 5);
    // Nach 3...Sf6?? ist die Partie entschieden: 4. Dxf7# zählt nicht mehr für die Spielstärke.
    expect(s.white.gewertet).toBe(3);
    expect(s.black.gewertet).toBe(3);
  });

  it("Mittelspiel nach Zugart: nur Züge des Mittelspiels, getrennt nach Taktik und Strategie", () => {
    const p = partie();
    const werte = [0.3, 0.3, 0.3, -0.3, -0.3, -0.3, 10, 10];
    const beste = ["e2e4", "e7e5", "g1f3", "b8c6", "g1f3", "g8f6", "h5f7", ""];
    const urteile = zugurteile(p, werte, beste, [0, 0, 0, 0, 0, 0, 5, 0]);
    const phasen: Phase[] = [
      "eroeffnung",
      "eroeffnung",
      "eroeffnung",
      "mittelspiel",
      "mittelspiel",
      "mittelspiel",
      "mittelspiel",
      "mittelspiel",
    ];
    const zugarten: Zugart[] = [
      "strategie",
      "strategie",
      "strategie",
      "strategie",
      "taktik",
      "taktik",
      "taktik",
      "taktik",
    ];
    const je = spielstaerkeImMittelspiel(p, werte, urteile, beste, [], phasen, zugarten);
    expect(je.strategie.black.zuege).toBe(1);
    expect(je.taktik.white.zuege).toBe(2);
    expect(je.taktik.black.zuege).toBe(1);
    expect(je.taktik.white.spielstaerke).toBeNull();
  });
});
