/**
 * Gabelgeometrie (Warnsignal W6): Felder, von denen aus ein Springer oder Bauer nach einem Zug
 * zwei gegnerische Ziele zugleich angreift.
 *
 * Rolle im Gesamtbild: Baustein für k7-warnsignale. Pflichtenheft 6.6: „W6 Gabelgeometrie: Ein
 * Feld, das ein eigener Springer oder Bauer mit einem Zug erreicht und von dem aus er zwei
 * gegnerische Ziele angreift: König, wertvollere oder ungedeckte Figur.“
 * Abhängigkeiten: chessops, angriffskarte.ts, sichereFelder.ts (Zugziele).
 * Buchbezug: Kapitel 7, W6 („Zwei gegnerische Figuren stehen so, dass ein Springer oder ein Bauer
 * sie von einem Feld aus zugleich angreifen könnte“) und Motiv 1 (Abb. 7.2, 7.3, 7.15).
 */
import { attacks } from "chessops/attacks";
import { SquareSet } from "chessops/squareSet";
import type { Color, Piece, Square } from "chessops/types";
import type { Angriffskarte, Figurenstand } from "./angriffskarte";
import { zugziele } from "./sichereFelder";
import { FIGURENWERT, gegner, type Stellung } from "./stellung";

/** Ein Gabelfeld: die Figur, die es erreicht, und die Ziele, die sie von dort angreift. */
export interface Gabelfeld {
  readonly figur: Figurenstand;
  readonly feld: Square;
  readonly ziele: readonly Square[];
}

/** Gabelt nur, wer es zweimal trifft. */
const MINDESTENS_ZIELE = 2;

/**
 * Ist die gegnerische Figur auf dem Feld ein Gabelziel, also eines, das der Angreifer gewinnt,
 * wenn der Gegner es nicht rettet?
 *
 * Regel: Kapitel 7, Motiv 1 und W6; Entscheidung des Autors zu C2.12 („Generell sollte eine Gabel
 * Material gewinnen. Zumindest eine der angegriffenen Figuren sollte also ungedeckt sein oder mehr
 * wert.“). Ein Ziel ist der König (er gilt als wertvollstes Ziel und muss immer gerettet werden),
 * eine Figur, die mehr wert ist als der Angreifer, oder eine ungedeckte Figur, auch ein
 * ungedeckter Bauer. Gedeckte Bauern und gedeckte Figuren, die nicht mehr wert sind, zählen nicht:
 * Sie zu schlagen wäre nur ein Tausch. Weil jedes Ziel einzeln gewinnbar ist, gewinnt eine Gabel
 * mit zwei Zielen Material: Der Gegner rettet nur eines (den König zuerst), das andere fällt.
 * Eingaben: Angriffskarte, Feld des Ziels, angreifende Figur. Ausgabe: true, wenn Ziel.
 * Beispiel: Abb. 7.18, der Springer e7 trifft Turm c8 (mehr wert) und König g8; der gedeckte
 * Läufer c6 ist kein Ziel. Abb. 7.18 für Schwarz: Sb4 trifft die ungedeckten Bauern a2 und c2.
 * Sonderfall: Auch das Motiv-Werkzeug (taktikmotive.ts) wählt seine Ziele mit dieser Regel.
 */
export function istGabelziel(karte: Angriffskarte, feld: Square, angreifer: Piece): boolean {
  const figur = karte.brett.get(feld);
  if (!figur) return false;
  if (figur.role === "king") return true;
  const ungedeckt = karte.angreiferVon(feld, figur.color).length === 0;
  if (figur.role === "pawn") return ungedeckt;
  return FIGURENWERT[figur.role] > FIGURENWERT[angreifer.role] || ungedeckt;
}

/**
 * Alle Gabelfelder einer Farbe (der angreifenden Seite).
 *
 * Eingaben: Stellung, Angriffskarte, angreifende Farbe. Ausgabe: Gabelfelder, je Figur und Feld.
 * Beispiel: Abb. 7.14 nach 1. Th8+ Kxh8: Der Springer g5 erreicht f7 und trifft dort König h8
 * und Dame d6 (Abb. 7.15). Sonderfälle: Ohne Regeln gelten die einfachen Zugmöglichkeiten.
 */
export function gabelfelder(stellung: Stellung, karte: Angriffskarte, farbe: Color): Gabelfeld[] {
  const feind = gegner(farbe);
  const ergebnis: Gabelfeld[] = [];
  for (const [von, felder] of zugziele(stellung, farbe)) {
    const figur = stellung.brett.get(von);
    if (!figur || (figur.role !== "knight" && figur.role !== "pawn")) continue;
    for (const feld of felder) {
      const getroffen = attacks(figur, feld, SquareSet.empty()).intersect(stellung.brett[feind]);
      const ziele = [...getroffen].filter((z) => istGabelziel(karte, z, figur));
      if (ziele.length >= MINDESTENS_ZIELE)
        ergebnis.push({ figur: { feld: von, figur }, feld, ziele });
    }
  }
  return ergebnis;
}
