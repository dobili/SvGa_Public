/** Tests der Elo-Zahl der Bots: Daten vollständig und geordnet, Schätzung aus Stufen, Anzeige. */
import { REINE_STUFEN_STAERKE } from "./reinestufen-daten";
import { describe, expect, it } from "vitest";
import {
  ANGABE_HOECHSTENS,
  ANGABE_MINDESTENS,
  bereichDerSpassbots,
  gegnerstaerke,
  staerkeangabe,
  staerkeAusStufen,
  staerkeDerStufe,
  staerkeDesBots,
  zusatzanteil,
} from "./botstaerke";
import { BLINDE_FLECKEN } from "./blindeFlecken";
import { GEGNER } from "./gegnerliste";
import { GELEGENHEITSARTEN } from "./menschenprofil";

const STUFEN = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

describe("Zusatzfehler eigener Gegner (0.2.117)", () => {
  const vier = { eroeffnung: 4, mittelspiel: 4, endspiel: 4 } as const;
  it("ohne Haken kein Anteil, alle Arten und Flecken wie Menschen ganz", () => {
    expect(zusatzanteil({ stufenJePhase: vier, fehlerarten: [], blindeFlecken: [] })).toBe(0);
    const voll = Object.fromEntries([...GELEGENHEITSARTEN, ...BLINDE_FLECKEN].map((a) => [a, 1]));
    expect(zusatzanteil({ stufenJePhase: vier, gewichte: voll })).toBeCloseTo(1);
    expect(zusatzanteil({ stufenJePhase: vier, gewichte: voll, haeufigkeit: 0.5 })).toBeCloseTo(
      0.5,
    );
  });
});

describe("Elo-Zahl der Bots", () => {
  it("jede Stufe ist stärker als die darunter", () => {
    for (let i = 1; i < STUFEN.length; i += 1) {
      expect(staerkeDerStufe(STUFEN[i] ?? 8)).toBeGreaterThan(staerkeDerStufe(STUFEN[i - 1] ?? 1));
    }
  });

  it("Spaß-Bots (0.2.88): ihr Bereich umfasst alle vier (im Bereich der Anzeige)", () => {
    const bereich = bereichDerSpassbots();
    expect(bereich).not.toBeNull();
    // Seit dem Bot-Satz vom 24.10.2026 beginnt Kiki unter Stufe 1 (580 gegen 747): nur die Anzeigegrenze.
    expect(bereich?.von ?? 0).toBeGreaterThan(ANGABE_MINDESTENS);
    expect(bereich?.von ?? 0).toBeLessThan(bereich?.bis ?? 0);
  });

  it("alle vorgefertigten Bots (78 und die vier Spaß-Bots) haben eine gemessene Zahl", () => {
    for (const g of GEGNER) expect(staerkeDesBots(g.kennung), g.kennung).not.toBeNull();
    expect(staerkeDesBots(null)).toBeNull();
    expect(staerkeDesBots("eigen-123")).toBeNull();
  });

  it("Schätzung aus Stufen je Phase: reine Stufe gleich der Stufe, Mischung dazwischen", () => {
    expect(staerkeAusStufen({ eroeffnung: 5, mittelspiel: 5, endspiel: 5 })).toBe(
      staerkeDerStufe(5),
    );
    const mischung = staerkeAusStufen({ eroeffnung: 3, mittelspiel: 4, endspiel: 3 });
    const drei = staerkeDerStufe(3);
    expect(mischung).toBeCloseTo(drei + (staerkeDerStufe(4) - drei) / 3, 6);
    expect(staerkeAusStufen({ eroeffnung: 8, mittelspiel: 8, endspiel: 8 })).toBe(
      staerkeDerStufe(8),
    );
  });

  it("Gegnerwertung: gemessener Bot, sonst Schätzung aus den Stufen", () => {
    const fuenf = { eroeffnung: 5, mittelspiel: 5, endspiel: 5 } as const;
    const svenja = GEGNER.find((g) => g.kennung === "svenja");
    expect(gegnerstaerke({ bot: "svenja", stufenJePhase: fuenf })).toBe(staerkeDesBots("svenja"));
    expect(svenja).toBeDefined();
    // Partien von vor 0.2.126 gegen die eigene Stufe (ohne Stil) spielten rein.
    expect(gegnerstaerke({ bot: null, stufenJePhase: fuenf })).toBe(REINE_STUFEN_STAERKE[5]);
    // Seit 0.2.126 spielt die eigene Stufe mit Zusatzfehlern wie die gemessene Stufe „5m“.
    const neu = { bot: null, stufenJePhase: fuenf, stilname: "universell", fehlerarten: null };
    expect(gegnerstaerke(neu)).toBe(staerkeDerStufe(5));
    expect(gegnerstaerke({ ...neu, fehlerarten: [] })).toBe(REINE_STUFEN_STAERKE[5]);
    expect(gegnerstaerke({ bot: "eigen-1", stufenJePhase: fuenf })).toBe(staerkeDerStufe(5));
  });

  it("Anzeige: auf 50 gerundet, außerhalb der Eichung nur die Grenze", () => {
    expect(staerkeangabe(1083)).toEqual({ art: "etwa", wert: 1100 });
    expect(staerkeangabe(1074)).toEqual({ art: "etwa", wert: 1050 });
    expect(staerkeangabe(2650)).toEqual({ art: "etwa", wert: 2650 });
    expect(staerkeangabe(3400)).toEqual({ art: "ueber", wert: ANGABE_HOECHSTENS });
    expect(staerkeangabe(310)).toEqual({ art: "unter", wert: ANGABE_MINDESTENS });
    expect(staerkeangabe(ANGABE_HOECHSTENS)).toEqual({ art: "etwa", wert: ANGABE_HOECHSTENS });
  });
});

describe("Zahlen je Zeitklasse (0.2.129)", () => {
  const KLASSISCH_30_20 = { grundzeitMs: 1_800_000, zuschlagMs: 20_000 };
  it("jeder Bot und jede Stufe hat in Klassisch eine gemessene Zahl", () => {
    for (const g of GEGNER)
      expect(staerkeDesBots(g.kennung, "classical"), g.kennung).toBeTypeOf("number");
    for (const n of STUFEN) expect(staerkeDerStufe(n, "classical")).toBeGreaterThan(0);
  });
  it("die Gegnerwertung nimmt die Zahl der Zeitklasse der Uhr", () => {
    const partie = {
      bot: "ole",
      stufenJePhase: { eroeffnung: 9, mittelspiel: 9, endspiel: 9 },
    } as const;
    expect(gegnerstaerke({ ...partie, uhr: KLASSISCH_30_20 })).toBe(
      staerkeDesBots("ole", "classical"),
    );
    expect(gegnerstaerke({ ...partie, uhr: null })).toBe(staerkeDesBots("ole"));
  });
});
