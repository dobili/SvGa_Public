/** Tests der Phasen je Stellung: Regel aus Kapitel 11, nie rückwärts, Übergänge für die Kurve. */
import { describe, expect, it } from "vitest";
import { leserzug, neuePartie, ziehe, type Partie } from "./partie";
import { phasenJeStellung, phasenwechsel, phaseVon } from "./phasen";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
/** Abb. 8.1 (nur Könige und Bauern): Endspiel. */
const BAUERNENDSPIEL = "8/5k2/8/3K4/3P4/8/8/8 w - - 0 1";

function partie(startFen: string, zuege: readonly string[]): Partie {
  const start = neuePartie(
    {
      startFen,
      eigeneFarbe: "white",
      stufe: 1,
      uhr: null,
      ruecknahmeErlaubt: true,
      abbildung: null,
      eroeffnung: null,
      stufenJePhase: { eroeffnung: 1, mittelspiel: 1, endspiel: 1 },
    },
    "p",
    "2026-10-17T08:00:00.000Z",
  );
  const fertig = zuege.reduce<Partie | null>((p, z) => (p ? ziehe(p, leserzug(z)) : null), start);
  if (!fertig) throw new Error("Zug geht nicht");
  return fertig;
}

describe("Phasen", () => {
  it("Grundstellung ist Eröffnung, ein Bauernendspiel Endspiel, Unsinn null", () => {
    expect(phaseVon(GRUNDSTELLUNG)).toBe("eroeffnung");
    expect(phaseVon(BAUERNENDSPIEL)).toBe("endspiel");
    expect(phaseVon("unsinn")).toBeNull();
  });

  it("je Stellung eine Phase, die nie zurückspringt; Übergänge als Index", () => {
    const p = partie(BAUERNENDSPIEL, ["Ke5", "Ke7"]);
    expect(phasenJeStellung(p)).toEqual(["endspiel", "endspiel", "endspiel"]);
    expect(phasenwechsel(["eroeffnung", "eroeffnung", "mittelspiel", "endspiel"])).toEqual({
      eroeffnung: 0,
      mittelspiel: 2,
      endspiel: 3,
    });
    expect(phasenwechsel(["eroeffnung"]).endspiel).toBeNull();
  });
});
