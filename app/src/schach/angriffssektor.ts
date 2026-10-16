/**
 * Angriffssektor für die goldene Angriffsregel (Kapitel 1): Angreifer und Verteidiger am König.
 *
 * Rolle im Gesamtbild: Baustein für das Werkzeug k1-angriffsregel. Pflichtenheft 6.6 definiert
 * den Sektor als die Linien des Flügels, auf dem der gegnerische König steht (e bis h, a bis d,
 * in der Mitte c bis f). Die App nimmt davon die Hälfte des Verteidigers (Reihen 5 bis 8 gegen
 * Schwarz, 1 bis 4 gegen Weiß) und zählt so, wie das Buch in Abb. 1.36 und 1.37 zählt:
 * Angreifer sind Figuren außer König und Bauer, die ein Sektorfeld angreifen, Langschrittfiguren
 * auch durch eine eigene Figur hindurch, die wegziehen kann (die Diagonale d1–h5, „sobald der
 * Springer zieht“). Verteidiger sind gegnerische Figuren außer König und Bauer, die im Sektor
 * stehen; gefesselte und überlastete zählen nicht (Kapitel 1: „Ein gefesselter … oder
 * überlasteter Verteidiger zählt weniger“). Gefesselte Angreifer zählen ebenso wenig.
 * Abhängigkeiten: chessops, angriffskarte.ts, stellung.ts.
 * Buchbezug: Kapitel 1, „Angriff braucht Übermacht: die goldene Angriffsregel“, Abb. 1.36, 1.37.
 */
import { attacks } from "chessops/attacks";
import type { Board } from "chessops/board";
import { SquareSet } from "chessops/squareSet";
import type { Color, Square } from "chessops/types";
import { squareFile, squareFromCoords } from "chessops/util";
import type { Figurenstand } from "./angriffskarte";
import { gegner } from "./stellung";

/** Linien der drei Sektoren (Pflichtenheft 6.6): Damenflügel, Mitte, Königsflügel. */
const DAMENFLUEGEL = [0, 1, 2, 3];
const MITTE = [2, 3, 4, 5];
const KOENIGSFLUEGEL = [4, 5, 6, 7];
/** Der König steht auf dem Damenflügel bis Linie c, auf dem Königsflügel ab Linie f. */
const LETZTE_DAMENLINIE = 2;
const ERSTE_KOENIGSLINIE = 5;
/** Reihen der Hälfte des Verteidigers. */
const HAELFTE: Readonly<Record<Color, readonly number[]>> = {
  white: [0, 1, 2, 3],
  black: [4, 5, 6, 7],
};
const LANGSCHRITTLER = new Set(["bishop", "rook", "queen"]);
/** Reihenfolge in den Listen wie im Buch: Springer, Läufer, Türme, Dame. */
const REIHENFOLGE = ["knight", "bishop", "rook", "queen"];

/** Warum eine Figur im Sektor nicht mitzählt. */
export type Ausnahmegrund = "gefesselt" | "ueberlastet";

export interface Angriffssektor {
  /** Die Seite, die angreift. */
  readonly angreifer: Color;
  readonly felder: SquareSet;
  /** Linien des Sektors (für die Beschriftung „e5–h8“). */
  readonly linien: readonly number[];
  readonly reihen: readonly number[];
  readonly angreiferListe: readonly Figurenstand[];
  readonly verteidiger: readonly Figurenstand[];
  /** Angreifer und Verteidiger im Sektor, die nicht zählen, mit Grund. */
  readonly ausgenommen: readonly { stand: Figurenstand; grund: Ausnahmegrund }[];
}

/** Die Linien des Flügels, auf dem der König steht. */
export function sektorlinien(koenig: Square): readonly number[] {
  const linie = squareFile(koenig);
  if (linie <= LETZTE_DAMENLINIE) return DAMENFLUEGEL;
  if (linie >= ERSTE_KOENIGSLINIE) return KOENIGSFLUEGEL;
  return MITTE;
}

function sektorfelder(linien: readonly number[], reihen: readonly number[]): SquareSet {
  let felder = SquareSet.empty();
  for (const linie of linien) {
    for (const reihe of reihen) {
      const feld = squareFromCoords(linie, reihe);
      if (feld !== undefined) felder = felder.with(feld);
    }
  }
  return felder;
}

/**
 * Greift die Figur ein Sektorfeld an, als Langschrittfigur auch durch eine eigene Figur hindurch?
 * Bauern als Schirm zählen nicht: Sie verlassen ihre Linie nur mit einem Schlag.
 */
function greiftSektorAn(brett: Board, stand: Figurenstand, felder: SquareSet): boolean {
  const direkt = attacks(stand.figur, stand.feld, brett.occupied);
  if (direkt.intersects(felder)) return true;
  if (!LANGSCHRITTLER.has(stand.figur.role)) return false;
  const eigeneSchirme = direkt
    .intersect(brett[stand.figur.color])
    .diff(brett.pieces(stand.figur.color, "pawn"));
  for (const schirm of eigeneSchirme) {
    if (attacks(stand.figur, stand.feld, brett.occupied.without(schirm)).intersects(felder)) {
      return true;
    }
  }
  return false;
}

function figurenVon(brett: Board, farbe: Color, auswahl: SquareSet): Figurenstand[] {
  const liste: Figurenstand[] = [];
  for (const feld of brett[farbe].intersect(auswahl)) {
    const figur = brett.get(feld);
    if (figur && figur.role !== "king" && figur.role !== "pawn") liste.push({ feld, figur });
  }
  const rang = (stand: Figurenstand) => REIHENFOLGE.indexOf(stand.figur.role);
  return liste.sort((a, b) => rang(a) - rang(b) || a.feld - b.feld);
}

/**
 * Zählt Angreifer und Verteidiger im Sektor um den gegnerischen König.
 *
 * Warum: „Ein Angriff gelingt nur, wenn deine Angreifer die Verteidiger im Zielbereich
 * zahlenmäßig übertreffen“ (Kapitel 1). Eingaben: Brett, angreifende Farbe, Felder gefesselter
 * Figuren (beider Seiten) und überlasteter Verteidiger. Ausgabe: Sektor mit Angreifern und Verteidigern, oder null
 * ohne gegnerischen König. Beispiel: Abb. 1.36: Angreifer nur Sf3; Abb. 1.37: Ld3, Sf3 und Dd1
 * gegen den Turm f8.
 */
export function angriffssektor(
  brett: Board,
  angreifer: Color,
  gefesselt: ReadonlySet<Square>,
  ueberlastet: ReadonlySet<Square>,
): Angriffssektor | null {
  const verteidigerFarbe = gegner(angreifer);
  const koenig = brett.kingOf(verteidigerFarbe);
  if (koenig === undefined) return null;
  const linien = sektorlinien(koenig);
  const reihen = HAELFTE[verteidigerFarbe];
  const felder = sektorfelder(linien, reihen);
  const moegliche = figurenVon(brett, angreifer, SquareSet.full()).filter((stand) =>
    greiftSektorAn(brett, stand, felder),
  );
  const imSektor = figurenVon(brett, verteidigerFarbe, felder);
  const grund = (stand: Figurenstand): Ausnahmegrund | null =>
    gefesselt.has(stand.feld) ? "gefesselt" : ueberlastet.has(stand.feld) ? "ueberlastet" : null;
  const ausgenommen = [...moegliche, ...imSektor].flatMap((stand) => {
    const g = grund(stand);
    return g === null ? [] : [{ stand, grund: g }];
  });
  return {
    angreifer,
    felder,
    linien,
    reihen,
    angreiferListe: moegliche.filter((stand) => grund(stand) === null),
    verteidiger: imSektor.filter((stand) => grund(stand) === null),
    ausgenommen,
  };
}
