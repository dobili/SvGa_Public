/**
 * Angreifer eines Feldes finden, auch Figuren in einer Batterie.
 *
 * Rolle im Gesamtbild: Grundlage aller Zählwerkzeuge (Konzept 6.2 „angreifer“ und 7.2
 * „Angriffskarte“). Das Werkzeug k1-zaehlen und die Abtauschrechnung bauen darauf auf.
 * Abhängigkeiten: chessops (Angriffsfelder je Figur), stellung.ts.
 * Buchbezug: Kapitel 1, „Werte von Angreifer und Verteidiger zählen“ und
 * „Zählen in der Praxis: der Bauernhebel“.
 */
import { attacks, between } from "chessops/attacks";
import type { Board } from "chessops/board";
import { SquareSet } from "chessops/squareSet";
import type { Color, Role, Square } from "chessops/types";

/** Eine Figur, die ein Feld angreift oder deckt. */
export interface Angreifer {
  /** Feld, auf dem die Figur steht. */
  readonly feld: Square;
  readonly rolle: Role;
  readonly farbe: Color;
  /**
   * Bei einer Batterie das Feld der eigenen Figur direkt davor (Abb. 1.26: Dame b6 hinter
   * dem Bauern c5), sonst null.
   */
  readonly hinter: Square | null;
}

/** Figuren, die auf Linien ziehen und deshalb hinter einer anderen Figur eine Batterie bilden. */
const LINIENFIGUREN: ReadonlySet<Role> = new Set<Role>(["bishop", "rook", "queen"]);

/**
 * Findet alle Figuren einer Farbe, die ein Feld bei gegebener Brettbelegung direkt angreifen.
 *
 * Warum: Die Belegung ist ein eigener Parameter, damit Batterien und Abtauschfolgen
 * dieselbe Funktion mit „weggedachten“ Figuren nutzen können.
 * Eingaben: Brett, Zielfeld, Farbe, Belegung (welche Felder als besetzt gelten),
 * Felder, die nicht mehr mitzählen (schon geschlagen oder schon gezählt).
 * Ausgabe: Angreifer ohne Batterieangabe.
 * Beispiel: Abb. 1.28, Feld d4, Schwarz: Springer c6 und Dame b6.
 */
export function direkteAngreifer(
  brett: Board,
  ziel: Square,
  farbe: Color,
  belegung: SquareSet,
  ausgenommen: SquareSet,
): Angreifer[] {
  const ergebnis: Angreifer[] = [];
  for (const feld of brett[farbe].diff(ausgenommen)) {
    const figur = brett.get(feld);
    if (figur && attacks(figur, feld, belegung).has(ziel)) {
      ergebnis.push({ feld, rolle: figur.role, farbe, hinter: null });
    }
  }
  return ergebnis;
}

/**
 * Bestimmt, hinter welcher eigenen Figur eine Linienfigur in der Batterie steht.
 *
 * Regel: Kapitel 1, Abb. 1.26: Die Dame b6 greift d4 über den Bauern c5 hinweg an, weil der
 * Bauer selbst d4 angreift. Gemeint ist die vorderste weggedachte Figur direkt vor ihr.
 */
function vordermann(feld: Square, ziel: Square, weggedacht: SquareSet): Square | null {
  let naechstes: Square | null = null;
  let kleinsterAbstand = Number.POSITIVE_INFINITY;
  for (const kandidat of between(feld, ziel).intersect(weggedacht)) {
    const abstand = between(feld, kandidat).size();
    if (abstand < kleinsterAbstand) {
      kleinsterAbstand = abstand;
      naechstes = kandidat;
    }
  }
  return naechstes;
}

/**
 * Findet alle Figuren einer Farbe, die ein Feld angreifen oder decken, auf Wunsch mit Batterien.
 *
 * Warum: Das Zählen im Buch zählt Figuren in einer Batterie mit (Abb. 1.26: Dame b6 hinter dem
 * Bauern c5), aber keine Figur, die von einer anderen Figur verstellt wird, die selbst nicht
 * angreift (Abb. 1.6: Dame d8 hinter dem Bauern d5 zählt nicht, Dame d1 hinter dem Läufer d3
 * auch nicht).
 * Eingaben: Brett, Zielfeld, Farbe, ob Batterien mitzählen.
 * Ausgabe: Angreifer in der Reihenfolge, in der sie gefunden werden (erst direkte, dann Batterien).
 * Beispiel: Abb. 1.26, d4, Schwarz → Bauer c5, Springer c6, Dame b6 (hinter c5).
 * Sonderfälle: Eine Batterie kann mehrstufig sein (Turm hinter Turm hinter Dame). Gegnerische
 * Figuren auf der Linie unterbrechen die Batterie immer.
 */
export function angreifer(
  brett: Board,
  ziel: Square,
  farbe: Color,
  mitBatterie = true,
): Angreifer[] {
  let belegung = brett.occupied;
  let gezaehlt = direkteAngreifer(brett, ziel, farbe, belegung, SquareSet.empty());
  const ergebnis: Angreifer[] = [...gezaehlt];
  let bekannt = felderVon(ergebnis);

  // Schrittweise jede gefundene Figur wegdenken und prüfen, ob dahinter eine Linienfigur frei wird.
  while (mitBatterie && gezaehlt.length > 0) {
    belegung = belegung.diff(felderVon(gezaehlt));
    const neue = direkteAngreifer(brett, ziel, farbe, belegung, bekannt)
      .filter((figur) => LINIENFIGUREN.has(figur.rolle))
      .map((figur) => ({ ...figur, hinter: vordermann(figur.feld, ziel, bekannt) }));
    ergebnis.push(...neue);
    bekannt = bekannt.union(felderVon(neue));
    gezaehlt = neue;
  }
  return ergebnis;
}

/** Die Felder einer Liste von Angreifern als Feldmenge. */
function felderVon(liste: readonly Angreifer[]): SquareSet {
  return liste.reduce((menge, figur) => menge.with(figur.feld), SquareSet.empty());
}
