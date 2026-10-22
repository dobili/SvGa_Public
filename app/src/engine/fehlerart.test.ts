/** Tests der Fehlerarten (Konzept 8.2) an Stellungen aus dem Buch, geprüft mit den Werkzeugen. */
import { describe, expect, it } from "vitest";
import { eingestellt } from "./fehlerart-neu";
import { probe } from "./zugprobe";
import { alleZuege, fehlerartIn, fehlerartVon, istDamenopfer, lageVon } from "./fehlerart";

/** Abb. 1.8 vor 3... Df6: Schwarz hat Springer g8 und Läufer c8, f8 zu Hause. */
const VOR_DF6 = "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3";
/** Abb. 1.13, Schwarz am Zug nach 2. Dh5: Weiß droht Dxe5+. */
const NACH_DH5 = "rnbqkbnr/pppp1ppp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2";
/** Mittelspiel, Weiß am Zug: Sxd5 verliert den Springer gegen einen Bauern (exd5). */
const MITTELSPIEL = "r2q1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R2Q1RK1 w - - 0 11";
/** Zweispringerspiel nach 5. exd5: 5... Sxd5?! erlaubt 6. Sxf7 (Gabel, Kapitel 7). */
const ZWEISPRINGER = "r1bqkb1r/ppp2ppp/2n2n2/3Pp1N1/2B5/8/PPPP1PPP/RNBQK2R b KQkq - 0 5";
/** Schwarz am Zug: Dd6?? läuft in die Springergabel Sf7+ (W6 Gabelgeometrie); f7 deckt der Turm. */
const GABEL = "5r1k/5ppp/q7/6N1/8/8/8/6K1 b - - 0 1";
/** Schwarz am Zug: Te8?? gibt die Deckung von f7 auf, Sxf7+ gabelt König und Dame. */
const DECKUNG = "5r1k/5ppp/3q4/6N1/8/8/8/6K1 b - - 0 1";
/** Italienisch im zwölften Zug, Weiß kann rochieren. */
const ZUG_ZWOELF = "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 6 12";

describe("Fehlerart", () => {
  it("verfrühte Dame: 3... Df6 mit drei Leichtfiguren zu Hause", () => {
    expect(fehlerartVon(VOR_DF6, ["d8f6"], 1)).toBe("verfruehteDame");
  });

  it("Drohung ignoriert: Dxe5+ droht, und der Zug lässt es zu", () => {
    expect(fehlerartVon(NACH_DH5, ["g8f6", "h5e5", "f8e7"], 3)).toBe("drohungIgnoriert");
    expect(fehlerartVon(NACH_DH5, ["g8e7", "h5e5"], 1)).toBe("drohungIgnoriert");
    // 2... Sc6 deckt e5: keine Drohung mehr, keine Figur hängt → ungenau.
    expect(fehlerartVon(NACH_DH5, ["b8c6", "h5f7", "e8f7"], 3)).toBe("ungenau");
  });

  it("Figur hängen (W1): Läufer nach a3, der Bauer b2 schlägt ihn", () => {
    const fen = "rnbqkbnr/pppp1ppp/8/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq - 1 2";
    expect(fehlerartVon(fen, ["f8a3", "b2a3"], 3)).toBe("figurHaengen");
    // Ohne Antwort der Engine erkennt die Abtauschrechnung das Gleiche.
    expect(fehlerartVon(fen, ["f8a3"], 3)).toBe("figurHaengen");
  });

  it("Schlagreflex (W5): Sxd5 exd5 verliert den Springer gegen einen Bauern", () => {
    expect(fehlerartVon(MITTELSPIEL, ["c3d5"], 0)).toBe("schlagreflex");
    // Ein Schlag, den die Engine mit mindestens einem Bauern Verlust bewertet, ebenso.
    expect(fehlerartVon(MITTELSPIEL, ["d3h7", "g8h7"], 2)).toBe("schlagreflex");
  });

  it("Köder annehmen (W5): 5... Sxd5?! gewinnt laut Abtausch, die Engine widerlegt es", () => {
    expect(fehlerartVon(ZWEISPRINGER, ["f6d5", "g5f7", "e8f7", "d1f3"], 1.5)).toBe("schlagreflex");
  });

  it("Taktik übersehen (Kapitel 7): Antwort der Engine ist eine Gabel", () => {
    expect(fehlerartVon(DECKUNG, ["f8e8", "g5f7", "h8g8", "f7d6"], 9)).toBe("taktikUebersehen");
    expect(fehlerartVon(DECKUNG, ["f8e8"], 9)).toBe("ungenau");
  });

  it("Taktik übersehen: der Zug stellt die Dame in eine Springergabel (W6)", () => {
    // Ohne Turm auf f8 gewinnt Sf7+ die Dame: die Widerlegung spielt die Gabel und gewinnt
    const echt = "r6k/6pp/q7/6N1/8/8/8/6K1 b - - 0 1";
    expect(fehlerartVon(echt, ["a6d6", "g5f7", "h8g8", "f7d6"], 9)).toBe("taktikUebersehen");
    expect(fehlerartVon(GABEL, ["a6a2"], 0.3)).toBe("ungenau");
  });

  it("keine Taktik, wenn die Gabel nichts gewinnt oder die Engine sie nicht spielt (0.2.118)", () => {
    // Hier deckt der Turm f7: Sf7+ Txf7 verliert den Springer, also kein Gabelfehler
    expect(fehlerartVon(GABEL, ["a6d6", "g5f7", "f8f7"], 1)).not.toBe("taktikUebersehen");
    // Ohne Widerlegung der Engine zählt kein Motiv
    expect(fehlerartVon("r6k/6pp/q7/6N1/8/8/8/6K1 b - - 0 1", ["a6d6"], 9)).not.toBe(
      "taktikUebersehen",
    );
  });

  it("König in der Mitte: ab dem zehnten Zug eine mögliche Rochade ausgelassen", () => {
    expect(fehlerartVon(ZUG_ZWOELF, ["a2a3"], 0.6)).toBe("koenigMitte");
    expect(fehlerartVon(ZUG_ZWOELF, ["e1g1"], 0)).not.toBe("koenigMitte");
  });

  it("unlesbarer oder illegaler Zug: ungenau", () => {
    expect(fehlerartVon(NACH_DH5, ["zz"], 3)).toBe("ungenau");
    expect(fehlerartVon(NACH_DH5, ["e8e6"], 3)).toBe("ungenau");
    expect(fehlerartVon("kein fen", ["e2e4"], 3)).toBe("ungenau");
  });
});

describe("Fehlerarten seit 0.2.118 (Lichess-Auswertung)", () => {
  /** Weiß am Zug, d4 deckt den Springer e5 gegen den Bauern d6. */
  const SPRINGER = "4k3/8/3p4/4N3/3P4/8/8/4K3 w - - 0 1";
  it("Figur hängen über die Widerlegung, Bauer eingestellt", () => {
    const regeln = lageVon(SPRINGER)?.regeln;
    const springer = regeln && probe(regeln, "d4d5");
    expect(springer && eingestellt(springer, ["e8d7"])).toBeNull();
    expect(springer && eingestellt(springer, ["d6e5", "e1e2"])?.art).toBe("figurHaengen");
    const bauer = "4k3/8/3n4/8/2P5/1P6/8/4K3 w - - 0 1";
    expect(fehlerartVon(bauer, ["b3b4", "d6c4", "e1e2"], 1)).toBe("bauerEingestellt");
  });

  it("Schlag verpasst, Bauern- und Königszug ohne Not", () => {
    const schlag = "4k3/8/8/4n3/8/8/PP2R3/4K3 w - - 0 1";
    const lage = lageVon(schlag);
    expect(lage && fehlerartIn(lage, "a2a3", ["e8d7"], 3, "e2e5")).toBe("schlagVerpasst");
    const mitte = "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQ1RK1 w kq - 6 6";
    expect(fehlerartVon(mitte, ["a2a3", "f6g4"], 0.6)).toBe("bauernzugOhneNot");
    expect(fehlerartVon(mitte, ["g1h1", "f6g4"], 0.6)).toBe("koenigszugOhneNot");
    expect(fehlerartVon(mitte, ["a2a3"], 0.2)).toBe("ungenau");
  });
});

describe("Damenopfer (Konzept 8.2)", () => {
  it("Dh4?? verliert die Dame gegen nichts; Sc6 nicht", () => {
    const lage = lageVon(NACH_DH5);
    expect(lage && istDamenopfer(lage, "d8h4")).toBe(true);
    expect(lage && istDamenopfer(lage, "b8c6")).toBe(false);
  });
});

describe("Züge in der Schreibweise der Engine", () => {
  it("Rochade als Königszug um zwei Felder, Umwandlung in die Dame", () => {
    const lage = lageVon(ZUG_ZWOELF);
    expect(lage && alleZuege(lage)).toContain("e1g1");
    expect(lage && alleZuege(lage)).not.toContain("e1h1");
    const umwandlung = lageVon("8/4P3/8/8/8/8/k7/4K3 w - - 0 1");
    expect(umwandlung && alleZuege(umwandlung)).toContain("e7e8q");
  });
});
