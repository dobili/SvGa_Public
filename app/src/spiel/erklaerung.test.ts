/** Tests der Erklärung im Rückblick an Stellungen aus dem Buch (dieselben wie in engine/fehlerart.test.ts). */
import { describe, expect, it } from "vitest";
import { erklaereZug, fehlerartText } from "./erklaerung";
import { fenNach, uciZuSan } from "./zuege";

/** Abb. 1.13, Schwarz am Zug nach 2. Dh5: Weiß droht Dxe5+. */
const NACH_DH5 = "rnbqkbnr/pppp1ppp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2";
/** Schwarz am Zug: Läufer nach a3, der Bauer b2 schlägt ihn (W1). */
const LAEUFER_A3 = "rnbqkbnr/pppp1ppp/8/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq - 1 2";
/** Schwarz am Zug: Dd6?? läuft in die Springergabel Sf7+ (W6). */
const GABEL = "5r1k/5ppp/q7/6N1/8/8/8/6K1 b - - 0 1";
/** Mittelspiel, Weiß am Zug: Sxd5 verliert den Springer gegen einen Bauern (exd5). */
const MITTELSPIEL = "r2q1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R2Q1RK1 w - - 0 11";
/** Abb. 1.8 vor 3... Df6: Schwarz hat Springer g8 und Läufer c8, f8 zu Hause. */
const VOR_DF6 = "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3";

function danach(fen: string, uci: string): string {
  const san = uciZuSan(fen, uci);
  const neu = san ? fenNach(fen, san) : null;
  if (!neu) throw new Error(`Zug ${uci} geht nicht in ${fen}`);
  return neu;
}

describe("Erklärung im Rückblick", () => {
  it("2... Sf6?? lässt die Drohung Dxe5+ stehen: Satz, roter Pfeil h5–e5, rotes Feld e5", () => {
    const e = erklaereZug(NACH_DH5, danach(NACH_DH5, "g8f6"), "g8f6", "h5e5", 3);
    expect(e?.text).toBe("lässt die Drohung Dxe5+ stehen (gewinnt den Bauern).");
    expect(e?.marken).toEqual([
      { typ: "pfeil", farbe: "rot", von: "h5", nach: "e5" },
      { typ: "feld", farbe: "rot", feld: "e5" },
    ]);
    expect(fehlerartText(NACH_DH5, "g8f6", "h5e5")).toBe("eine Drohung ignoriert");
  });

  it("2... La3?? lässt den Läufer hängen: Feld a3 mit W1", () => {
    const e = erklaereZug(LAEUFER_A3, danach(LAEUFER_A3, "f8a3"), "f8a3", "b2a3", 3);
    expect(e?.text).toBe("lässt Läufer a3 ungedeckt hängen (W1).");
    expect(e?.marken).toEqual([{ typ: "feld", farbe: "rot", feld: "a3", text: "W1" }]);
  });

  it("Dd6?? stellt die Dame in die Springergabel: Pfeil g5–f7, Ziele h8 und d6", () => {
    const e = erklaereZug(GABEL, danach(GABEL, "a6d6"), "a6d6", "g5f7", 9);
    expect(e?.text).toBe("übersieht die Gabel: Springer g5 nach f7 trifft d6, h8.");
    expect(e?.marken).toContainEqual({ typ: "pfeil", farbe: "rot", von: "g5", nach: "f7" });
    expect(e?.marken).toContainEqual({ typ: "feld", farbe: "rot", feld: "d6" });
  });

  it("Sxd5?? ist ein Schlagreflex: die Antwort exd5 als roter Pfeil", () => {
    const e = erklaereZug(MITTELSPIEL, danach(MITTELSPIEL, "c3d5"), "c3d5", "e6d5", 2);
    expect(e?.text).toBe("schlägt aus Schlagreflex (W5): Nach exd5 steht es schlechter.");
    expect(e?.marken).toEqual([{ typ: "pfeil", farbe: "rot", von: "e6", nach: "d5" }]);
  });

  it("3... Df6?! ist die verfrühte Dame; ein unauffälliger Zug hat keine Erklärung", () => {
    expect(erklaereZug(VOR_DF6, danach(VOR_DF6, "d8f6"), "d8f6", "", 1)?.text).toBe(
      "zieht die Dame zu früh (Kapitel 1): Erst die Leichtfiguren entwickeln.",
    );
    expect(erklaereZug(NACH_DH5, danach(NACH_DH5, "b8c6"), "b8c6", "", 0)).toBeNull();
    expect(erklaereZug("unsinn", "unsinn", "e2e4", "", 0)).toBeNull();
  });
});

describe("Ausgelassener Schlag (0.2.85)", () => {
  // Partie des Autors gegen Mia: 9... Sxf4 und 10. Tab1?? statt exf4.
  const ZUEGE = "d4 d6 Bf4 Qd7 e3 e6 Nf3 b6 c3 Ba6 Bxa6 Nxa6 Nbd2 Nb4 O-O Nd3 Qc2 Nxf4".split(" ");
  const GRUND = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const vorher = ZUEGE.reduce<string>((fen, san) => fenNach(fen, san) ?? fen, GRUND);
  const danach = fenNach(vorher, "Rab1") ?? "";

  it("nach dem Schlag des Gegners: „schlägt nicht zurück“, rotes Feld f4", () => {
    const e = erklaereZug(vorher, danach, "a1b1", "f4g6", 6.2, "e3f4", "Nxf4");
    expect(e?.text).toBe(
      "schlägt nicht zurück: exf4 nahm den Springer f4 wieder, so fehlt das Material (Kapitel 1, Abtausch).",
    );
    expect(e?.marken).toEqual([{ typ: "feld", farbe: "rot", feld: "f4" }]);
  });

  it("ohne vorigen Schlag und bei kleinem Verlust kein Satz zum Schlag", () => {
    const klein = erklaereZug(vorher, danach, "a1b1", "f4g6", 0.6, "e3f4", "Nxf4");
    expect(klein?.text ?? "").not.toContain("schlägt nicht zurück");
    const ohne = erklaereZug(vorher, danach, "a1b1", "f4g6", 6.2, "e3f4", null);
    expect(ohne?.text ?? "").not.toContain("schlägt nicht zurück");
  });
});
