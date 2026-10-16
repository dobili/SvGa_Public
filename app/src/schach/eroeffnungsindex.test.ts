/**
 * Tests der Buchzüge ab einer Stellung (Eröffnungsmodus beim Spiel gegen die Engine, Konzept 8.3)
 * mit dem Index aus den Buchvarianten der Kapitel 2 und 3.
 */
import { describe, expect, it } from "vitest";
import { ladeKapitel } from "./buchabbildungen.testhilfe";
import { baueEroeffnungsindex, buchzuegeAb } from "./eroeffnungsindex";

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
