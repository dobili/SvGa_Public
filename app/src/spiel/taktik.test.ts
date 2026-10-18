/** Tests der Zugart je Stellung: Schach, Drohung, Schlag mit Gewinn und Matt sind Taktik, sonst Strategie. */
import { describe, expect, it } from "vitest";
import { leserzug, neuePartie, ziehe, type Partie } from "./partie";
import { zugartJeStellung, zugartVon } from "./taktik";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
/** Nach 1. e4 d5: Weiß kann mit Gewinn schlagen (exd5). */
const NACH_E4_D5 = "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 2";
/** Nach 1. e4 e5 2. Dh5 Sc6 3. Lc4 Sf6: Weiß setzt mit Dxf7 Matt. */
const VOR_SCHAEFERMATT = "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4";
/** Schwarz steht im Schach (1. e4 e5 2. Lc4 d6 3. Lxf7+). */
const IM_SCHACH = "rnbqkbnr/ppp2Bpp/3p4/4p3/4P3/8/PPPP1PPP/RNBQK1NR b KQkq - 0 3";
/** Ruhige Stellung: Italienisch nach 1. e4 e5 2. Sf3 Sc6 3. Lc4 Lc5 4. c3 Sf6 5. d3 d6. */
const RUHIG = "r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQK2R w KQkq - 0 6";
/** Lehrbild ohne Könige: keine Regeln, keine Zugart. */
const OHNE_KOENIGE = "8/8/8/3p4/4P3/8/8/8 w - - 0 1";

function partie(zuege: readonly string[]): Partie {
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
    "2026-10-18T08:00:00.000Z",
  );
  const fertig = zuege.reduce<Partie | null>((p, z) => (p ? ziehe(p, leserzug(z)) : null), start);
  if (!fertig) throw new Error("Zug geht nicht");
  return fertig;
}

describe("Zugart", () => {
  it("Grundstellung und ruhige Italienisch-Stellung sind Strategie", () => {
    expect(zugartVon(GRUNDSTELLUNG)).toBe("strategie");
    expect(zugartVon(RUHIG)).toBe("strategie");
  });

  it("Schlag mit Gewinn, Matt in einem Zug und Schach sind Taktik", () => {
    expect(zugartVon(NACH_E4_D5)).toBe("taktik");
    expect(zugartVon(VOR_SCHAEFERMATT)).toBe("taktik");
    expect(zugartVon(IM_SCHACH)).toBe("taktik");
  });

  it("Drohung des Gegners ist Taktik: nach 1. e4 e5 2. Dh5 muss Schwarz e5 decken", () => {
    const p = partie(["e4", "e5", "Qh5"]);
    const arten = zugartJeStellung(p);
    expect(arten).toHaveLength(4);
    expect(arten[0]).toBe("strategie");
    expect(arten.at(-1)).toBe("taktik");
  });

  it("ohne Könige keine Zugart", () => {
    expect(zugartVon(OHNE_KOENIGE)).toBeNull();
    expect(zugartVon("unsinn")).toBeNull();
  });
});
