/**
 * Tests für das Finden von Angreifern, besonders Batterien.
 * Regel: Kapitel 1, „Zählen in der Praxis: der Bauernhebel“ und Lösung „Zählen vor dem Vorstoß“.
 */
import { describe, expect, it } from "vitest";
import { angreifer } from "./angreifer";
import { feldAusName, feldname, stellungAusFen } from "./stellung";

function felder(fen: string, feld: string, farbe: "white" | "black", mitBatterie = true) {
  const stellung = stellungAusFen(fen);
  const ziel = feldAusName(feld);
  if (!stellung.ok || ziel === null) throw new Error("Testdaten fehlerhaft");
  return angreifer(stellung.wert.brett, ziel, farbe, mitBatterie).map((a) => feldname(a.feld));
}

const ABB_1_26 = "r1b1kbnr/pp3ppp/1qn1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1R w KQkq - 4 6";

describe("angreifer", () => {
  it("findet die Dame b6 in der Batterie hinter dem Bauern c5 (Abb. 1.26)", () => {
    expect(felder(ABB_1_26, "d4", "black")).toEqual(["c5", "c6", "b6"]);
  });

  it("ohne Batterie zählt die Dame b6 nicht", () => {
    expect(felder(ABB_1_26, "d4", "black", false)).toEqual(["c5", "c6"]);
  });

  it("mehrstufige Batterie: Turm hinter Turm hinter Dame", () => {
    expect(felder("4k3/8/8/8/8/3Q4/3R4/3RK3 w - - 0 1", "d7", "white")).toEqual(["d3", "d2", "d1"]);
  });

  it("eine gegnerische Figur unterbricht die Batterie", () => {
    expect(felder("4k3/8/8/8/3p4/3Q4/3r4/3RK3 w - - 0 1", "d4", "white")).toEqual(["d3"]);
  });

  it("Dame d8 hinter dem Springer d7 zählt nicht (Lösung „Zählen vor dem Vorstoß“)", () => {
    expect(felder("3qk3/3n4/2p1p3/3p4/2PP4/8/8/4K3 b - - 0 1", "d5", "black")).toEqual([
      "c6",
      "e6",
    ]);
  });
});
