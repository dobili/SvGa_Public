/**
 * Bauernsturm gegen den gegnerischen König: Wie viele Bauernzüge bis zum ersten Hebel gegen
 * seinen Bauernschild? Dazu die Ziele im Bauernschild, die nur der König deckt.
 *
 * Rolle im Gesamtbild: Baustein für k6-wo (Planfrage 1, Lagen „Könige auf verschiedenen Flügeln“
 * und „auf demselben Flügel“). Pflichtenheft 6.3: „Bei entgegengesetzten Rochaden: Bauernzüge bis
 * zum ersten Hebel für beide Seiten zählen.“ Abhängigkeiten: chessops, bauernprofil.ts,
 * angriffskarte.ts, koenigsumgebung.ts.
 * Buchbezug: Kapitel 6, Abb. 6.6: „Weiß braucht zwei (h4 und h5), bis sein h-Bauer den Bauern g6
 * angreift. Schwarz braucht mindestens drei (...a5, ...a4, ...a3).“ Abb. 6.7: das Ziel h7, „das
 * nur der König deckt“.
 */
import { attacks } from "chessops/attacks";
import type { Board } from "chessops/board";
import { SquareSet } from "chessops/squareSet";
import type { Color, Square } from "chessops/types";
import { squareFile } from "chessops/util";
import type { Angriffskarte } from "./angriffskarte";
import { eigeneReihe, feldAusEigener } from "./bauernprofil";
import type { Koenigsumgebung } from "./koenigsumgebung";
import { gegner } from "./stellung";

/** So viele Bauernzüge zählt die App höchstens bis zum Hebel. */
const HOECHSTENS_ZUEGE = 4;
const STARTREIHE = 1;

/** Ein Bauernsturm: der Bauer, sein Zielfeld, die Züge bis dahin und der Schildbauer, den er trifft. */
export interface Sturm {
  readonly bauer: Square;
  readonly ziel: Square;
  readonly zuege: number;
  readonly trifft: Square;
}

/** Ein Ziel im gegnerischen Bauernschild: nur der König deckt es, eigene Figuren erreichen es. */
export interface Schildziel {
  readonly feld: Square;
  readonly angreifer: readonly Square[];
}

/** Die Felder, die ein Bauer der Farbe von dort aus angreift. */
function bauerndeckung(feld: Square, farbe: Color): SquareSet {
  return attacks({ role: "pawn", color: farbe }, feld, SquareSet.empty());
}

/** Zählt die Züge eines Bauern bis er einen Schildbauern angreift, oder null. */
function sturmVon(brett: Board, bauer: Square, farbe: Color, schild: SquareSet): Sturm | null {
  const linie = squareFile(bauer);
  let reihe = eigeneReihe(bauer, farbe);
  let zuege = 0;
  while (zuege < HOECHSTENS_ZUEGE) {
    const doppelschritt = reihe === STARTREIHE;
    const schritte = doppelschritt ? 2 : 1;
    let ziel: Square | null = null;
    for (let s = 1; s <= schritte; s += 1) {
      const feld = feldAusEigener(linie, reihe + s, farbe);
      if (feld === null || brett.occupied.has(feld)) break;
      ziel = feld;
      const trifft = bauerndeckung(feld, farbe).intersect(schild).first();
      if (trifft !== undefined) return { bauer, ziel: feld, zuege: zuege + 1, trifft };
    }
    if (ziel === null) return null;
    reihe = eigeneReihe(ziel, farbe);
    zuege += 1;
  }
  return null;
}

/**
 * Der schnellste Bauernsturm einer Seite gegen den Bauernschild des gegnerischen Königs.
 *
 * Eingaben: Brett, stürmende Farbe, Umgebung des gegnerischen Königs. Ausgabe: der Sturm mit den
 * wenigsten Zügen, oder null (kein Schild, kein Bauer kommt heran).
 * Beispiel: Abb. 6.6: Weiß h2–h5 in 2 Zügen gegen g6; Schwarz a7–a3 in 3 Zügen gegen b2.
 * Sonderfälle: Der Doppelschritt vom Startfeld zählt als ein Zug; ein besetztes Feld sperrt.
 */
export function schnellsterSturm(
  brett: Board,
  farbe: Color,
  koenigGegner: Koenigsumgebung,
): Sturm | null {
  const schild = koenigGegner.bauernschild.reduce((menge, b) => menge.with(b), SquareSet.empty());
  if (schild.isEmpty()) return null;
  let bester: Sturm | null = null;
  for (const bauer of brett.pawn.intersect(brett[farbe])) {
    const sturm = sturmVon(brett, bauer, farbe, schild);
    if (sturm && (!bester || sturm.zuege < bester.zuege)) bester = sturm;
  }
  return bester;
}

/**
 * Ziele im gegnerischen Bauernschild: Felder (Schildbauern und Nachbarfelder des Königs), die
 * außer dem König keine gegnerische Figur deckt und die mindestens eine eigene Figur angreift.
 *
 * Regel: Kapitel 6, dritte Bedingung für den Königsangriff: „ein Feld, das nur der König deckt
 * und das deine Angreifer erreichen“. Beispiel: Abb. 6.7: h7 (Läufer d3), vom König gedeckt.
 */
export function schildziele(
  karte: Angriffskarte,
  farbe: Color,
  koenigGegner: Koenigsumgebung,
): Schildziel[] {
  const feind = gegner(farbe);
  const kandidaten = new Set([...koenigGegner.bauernschild, ...koenigGegner.nachbarfelder]);
  const ziele: Schildziel[] = [];
  for (const feld of kandidaten) {
    const verteidiger = karte.angreiferVon(feld, feind).filter((a) => a.rolle !== "king");
    if (verteidiger.length > 0) continue;
    const angreifer = karte
      .angreiferVon(feld, farbe)
      .filter((a) => a.rolle !== "king" && a.rolle !== "pawn")
      .map((a) => a.feld);
    if (angreifer.length > 0) ziele.push({ feld, angreifer });
  }
  return ziele.sort((a, b) => a.feld - b.feld);
}
