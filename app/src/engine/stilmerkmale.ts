/**
 * Stilmerkmale eines Zuges für das Wahlmodell der Bots (0.2.124): Schlag, Schach, Vorwärtszug,
 * Nähe zum gegnerischen König, Bauernsturm, Rückzug, gleichwertiger Abtausch.
 *
 * Rolle im Gesamtbild: Dieselben sieben Merkmale wie in der Eichung des Wahlmodells
 * (buch/arbeit/zugwahl/merkmale.py, Spalten stil_*), damit die Gewichte aus
 * engine/wahlmodell-daten.ts passen. Sie tragen auch die drei Stilachsen der Spieler (Teil D,
 * docs/ENTSCHEIDUNGEN.md „Spielstile der Bots“): Königsangriff (Schach, Königsnähe), Aktivität
 * (Schlag, Vorwärts gegen Rückzug) und Bauernsturm gegen Abtausch.
 * Abhängigkeiten: chessops.
 */
import type { Chess } from "chessops/chess";
import type { NormalMove, Role } from "chessops/types";
import { squareFile, squareRank } from "chessops/util";
import { FIGURENWERT } from "../schach/stellung";

export interface Stilmerkmale {
  readonly schlag: boolean;
  readonly schach: boolean;
  readonly vorwaerts: boolean;
  readonly koenigsnaehe: boolean;
  readonly bauernsturm: boolean;
  readonly rueckzug: boolean;
  readonly tausch: boolean;
}

/** Reihenfolge wie in den Gewichten (stil_…). */
export const STILMERKMALE = [
  "schlag",
  "schach",
  "vorwaerts",
  "koenigsnaehe",
  "bauernsturm",
  "rueckzug",
  "tausch",
] as const;

/** Bis zu diesem Königsabstand (Felder) gilt ein Zielfeld als nah am gegnerischen König. */
const KOENIGSNAEHE = 2;
/** Ein Bauernsturm: Bauer auf der Linie des gegnerischen Königs oder daneben. */
const STURMLINIEN = 1;
const KEIN_RUECKZUG: ReadonlySet<Role> = new Set<Role>(["pawn", "king"]);

/** Königsabstand zweier Felder (Tschebyschew). */
function abstand(a: number, b: number): number {
  return Math.max(Math.abs(squareFile(a) - squareFile(b)), Math.abs(squareRank(a) - squareRank(b)));
}

/**
 * Die Stilmerkmale eines legalen Zuges in der Stellung (vor dem Zug).
 *
 * Beispiel: 1. e4 → vorwaerts, sonst nichts; Dh5 nach 1. e4 e5 → vorwaerts; Sxf7 im
 * Zweispringerspiel → schlag, schach, vorwaerts, koenigsnaehe. Sonderfall: Ohne Figur auf dem
 * Startfeld alles falsch (der Aufrufer prüft die Legalität).
 */
export function stilmerkmale(regeln: Chess, zug: NormalMove): Stilmerkmale {
  const figur = regeln.board.get(zug.from);
  if (!figur) {
    return {
      schlag: false,
      schach: false,
      vorwaerts: false,
      koenigsnaehe: false,
      bauernsturm: false,
      rueckzug: false,
      tausch: false,
    };
  }
  const gegner = figur.color === "white" ? "black" : "white";
  const opfer = regeln.board.get(zug.to);
  const schlag =
    (opfer !== undefined && opfer.color === gegner) ||
    (figur.role === "pawn" && zug.to === regeln.epSquare);
  const danach = regeln.clone();
  danach.play(zug);
  const reihen = squareRank(zug.to) - squareRank(zug.from);
  const vorwaerts = figur.color === "white" ? reihen > 0 : reihen < 0;
  const koenig = regeln.board.kingOf(gegner);
  const nah = koenig !== undefined && abstand(zug.to, koenig) <= KOENIGSNAEHE;
  const sturm =
    figur.role === "pawn" &&
    koenig !== undefined &&
    Math.abs(squareFile(zug.to) - squareFile(koenig)) <= STURMLINIEN &&
    !schlag &&
    vorwaerts;
  const geschlagen = opfer && opfer.color === gegner ? FIGURENWERT[opfer.role] : 0;
  return {
    schlag,
    schach: danach.isCheck(),
    vorwaerts,
    koenigsnaehe: nah,
    bauernsturm: sturm,
    rueckzug: !vorwaerts && reihen !== 0 && !KEIN_RUECKZUG.has(figur.role),
    tausch: schlag && figur.role !== "pawn" && geschlagen === FIGURENWERT[figur.role],
  };
}
