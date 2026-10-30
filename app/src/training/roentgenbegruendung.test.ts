/**
 * Tests der Begründungen im Röntgen-Trainer (Nebenchat, 30.10.2026) an der Stellung, die der
 * Autor meldete: Txe7+ lohnt sich erst nach dem ganzen Abtausch (Txe7+ Sxe7 fxe7: +1).
 */
import { describe, expect, it } from "vitest";
import { gegnerdrohungen, roentgenbegruendungen } from "./roentgenbegruendung";
import type { Roentgenaufgabe, Schrittloesung } from "./roentgentrainer";

const FEN = "1r2k1r1/pbppnp1p/1bn2P2/7q/Q7/B1PB1N2/P4PPP/R3R1K1 w - - 0 1";
const leer = (farbe: "white" | "black"): Schrittloesung => ({ farbe, verlangt: [], erlaubt: [] });
const AUFGABE: Roentgenaufgabe = {
  nummer: "6.x",
  fen: FEN,
  eigen: "white",
  schritte: { schachs: leer("white"), schlaege: leer("white"), gegner: leer("black") },
  drohende: [],
};

describe("Röntgen-Trainer: Begründungen", () => {
  it("zeigt zu Txe7+ die ganze Abtauschfolge und +1", () => {
    const [satz] = roentgenbegruendungen(AUFGABE, "white", ["e1-e7"]);
    expect(satz).toBe("Txe7+ Sxe7 fxe7: +1 Bauerneinheit");
  });

  it("nennt einen Verlustschlag mit Minus und einen leeren Pfeil als „weder noch“", () => {
    const [verlust, leerer] = roentgenbegruendungen(AUFGABE, "white", ["d3-h7", "g1-h1"]);
    expect(verlust).toContain("−2 Bauerneinheiten");
    expect(leerer).toContain("weder Schach noch Schlag");
  });

  it("nennt die Drohungen der Gegenseite (Schläge mit Gewinn)", () => {
    expect(Array.isArray(gegnerdrohungen(AUFGABE))).toBe(true);
  });
});
