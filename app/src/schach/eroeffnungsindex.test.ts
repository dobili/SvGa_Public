/**
 * Tests der Buchzüge ab einer Stellung (Eröffnungsmodus beim Spiel gegen die Engine, Konzept 8.3)
 * mit dem Index aus den Buchvarianten der Kapitel 2 und 3.
 */
import { describe, expect, it } from "vitest";
import { ladeKapitel } from "./buchabbildungen.testhilfe";
import {
  baueEroeffnungsindex,
  buchzuegeAb,
  buchzuegeZu,
  eroeffnungsnamen,
  hauptlinieVon,
} from "./eroeffnungsindex";

const INDEX = baueEroeffnungsindex([ladeKapitel(2), ladeKapitel(3)]);
const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
/** Nach 1. e4 e5 2. Sf3, Schwarz am Zug. */
const NACH_SF3 = "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2";
/** Eine Stellung, die in keiner Buchvariante vorkommt (1. h4 a5). */
const AUSSERHALB = "rnbqkbnr/1ppppppp/8/p7/7P/8/PPPPPPP1/RNBQKBNR w KQkq - 0 2";

describe("buchzuegeAb", () => {
  it("in der Grundstellung: die Buchanfänge, darunter 1. e4 und 1. d4", () => {
    const zuege = buchzuegeAb(INDEX, GRUNDSTELLUNG);
    expect(zuege).toContain("e4");
    expect(zuege).toContain("d4");
  });

  it("nach 1. e4 e5 2. Sf3: Sc6 steht im Buch", () => {
    expect(buchzuegeAb(INDEX, NACH_SF3)).toContain("Nc6");
  });

  it("Zugzähler zählen nicht, nur Figuren, Zugrecht und Rochade", () => {
    const andereZaehler = NACH_SF3.replace(/ 1 2$/, " 0 7");
    expect(buchzuegeAb(INDEX, andereZaehler)).toEqual(buchzuegeAb(INDEX, NACH_SF3));
  });

  it("außerhalb des Buches: keine Züge", () => {
    expect(buchzuegeAb(INDEX, AUSSERHALB)).toEqual([]);
  });

  it("enthält keine mit „?“ markierten Züge", () => {
    for (const [schluessel, zeichen] of INDEX.buchzuege) {
      if (!zeichen.includes("?")) continue;
      const [stellung, san] = schluessel.split("|");
      expect(buchzuegeAb(INDEX, `${stellung} - 0 1`)).not.toContain(san);
    }
  });
});

describe("Eröffnung vorgeben (0.2.39)", () => {
  it("nennt die Eröffnungen des Buches, Spanisch darunter, ohne Doppelte", () => {
    const namen = eroeffnungsnamen(INDEX);
    expect(namen.some((n) => n.startsWith("Spanisch"))).toBe(true);
    expect(new Set(namen).size).toBe(namen.length);
  });

  it("Spanisch: aus der Grundstellung nur e4, nach 1. e4 e5 2. Sf3 Sc6 nur Lb5", () => {
    const spanisch = eroeffnungsnamen(INDEX).find((n) => n.startsWith("Spanisch")) ?? "";
    expect(buchzuegeZu(INDEX, GRUNDSTELLUNG, spanisch)).toEqual(["e4"]);
    const nachSc6 = "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3";
    expect(buchzuegeZu(INDEX, nachSc6, spanisch)).toEqual(["Bb5"]);
    // Außerhalb der Eröffnung gibt es keine Züge mehr.
    expect(buchzuegeZu(INDEX, AUSSERHALB, spanisch)).toEqual([]);
  });

  it("die Hauptvariante von Spanisch beginnt mit 1. e4 e5 2. Sf3 Sc6 3. Lb5", () => {
    const spanisch = eroeffnungsnamen(INDEX).find((n) => n.startsWith("Spanisch")) ?? "";
    expect(hauptlinieVon(INDEX, spanisch).slice(0, 5)).toEqual(["e4", "e5", "Nf3", "Nc6", "Bb5"]);
  });
});
