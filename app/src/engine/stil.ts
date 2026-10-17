/**
 * Spielstil eines eigenen Gegners: aggressiv oder defensiv (Wunsch des Autors, 17.10.2026,
 * Version 0.2.42).
 *
 * Rolle im Gesamtbild: Ein Regler von −2 (sehr defensiv) bis +2 (sehr aggressiv). Statt des einen
 * besten Zuges holt die Zugwahl (engine/zugwahl.ts) mehrere Kandidaten der Engine und wählt unter
 * denen, die höchstens 0,15 Bauerneinheiten je Reglerstufe hinter dem besten liegen, den Zug, der
 * dem Stil am meisten entspricht. Aggressiv (Vorschlag des Autors): Zielfeld in der gegnerischen
 * Bretthälfte, im Viertel des gegnerischen Königs, ein Schlag oder ein Schach. Defensiv: Zielfeld
 * in der eigenen Hälfte, im Viertel des eigenen Königs, kein Schlag. Der Stil kostet also nie mehr
 * als eine kleine Ungenauigkeit; die Stärke der Stufe bleibt.
 * Abhängigkeiten: chessops, engine/spielbewerter.ts (wertFuer), engine/uci.ts (Variante).
 */
import { Chess } from "chessops/chess";
import { parseFen } from "chessops/fen";
import type { Color, Square } from "chessops/types";
import { opposite, parseUci, squareFile, squareRank } from "chessops/util";
import { wertFuer } from "./spielbewerter";
import type { Variante } from "./uci";

export const STIL_MIN = -2;
export const STIL_MAX = 2;
export const STIL_NEUTRAL = 0;
/** Erlaubter Verlust je Reglerstufe in Bauerneinheiten. */
export const STIL_TOLERANZ = 0.15;
/** So viele Kandidaten holt die Zugwahl bei einem Stil ungleich 0. */
export const STIL_KANDIDATEN = 4;
/** Das Brett in zwei Hälften und vier Viertel: Linie und Reihe unter 4 oder ab 4. */
const MITTE = 4;
/** Punkte je Merkmal. */
const PUNKT_HAELFTE = 1;
const PUNKT_VIERTEL = 1;
const PUNKT_SCHLAG = 0.5;
const PUNKT_SCHACH = 0.5;

/** Liegt das Feld in der Bretthälfte dieser Farbe (Weiß: Reihen 1 bis 4)? */
function inHaelfteVon(feld: Square, farbe: Color): boolean {
  return farbe === "white" ? squareRank(feld) < MITTE : squareRank(feld) >= MITTE;
}

/** Liegt das Feld im selben Viertel des Bretts wie der König? */
function imViertelVon(feld: Square, koenig: Square | undefined): boolean {
  if (koenig === undefined) return false;
  return (
    squareFile(feld) < MITTE === squareFile(koenig) < MITTE &&
    squareRank(feld) < MITTE === squareRank(koenig) < MITTE
  );
}

/**
 * Wie gut ein Zug zum Stil passt (0 bis 3): bei aggressivem Stil Punkte für die gegnerische
 * Hälfte, das Viertel des gegnerischen Königs, Schlag und Schach; bei defensivem Stil für die
 * eigene Hälfte, das Viertel des eigenen Königs und keinen Schlag. Stil 0: immer 0.
 * Beispiel: Grundstellung, Stil +2, „e2e4“ → 1 (gegnerische Hälfte? nein, e4 ist Reihe 4: 0;
 * Viertel des Königs e8: ja, 1); „g1f3“ → 0.
 */
export function stilwert(fen: string, uci: string, stil: number): number {
  if (stil === STIL_NEUTRAL) return 0;
  const setup = parseFen(fen);
  const zug = parseUci(uci);
  if (setup.isErr || !zug || !("to" in zug)) return 0;
  const regeln = Chess.fromSetup(setup.value);
  if (regeln.isErr) return 0;
  const pos = regeln.value;
  const eigene = pos.turn;
  const schlag = pos.board.get(zug.to) !== undefined;
  if (stil > 0) {
    const nach = pos.clone();
    nach.play(zug);
    return (
      (inHaelfteVon(zug.to, opposite(eigene)) ? PUNKT_HAELFTE : 0) +
      (imViertelVon(zug.to, pos.board.kingOf(opposite(eigene))) ? PUNKT_VIERTEL : 0) +
      (schlag ? PUNKT_SCHLAG : 0) +
      (nach.isCheck() ? PUNKT_SCHACH : 0)
    );
  }
  return (
    (inHaelfteVon(zug.to, eigene) ? PUNKT_HAELFTE : 0) +
    (imViertelVon(zug.to, pos.board.kingOf(eigene)) ? PUNKT_VIERTEL : 0) +
    (schlag ? 0 : PUNKT_SCHLAG)
  );
}

/**
 * Wählt unter den Kandidaten der Engine (beste zuerst) den Zug nach dem Stil: unter allen, die
 * höchstens STIL_TOLERANZ · |Stil| hinter dem besten liegen, der mit dem höchsten Stilwert; bei
 * Gleichstand der bessere. Ausgabe: UCI oder null ohne Kandidaten.
 * Beispiel: Stil +2 (Toleranz 0,3), Kandidaten e4 (+0,3), Sf3 (+0,25), a3 (−0,2) → e4 oder Sf3,
 * je nach Stilwert; a3 liegt zu weit zurück.
 */
export function stilwahl(fen: string, varianten: readonly Variante[], stil: number): string | null {
  const beste = varianten[0];
  const bester = beste?.zuege[0];
  if (!beste || !bester) return null;
  const weissAmZug = fen.split(" ")[1] !== "b";
  const bestwert = wertFuer(beste.wert, weissAmZug);
  const toleranz = STIL_TOLERANZ * Math.abs(stil);
  let wahl = bester;
  let bestePunkte = stilwert(fen, bester, stil);
  for (const v of varianten.slice(1)) {
    const uci = v.zuege[0];
    if (!uci || bestwert - wertFuer(v.wert, weissAmZug) > toleranz) continue;
    const punkte = stilwert(fen, uci, stil);
    if (punkte > bestePunkte) {
      wahl = uci;
      bestePunkte = punkte;
    }
  }
  return wahl;
}
