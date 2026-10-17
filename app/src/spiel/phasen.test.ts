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
      gegner: "engine",
      bot: null,
      hilfen: { symbole: true, werkzeuge: true },
      gewertet: true,
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

  // Zusatzregel (0.2.41, nicht aus dem Buch): Speelman (höchstens 13 Punkte je Seite). Eine Regel
  // nach der Zugzahl gibt es nicht mehr (Entscheidung des Autors, 17.10.2026).
  it("Damenendspiel ist Endspiel (Zusatzregel Speelman); die Zugzahl ändert nichts", () => {
    // Dame, Turm und drei Bauern je Seite (17 Punkte): Mittelspiel; ohne Türme (12 Punkte): Endspiel.
    expect(phaseVon("3q1rk1/5ppp/8/8/8/8/5PPP/3QR1K1 w - - 0 40")).toBe("mittelspiel");
    expect(phaseVon("3q2k1/5ppp/8/8/8/8/5PPP/3Q2K1 w - - 0 40")).toBe("endspiel");
    // Weiß hat Sb1 und Lc1 zu Hause: nach dem Buch Eröffnung, auch in Zug 30.
    const zuHause = "r4rk1/ppp2ppp/2n2n2/3qp3/8/5N2/PPPP1PPP/RNBQ1RK1 w - - 0";
    expect(phaseVon(`${zuHause} 14`)).toBe("eroeffnung");
    expect(phaseVon(`${zuHause} 30`)).toBe("eroeffnung");
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
