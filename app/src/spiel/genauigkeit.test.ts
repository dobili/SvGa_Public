/** Tests der Spielstärke-Bewertung: Gewinnwahrscheinlichkeit, Genauigkeit, Schätzung, Bilanz je Seite. */
import { describe, expect, it } from "vitest";
import { zugurteile } from "./auswertung";
import {
  gewinnwahrscheinlichkeit,
  spielstaerke,
  spielstaerkeAus,
  zuggenauigkeit,
} from "./genauigkeit";
import { leserzug, neuePartie, ziehe, type Partie, type Partiezug } from "./partie";

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

  it("Schätzung aus dem Verlust je Zug: 0,4 → 1800, 1,0 → 1100, dazwischen linear, Mindestwert", () => {
    expect(spielstaerkeAus(0.4)).toBe(1800);
    expect(spielstaerkeAus(1.0)).toBe(1100);
    expect(spielstaerkeAus(0.46)).toBe(1700);
    expect(spielstaerkeAus(9)).toBe(500);
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
    expect(s.white.zeichen).toEqual({ "!": 1, "?!": 1, "?": 0, "??": 0 });
    expect(s.white.spielstaerke).toBeNull();
    expect(s.black.zeichen["??"]).toBe(1);
    expect(s.black.genauigkeit).toBeLessThan(s.white.genauigkeit ?? 0);
    expect(s.black.verlustJeZug).toBeCloseTo(10.3 / 3, 5);
  });
});
