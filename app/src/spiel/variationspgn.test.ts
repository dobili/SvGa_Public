/**
 * Tests für PGN-Export und -Import der Varianten (Nebenvarianten, Kommentare, Zugzeichen).
 */
import { describe, expect, it } from "vitest";
import { ausStellung } from "../training/variationsquellen";
import type { Variation } from "../training/variationen";
import { variationAlsPgn, variationAusPgn, variationenAlsPgn } from "./variationspgn";

const JETZT = new Date("2026-11-01T10:00:00.000Z");
const GRUND = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const PETROFF_PGN =
  "1. e4 e5 2. Nf3 Nf6 3. Nxe5 d6 (3... Nxe4?! {gierig} 4. Qe2 Qe7 5. Qxe4 d6 6. d4 dxe5) 4. Nf3 Nxe4 *";

function gelesen(text: string): Variation {
  const ergebnis = variationAusPgn(text, "Import", JETZT);
  if (!ergebnis.ok) throw new Error(ergebnis.fehler.art);
  return ergebnis.variation;
}

describe("Export", () => {
  it("schreibt Titel, Kommentare, Zugzeichen und Nebenvarianten", () => {
    const v = {
      ...gelesen(PETROFF_PGN),
      titel: "Petroff-Falle",
      kommentar: "Warum Sxe4 nicht geht",
    };
    const pgn = variationAlsPgn(v);
    expect(pgn).toContain('[Event "Petroff-Falle"]');
    expect(pgn).toContain('[Date "2026.11.01"]');
    expect(pgn).not.toContain("[FEN");
    expect(pgn).toContain("{ Warum Sxe4 nicht geht }");
    expect(pgn).toContain("3. Nxe5 d6 ( 3... Nxe4?! { gierig } 4. Qe2");
    expect(pgn.trim().endsWith("*")).toBe(true);
  });

  it("schreibt eine andere Startstellung als FEN und mehrere Varianten hintereinander", () => {
    const fen = "4k3/8/8/8/8/8/4P3/4K3 w - - 0 1";
    const v = ausStellung("fen", fen, "Endspiel", JETZT);
    if (!v) throw new Error("Stellung");
    const pgn = variationenAlsPgn([v, v]);
    expect(pgn).toContain('[SetUp "1"]');
    expect(pgn).toContain(`[FEN "${fen}"]`);
    expect(pgn.match(/\[Event "Endspiel"\]/g)).toHaveLength(2);
  });

  it("liest den eigenen Export unverändert wieder ein", () => {
    const v = gelesen(PETROFF_PGN);
    const wieder = gelesen(variationAlsPgn(v));
    expect(wieder.zuege).toEqual(v.zuege);
    expect(wieder.startFen).toBe(GRUND);
  });
});

describe("Import", () => {
  it("liest Varianten, Kommentare ohne Befehle und NAGs", () => {
    const v = gelesen(
      '[Event "Studie"]\n\n{ Vorweg [%cal Ge2e4] } 1. e4 $1 { [%csl Re5] Zentrum } e5 (1... c5 $5 {Sizilianisch}) 2. Nf3 $10 *',
    );
    expect(v.titel).toBe("Studie");
    expect(v.kommentar).toBe("Vorweg");
    expect(v.quelle).toEqual({ art: "pgn" });
    expect(v.zuege[0]).toMatchObject({ zug: "e4", zeichen: "!", kommentar: "Zentrum" });
    expect(v.zuege[0]?.weiter.map((k) => k.zug)).toEqual(["e5", "c5"]);
    expect(v.zuege[0]?.weiter[1]).toMatchObject({ zeichen: "!?", kommentar: "Sizilianisch" });
    const sf3 = v.zuege[0]?.weiter[0]?.weiter[0];
    expect(sf3?.zug).toBe("Nf3");
    expect(sf3 && "zeichen" in sf3).toBe(false);
  });

  it("übersetzt deutsche Notation und nimmt Weiß – Schwarz als Titel", () => {
    const v = gelesen('[White "Anna"]\n[Black "Ben"]\n\n1. e4 e5 2. Sf3 Sc6 3. Lb5 *');
    expect(v.titel).toBe("Anna – Ben");
    expect(v.zuege[0]?.weiter[0]?.weiter[0]?.weiter[0]?.weiter[0]?.zug).toBe("Bb5");
  });

  it("lehnt Leeres, Unlesbares und Schachvarianten ab", () => {
    expect(variationAusPgn("  ", "x", JETZT)).toEqual({ ok: false, fehler: { art: "leer" } });
    const fischer =
      '[Variant "Chess960"]\n[FEN "bqnb1rkr/pp3ppp/3ppn2/2p5/5P2/P2P4/NPP1P1PP/BQ1BNRKR w HFhf - 2 9"]\n\n9. g3 *';
    expect(variationAusPgn(fischer, "x", JETZT)).toEqual({
      ok: false,
      fehler: { art: "variante" },
    });
    expect(variationAusPgn('[FEN "kaputt"]\n\n*', "x", JETZT)).toEqual({
      ok: false,
      fehler: { art: "unlesbar" },
    });
  });

  it("kürzt über der Grenze von 600 Zügen und meldet es", () => {
    const runde = "Nf3 Nf6 Ng1 Ng8 ";
    const text = `${runde.repeat(160)}*`;
    const ergebnis = variationAusPgn(text, "x", JETZT);
    expect(ergebnis.ok && ergebnis.gekuerzt).toBe(true);
  });
});
