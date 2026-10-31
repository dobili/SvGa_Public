/** Tests der Phasen je Stellung: Regel aus Kapitel 11, nie rückwärts, Übergänge für die Kurve. */
import { describe, expect, it } from "vitest";
import { leserzug, neuePartie, ziehe, type Partie } from "./partie";
import { phasenbefundVon, phasenJeStellung, phasenwechsel, phaseVon } from "./phasen";

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

  // Zusatzregel (nicht aus dem Buch): Speelman (höchstens 13 Punkte je Seite). Eine Regel
  // nach der Zugzahl gibt es nicht mehr (Entscheidung des Autors, 17.10.2026).
  it("Damenendspiel ist Endspiel (Zusatzregel Speelman); die Zugzahl ändert nichts", () => {
    // Dame, Turm und drei Bauern je Seite (17 Punkte): Mittelspiel; ohne Türme (12 Punkte): Endspiel.
    expect(phaseVon("3q1rk1/5ppp/8/8/8/8/5PPP/3QR1K1 w - - 0 40")).toBe("mittelspiel");
    expect(phaseVon("3q2k1/5ppp/8/8/8/8/5PPP/3Q2K1 w - - 0 40")).toBe("endspiel");
    // Die Zugzahl ändert nichts: Beide Seiten mit zwei Leichtfiguren zu Hause bleiben in der
    // Eröffnung, auch in Zug 30.
    const beideZuHause = "r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 4";
    expect(phaseVon(`${beideZuHause} 4`)).toBe("eroeffnung");
    expect(phaseVon(`${beideZuHause} 30`)).toBe("eroeffnung");
  });

  // Lesart seit 0.3.14 (Entscheidungen 11 und 12 des Autors, 30.10.2026): Mittelspiel, wenn beide
  // entwickelt und rochiert sind, oder nach einem Ausweg wie bei Lichess (Abtausch, Grundreihe,
  // Kontakt); eine allein entwickelte Seite oder ungleiches Material beendet die Eröffnung nicht mehr.
  it("Eröffnung bis beide fertig sind oder ein Ausweg greift", () => {
    const befund = (fen: string) => phasenbefundVon(fen);
    // Beide mit Figuren zu Hause, Weiß hat einen Springer mehr: noch Eröffnung (vorher Mittelspiel).
    expect(
      befund("r1bqkb1r/pppp1ppp/5n2/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 5"),
    ).toMatchObject({ phase: "eroeffnung", grund: "zuHause" });
    // Schwarz entwickelt und rochiert, Weiß hat schon Dame und Läufer weg von der Grundreihe.
    expect(befund("r4rk1/ppp2ppp/2n2n2/3qp3/8/5N2/PPPP1PPP/RNBQ1RK1 w - - 0 14")?.phase).toBe(
      "mittelspiel",
    );
    // Beide entwickelt und rochiert: Mittelspiel nach dem Glossar.
    expect(befund("2r2rk1/pp3ppp/2n1b3/8/8/2N1B3/PP3PPP/2R2RK1 w - - 0 20")?.grund).toBe(
      "beideFertig",
    );
    // Vier Figuren getauscht, Könige noch in der Mitte: Abtausch beendet die Eröffnung.
    expect(befund("r2qk2r/ppp2ppp/2n5/3pp3/3PP3/2N5/PPP2PPP/R2QK2R w KQkq - 0 10")?.grund).toBe(
      "abtausch",
    );
  });

  it("Endspiel in eigenen Partien nur mit wenig Material; Berliner Verteidigung kein Endspiel", () => {
    // Berliner Verteidigung nach 8. Dxd8+ Kxd8 9. Sc3: Damen weg, 19 Punkte Figuren je Seite.
    expect(phaseVon("r1bk1b1r/ppp2ppp/2p5/4Pn2/8/2N2N2/PPP2PPP/R1B2RK1 b - - 1 9")).toBe(
      "mittelspiel",
    );
    // Damen weg, je zwei Türme und zwei Leichtfiguren, weißer Freibauer d5: kein Endspiel.
    expect(phaseVon("2r2rk1/pp3ppp/2n1b3/3P4/8/2N1B3/PP3PPP/2R2RK1 w - - 0 20")).toBe(
      "mittelspiel",
    );
    // Je Turm und Läufer: Endspiel nach den Fragen des Buches.
    expect(phaseVon("5rk1/pp3ppp/4b3/8/8/4B3/PP3PPP/5RK1 w - - 0 30")).toBe("endspiel");
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
