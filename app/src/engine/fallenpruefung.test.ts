/**
 * Fallenprüfung mit der echten Engine (Stockfish lite, ein Kern) an den Fallen aus Kapitel 4.
 *
 * Am Stopp-Moment ist der nächste Buchzug der Fehlzug: Lxf3?? (Abb. 4.11), axb4?? (Abb. 4.21),
 * Sxe4?? (Abb. 4.24), fxe5?? (Abb. 4.38). Gegenprobe: eine ungedeckte Dame ist ein Geschenk.
 */
import { Chess } from "chessops/chess";
import { parseFen } from "chessops/fen";
import { parseSan } from "chessops/san";
import { makeUci } from "chessops/util";
import { afterAll, describe, expect, it } from "vitest";
import { abbildung, naechsterBuchzug } from "../schach/buchabbildungen.testhilfe";
import { pruefeFalle } from "./fallenpruefung";
import { festeTiefe, nodeEngine, ZEIT_UNBEACHTET_MS } from "./nodeEngine.testhilfe";

/**
 * Früher je Rechnung 2 s: 500 ms reichten auf einem ausgelasteten GitHub-Rechner bei Abb. 4.24
 * einmal nicht (Urteil „geschenk“ statt „falle“, 15.10.2026). Seit 0.2.90 feste Tiefe
 * (nodeEngine.testhilfe.ts), damit das Ergebnis nicht mehr von der Last abhängt.
 */
const TESTFRIST_MS = 60_000;

/** Der Zug (SAN) in UCI-Schreibweise in der Stellung. */
function uci(fen: string, san: string): string {
  const setup = parseFen(fen);
  if (setup.isErr) throw new Error(fen);
  const pos = Chess.fromSetup(setup.value).unwrap();
  const zug = parseSan(pos, san);
  if (!zug) throw new Error(san);
  return makeUci(zug);
}

describe("Fallenprüfung mit Stockfish", () => {
  const dienst = nodeEngine();
  afterAll(() => dienst.beendeEngine());
  const bewerter = festeTiefe(dienst);

  it.each(["4.11", "4.21", "4.24", "4.38"])(
    "Abb. %s: Der nächste Buchzug ist eine Falle",
    async (nummer) => {
      const bild = abbildung(nummer);
      const san = naechsterBuchzug(nummer);
      if (!san) throw new Error(`kein Buchzug nach ${nummer}`);
      const farbe = bild.fen.split(" ")[1] === "w" ? "white" : "black";
      const pruefung = await pruefeFalle(
        bewerter,
        bild.fen,
        uci(bild.fen, san),
        farbe,
        ZEIT_UNBEACHTET_MS,
      );
      expect(pruefung?.urteil.art).toBe("falle");
      expect(pruefung?.rettung).not.toBeNull();
    },
    TESTFRIST_MS,
  );

  it(
    "Gegenprobe: eine ungedeckte Dame zu schlagen ist ein Geschenk",
    async () => {
      const fen = "rnb1kbnr/pppp1ppp/8/4p3/4P2q/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3";
      const pruefung = await pruefeFalle(bewerter, fen, "f3h4", "white", ZEIT_UNBEACHTET_MS);
      expect(pruefung?.urteil.art).toBe("geschenk");
    },
    TESTFRIST_MS,
  );
});
