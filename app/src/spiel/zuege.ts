/**
 * Züge zwischen den Schreibweisen der Engine (UCI, „g1f3“) und der Daten (SAN, „Nf3“) umrechnen.
 *
 * Rolle im Gesamtbild: Die Engine antwortet in UCI, die Partie speichert SAN wie die Buchdaten,
 * der Eröffnungsindex liefert SAN. Diese Datei verbindet beides für das Spiel gegen die Engine.
 * Abhängigkeiten: chessops.
 * Buchbezug: Kapitel 0, „Wie liest man Schachzüge?“.
 */
import { Chess, normalizeMove, type Position } from "chessops/chess";
import { makeFen, parseFen } from "chessops/fen";
import { makeSan, parseSan } from "chessops/san";
import { makeUci, parseUci } from "chessops/util";
import { rochadeUci } from "../schach/chess960";
import { stellungMit } from "./varianten/regelschicht";
import { varianteVon } from "./varianten/alle";

/** Stellung mit Regeln aus einer FEN; null bei unlesbarer oder regelwidriger Stellung. */
export function regelstellung(fen: string): Chess | null {
  const setup = parseFen(fen);
  if (setup.isErr) return null;
  const pos = Chess.fromSetup(setup.value);
  return pos.isOk ? pos.value : null;
}

/**
 * Die Stellung unter den Regeln einer Variante (spiel/varianten/): Drei-Schach, Atomschach, König
 * der Hügel, Königsrennen, Räuberschach rechnen mit eigenen Regeln; ohne Variante oder bei einer
 * Variante mit gewöhnlichen Regeln (Schach960, blind, nach Gehör) wie `regelstellung`.
 * Beispiel: („…“ mit Zähler „3+3“, „dreischach“) → ThreeCheck-Stellung von chessops.
 */
export function regelstellungFuer(fen: string, variante?: string): Position | null {
  const regeln = varianteVon(variante)?.regeln.chessops;
  if (!regeln || regeln === "chess") return regelstellung(fen);
  return stellungMit(regeln, fen);
}

/**
 * Ein Zug der Engine in Kurznotation.
 *
 * Warum: Die Partie und die Zugliste arbeiten mit SAN. Eingaben: FEN vor dem Zug, Zug in UCI.
 * Ausgabe: SAN oder null, wenn der Zug in der Stellung nicht legal ist.
 * Beispiel: Grundstellung, „g1f3“ → „Nf3“; „e1g1“ mit Rochaderecht → „O-O“.
 * Sonderfall: Stockfish schreibt die Rochade als Königszug um zwei Felder; chessops erwartet
 * „König auf Turm“, deshalb wird der Zug vorher angeglichen.
 */
export function uciZuSan(fen: string, uci: string, variante?: string): string | null {
  const pos = regelstellungFuer(fen, variante);
  const zug = parseUci(uci);
  if (!pos || !zug) return null;
  const angeglichen = normalizeMove(pos, zug);
  return pos.isLegal(angeglichen) ? makeSan(pos, angeglichen) : null;
}

/**
 * Ein Zug in Kurznotation als UCI, wie ihn die Engine schreibt.
 *
 * Beispiel: Grundstellung, „e4“ → „e2e4“. Rochade → Königszug um zwei Felder („e1g1“), so wie
 * Stockfish sie selbst schreibt; im Schach960 „König auf Turm“ (spiel/chess960.ts).
 * Sonderfall: illegaler Zug → null.
 */
export function sanZuUci(fen: string, san: string, variante?: string): string | null {
  const pos = regelstellungFuer(fen, variante);
  const zug = pos ? parseSan(pos, san) : undefined;
  if (!pos || !zug) return null;
  if (!("from" in zug)) return makeUci(zug);
  const figur = pos.board.get(zug.from);
  const ziel = pos.board.get(zug.to);
  const rochade = figur?.role === "king" && ziel?.role === "rook" && ziel.color === figur.color;
  return rochade ? rochadeUci(pos, zug) : makeUci(zug);
}

/** Stellung nach einem Zug in Kurznotation; null, wenn der Zug nicht passt. */
export function fenNach(fen: string, san: string, variante?: string): string | null {
  const pos = regelstellungFuer(fen, variante);
  const zug = pos ? parseSan(pos, san) : undefined;
  if (!pos || !zug) return null;
  pos.play(zug);
  return makeFen(pos.toSetup());
}
