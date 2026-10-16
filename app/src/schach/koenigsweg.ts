/**
 * Wege des Königs: Abstand in Königszügen und der kürzeste sichere Weg zu einem Ziel.
 *
 * Rolle im Gesamtbild: Baustein der Endspielwerkzeuge (k8-regeln „Weg des Königs“,
 * k8-schluesselfelder). Pflichtenheft 6.3, Kapitel 8: „Gold: Weg des Königs“.
 * Abhängigkeiten: chessops, angriffskarte.ts.
 * Buchbezug: Kapitel 8, Abb. 8.37 („Er braucht für einen Weg so viele Züge, wie die längere der
 * beiden Strecken beträgt“) und Regel 1 („Aktiv wird er erst, wenn ihn die gegnerischen Figuren
 * nicht mehr mit Schachs oder Mattdrohungen bestrafen können“).
 */
import { kingAttacks } from "chessops/attacks";
import type { Color, Square } from "chessops/types";
import { squareFile, squareRank } from "chessops/util";
import type { Angriffskarte } from "./angriffskarte";
import { gegner, type Stellung } from "./stellung";

/** Ein Weg des Königs: das erreichte Ziel und die Felder dorthin (ohne Startfeld, mit Ziel). */
export interface Koenigsweg {
  readonly ziel: Square;
  readonly weg: readonly Square[];
}

/**
 * Abstand zweier Felder in Königszügen.
 *
 * Regel: Kapitel 8, Abb. 8.37: Der König braucht so viele Züge wie die längere der beiden
 * Strecken, da ein schräger Schritt beides zugleich verkürzt. Beispiel: e1 nach e5 vier Züge,
 * e1 nach a5 ebenfalls vier.
 */
export function koenigsabstand(a: Square, b: Square): number {
  return Math.max(Math.abs(squareFile(a) - squareFile(b)), Math.abs(squareRank(a) - squareRank(b)));
}

/** Darf der König der Farbe dieses Feld betreten: frei von eigenen Figuren und nicht angegriffen? */
function betretbar(stellung: Stellung, karte: Angriffskarte, farbe: Color, feld: Square): boolean {
  const figur = stellung.brett.get(feld);
  if (figur && figur.color === farbe) return false;
  return !karte.greiftAn(feld, gegner(farbe));
}

/**
 * Kürzester sicherer Weg des Königs zu einem der Ziele.
 *
 * Warum: Regel 1 („Aktiviere deinen König“) verlangt einen Weg, auf dem ihn keine Schachs
 * bestrafen. Die App sucht in der Breite über Felder, die keine eigene Figur besetzt und die der
 * Gegner nicht angreift. Ungedeckte gegnerische Figuren darf er schlagen.
 * Eingaben: Stellung, Angriffskarte, Farbe des Königs, Zielfelder. Ausgabe: Ziel und Weg, oder
 * null, wenn kein Ziel erreichbar ist oder die Farbe keinen König hat.
 * Beispiel: Abb. 8.27 (Weiß am Zug, König d3, Bauer d2): Ziel c4, d4 oder e4 in einem Zug.
 * Sonderfall: Näherung, die übrigen Figuren bleiben stehen; ein Ziel, auf dem der König schon
 * steht, ergibt einen leeren Weg.
 */
export function koenigsweg(
  stellung: Stellung,
  karte: Angriffskarte,
  farbe: Color,
  ziele: ReadonlySet<Square>,
): Koenigsweg | null {
  const start = stellung.brett.kingOf(farbe);
  if (start === undefined) return null;
  if (ziele.has(start)) return { ziel: start, weg: [] };
  const vorgaenger = new Map<Square, Square>([[start, start]]);
  const schlange: Square[] = [start];
  for (let i = 0; i < schlange.length; i += 1) {
    const feld = schlange[i] as Square;
    for (const nachbar of geradeZuerst(kingAttacks(feld), ziele)) {
      if (vorgaenger.has(nachbar) || !betretbar(stellung, karte, farbe, nachbar)) continue;
      vorgaenger.set(nachbar, feld);
      if (ziele.has(nachbar)) return { ziel: nachbar, weg: rueckweg(vorgaenger, start, nachbar) };
      schlange.push(nachbar);
    }
  }
  return null;
}

/**
 * Nachbarfelder so geordnet, dass der Weg möglichst gerade auf das Ziel zuläuft (Abb. 8.37: der
 * gerade Weg und der Bogen sind gleich lang; die App zeigt den geraden, Übung 8.60: Kc3, Kc4, Kc5).
 */
function geradeZuerst(felder: Iterable<Square>, ziele: ReadonlySet<Square>): Square[] {
  const BOGEN = 16;
  const mass = (feld: Square) =>
    Math.min(
      ...[...ziele].map(
        (ziel) =>
          koenigsabstand(feld, ziel) * BOGEN +
          Math.abs(squareFile(feld) - squareFile(ziel)) +
          Math.abs(squareRank(feld) - squareRank(ziel)),
      ),
    );
  return [...felder].sort((a, b) => mass(a) - mass(b));
}

/** Liest den Weg aus den Vorgängern, vom Ziel zurück zum Start. */
function rueckweg(vorgaenger: ReadonlyMap<Square, Square>, start: Square, ziel: Square): Square[] {
  const weg: Square[] = [];
  for (let feld = ziel; feld !== start; feld = vorgaenger.get(feld) ?? start) weg.unshift(feld);
  return weg;
}
