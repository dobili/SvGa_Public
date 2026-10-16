/**
 * Welchen typischen Anfängerfehler ein Zug darstellt (Konzept 8.2, Tabelle „Fehlerarten“).
 *
 * Rolle im Gesamtbild: Die Zugwahl der Stufen 1 bis 3 (engine/zugwahl.ts) sucht unter den
 * Kandidaten der Engine einen Fehlerzug und protokolliert seine Art; die Auswertung nach der
 * Partie nennt sie („In Zug 12 hat die Engine eine Figur hängen lassen (W1). Hast du es
 * gesehen?“, Pflichtenheft 5.2).
 *
 * PLATZHALTER (AP 11, Opus): einfache Regeln aus dem Zug und der Antwort der Engine. Die
 * Fehlerprofile mit allen sechs Arten aus Konzept 8.2 (dazu Taktik übersehen, Drohung
 * ignorieren über die Werkzeuge der Kapitel 1, 4 und 7) baut Fable in AP 11; was hier nicht
 * erkannt wird, heißt „ungenau“.
 * Abhängigkeiten: chessops, schach/todsuenden.ts (Leichtfiguren zu Hause).
 */
import { Chess } from "chessops/chess";
import { parseFen } from "chessops/fen";
import type { Position } from "chessops/chess";
import type { Role } from "chessops/types";
import { parseUci } from "chessops/util";
import { leichtfigurenZuHause } from "../schach/todsuenden";

export type Fehlerart =
  | "figurHaengen"
  | "schlagreflex"
  | "verfruehteDame"
  | "koenigMitte"
  | "taktikUebersehen"
  | "drohungIgnoriert"
  | "ungenau";

/** Faustwerte aus Kapitel 1, um eine „Figur“ (ab Leichtfigur) vom Bauern zu unterscheiden. */
const FIGURWERT: Readonly<Record<Role, number>> = {
  pawn: 1,
  knight: 3,
  bishop: 3,
  rook: 5,
  queen: 9,
  king: 0,
};
const LEICHTFIGUR = 3;
/** Ab so viel Verlust gilt ein Schlag als Schlagreflex statt als Abtausch. */
const SCHLAG_VERLUST = 1;
/** Leichtfiguren zu Hause, ab denen ein Damenzug „verfrüht“ ist (wie k1-todsuenden). */
const ZU_HAUSE_DAME = 2;
/** Ab diesem Zug gilt eine ausgelassene mögliche Rochade als „König in der Mitte“. */
const ROCHADE_SPAETESTENS = 10;
const DAMENLINIE = 3;
const GRUNDREIHE = { white: 0, black: 7 } as const;
const AUF_REIHE = 8;

function stellung(fen: string): Position | null {
  const setup = parseFen(fen);
  if (setup.isErr) return null;
  const pos = Chess.fromSetup(setup.value);
  return pos.isOk ? pos.value : null;
}

/** Kann die Seite am Zug jetzt rochieren (ein Königszug um zwei Linien oder auf den Turm)? */
function kannRochieren(pos: Position): boolean {
  const koenig = pos.board.kingOf(pos.turn);
  if (koenig === undefined) return false;
  for (const ziel of pos.dests(koenig)) {
    const figur = pos.board.get(ziel);
    if (figur?.role === "rook" && figur.color === pos.turn) return true;
  }
  return false;
}

/**
 * Ordnet einem Fehlerzug seine Art zu.
 *
 * Eingaben: Stellung vor dem Zug, Variante der Engine (Zug und Antwort in UCI), Verlust des Zuges
 * gegenüber dem besten in Bauerneinheiten. Ausgabe: Fehlerart, „ungenau“, wenn keine Regel passt.
 * Beispiel: Abb. 1.8, 3... Df6 mit Springern und Läufern zu Hause → „verfruehteDame“.
 * Sonderfall: Ein unlesbarer Zug ergibt „ungenau“.
 */
export function fehlerartVon(fen: string, zuege: readonly string[], verlust: number): Fehlerart {
  const pos = stellung(fen);
  const zug = zuege[0] ? parseUci(zuege[0]) : undefined;
  if (!pos || !zug || !("from" in zug)) return "ungenau";
  const figur = pos.board.get(zug.from);
  const startfeldDame = GRUNDREIHE[pos.turn] * AUF_REIHE + DAMENLINIE;
  if (
    figur?.role === "queen" &&
    zug.from === startfeldDame &&
    leichtfigurenZuHause(pos.board, pos.turn) >= ZU_HAUSE_DAME
  ) {
    return "verfruehteDame";
  }
  const antwort = zuege[1] ? parseUci(zuege[1]) : undefined;
  if (antwort && "from" in antwort) {
    const danach = pos.clone();
    danach.play(zug);
    const geschlagen = danach.board.get(antwort.to);
    if (geschlagen && geschlagen.color === pos.turn && FIGURWERT[geschlagen.role] >= LEICHTFIGUR) {
      return "figurHaengen";
    }
  }
  if (
    pos.board[pos.turn === "white" ? "black" : "white"].has(zug.to) &&
    verlust >= SCHLAG_VERLUST
  ) {
    return "schlagreflex";
  }
  if (pos.fullmoves >= ROCHADE_SPAETESTENS && kannRochieren(pos) && figur?.role !== "king") {
    return "koenigMitte";
  }
  return "ungenau";
}
