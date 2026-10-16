/**
 * Plan des Gegners mit der echten Engine (Stockfish lite, ein Kern): Was würde er spielen?
 *
 * Abb. 6.13 (Schwarz am Zug): Weiß droht Lxh7+, das griechische Geschenk. Im Schach gibt es
 * keinen Nullzug (Abb. 5.12).
 */
import { createRequire } from "node:module";
import { afterAll, describe, expect, it } from "vitest";
import { abbildung } from "../schach/buchabbildungen.testhilfe";
import { EngineDienst, type Kanal } from "./engineDienst";
import { fenNullzug, rechneGegnerplan } from "./gegnerplan";

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

const RECHENZEIT_MS = 500;
const TESTFRIST_MS = 60_000;
const VARIANTEN = 3;

describe("Gegnerplan mit Stockfish", () => {
  const dienst = new EngineDienst(nodeKanal);
  afterAll(() => dienst.beendeEngine());

  it("Nullzug: die andere Seite kommt an den Zug, nicht aber im Schach", () => {
    expect(fenNullzug(abbildung("6.13").fen)?.split(" ")[1]).toBe("w");
    expect(fenNullzug(abbildung("5.12").fen)).toBeNull();
  });

  it(
    "Abb. 6.13: Wäre Weiß am Zug, spielte er Lxh7+",
    async () => {
      const plan = await rechneGegnerplan(dienst, abbildung("6.13").fen, RECHENZEIT_MS, VARIANTEN);
      expect(plan?.varianten[0]?.zuege[0]).toBe("d3h7");
    },
    TESTFRIST_MS,
  );
});
