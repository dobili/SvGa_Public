/**
 * Strahlen: Für jede Langschrittfigur die erste und zweite Figur auf jedem ihrer Strahlen.
 *
 * Rolle im Gesamtbild: Baustein „Strahlen“ des Stellungsprofils (Konzept 7.2). Auf ihm bauen die
 * Linienmotive auf (linienmotive.ts: Fesselung, Spieß, Abzug, Batterie) und später das
 * Warnsignal W2 „Gefährliche Linie“ (Kapitel 4 und 7) sowie die Turmbegriffe aus Kapitel 9.
 * Abhängigkeiten: chessops (Brett, Feldrechnung), angriffskarte.ts (Figurenstand).
 * Buchbezug: Kapitel 7, „Verfolge jede Linie, die auf das Feld zielt, bis zu ihrem Ende.“
 */
import { pawnAttacks } from "chessops/attacks";
import type { Board } from "chessops/board";
import type { Color, Piece, Role, Square } from "chessops/types";
import { squareFile, squareFromCoords, squareRank } from "chessops/util";
import type { Figurenstand } from "./angriffskarte";

/** Eine Richtung auf dem Brett: Schritt in Linie (a→h) und Reihe (1→8), je −1, 0 oder 1. */
export interface Richtung {
  readonly linie: -1 | 0 | 1;
  readonly reihe: -1 | 0 | 1;
}

/** Die vier geraden Richtungen des Turms. */
const GERADE: readonly Richtung[] = [
  { linie: 1, reihe: 0 },
  { linie: -1, reihe: 0 },
  { linie: 0, reihe: 1 },
  { linie: 0, reihe: -1 },
];

/** Die vier schrägen Richtungen des Läufers. */
const SCHRAEG: readonly Richtung[] = [
  { linie: 1, reihe: 1 },
  { linie: 1, reihe: -1 },
  { linie: -1, reihe: 1 },
  { linie: -1, reihe: -1 },
];

/** Richtungen je Langschrittfigur. Bauern, Springer und König haben keine Strahlen. */
const RICHTUNGEN: Readonly<Record<Role, readonly Richtung[]>> = {
  rook: GERADE,
  bishop: SCHRAEG,
  queen: [...GERADE, ...SCHRAEG],
  pawn: [],
  knight: [],
  king: [],
};

/** Ein Strahl einer Langschrittfigur in einer Richtung. */
export interface Strahl {
  /** Feld und Figur, von der der Strahl ausgeht. */
  readonly von: Square;
  readonly figur: Piece;
  readonly richtung: Richtung;
  /** Die leeren Felder bis zur ersten Figur, vom Ausgangsfeld aus gesehen. */
  readonly frei: readonly Square[];
  /** Die erste Figur auf dem Strahl, gleich welcher Farbe, oder null bis zum Brettrand. */
  readonly erste: Figurenstand | null;
  /** Die Felder zwischen der ersten und der zweiten Figur. */
  readonly dazwischen: readonly Square[];
  /** Die zweite Figur, die hinter der ersten auf demselben Strahl steht, oder null. */
  readonly zweite: Figurenstand | null;
}

/** Das nächste Feld in einer Richtung, oder null am Brettrand. */
export function naechstesFeld(feld: Square, richtung: Richtung): Square | null {
  return (
    squareFromCoords(squareFile(feld) + richtung.linie, squareRank(feld) + richtung.reihe) ?? null
  );
}

/** Läuft vom Feld in eine Richtung bis zur ersten Figur; liefert die leeren Felder und die Figur. */
function laufe(
  brett: Board,
  start: Square,
  richtung: Richtung,
): { leer: Square[]; figur: Figurenstand | null } {
  const leer: Square[] = [];
  let feld = naechstesFeld(start, richtung);
  while (feld !== null) {
    const figur = brett.get(feld);
    if (figur) return { leer, figur: { feld, figur } };
    leer.push(feld);
    feld = naechstesFeld(feld, richtung);
  }
  return { leer, figur: null };
}

/**
 * Bestimmt den Strahl einer Figur in einer Richtung.
 *
 * Beispiel: Abb. 7.33, Turm d1 nach oben: frei [], erste Turm d2 (eigen), dazwischen [d3, d4],
 * zweite Bauer d5 (gegnerisch): Der Turm d1 ist „der dritte Angreifer“ hinter dem Turm d2.
 */
export function strahl(brett: Board, von: Square, figur: Piece, richtung: Richtung): Strahl {
  const bisErste = laufe(brett, von, richtung);
  const erste = bisErste.figur;
  const bisZweite = erste ? laufe(brett, erste.feld, richtung) : { leer: [], figur: null };
  return {
    von,
    figur,
    richtung,
    frei: bisErste.leer,
    erste,
    dazwischen: bisZweite.leer,
    zweite: bisZweite.figur,
  };
}

/**
 * Alle Strahlen aller Langschrittfiguren einer Farbe (oder beider Farben).
 *
 * Warum: Fesselung, Spieß, Abzug und Batterie sind alle dieselbe Frage: Welche zwei Figuren
 * stehen hintereinander auf dem Strahl einer Langschrittfigur? (Kapitel 7, Motive 2 bis 4.)
 * Eingaben: Brett, optional die Farbe. Ausgabe: Strahlen, je Figur in fester Richtungsfolge.
 * Beispiel: Abb. 7.4, Läufer b5 nach oben rechts: erste Springer c6, zweite König e8.
 * Sonderfälle: Strahlen ohne Figur (bis zum Rand) sind enthalten; `erste` ist dann null.
 */
export function strahlen(brett: Board, farbe?: Color): Strahl[] {
  const ergebnis: Strahl[] = [];
  const felder = farbe ? brett[farbe] : brett.occupied;
  for (const von of felder) {
    const figur = brett.get(von);
    if (!figur) continue;
    for (const richtung of RICHTUNGEN[figur.role]) {
      ergebnis.push(strahl(brett, von, figur, richtung));
    }
  }
  return ergebnis;
}

/** Ob eine Figur in dieser Richtung ziehen kann (Turm gerade, Läufer schräg, Dame beides). */
export function ziehtInRichtung(rolle: Role, richtung: Richtung): boolean {
  return RICHTUNGEN[rolle].some((r) => r.linie === richtung.linie && r.reihe === richtung.reihe);
}

/**
 * Kann eine Figur auf einem Strahl die Linie verlassen?
 *
 * Warum: Abzug und Fesselung setzen voraus, dass die Figur auf der Linie wegziehen könnte. Ein
 * Bauer auf einer Linie (senkrechter Strahl) verlässt sie nur durch einen Schlag; ohne
 * schlagbares Ziel bleibt er stehen (Präzisierung der App zu W2 und F3, Kapitel 4).
 * Eingaben: Brett, Figur, Richtung des Strahls. Ausgabe: ja oder nein.
 * Beispiel: Abb. 4.2, Bauer a7 vor dem Turm a8 auf der a-Linie: kann nicht schlagen, also nein.
 * Sonderfälle: Alle anderen Figuren und Bauern auf Reihen oder Diagonalen gelten als beweglich.
 */
export function verlaesstLinie(brett: Board, stand: Figurenstand, richtung: Richtung): boolean {
  if (stand.figur.role !== "pawn" || richtung.linie !== 0) return true;
  const feinde = brett[stand.figur.color === "white" ? "black" : "white"];
  return pawnAttacks(stand.figur.color, stand.feld).intersects(feinde);
}
