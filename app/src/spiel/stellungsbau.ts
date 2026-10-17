/**
 * Stellungen selbst aufbauen (Wunsch des Autors, 17.10.2026, Version 0.2.41): Steine frei setzen
 * und entfernen, Seite am Zug wählen, daraus eine FEN für eine Partie.
 *
 * Rolle im Gesamtbild: Reine Funktionen für den Stellungseditor (ui/komponenten/
 * Stellungseditor.tsx). Beliebig viele Steine sind erlaubt (Entscheidung des Autors); ob sich aus
 * der Stellung eine Partie spielen lässt, prüft spiel/partie.ts (spielbar) erst beim Übernehmen.
 * Rochaderechte ergeben sich aus den Steinen: König und Turm auf ihren Startfeldern dürfen
 * rochieren. En passant gibt es in einer aufgebauten Stellung nicht; Zugzähler beginnen bei 1.
 * Abhängigkeiten: chessops.
 */
import { makeFen, parseFen } from "chessops/fen";
import { SquareSet } from "chessops/squareSet";
import type { Board } from "chessops/board";
import type { Color } from "chessops/types";
import { charToRole, parseSquare } from "chessops/util";

export const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
export const LEERES_BRETT = "8/8/8/8/8/8/8/8 w - - 0 1";

/** Die zwölf Steine als FEN-Buchstaben: Großbuchstaben Weiß, Kleinbuchstaben Schwarz. */
export const STEINE: readonly string[] = [
  "K",
  "Q",
  "R",
  "B",
  "N",
  "P",
  "k",
  "q",
  "r",
  "b",
  "n",
  "p",
];

/** König und Turm auf dem Startfeld: Rochaderecht (Feld des Turms, wie chessops es führt). */
const ROCHADEN: readonly {
  readonly koenig: string;
  readonly turm: string;
  readonly farbe: Color;
}[] = [
  { koenig: "e1", turm: "h1", farbe: "white" },
  { koenig: "e1", turm: "a1", farbe: "white" },
  { koenig: "e8", turm: "h8", farbe: "black" },
  { koenig: "e8", turm: "a8", farbe: "black" },
];

/** Die Rochaderechte, die zu den Steinen passen. */
function rochaderechte(brett: Board): SquareSet {
  let rechte = SquareSet.empty();
  for (const r of ROCHADEN) {
    const koenig = brett.get(parseSquare(r.koenig) ?? 0);
    const turm = brett.get(parseSquare(r.turm) ?? 0);
    const passt =
      koenig?.role === "king" &&
      koenig.color === r.farbe &&
      turm?.role === "rook" &&
      turm.color === r.farbe;
    if (passt) rechte = rechte.with(parseSquare(r.turm) ?? 0);
  }
  return rechte;
}

/** Eine FEN aus Brett und Seite am Zug, mit passenden Rochaderechten und frischen Zählern. */
function baueFen(brett: Board, amZug: Color): string {
  return makeFen({
    board: brett,
    pockets: undefined,
    turn: amZug,
    castlingRights: rochaderechte(brett),
    epSquare: undefined,
    remainingChecks: undefined,
    halfmoves: 0,
    fullmoves: 1,
  });
}

/** Das Brett einer FEN; bei unlesbarer FEN das leere Brett. */
function brettUndZug(fen: string): { brett: Board; amZug: Color } {
  const setup = parseFen(fen);
  if (setup.isErr) {
    const leer = parseFen(LEERES_BRETT);
    return { brett: leer.unwrap().board, amZug: "white" };
  }
  return { brett: setup.value.board, amZug: setup.value.turn };
}

/**
 * Setzt einen Stein auf ein Feld (FEN-Buchstabe, Großschreibung Weiß) oder räumt es (null).
 * Beispiel: leeres Brett, „e1“, „K“ → „8/8/8/8/8/8/8/4K3 w - - 0 1“. Steht derselbe Stein schon
 * dort, wird das Feld frei (ein zweiter Tipp entfernt ihn).
 */
export function setzeStein(fen: string, feld: string, zeichen: string | null): string {
  const { brett, amZug } = brettUndZug(fen);
  const feldNr = parseSquare(feld);
  if (feldNr === undefined) return fen;
  const rolle = zeichen ? charToRole(zeichen) : undefined;
  const vorhanden = brett.get(feldNr);
  const farbe: Color = zeichen === zeichen?.toUpperCase() ? "white" : "black";
  const gleich = vorhanden && rolle === vorhanden.role && farbe === vorhanden.color;
  if (!rolle || gleich) brett.take(feldNr);
  else brett.set(feldNr, { role: rolle, color: farbe });
  return baueFen(brett, amZug);
}

/** Dieselbe Stellung mit dieser Seite am Zug. */
export function mitAmZug(fen: string, amZug: Color): string {
  return baueFen(brettUndZug(fen).brett, amZug);
}

/** Die Seite am Zug einer FEN; Weiß, wenn sie nicht lesbar ist. */
export function amZugVon(fen: string): Color {
  return brettUndZug(fen).amZug;
}
