/**
 * Tests für „jeden Kandidaten bis zur Ruhe“ (Vorschlag B1, seit 0.2.33) an Abb. 7.14: mit fester
 * Fortsetzung (ohne Engine) und mit der echten Engine (Stockfish lite, ein Kern).
 * 1. Te8+ verliert den Turm, 2. Th8+ Kxh8 Sxf7+ Kg8 Sxd6 gewinnt die Dame (+5).
 */
import { afterAll, describe, expect, it } from "vitest";
import { abbildung } from "../schach/buchabbildungen.testhilfe";
import type { Bewertung } from "./engineDienst";
import { kandidatenwert, rechneKandidatenruhe } from "./kandidatenruhe";
import { festeTiefe, nodeEngine, ZEIT_UNBEACHTET_MS } from "./nodeEngine.testhilfe";
import type { Bewerter } from "./ruhe";

/** Ein Bewerter, der nach dem Kandidaten eine feste Fortsetzung mit festem Wert liefert. */
function feste(zuege: string[], bauern: number): Bewerter {
  return {
    bewerte: () => {
      const bewertung: Bewertung = {
        varianten: [{ nummer: 1, wert: { art: "bauern", bauern }, zuege }],
        tiefe: 20,
        knotenJeSekunde: 0,
        rechenzeitMs: 0,
        startzeitMs: 0,
        besterZug: zuege[0] ?? null,
      };
      return Promise.resolve(bewertung);
    },
  };
}

const FEN_7_14 = abbildung("7.14").fen;
const TESTFRIST_MS = 60_000;
/** Ein Bauer Unterschied liegt bei begrenzter Suchtiefe im Rahmen der Engine. */
const HOECHSTENS_EIN_BAUER = 1;

describe("Kandidat bis zur Ruhe mit fester Fortsetzung (Abb. 7.14)", () => {
  it("2. Th8+: Kxh8 Sxf7+ Kg8 Sxd6, Ruhe, +5, gewinnt die Dame", async () => {
    const fortsetzung = ["g8h8", "g5f7", "h8g8", "f7d6", "b7b6", "c3c4", "a8d8"];
    const k = await rechneKandidatenruhe(feste(fortsetzung, 6.2), FEN_7_14, "h1h8", 1);
    expect(k?.zuege).toEqual(["h1h8", "g8h8", "g5f7", "h8g8", "f7d6"]);
    expect(k?.ende).toBe("ruhe");
    expect(k?.bilanz).toBe(5);
    expect(k?.figur).toBe("queen");
    expect(k?.matt).toBeNull();
  });

  it("1. Te8+: Txe8, danach ruhig: −5, verliert einen Turm", async () => {
    const k = await rechneKandidatenruhe(feste(["a8e8", "b2b3", "b7b6"], -4), FEN_7_14, "e1e8", 1);
    expect(k?.zuege).toEqual(["e1e8", "a8e8"]);
    expect(k?.bilanz).toBe(-5);
    expect(k?.figur).toBe("rook");
  });

  it("ein Kandidat, der nicht geht, liefert null", async () => {
    expect(await rechneKandidatenruhe(feste([], 0), FEN_7_14, "g5g7", 1)).toBeNull();
  });

  it("Matt mit dem Kandidaten selbst: ohne Engine, „setzt“ (Abb. 7.1: Dxa8#)", async () => {
    const fen = "r6k/p5pp/8/3Q4/8/8/5PPP/6K1 w - - 0 1";
    const k = await rechneKandidatenruhe(feste([], 0), fen, "d5a8", 1);
    expect(k?.matt).toBe("setzt");
    expect(k && kandidatenwert(k, "white")).toBeGreaterThan(100);
  });
});

describe("Kandidaten bis zur Ruhe mit Stockfish (Abb. 7.14)", () => {
  const dienst = nodeEngine();
  afterAll(() => dienst.beendeEngine());
  // Feste Tiefe statt fester Zeit: gleiches Ergebnis auf jedem Rechner (nodeEngine.testhilfe.ts).
  const bewerter = festeTiefe(dienst);

  it(
    "Th8+ gewinnt die Dame und ist stärker als Te8+, das nichts gewinnt",
    async () => {
      const th8 = await rechneKandidatenruhe(bewerter, FEN_7_14, "h1h8", ZEIT_UNBEACHTET_MS);
      const te8 = await rechneKandidatenruhe(bewerter, FEN_7_14, "e1e8", ZEIT_UNBEACHTET_MS);
      expect(th8?.bilanz ?? 0).toBeGreaterThan(0);
      expect(th8?.figur).toBe("queen");
      // Te8+ Txe8 holt sich die Engine über Th8+ und die Gabel zurück, gewinnt aber nichts
      // Wesentliches. Lokal ergibt das 0 bei jeder Rechenzeit (50 bis 2000 ms); auf dem
      // langsameren Rechner der CI endete die Linie einmal einen Bauern später (+1, 16.10.2026).
      expect(te8?.bilanz ?? 0).toBeLessThanOrEqual(HOECHSTENS_EIN_BAUER);
      if (th8 && te8)
        expect(kandidatenwert(th8, "white")).toBeGreaterThan(kandidatenwert(te8, "white"));
    },
    TESTFRIST_MS,
  );
});
