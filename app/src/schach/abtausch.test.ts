/**
 * Tests der Abtauschrechnung an den Beispielen aus Kapitel 1.
 * Regel: Kapitel 1, „Schlage grundsätzlich zunächst mit deiner billigsten Figur“.
 */
import { describe, expect, it } from "vitest";
import { abtausch } from "./abtausch";
import { feldAusName, stellungAusFen } from "./stellung";

function rechne(fen: string, feld: string) {
  const stellung = stellungAusFen(fen);
  const ziel = feldAusName(feld);
  if (!stellung.ok || ziel === null) throw new Error("Testdaten fehlerhaft");
  return abtausch(stellung.wert.brett, ziel);
}

describe("abtausch", () => {
  it("Beispiel aus dem Text: Springer und Dame gegen Turm – zuerst der Springer", () => {
    // Weißer Springer c3 und Dame d1 greifen den Bauern d5 an, nur der Turm d8 deckt.
    // Buch: „hast du den Bauern sicher (+1), und schlägt der Turm zurück, … somit +3“.
    // Bei bestem Spiel schlägt der Turm nicht zurück, die Bilanz ist also +1.
    const ergebnis = rechne("3r2k1/8/8/3p4/8/2N5/8/3Q2K1 w - - 0 1", "d5");
    expect(ergebnis?.schlagfolge.map((s) => s.figur.rolle)).toEqual(["knight", "rook", "queen"]);
    expect(ergebnis?.bilanz).toBe(1);
    expect(ergebnis?.lohnendeSchlaege).toBe(1);
  });

  it("gleiche Anzahl lohnt sich nicht (Vorsicht-Kasten Kapitel 1)", () => {
    const ergebnis = rechne(
      "r1b1kbnr/pp3ppp/1qn1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1R w KQkq - 4 6",
      "d4",
    );
    expect(ergebnis?.bilanz).toBe(0);
    expect(ergebnis?.lohnendeSchlaege).toBe(0);
    expect(ergebnis?.schlagfolge).toHaveLength(6);
  });

  it("der König schlägt nicht auf ein gedecktes Feld", () => {
    // Schwarzer König e5 neben dem weißen Bauern d4, den der Springer f3 deckt.
    const ergebnis = rechne("8/8/8/4k3/3P4/5N2/8/6K1 b - - 0 1", "d4");
    expect(ergebnis?.schlagfolge).toHaveLength(0);
  });

  it("leeres Feld hat keinen Abtausch", () => {
    expect(rechne("8/8/8/4k3/8/8/8/6K1 w - - 0 1", "d4")).toBeNull();
  });
});

describe("abtausch nach Kapitel 7, „Rechnen statt hoffen“", () => {
  it("Abb. 7.30: drei gegen drei, aber der erste Verteidiger ist ein Bauer: Weiß verliert", () => {
    const ergebnis = rechne("3r2k1/p3bppp/4pn2/3p4/8/2N1P1P1/PP3PBP/3R2K1 w - - 0 1", "d5");
    expect(ergebnis?.seite).toBe("white");
    expect(ergebnis?.schlagfolge.map((s) => s.figur.rolle)).toEqual([
      "knight",
      "pawn",
      "bishop",
      "knight",
      "rook",
      "rook",
    ]);
    expect(ergebnis?.bilanz).toBeLessThan(0);
    expect(ergebnis?.lohnendeSchlaege).toBe(0);
  });

  it("Abb. 7.33: der Turm d1 hinter d2 ist der dritte Angreifer, Weiß gewinnt den Bauern", () => {
    const ergebnis = rechne("r2r2k1/pp3ppp/5n2/3p4/8/2N4P/PP1R1PP1/3R2K1 w - - 0 1", "d5");
    expect(ergebnis?.schlagfolge.map((s) => s.figur.rolle)).toEqual([
      "knight",
      "knight",
      "rook",
      "rook",
      "rook",
    ]);
    expect(ergebnis?.bilanz).toBe(1);
    expect(ergebnis?.lohnendeSchlaege).toBe(5);
  });

  it("Abb. 7.33, Turm a8 auf d7: drei Verteidiger, der Bauer ist gedeckt", () => {
    // Sxd5 Sxd5 gewinnt den Bauern, kostet aber den Springer; Txd5 danach verlöre den Turm.
    const ergebnis = rechne("3r2k1/pp1r1ppp/5n2/3p4/8/2N4P/PP1R1PP1/3R2K1 w - - 0 1", "d5");
    expect(ergebnis?.bilanz).toBe(-2);
    expect(ergebnis?.lohnendeSchlaege).toBe(0);
  });
});
