/**
 * Tests der Märchenfiguren (Falke und Bison, Drache): Die Regelschicht über ffish rechnet wie
 * Fairy-Stockfish (Fälle aus pyffish in abenteuer/regeln/maerchenfaelle.json), die Varianten sind
 * angemeldet und die Engine bekommt denselben Abschnitt der variants.ini.
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { beforeAll, describe, expect, it } from "vitest";
import faelle from "../../abenteuer/regeln/maerchenfaelle.json";
import { DRACHE_INI, DRACHE_START, FALKE_UND_BISON_START } from "./maerchenfiguren";
import { ladeMaerchenregeln, maerchenRegeln } from "./maerchenregeln";
import { varianteVon } from "./alle";

const WASM = createRequire(import.meta.url).resolve("ffish-es6/ffish.wasm");

beforeAll(async () => {
  await ladeMaerchenregeln({ wasmBinary: readFileSync(WASM) });
});

describe("Regeln wie Fairy-Stockfish", () => {
  for (const [variante, daten] of Object.entries(faelle.varianten)) {
    const regeln = maerchenRegeln(variante);
    it(`${variante}: legale Züge, SAN und neue FEN in ${daten.faelle.length} Stellungen`, () => {
      for (const fall of daten.faelle) {
        expect([...regeln.legaleZuege(fall.fen)].sort()).toEqual(fall.legal.split(" "));
        expect(regeln.ziehe(fall.fen, fall.zug)).toEqual({ fen: fall.danach, san: fall.san });
      }
    });
  }

  it("lehnt einen illegalen Zug ab und kennt Matt", () => {
    const regeln = maerchenRegeln("seirawan");
    expect(regeln.ziehe(FALKE_UND_BISON_START, "e2e5")).toBeNull();
    // Narrenmatt in der Variante: Die Tasche ändert nichts daran.
    const matt = "rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR[HEhe] w KQBCDFGkqbcdfg - 1 3";
    expect(regeln.ende(matt)).toEqual({ sieger: "schwarz", grund: "variante.matt" });
    expect(regeln.ende(FALKE_UND_BISON_START)).toBeNull();
  });
});

describe("Anmeldung", () => {
  it("meldet beide Varianten mit Startstellung, Engine und Namen an", () => {
    const falke = varianteVon("falkeUndBison");
    const drache = varianteVon("drache");
    expect(falke?.art).toBe("figuren");
    expect(falke?.engine).toEqual({ engine: "fairy", uciVariante: "seirawan" });
    expect(falke?.startstellung?.(Math.random)).toBe(faelle.varianten.seirawan.start);
    expect(drache?.engine.ini).toBe(DRACHE_INI);
    expect(drache?.startstellung?.(Math.random)).toBe(DRACHE_START);
    expect(DRACHE_INI).toBe(faelle.ini);
  });
});
