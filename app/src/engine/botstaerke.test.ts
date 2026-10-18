/** Tests der Elo-Zahl der Bots: Daten vollständig und geordnet, Schätzung aus Stufen, Anzeige. */
import { describe, expect, it } from "vitest";
import {
  ANGABE_HOECHSTENS,
  ANGABE_MINDESTENS,
  gegnerstaerke,
  staerkeangabe,
  staerkeAusStufen,
  staerkeDerStufe,
  staerkeDesBots,
} from "./botstaerke";
import { GEGNER } from "./gegnerliste";

const STUFEN = [1, 2, 3, 4, 5, 6, 7, 8] as const;

describe("Elo-Zahl der Bots", () => {
  it("jede Stufe ist stärker als die darunter", () => {
    for (let i = 1; i < STUFEN.length; i += 1) {
      expect(staerkeDerStufe(STUFEN[i] ?? 8)).toBeGreaterThan(staerkeDerStufe(STUFEN[i - 1] ?? 1));
    }
  });

  it("alle 64 vorgefertigten Bots haben eine gemessene Zahl", () => {
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
    const nina = GEGNER.find((g) => g.kennung === "nina");
    expect(gegnerstaerke({ bot: "nina", stufenJePhase: fuenf })).toBe(staerkeDesBots("nina"));
    expect(nina).toBeDefined();
    expect(gegnerstaerke({ bot: null, stufenJePhase: fuenf })).toBe(staerkeDerStufe(5));
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
