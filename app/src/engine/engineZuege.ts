/**
 * Züge in der UCI-Schreibweise der Engine: Rochade als Königszug um zwei Felder, Umwandlung in
 * die Dame.
 *
 * Rolle im Gesamtbild: Die Fehlersuche (engine/fehlersuche.ts) prüft Züge mit „searchmoves“ und
 * braucht dafür die Schreibweise von Stockfish; chessops schreibt die Rochade als „König auf
 * Turm“. Ausgelagert aus fehlerart.ts (0.2.39).
 * Abhängigkeiten: chessops, schach/drohungen.ts (legaleZuege), fehlerart-typen.ts (Typ Lage).
 */
import type { Chess } from "chessops/chess";
import type { NormalMove } from "chessops/types";
import { makeUci, squareRank } from "chessops/util";
import { legaleZuege } from "../schach/drohungen";
import type { Lage } from "./fehlerart-typen";

const AUF_REIHE = 8;
const LETZTE_REIHEN = new Set([0, 7]);
/** Linien des Königs nach der kurzen (g) und der langen (c) Rochade, in UCI der Engine. */
const KOENIG_KURZ = 6;
const KOENIG_LANG = 2;

/**
 * Ein legaler Zug in der UCI-Schreibweise der Engine: Rochade als Königszug um zwei Felder
 * (chessops schreibt „König auf Turm“), Umwandlung immer in die Dame.
 */
export function engineUci(regeln: Chess, zug: NormalMove): string {
  const figur = regeln.board.get(zug.from);
  if (figur?.role === "king" && regeln.board[regeln.turn].has(zug.to)) {
    const reihe = zug.from - (zug.from % AUF_REIHE);
    return makeUci({ from: zug.from, to: reihe + (zug.to > zug.from ? KOENIG_KURZ : KOENIG_LANG) });
  }
  if (figur?.role === "pawn" && LETZTE_REIHEN.has(squareRank(zug.to))) {
    return makeUci({ ...zug, promotion: "queen" });
  }
  return makeUci(zug);
}

/** Alle legalen Züge der Seite am Zug in der UCI-Schreibweise der Engine. */
export function alleZuege(lage: Lage): string[] {
  return legaleZuege(lage.regeln).map((zug) => engineUci(lage.regeln, zug));
}
