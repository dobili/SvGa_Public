/**
 * Sichere Felder: Für jede Figur die Felder, auf denen sie laut Abtauschrechnung nichts verliert.
 *
 * Rolle im Gesamtbild: Baustein „Sichere Felder“ des Stellungsprofils (Konzept 7.2), Grundlage
 * für W7 „Figur am Rand“, das LAP-Prinzip und die Aktivität in der Faktorenbilanz (AP 8/9).
 * Abhängigkeiten: chessops (legale Züge), abtausch.ts, stellung.ts.
 * Buchbezug: Pflichtenheft 6.6, „Sicheres Feld: Ein Feld, auf dem eine Figur laut
 * Abtauschrechnung kein Material verliert.“
 */
import { attacks } from "chessops/attacks";
import type { Board } from "chessops/board";
import type { Chess } from "chessops/chess";
import { SquareSet } from "chessops/squareSet";
import type { Color, Piece, Square } from "chessops/types";
import { squareRank } from "chessops/util";
import { abtausch } from "./abtausch";
import { FIGURENWERT, gegner, type Stellung } from "./stellung";
import { naechstesFeld } from "./strahlen";

/** Eine Figur mit ihren sicheren und unsicheren Zielfeldern. */
export interface Figurenfelder {
  readonly feld: Square;
  readonly figur: Piece;
  readonly sichere: readonly Square[];
  readonly unsichere: readonly Square[];
}

/** Die Reihe, auf der ein Bauer der Farbe startet, und die, auf der er umwandelt. */
const STARTREIHE: Readonly<Record<Color, number>> = { white: 1, black: 6 };
const UMWANDLUNGSREIHE: Readonly<Record<Color, number>> = { white: 7, black: 0 };

/** Schritt eines Bauern der Farbe nach vorn. */
function vorwaerts(farbe: Color): { linie: 0; reihe: 1 | -1 } {
  return { linie: 0, reihe: farbe === "white" ? 1 : -1 };
}

/**
 * Zielfelder eines Bauern ohne Regeln: ein Schritt, vom Startfeld zwei, Schlagen schräg.
 * En passant bleibt außen vor (Lehrbilder ohne König haben keine Zughistorie).
 */
function bauernziele(brett: Board, von: Square, farbe: Color): SquareSet {
  let ziele = SquareSet.empty();
  const schritt = vorwaerts(farbe);
  const eins = naechstesFeld(von, schritt);
  if (eins !== null && !brett.occupied.has(eins)) {
    ziele = ziele.with(eins);
    const zwei = naechstesFeld(eins, schritt);
    if (squareRank(von) === STARTREIHE[farbe] && zwei !== null && !brett.occupied.has(zwei)) {
      ziele = ziele.with(zwei);
    }
  }
  const schlaege = attacks({ role: "pawn", color: farbe }, von, brett.occupied).intersect(
    brett[gegner(farbe)],
  );
  return ziele.union(schlaege);
}

/**
 * Zielfelder einer Figur ohne Regeln (Lehrbild ohne König): alle angegriffenen Felder, die keine
 * eigene Figur besetzt. Rochade und Fesselungen gibt es hier nicht.
 */
function zieleOhneRegeln(brett: Board, von: Square, figur: Piece): SquareSet {
  if (figur.role === "pawn") return bauernziele(brett, von, figur.color);
  return attacks(figur, von, brett.occupied).diff(brett[figur.color]);
}

/** Die Regeln so, dass die gewünschte Farbe am Zug ist (Nullzug: der Gegner „passt“). */
function regelnFuer(regeln: Chess, farbe: Color): Chess {
  if (regeln.turn === farbe) return regeln;
  const kopie = regeln.clone();
  kopie.turn = farbe;
  kopie.epSquare = undefined;
  return kopie;
}

/**
 * Legale Zielfelder jeder Figur einer Farbe, auch wenn die andere Seite am Zug ist.
 *
 * Warum: Werkzeuge fragen für beide Seiten („Welche Felder hat seine Figur noch?“, W7). Ohne
 * Regeln (Lehrbild ohne König) gelten die einfachen Zugmöglichkeiten der Figuren.
 * Eingaben: Stellung, Farbe. Ausgabe: je Figur ihre Zielfelder (Rochade als Turmfeld, wie in
 * chessops; der König schlägt dabei scheinbar den eigenen Turm und wird hier ausgelassen).
 */
export function zugziele(stellung: Stellung, farbe: Color): Map<Square, SquareSet> {
  const { brett, regeln } = stellung;
  if (regeln) {
    const ziele = regelnFuer(regeln, farbe).allDests();
    for (const [von, felder] of ziele) {
      ziele.set(von, felder.diff(brett[farbe]));
    }
    return ziele;
  }
  const ziele = new Map<Square, SquareSet>();
  for (const von of brett[farbe]) {
    const figur = brett.get(von);
    if (figur) ziele.set(von, zieleOhneRegeln(brett, von, figur));
  }
  return ziele;
}

/**
 * Prüft, ob eine Figur auf dem Zielfeld sicher stünde: Was sie dort schlägt, abzüglich dessen,
 * was der Gegner laut Abtauschrechnung zurückgewinnt, ist nicht negativ. Ein Bauer auf der
 * letzten Reihe zählt als Dame.
 *
 * Beispiel: Abb. 1.32, Läufer g4: h5 und e6 sind sicher (das Buch empfiehlt 7... Lh5 oder Le6),
 * f3 ist ein Abtausch (Lxf3 Dxf3, Bilanz 0, also „verliert nichts“), h3 verliert den Läufer
 * für einen Bauern.
 */
function istSicher(brett: Board, von: Square, figur: Piece, nach: Square): boolean {
  const kopie = brett.clone();
  kopie.take(von);
  const geschlagen = kopie.take(nach);
  const umgewandelt = figur.role === "pawn" && squareRank(nach) === UMWANDLUNGSREIHE[figur.color];
  kopie.set(nach, umgewandelt ? { role: "queen", color: figur.color } : figur);
  const rueckschlag = abtausch(kopie, nach);
  const verlust = rueckschlag ? Math.max(0, rueckschlag.bilanz) : 0;
  const gewinn = geschlagen ? FIGURENWERT[geschlagen.role] : 0;
  return gewinn - verlust >= 0;
}

/**
 * Sichere und unsichere Zielfelder jeder Figur einer Farbe.
 *
 * Warum: „Figur am Rand“ (W7) heißt laut Pflichtenheft 6.6: höchstens zwei sichere Felder.
 * Eingaben: Stellung, Farbe. Ausgabe: je Figur (ohne Bauern und König sinnvoll, aber vollständig)
 * die Felder, auf denen sie kein Material verliert, und die übrigen.
 * Beispiel: Abb. 7.5 (nach 4. Lg5, Schwarz am Zug): Der Springer f6 hat kein sicheres Feld, denn
 * zieht er, schlägt der Läufer die Dame (relative Fesselung); die Abtauschrechnung sieht nur
 * das Zielfeld, deshalb erscheint e4 trotzdem als sicher. Das ist die Grenze dieses Bausteins.
 * Sonderfälle: Ohne Regeln (Lehrbild) einfache Zugmöglichkeiten, siehe zugziele.
 */
export function sichereFelder(stellung: Stellung, farbe: Color): Figurenfelder[] {
  const ergebnis: Figurenfelder[] = [];
  for (const [von, ziele] of zugziele(stellung, farbe)) {
    const figur = stellung.brett.get(von);
    if (!figur) continue;
    const sichere: Square[] = [];
    const unsichere: Square[] = [];
    for (const nach of ziele) {
      (istSicher(stellung.brett, von, figur, nach) ? sichere : unsichere).push(nach);
    }
    ergebnis.push({ feld: von, figur, sichere, unsichere });
  }
  return ergebnis;
}
