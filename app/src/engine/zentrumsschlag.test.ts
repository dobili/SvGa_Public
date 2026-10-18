/**
 * Zentrumsschlag mit der echten Engine (Stockfish lite, ein Kern) an den Abbildungen aus C1.1
 * und C1.2: Abb. 2.40 (3... Sxe4?! 4. De2!), 2.113 (7. dxe5 … Sxe4!), 2.24 (6... Sxe4? 7. dxc5)
 * gewinnen den Bauern nicht; in Abb. 2.29 hängt d5 wirklich (Zielbilanz des Buches: teils).
 */
import { Chess } from "chessops/chess";
import { parseFen } from "chessops/fen";
import { parseSquare } from "chessops/util";
import { afterAll, describe, expect, it } from "vitest";
import { abbildung } from "../schach/buchabbildungen.testhilfe";
import { festeTiefe, nodeEngine, ZEIT_UNBEACHTET_MS } from "./nodeEngine.testhilfe";
import { billigsterSchlag, materialFuer, pruefeZentrumsschlag } from "./zentrumsschlag";

const TESTFRIST_MS = 60_000;

describe("Zentrumsschlag mit Stockfish", () => {
  const dienst = nodeEngine();
  afterAll(() => dienst.beendeEngine());
  // Feste Tiefe statt fester Zeit: gleiches Ergebnis auf jedem Rechner (nodeEngine.testhilfe.ts).
  const bewerter = festeTiefe(dienst);

  it.each([
    ["2.40", "e4", "f6e4"],
    ["2.113", "e5", "d4e5"],
    ["2.24", "e4", "f6e4"],
  ])(
    "Abb. %s: Der Schlag auf %s gewinnt den Bauern nicht",
    async (nummer, feld, schlag) => {
      const pruefung = await pruefeZentrumsschlag(
        bewerter,
        abbildung(nummer).fen,
        feld,
        ZEIT_UNBEACHTET_MS,
      );
      expect(pruefung?.schlag).toBe(schlag);
      expect(pruefung?.haengt).toBe(false);
      expect(pruefung?.gewinn).toBeLessThan(1);
    },
    TESTFRIST_MS,
  );

  it(
    "Abb. 2.29: Der Bauer d5 hängt wirklich (11. Lxd5)",
    async () => {
      const pruefung = await pruefeZentrumsschlag(
        bewerter,
        abbildung("2.29").fen,
        "d5",
        ZEIT_UNBEACHTET_MS,
      );
      expect(pruefung?.schlag).toBe("c4d5");
      expect(pruefung?.haengt).toBe(true);
    },
    TESTFRIST_MS,
  );
});

describe("Zentrumsschlag ohne Engine", () => {
  it("schlägt mit der billigsten Figur und zählt Material mit Faustwerten", () => {
    const pos = Chess.fromSetup(parseFen(abbildung("2.113").fen).unwrap()).unwrap();
    const e5 = parseSquare("e5");
    if (e5 === undefined) throw new Error("e5");
    // Bauer d4 vor Springer f3 (Kapitel 1: „Schlage zunächst mit deiner billigsten Figur“).
    expect(billigsterSchlag(pos, e5)).toEqual({ from: parseSquare("d4"), to: e5 });
    expect(materialFuer(pos.board, "white")).toBe(0);
  });

  it("ohne legalen Schlag gibt es keine Prüfung", async () => {
    const keinBewerter = {
      bewerte: () => Promise.reject(new Error("darf nicht rechnen")),
    };
    expect(await pruefeZentrumsschlag(keinBewerter, abbildung("2.11").fen, "e4", 1)).toBeNull();
  });
});
