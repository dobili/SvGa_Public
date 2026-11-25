/**
 * Die Engines als Zugbewerter der Sonderformen: Fairy-Stockfish über die Variantenengine von
 * mittel-3 (Ente `duck`, Tandem `crazyhouse`) und die gewöhnliche Engine der App (Nebel).
 *
 * Warum: Die Bots fragen nur „FEN und Zahl der Kandidaten → Züge mit Wert“ (botwahl.ts). Hier wird
 * das an die echten Engines gehängt. Fehlt das Zusatzpaket mit Fairy-Stockfish, lehnt der
 * Bewerter ab, und die Bots spielen ihren Notplan; die Partie bleibt spielbar.
 * Abhängigkeiten: spiel/varianten/variantenengine.ts, engine/engineDienst.ts, botwahl.ts.
 */
import { engine } from "../../engine/engineDienst";
import type { Wert } from "../../engine/uci";
import type { Engineangabe } from "../../spiel/varianten/variante";
import { variantenengine, type Variantenkandidat } from "../../spiel/varianten/variantenengine";
import type { Zugbewerter } from "./botwahl";

/** Rechenzeit je Botzug (ms): kurz genug für das Handy, die Bots streuen ohnehin. */
export const RECHENZEIT_MS = 400;
/** Wert eines Matts in Centipawns, weit über jeder Bewertung. */
const MATTWERT = 100000;
const CENTIPAWNS_JE_BAUER = 100;

/** Wert eines Kandidaten der Variantenengine in Centipawns (Sicht der Seite am Zug). */
function centipawns(k: Variantenkandidat): number {
  return "cp" in k.wert ? k.wert.cp : Math.sign(k.wert.matt) * MATTWERT;
}

/**
 * Zugbewerter über Fairy-Stockfish. Beispiel: Ente → { engine: "fairy", uciVariante: "duck" }.
 * Sonderfall: ohne angemeldete Variantenengine ein abgelehntes Versprechen (Notplan des Bots).
 */
export function fairyZugbewerter(angabe: Engineangabe, ms = RECHENZEIT_MS): Zugbewerter {
  return async (fen, kandidaten) => {
    const e = variantenengine();
    if (!e) throw new Error("Die Variantenengine ist nicht geladen.");
    const liste = await e.analysiere({ fen, engine: angabe, ms, kandidaten });
    return liste.map((k) => ({ zug: k.zug, wert: centipawns(k) }));
  };
}

/** Wert der gewöhnlichen Engine (aus Sicht von Weiß) in Centipawns aus Sicht der Seite am Zug. */
function ausSichtAmZug(wert: Wert, weissAmZug: boolean): number {
  const weiss =
    wert.art === "bauern"
      ? Math.round(wert.bauern * CENTIPAWNS_JE_BAUER)
      : Math.sign(wert.zuege) * MATTWERT;
  return weissAmZug ? weiss : -weiss;
}

/** Zugbewerter über die gewöhnliche Engine der App (für den Nebelbot, normales Schach). */
export function stockfishZugbewerter(ms = RECHENZEIT_MS): Zugbewerter {
  return async (fen, kandidaten) => {
    const bewertung = await engine.bewerte(fen, ms, kandidaten);
    const weissAmZug = fen.split(" ")[1] !== "b";
    return bewertung.varianten
      .filter((v) => v.zuege.length > 0)
      .map((v) => ({ zug: v.zuege[0] as string, wert: ausSichtAmZug(v.wert, weissAmZug) }));
  };
}
