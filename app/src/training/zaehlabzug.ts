/**
 * Motiv „Abzug“ im Zähltrainer: verdeckte Angreifer hinter einer eigenen Figur.
 *
 * Rolle im Gesamtbild: Punkt B5 des Nebenchats (Wunsch des Autors: Motive wie Fesselungen,
 * Batterien und Abzüge im Zähltrainer). Eine Langschrittfigur, die auf ihrer Linie hinter einer
 * eigenen Figur steht, zählt beim Zählen nicht mit, wenn die vordere Figur das Feld selbst nicht
 * angreift (Kapitel 1, Abb. 1.6: die Dame d1 hinter dem Läufer d3). Zieht die vordere Figur weg,
 * greift die hintere an: ein Abzugsangriff (Kapitel 3, „Eine Figur zieht weg und gibt die Linie
 * frei“). Der Trainer nennt solche Figuren nach der Antwort und stuft die Aufgabe als schwer ein.
 * Abhängigkeiten: chessops (Angriffe, Wege), schach/stellung.ts.
 * Buchbezug: Kapitel 1, Abb. 1.6; Kapitel 3, Abzugsangriff (Abb. 3.23).
 */
import { attacks, between } from "chessops/attacks";
import { SquareSet } from "chessops/squareSet";
import type { Square } from "chessops/types";
import type { Stellung } from "../schach/stellung";

/** Eine verdeckte Langschrittfigur und die Figur, die sie verstellt. */
export interface Abzugspaar {
  readonly hinten: Square;
  readonly vorn: Square;
}

const LANGSCHRITTLER = new Set(["bishop", "rook", "queen"]);

/**
 * Die verdeckten Angreifer und Verteidiger eines Feldes (beide Seiten).
 *
 * Beispiel: Läufer d3, dahinter Dame d1 auf der d-Linie, Ziel d5: Der Läufer greift d5 nicht an
 * (er zieht schräg), die Dame steht dahinter → Paar (Dame d1, Läufer d3).
 * Sonderfälle: Greift die vordere Figur das Feld selbst an, ist es eine Batterie, kein Abzug. Ein
 * Bauer vorn zählt nicht (Turm hinter dem eigenen a-Bauern ist kein Abzug).
 */
export function abzugspaare(s: Stellung, feld: Square): Abzugspaar[] {
  const brett = s.brett;
  const paare: Abzugspaar[] = [];
  for (const hinten of brett.occupied) {
    const figur = brett.get(hinten);
    if (!figur || !LANGSCHRITTLER.has(figur.role) || hinten === feld) continue;
    if (!attacks(figur, hinten, SquareSet.empty()).has(feld)) continue;
    const dazwischen = [...between(hinten, feld).intersect(brett.occupied)];
    const [vorn] = dazwischen;
    if (dazwischen.length !== 1 || vorn === undefined) continue;
    const vordere = brett.get(vorn);
    // Ein Bauer verlässt seine Linie nur beim Schlagen; Abzug heißt hier: eine Figur zieht weg.
    if (!vordere || vordere.color !== figur.color || vordere.role === "pawn") continue;
    if (attacks(vordere, vorn, brett.occupied).has(feld)) continue;
    paare.push({ hinten, vorn });
  }
  return paare;
}
