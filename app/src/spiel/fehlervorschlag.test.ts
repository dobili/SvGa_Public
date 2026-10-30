/** Tests des Vorschlags für die Fehlerdatenbank: erkannte Fehlerart → Kapitel der Checkliste. */
import { describe, expect, it } from "vitest";
import { kapitelvorschlag } from "./fehlervorschlag";

/** Abb. 1.13 nach 2. Dh5: Weiß droht Dxe5+ (Schwarz am Zug). */
const NACH_DH5 = "rnbqkbnr/pppp1ppp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2";
/** Ruhige Mittelspielstellung (aus den Tests der Fehlerarten). */
const MITTELSPIEL = "r2q1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R2Q1RK1 w - - 0 11";

describe("Vorschlag für die Fehlerdatenbank", () => {
  it("eine stehengelassene Drohung gehört zu Kapitel 1 (Schach oder Schlag übersehen)", () => {
    expect(kapitelvorschlag(NACH_DH5, "Nf6", "h5e5", 3, "b8c6")).toBe(1);
  });

  it("eine hängende Figur ebenso", () => {
    expect(kapitelvorschlag(MITTELSPIEL, "Nd5", "", 3, null)).toBe(1);
  });

  it("ohne klare Fehlerart oder mit unlesbarem Zug kein Vorschlag", () => {
    expect(kapitelvorschlag(MITTELSPIEL, "a3", "", 0.1, null)).toBeNull();
    expect(kapitelvorschlag(MITTELSPIEL, "Qxh8", "", 1, null)).toBeNull();
    expect(kapitelvorschlag("kein fen", "e4", "", 1, null)).toBeNull();
  });
});
