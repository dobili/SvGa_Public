/**
 * Tests der Umrechnung auf chess.com und FIDE als Bereich: Tabelle wie bei chessgoals.com, Umweg
 * über chess.com Blitz, Breite aus der Streuung der Quelle, Ränder und null außerhalb; dazu die
 * Wahl der Quelle (eigene Messung oder chessgoals.com).
 */
import { describe, expect, it } from "vitest";
import { gemessenerBereich, gemessenerVergleichsbereich, istGemessen } from "./plattformvergleich";
import {
  bereichDerSpanne,
  bereichEtwa,
  bereichUeberChessgoals,
  entsprichtEtwa,
  kurvenwert,
  quelleDerUmrechnung,
  vergleichsbereich,
} from "./umrechnung";
import { SPALTE, VERGLEICHSTABELLE, type Spalte } from "./umrechnung-daten";

/** Halbe Breite eines Bereichs. */
function halbeBreite(bereich: { von: number; bis: number } | null): number {
  return bereich ? (bereich.bis - bereich.von) / 2 : Number.NaN;
}

describe("Vergleichstabelle (chessgoals.com, Juli 2026)", () => {
  it("steigt in jeder Spalte und stimmt an Stichproben mit der Quelle überein", () => {
    for (const spalte of Object.keys(SPALTE) as Spalte[]) {
      const werte = VERGLEICHSTABELLE.flatMap((z) => {
        const w = z[SPALTE[spalte]];
        return w === null ? [] : [w];
      });
      werte.slice(1).forEach((w, i) => expect(w).toBeGreaterThan(werte[i] ?? 0));
    }
    expect(VERGLEICHSTABELLE).toHaveLength(35);
    // chess.com Blitz 1100: Schnellschach 1340, FIDE 1660, Lichess 1490 / 1680 / 1730.
    expect(VERGLEICHSTABELLE[6]).toEqual([1100, 1340, 1660, 1490, 1680, 1730]);
    expect(VERGLEICHSTABELLE[5]?.[SPALTE.fide]).toBeNull();
  });
});

describe("Umweg über chessgoals.com", () => {
  it("Kurvenwert: linear zwischen Stützstellen, außerhalb der Randwert", () => {
    const kurve = [
      [0, 100],
      [10, 200],
    ] as const;
    expect(kurvenwert(kurve, 5)).toBe(150);
    expect(kurvenwert(kurve, -3)).toBe(100);
    expect(kurvenwert(kurve, 30)).toBe(200);
    expect(kurvenwert([], 1)).toBeNaN();
  });

  it("trifft in der Mitte die Zeilen der Quelle", () => {
    // Lichess Schnellschach 1680 = chess.com Schnellschach 1340 (Zeile chess.com Blitz 1100).
    expect(bereichUeberChessgoals("rapid", 1680)?.mitte).toBe(1340);
    // Lichess Blitz 1555 = chess.com Blitz 1200.
    expect(bereichUeberChessgoals("blitz", 1555)?.mitte).toBe(1200);
    // Lichess Klassisch 2120 = FIDE 1965 (gerundet 1970) und chess.com Schnellschach 1995 (2000).
    expect(bereichUeberChessgoals("classical", 2120, "fide")?.mitte).toBe(1970);
    expect(bereichUeberChessgoals("classical", 2120)?.mitte).toBe(2000);
  });

  it("gibt einen Bereich um die Mitte, auf 10 gerundet", () => {
    const b = bereichUeberChessgoals("blitz", 1550);
    expect(b).not.toBeNull();
    if (!b) return;
    expect(b.von).toBeLessThan(b.mitte);
    expect(b.bis).toBeGreaterThan(b.mitte);
    for (const zahl of [b.von, b.bis, b.mitte]) expect(zahl % 10).toBe(0);
  });

  it("leitet die Breite aus der Streuung der Quelle her", () => {
    // Blitz: ±70 Lichess geteilt durch die Steigung (etwa 0,65) → etwa ±105 chess.com Blitz.
    expect(halbeBreite(bereichUeberChessgoals("blitz", 1550))).toBeGreaterThanOrEqual(95);
    expect(halbeBreite(bereichUeberChessgoals("blitz", 1550))).toBeLessThanOrEqual(115);
    // Nie schmaler als die Streuung der Zielspalte allein (chess.com Schnellschach ±115).
    for (const w of [1300, 1700, 2100, 2600]) {
      expect(halbeBreite(bereichUeberChessgoals("rapid", w))).toBeGreaterThanOrEqual(110);
    }
    // FIDE nie schmaler als ±75 (Streuung der Spalte FIDE).
    expect(halbeBreite(bereichUeberChessgoals("classical", 1730, "fide"))).toBeGreaterThanOrEqual(
      70,
    );
  });

  it("ist breiter, wo die Daten dünn sind (Lichess Klassisch, flache Spalte)", () => {
    const blitz = halbeBreite(bereichUeberChessgoals("blitz", 1700));
    const schnell = halbeBreite(bereichUeberChessgoals("rapid", 1700));
    const klassisch = halbeBreite(bereichUeberChessgoals("classical", 1700));
    expect(schnell).toBeGreaterThan(blitz);
    expect(klassisch).toBeGreaterThan(schnell);
    // Am unteren Ende ist Lichess Klassisch am flachsten, der Bereich am breitesten.
    expect(halbeBreite(bereichUeberChessgoals("classical", 1550))).toBeGreaterThan(klassisch);
  });

  it("rechnet Klassisch auf chess.com über die Brücke chess.com Blitz", () => {
    const b = bereichUeberChessgoals("classical", 1600);
    expect(b).not.toBeNull();
    // Lichess Klassisch 1610 = chess.com Blitz 800 = chess.com Schnellschach 1085.
    expect(b?.mitte).toBeGreaterThanOrEqual(1040);
    expect(b?.mitte).toBeLessThanOrEqual(1090);
  });

  it("nimmt die Ränder der Tabelle noch mit, darüber und darunter null", () => {
    expect(bereichUeberChessgoals("blitz", 1090)?.mitte).toBe(500);
    expect(bereichUeberChessgoals("blitz", 2745)?.mitte).toBe(3000);
    expect(bereichUeberChessgoals("classical", 1505)?.mitte).toBe(820);
    expect(bereichUeberChessgoals("classical", 1730, "fide")?.mitte).toBe(1660);
    expect(bereichUeberChessgoals("blitz", 1089)).toBeNull();
    expect(bereichUeberChessgoals("blitz", 2746)).toBeNull();
    expect(bereichUeberChessgoals("rapid", 900)).toBeNull();
    expect(bereichUeberChessgoals("classical", 1500)).toBeNull();
    expect(bereichUeberChessgoals("classical", 1729, "fide")).toBeNull();
  });
});

describe("Quelle je Zeitklasse und Liste", () => {
  it("nimmt die eigene Messung, wo es sie gibt, sonst chessgoals.com", () => {
    for (const tempo of ["blitz", "rapid", "classical"] as const) {
      expect(quelleDerUmrechnung(tempo, "fide")).toBe(
        istGemessen(tempo, "fide") ? "messung" : "chessgoals",
      );
      expect(quelleDerUmrechnung(tempo, "chesscom")).toBe(
        istGemessen(tempo, "chesscom") ? "messung" : "chessgoals",
      );
    }
    // Stand der Messung vom 27.10.2026 (eine Million Profile): alle sechs Paare gemessen.
    expect(quelleDerUmrechnung("blitz", "chesscom")).toBe("messung");
    expect(quelleDerUmrechnung("classical", "chesscom")).toBe("messung");
    expect(quelleDerUmrechnung("classical", "fide")).toBe("messung");
  });

  it("liefert über die gewählte Quelle Bereich und Grenzen", () => {
    expect(bereichEtwa("classical", 2000)).toEqual(
      gemessenerBereich("classical", 2000, "chesscom"),
    );
    expect(vergleichsbereich("classical")).toEqual(
      gemessenerVergleichsbereich("classical", "chesscom"),
    );
    expect(bereichEtwa("blitz", 1900, "fide")).toEqual(gemessenerBereich("blitz", 1900, "fide"));
    expect(vergleichsbereich("blitz", "fide")).toEqual(
      gemessenerVergleichsbereich("blitz", "fide"),
    );
    expect(entsprichtEtwa("blitz", 1900, "fide")).toBe(
      gemessenerBereich("blitz", 1900, "fide")?.mitte,
    );
    expect(bereichEtwa("classical", 1200)).toBeNull();
  });

  it("macht aus einer Spanne die äußere Hülle der beiden Bereiche, außerhalb null", () => {
    const spanne = bereichDerSpanne("rapid", 1600, 1760);
    expect(spanne?.von).toBe(bereichEtwa("rapid", 1600)?.von);
    expect(spanne?.bis).toBe(bereichEtwa("rapid", 1760)?.bis);
    expect(bereichDerSpanne("classical", 1200, 1900)).toBeNull();
    expect(bereichDerSpanne("blitz", 1000, 3000, "fide")).toBeNull();
  });
});
