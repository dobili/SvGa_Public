/**
 * Endspieltrainer mit der echten Engine (Stockfish lite, ein Kern): Für einige Aufgaben aus
 * inhalte/de/trainer/endspiel.json bestätigt die Engine auch mit kurzer Rechenzeit das Ziel
 * (Gewinn: Wert über der Grenze oder Matt; Remis: Wert nahe null), und die Zugwahl des Trainers
 * (bester Zug für den Leser) ist in der Stellung legal.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import type { Endspieldaten } from "../daten/trainerdaten";
import { nodeEngine } from "../engine/nodeEngine.testhilfe";
import { wertFuer } from "../engine/spielbewerter";
import { uciZuSan } from "../spiel/zuege";
import { gekippt } from "./endspieltrainer";

const DATEI = resolve(__dirname, "../../../inhalte/de/trainer/endspiel.json");
const RECHENZEIT_MS = 2_000;
const TESTFRIST_MS = 60_000;
const GEPRUEFT = ["8.56", "8.19", "8.27", "9.3", "9.8"];

describe("Endspieltrainer mit Stockfish", () => {
  const daten = JSON.parse(readFileSync(DATEI, "utf8")) as Endspieldaten;
  const dienst = nodeEngine();
  afterAll(() => dienst.beendeEngine());

  it("die Datei ist da und jede Aufgabe hat Ziel, Thema und Prüfung", () => {
    expect(daten.aufgaben.length).toBeGreaterThanOrEqual(40);
    for (const a of daten.aufgaben) {
      expect(["gewinn", "remis"]).toContain(a.ziel);
      expect(a.pruefung.bester).not.toBeNull();
    }
  });

  it.each(GEPRUEFT)(
    "Abb. %s: Die Engine bestätigt das Ziel und nennt einen legalen Zug",
    async (nummer) => {
      const a = daten.aufgaben.find(
        (x) => x.herkunft.quelle === "buch" && x.herkunft.abbildung === nummer,
      );
      expect(a).toBeDefined();
      if (!a) return;
      const bewertung = await dienst.bewerte(a.fen, RECHENZEIT_MS, 1);
      const weissAmZug = a.fen.split(" ")[1] !== "b";
      const leserAmZug = (weissAmZug ? "w" : "b") === a.leser;
      const variante = bewertung.varianten[0];
      expect(variante).toBeDefined();
      if (!variante) return;
      const wertAmZug = wertFuer(variante.wert, weissAmZug);
      const wertLeser = leserAmZug ? wertAmZug : -wertAmZug;
      expect(gekippt(a.ziel, wertLeser, daten.massstab)).toBe(false);
      expect(bewertung.besterZug && uciZuSan(a.fen, bewertung.besterZug)).toBeTruthy();
    },
    TESTFRIST_MS,
  );
});
