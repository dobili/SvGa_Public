/**
 * Züge in der UCI-Schreibweise der Engine: Rochade als Königszug um zwei Felder, Umwandlung in
 * die Dame.
 *
 * Rolle im Gesamtbild: Die Fehlersuche (engine/fehlersuche.ts) prüft Züge mit „searchmoves“ und
 * braucht dafür die Schreibweise von Stockfish; chessops schreibt die Rochade als „König auf
 * Turm“. Eigene Datei, damit fehlerart.ts klein bleibt.
 * Abhängigkeiten: chessops, schach/drohungen.ts (legaleZuege), fehlerart-typen.ts (Typ Lage).
 */
import type { Chess } from "chessops/chess";
import type { NormalMove } from "chessops/types";
import { makeUci, squareRank } from "chessops/util";
import { legaleZuege } from "../schach/drohungen";
import { rochadeUci } from "../schach/chess960";
import type { Lage } from "./fehlerart-typen";

const LETZTE_REIHEN = new Set([0, 7]);

/**
 * Ein legaler Zug in der UCI-Schreibweise der Engine: Rochade als Königszug um zwei Felder
 * (chessops schreibt „König auf Turm“; im Schach960 bleibt es dabei), Umwandlung immer in die Dame.
 */
export function engineUci(regeln: Chess, zug: NormalMove): string {
  const figur = regeln.board.get(zug.from);
  if (figur?.role === "king" && regeln.board[regeln.turn].has(zug.to)) {
    return rochadeUci(regeln, zug);
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
