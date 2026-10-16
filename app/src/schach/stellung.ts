/**
 * Stellungen aus FEN lesen und die Grundbegriffe der Schachlogik bereitstellen.
 *
 * Rolle im Gesamtbild: Alle anderen Module (Analyse, Engine, Oberfläche) bekommen ihre
 * Stellung von hier. Die eigentliche Regelkunde liefert chessops (Lichess, GPL-3.0); dieses
 * Modul übersetzt sie in die Begriffe des Buches.
 * Abhängigkeiten: chessops.
 * Buchbezug: Kapitel 0 (Notation), Kapitel 1 (Faustwerte der Figuren).
 */
import { Chess } from "chessops/chess";
import { parseFen } from "chessops/fen";
import type { Board } from "chessops/board";
import type { Color, Role, Square } from "chessops/types";
import { makeSquare, parseSquare } from "chessops/util";

export type { Color as Farbe, Role as Rolle, Square as Feldindex };

/** Eine Stellung, wie die App sie verwendet. Wird nie verändert. */
export interface Stellung {
  /** Die Stellung als FEN, genau wie im Buch. */
  readonly fen: string;
  /** Figuren auf dem Brett. */
  readonly brett: Board;
  /** Wer am Zug ist. */
  readonly amZug: Color;
  /**
   * Die vollständige Stellung mit allen Regeln, falls sie legal ist. Buchdiagramme dürfen auch
   * Ausschnitte ohne König zeigen; dann fehlt dieser Teil und nur das Zählen funktioniert.
   */
  readonly regeln: Chess | null;
}

/** Ergebnis, das entweder einen Wert oder eine verständliche Fehlermeldung trägt. */
export type Ergebnis<T> =
  { readonly ok: true; readonly wert: T } | { readonly ok: false; readonly fehler: string };

/**
 * Liest eine Stellung aus einer FEN.
 *
 * Warum: Jede Abbildung des Buches kommt als FEN aus dem LaTeX (Konzept 4.1).
 * Eingabe: FEN-Text. Ausgabe: Stellung oder Fehler mit Grund.
 * Beispiel: Abb. 1.26 „r1b1kbnr/pp3ppp/1qn1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1R w KQkq - 4 6“.
 * Sonderfälle: Ist die Stellung nach den Regeln unmöglich (etwa ohne König), bleibt sie
 * trotzdem nutzbar, nur `regeln` ist dann leer.
 */
export function stellungAusFen(fen: string): Ergebnis<Stellung> {
  const setup = parseFen(fen.trim());
  if (setup.isErr) {
    return { ok: false, fehler: `FEN nicht lesbar (${setup.error.message}): ${fen}` };
  }
  const regeln = Chess.fromSetup(setup.value);
  return {
    ok: true,
    wert: {
      fen: fen.trim(),
      brett: setup.value.board,
      amZug: setup.value.turn,
      regeln: regeln.isOk ? regeln.value : null,
    },
  };
}

/** Faustwerte der Figuren in Bauerneinheiten. Regel: Kapitel 1, Tabelle „Faustwerte der Figuren“. */
export const FIGURENWERT: Readonly<Record<Role, number>> = {
  pawn: 1,
  knight: 3,
  bishop: 3,
  rook: 5,
  queen: 9,
  // „unbezahlbar“: höher als alle anderen zusammen, damit der König immer zuletzt schlägt.
  king: 1000,
};

/** Kurzbuchstabe einer Figur wie in der FEN (p, n, b, r, q, k), für Sprachschlüssel. */
export const ROLLENBUCHSTABE: Readonly<Record<Role, "p" | "n" | "b" | "r" | "q" | "k">> = {
  pawn: "p",
  knight: "n",
  bishop: "b",
  rook: "r",
  queen: "q",
  king: "k",
};

/** Wandelt „d4“ in die Feldnummer von chessops; null bei ungültigen Namen. */
export function feldAusName(name: string): Square | null {
  return parseSquare(name) ?? null;
}

/** Wandelt eine Feldnummer in den Namen wie „d4“. */
export function feldname(feld: Square): string {
  return makeSquare(feld);
}

/** Die Gegenfarbe. */
export function gegner(farbe: Color): Color {
  return farbe === "white" ? "black" : "white";
}

/** Kurzform der Farbe wie in der FEN: „w“ oder „b“, für Sprachschlüssel. */
export function farbkuerzel(farbe: Color): "w" | "b" {
  return farbe === "white" ? "w" : "b";
}
