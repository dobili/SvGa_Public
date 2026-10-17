/**
 * Kann eine Stellung in einer Partie entstanden sein, was die Zahl der Steine angeht?
 *
 * Rolle im Gesamtbild: Prüfung für „Stellung aufbauen“ und die FEN-Eingabe (Rückfrage S12).
 * Stockfish 19 lehnt Stellungen ab, die durch keine Partie entstehen können, und beendet sich
 * dann („Too many pieces“); die Engine zog in einer aufgebauten Stellung mit zwei weißen Damen
 * und acht weißen Bauern deshalb nie. Zusätzliche Damen, Türme, Läufer und Springer gibt es nur
 * durch Umwandlung, also höchstens so viele, wie Bauern fehlen.
 * Abhängigkeiten: chessops.
 * Buchbezug: Kapitel 0, Umwandlung (ein Bauer auf der letzten Reihe wird zu einer Figur).
 */
import type { Board } from "chessops/board";
import type { Color, Role } from "chessops/types";

/** Die Steine einer Seite in der Grundstellung. */
const GRUNDSTELLUNG: Readonly<Record<Exclude<Role, "king">, number>> = {
  pawn: 8,
  knight: 2,
  bishop: 2,
  rook: 2,
  queen: 1,
};
const FIGUREN = ["knight", "bishop", "rook", "queen"] as const;

/**
 * Hat die Seite höchstens so viele zusätzliche Figuren, wie Bauern fehlen?
 *
 * Beispiel: acht Bauern und zwei Damen → nein; sieben Bauern und zwei Damen → ja.
 */
export function steineMoeglich(brett: Board, farbe: Color): boolean {
  const eigene = brett[farbe];
  const bauern = brett.pawn.intersect(eigene).size();
  const zusaetzlich = FIGUREN.reduce(
    (summe, rolle) =>
      summe + Math.max(0, brett[rolle].intersect(eigene).size() - GRUNDSTELLUNG[rolle]),
    0,
  );
  return bauern <= GRUNDSTELLUNG.pawn && zusaetzlich <= GRUNDSTELLUNG.pawn - bauern;
}
