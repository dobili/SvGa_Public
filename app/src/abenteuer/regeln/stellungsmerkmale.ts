/**
 * Stellungsmerkmale für Partiemomente (Wunsch von mittel-3, 13.11.2026): Opposition der Könige und
 * Gabel. Beide gelten für den letzten Halbzug (Flanke, wie die übrigen Merkmale in
 * regeln/partiemomente.ts): Der Moment kommt, wenn das Ereignis mit diesem Zug entsteht.
 *
 * Rolle im Gesamtbild: reine Regeln ohne React für regeln/partiemomente.ts.
 * Abhängigkeiten: chessops (Brett, Angriffe), schach/stellung.ts (Figurenwerte).
 */
import { attacks } from "chessops/attacks";
import type { Board } from "chessops/board";
import type { Color, Square } from "chessops/types";
import { squareFile, squareRank } from "chessops/util";
import { FIGURENWERT, gegner } from "../../schach/stellung";

/** Abstand der Könige in Opposition: genau ein Feld dazwischen. */
const OPPOSITIONSABSTAND = 2;
/** Mindestens so viele Ziele macht einen Doppelangriff zur Gabel. */
const GABELZIELE = 2;

/**
 * Stehen die Könige in Opposition? Regel: Kapitel 8, Opposition: Die Könige stehen sich auf einer
 * Linie, Reihe oder Diagonale mit genau einem Feld Abstand gegenüber.
 * Beispiel: Weiß Ke4, Schwarz Ke6 → ja; Ke4 und Kg6 (Diagonale) → ja; Ke4 und Kf6 → nein.
 * Sonderfall: fehlt ein König, nie.
 */
export function inOpposition(brett: Board): boolean {
  const weiss = brett.kingOf("white");
  const schwarz = brett.kingOf("black");
  if (weiss === undefined || schwarz === undefined) return false;
  const dx = Math.abs(squareFile(weiss) - squareFile(schwarz));
  const dy = Math.abs(squareRank(weiss) - squareRank(schwarz));
  const gerade = (dx === 0 && dy === OPPOSITIONSABSTAND) || (dy === 0 && dx === OPPOSITIONSABSTAND);
  const schraeg = dx === OPPOSITIONSABSTAND && dy === OPPOSITIONSABSTAND;
  return gerade || schraeg;
}

/** Wird das Feld von einer Figur der Farbe angegriffen (gedeckt)? */
function gedeckt(brett: Board, feld: Square, farbe: Color): boolean {
  for (const von of brett[farbe]) {
    const figur = brett.get(von);
    if (figur && attacks(figur, von, brett.occupied).has(feld)) return true;
  }
  return false;
}

/**
 * Greift die Figur auf `feld` mindestens zwei gegnerische Figuren an, die sich lohnen? Regel:
 * Kapitel 1 und Glossar, Gabel: ein Doppelangriff einer einzelnen Figur auf zwei gegnerische
 * Figuren. Ziel zählt, wenn es der König ist, mehr wert ist als der Angreifer oder ungedeckt ist;
 * Bauern zählen nicht als Ziel (sonst wäre jeder Turm auf einer Bauernreihe eine Gabel).
 * Beispiel: Springer c7 gegen König e8 und Turm a8 → ja.
 */
export function istGabel(brett: Board, feld: Square): boolean {
  const figur = brett.get(feld);
  if (!figur) return false;
  const andere = gegner(figur.color);
  let ziele = 0;
  for (const ziel of attacks(figur, feld, brett.occupied).intersect(brett[andere])) {
    const opfer = brett.get(ziel);
    if (!opfer || opfer.role === "pawn") continue;
    const lohnt =
      opfer.role === "king" ||
      FIGURENWERT[opfer.role] > FIGURENWERT[figur.role] ||
      !gedeckt(brett, ziel, andere);
    if (lohnt) ziele += 1;
  }
  return ziele >= GABELZIELE;
}

/**
 * Die Felder, auf die die ziehende Seite mit dem letzten Halbzug gezogen hat (bei der Rochade
 * zwei). Ausgabe: Felder, auf denen jetzt eine Figur der Farbe steht, die vorher dort nicht stand.
 */
export function zielfelder(vor: Board, nach: Board, farbe: Color): Square[] {
  const felder: Square[] = [];
  for (const feld of nach[farbe]) {
    const jetzt = nach.get(feld);
    const vorher = vor.get(feld);
    if (jetzt && (vorher?.color !== jetzt.color || vorher.role !== jetzt.role)) felder.push(feld);
  }
  return felder;
}
