/**
 * Eine Partie mit Märchenfiguren durch Partie und Brett der App (ohne chessops, über ffish):
 * Einsetzwahl am Start, 40 Halbzüge über spiel/partie.ts, Nachspielen aller Stellungen.
 * Warum: Die Partie speichert Kurznotation und rechnet jede Stellung über die Regelschicht nach;
 * das muss richtig und schnell genug für jedes Neuzeichnen sein.
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { beforeAll, describe, expect, it } from "vitest";
import { spieleZug, zugzusaetze } from "../../schach/weiterspielen";
import { leserzug, neuePartie, stellungen, ziehe, type Partie } from "../partie";
import { uciZuSan } from "../zuege";
import { varianteVon } from "./alle";
import { FALKE_UND_BISON_START } from "./maerchenfiguren";
import { ladeMaerchenregeln } from "./maerchenregeln";

const WASM = createRequire(import.meta.url).resolve("ffish-es6/ffish.wasm");
const HALBZUEGE = 40;
/** Grenze für das zweite Nachrechnen aller Stellungen (ms): Es kommt aus dem Zugspeicher. */
const NACHRECHNEN_HOECHSTENS_MS = 50;
/** Das Spielen selbst rechnet jede neue Stellung einmal über ffish (etwa 60 ms je Stellung). */
const SPIELEN_FRIST_MS = 30000;

beforeAll(async () => {
  await ladeMaerchenregeln({ wasmBinary: readFileSync(WASM) });
});

function partie(): Partie {
  const p = neuePartie(
    {
      startFen: FALKE_UND_BISON_START,
      eigeneFarbe: "white",
      stufe: 3,
      stufenJePhase: { eroeffnung: 3, mittelspiel: 3, endspiel: 3 },
      uhr: null,
      ruecknahmeErlaubt: false,
      abbildung: null,
      gegner: "mensch",
      bot: null,
      stilname: "angreifer",
      hilfen: { symbole: false, werkzeuge: false },
      gewertet: false,
      eroeffnung: null,
      abenteuer: { kennung: "hochebene.falkeUndBison#1", variante: "falkeUndBison" },
    },
    "p-maerchen",
    "2026-11-26T10:00:00Z",
  );
  if (!p) throw new Error("Start von Falke und Bison nicht spielbar?");
  return p;
}

describe("Partie mit Falke und Bison", () => {
  it("bietet beim Springerzug von g1 das Einsetzen an", () => {
    expect(zugzusaetze(FALKE_UND_BISON_START, "g1", "f3", "falkeUndBison").sort()).toEqual([
      "",
      "e",
      "h",
    ]);
    expect(spieleZug(FALKE_UND_BISON_START, "g1", "f3", undefined, "falkeUndBison").art).toBe(
      "auswahl",
    );
    const mit = spieleZug(FALKE_UND_BISON_START, "g1", "f3", undefined, "falkeUndBison", "h");
    // Der Falke steht auf g1, in der Tasche bleiben Bison und die schwarzen Figuren.
    expect(mit.art === "gespielt" ? mit.fen.split(" ")[0] : null).toBe(
      "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKBHR[Eeh]",
    );
  });

  it(
    `spielt ${HALBZUEGE} Halbzüge und rechnet alle Stellungen nach`,
    { timeout: SPIELEN_FRIST_MS },
    () => {
      const regeln = varianteVon("falkeUndBison")?.regeln;
      if (!regeln) throw new Error("falkeUndBison nicht angemeldet");
      let p = partie();
      for (let i = 0; i < HALBZUEGE && !p.ende; i += 1) {
        const fen = stellungen(p).at(-1) ?? "";
        // Bevorzugt Züge mit Einsetzen, damit Falke und Bison aufs Brett kommen.
        const zuege = regeln.legaleZuege(fen);
        const uci = zuege.find((z) => z.length === 5) ?? zuege[i % zuege.length] ?? "";
        const san = uciZuSan(fen, uci, "falkeUndBison");
        if (!san) throw new Error(`kein SAN für ${uci} in ${fen}`);
        const weiter = ziehe(p, leserzug(san));
        if (!weiter) throw new Error(`Zug ${san} abgelehnt in ${fen}`);
        p = weiter;
      }
      const start = performance.now();
      const alle = stellungen(p);
      const dauer = performance.now() - start;
      expect(alle).toHaveLength(p.zuege.length + 1);
      expect(alle.at(-1)).not.toContain("[HEhe]");
      expect(dauer).toBeLessThan(NACHRECHNEN_HOECHSTENS_MS);
      console.info(`Nachrechnen von ${p.zuege.length} Halbzügen: ${Math.round(dauer)} ms`);
    },
  );
});
