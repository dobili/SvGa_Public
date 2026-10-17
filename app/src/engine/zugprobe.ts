/**
 * Ein Zug probeweise gespielt: der Zug, die gezogene Figur, die Stellung danach und was er schlägt.
 *
 * Rolle im Gesamtbild: Grundbaustein der Fehlerarten (engine/fehlerart.ts) und der Opfererkennung
 * (engine/opfer.ts). Beide prüfen viele Züge einer Stellung; das Spielen eines Zuges aus UCI liegt
 * deshalb hier einmal und ohne Abhängigkeit zu den Prüfregeln.
 * Abhängigkeiten: chessops.
 */
import { Chess, normalizeMove } from "chessops/chess";
import type { NormalMove, Piece, Role } from "chessops/types";
import { parseUci } from "chessops/util";

/** Ein geprüfter Zug: der Zug, die Stellung danach und was er schlägt. */
export interface Zugprobe {
  readonly zug: NormalMove;
  readonly figur: Piece;
  readonly danach: Chess;
  readonly geschlagen: Role | null;
}

/** Was der Zug schlägt (auch en passant), sonst null. */
function geschlageneRolle(regeln: Chess, zug: NormalMove): Role | null {
  const opfer = regeln.board.get(zug.to);
  if (opfer && opfer.color !== regeln.turn) return opfer.role;
  const bauer = regeln.board.get(zug.from);
  return bauer?.role === "pawn" && zug.to === regeln.epSquare ? "pawn" : null;
}

/**
 * Spielt einen Zug (UCI, Rochade wie die Engine sie schreibt) probeweise; null, wenn er nicht geht.
 *
 * Beispiel: Abb. 1.13 nach 2. Dh5, „g8f6“ → Zugprobe mit dem Springer, der Stellung nach 2... Sf6
 * und `geschlagen` null. Sonderfall: „e1g1“ und „e1h1“ sind beide die kurze Rochade.
 */
export function probe(regeln: Chess, uci: string): Zugprobe | null {
  const roh = parseUci(uci);
  if (!roh || !("from" in roh)) return null;
  const zug = normalizeMove(regeln, roh);
  if (!("from" in zug) || !regeln.isLegal(zug)) return null;
  const figur = regeln.board.get(zug.from);
  if (!figur) return null;
  const danach = regeln.clone();
  danach.play(zug);
  return { zug, figur, danach, geschlagen: geschlageneRolle(regeln, zug) };
}
