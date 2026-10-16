/**
 * Rechnung bis zur Ruhe mit der echten Engine (Stockfish lite, ein Kern) an Abb. 7.14:
 * 1. Th8+ Kxh8 2. Sxf7+ Kg8 3. Sxd6, danach Ruhe; die Bilanz geht von 0 auf +5 (Dame und Bauer gegen Turm).
 */
import { createRequire } from "node:module";
import { afterAll, describe, expect, it } from "vitest";
import { abbildung } from "../schach/buchabbildungen.testhilfe";
import { EngineDienst, type Kanal } from "./engineDienst";
import type { Bewertung } from "./engineDienst";
import { inSchritten, rechneRuhe, type Bewerter } from "./ruhe";

interface NodeEngine {
  processCommand(befehl: string): void;
  terminate(): void;
}
type EngineFabrik = (art: string, beiZeile: (zeile: string) => void) => NodeEngine;
const benoetige = createRequire(import.meta.url);
const ladeEngine = benoetige("stockfish") as EngineFabrik;

function nodeKanal(): Kanal {
  let empfaenger: (zeile: string) => void = () => undefined;
  const sf = ladeEngine("lite-single", (zeile) => empfaenger(zeile));
  return {
    senden: (befehl) => sf.processCommand(befehl),
    beiZeile: (neu) => {
      empfaenger = neu;
    },
    beenden: () => sf.terminate(),
  };
}

const RECHENZEIT_MS = 800;
const TESTFRIST_MS = 60_000;

describe("Ruhe mit Stockfish", () => {
  const dienst = new EngineDienst(nodeKanal);
  afterAll(() => dienst.beendeEngine());

  it("Schritte zu höchstens vier Halbzügen", () => {
    expect(inSchritten(["a", "b", "c", "d", "e"])).toEqual([["a", "b", "c", "d"], ["e"]]);
  });

  it(
    "Abb. 7.14: Th8+ beginnt die Hauptvariante, die Bilanz dreht sich zugunsten von Weiß",
    async () => {
      const ruhe = await rechneRuhe(dienst, abbildung("7.14").fen, RECHENZEIT_MS);
      expect(ruhe?.zuege[0]).toBe("h1h8");
      expect(ruhe?.materialVorher).toBe(0);
      expect(ruhe?.materialNachher ?? 0).toBeGreaterThan(0);
      expect(ruhe?.ende).not.toBe("matt");
    },
    TESTFRIST_MS,
  );
});

/** Ein Bewerter, der eine feste Hauptvariante liefert (ohne Engine). */
function feste(zuege: string[]): Bewerter {
  return {
    bewerte: () => {
      const bewertung: Bewertung = {
        varianten: [{ nummer: 1, wert: { art: "bauern", bauern: 7.4 }, zuege }],
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

describe("Ruhe ohne Engine (feste Varianten)", () => {
  // Abb. 7.14, die lange Variante aus dem Nachtest von 0.2.26: 1. Th8+ Kxh8 2. Sxf7+ Kg8 3. Sxd6
  // b6 4. c4 Td8 … 9. c5 bxc5 10. Sd6+. Ruhe ist nach 3. Sxd6 b6 4. c4 erreicht.
  const LANG = [
    "h1h8",
    "g8h8",
    "g5f7",
    "h8g8",
    "f7d6",
    "b7b6",
    "c3c4",
    "a8d8",
    "d6e4",
    "g8f7",
    "b2b3",
    "a7a5",
    "f2f3",
    "d8h8",
    "e1e2",
    "g7g6",
    "c4c5",
    "b6c5",
    "e4d6",
  ];

  it("Abb. 7.14: Ruhe nach 5 Halbzügen, auch wenn die Engine weiterrechnet (N56)", async () => {
    const ruhe = await rechneRuhe(feste(LANG), abbildung("7.14").fen, 1);
    expect(ruhe?.zuege).toEqual(["h1h8", "g8h8", "g5f7", "h8g8", "f7d6"]);
    expect(ruhe?.ende).toBe("ruhe");
    expect(ruhe?.materialVorher).toBe(0);
    expect(ruhe?.materialNachher).toBe(5);
  });

  it("endet die Variante mitten im Schlagabtausch, ist das Ende „offen“", async () => {
    const ruhe = await rechneRuhe(feste(LANG.slice(0, 5)), abbildung("7.14").fen, 1);
    expect(ruhe?.ende).toBe("offen");
    expect(ruhe?.zuege).toHaveLength(5);
  });

  it("eine ruhige Variante: nur der erste Zug", async () => {
    const ruhe = await rechneRuhe(feste(["b2b3", "a7a6", "a2a3"]), abbildung("7.14").fen, 1);
    expect(ruhe?.zuege).toEqual(["b2b3"]);
    expect(ruhe?.ende).toBe("ruhe");
  });
});
