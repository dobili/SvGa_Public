/**
 * Turmendspiel mit Freibauer: die drei Begriffe des Buches (Abschneiden, Schachdistanz, kurze und
 * lange Seite) und die Lage der Figuren, auf der die Erkennungsbilder aufbauen.
 *
 * Rolle im Gesamtbild: Baustein für k9-turmbegriffe und k9-erkennungsbilder. Pflichtenheft 6.3,
 * Kapitel 9: „Abschneiden, Schachdistanz (mindestens drei Linien zwischen Turm und Bauer), kurze
 * und lange Seite“.
 * Abhängigkeiten: chessops, bauernprofil.ts, bauernschwaechen.ts, stellung.ts.
 * Buchbezug: Kapitel 9, „Dein Werkzeug: drei Begriffe für jedes Turmendspiel“ (Abb. 9.1, 9.2).
 */
import type { Color, Square } from "chessops/types";
import { squareFile, squareRank } from "chessops/util";
import { eigeneReihe } from "./bauernprofil";
import { bauernschwaechen } from "./bauernschwaechen";
import { gegner, type Stellung } from "./stellung";

/** Die Lage eines Turmendspiels mit Freibauer. */
export interface Turmlage {
  /** Die Seite mit dem Freibauern. */
  readonly angreifer: Color;
  readonly bauer: Square;
  readonly umwandlungsfeld: Square;
  readonly koenigAngreifer: Square;
  readonly koenigVerteidiger: Square;
  /** Türme beider Seiten, null ohne Turm. */
  readonly turmAngreifer: Square | null;
  readonly turmVerteidiger: Square | null;
  readonly abschneiden: Abschneiden | null;
  readonly schachdistanz: Schachdistanz | null;
  readonly seiten: Seiten;
}

/** Abschneiden: Ein Turm sperrt eine Linie oder Reihe zwischen dem gegnerischen König und dem Bauern. */
export interface Abschneiden {
  readonly turm: Square;
  readonly koenig: Square;
  readonly richtung: "linie" | "reihe";
  /** Linien (oder Reihen) zwischen dem verteidigenden König und dem Bauern. */
  readonly dazwischen: number;
  /** Von und bis: die Sperrlinie des Turms, zum Zeichnen. */
  readonly von: Square;
  readonly bis: Square;
}

/** Schachdistanz des verteidigenden Turms: Linien zwischen Turm und Bauer. */
export interface Schachdistanz {
  readonly linien: number;
  readonly reicht: boolean;
}

/** Kurze und lange Seite neben dem Bauern. */
export interface Seiten {
  /** Linien links und rechts des Bauern bis zum Rand. */
  readonly links: number;
  readonly rechts: number;
  /** Seite, auf der der verteidigende König steht (null: auf der Bauernlinie). */
  readonly koenigAuf: "kurz" | "lang" | "gleich" | null;
  /** Seite, auf der der verteidigende Turm steht. */
  readonly turmAuf: "kurz" | "lang" | "gleich" | null;
}

/** „Zwischen dem Turm und dem Bauern müssen mindestens drei Linien liegen.“ */
export const SCHACHDISTANZ_LINIEN = 3;
/** „Ab drei Linien reicht es oft zum Gewinn.“ */
export const ABSCHNEIDEN_GEWINN_LINIEN = 3;
const LETZTE = 7;

/** Die 6. Reihe des Angreifers (Index 5): Ab hier gibt der Philidor-Turm von hinten Schach. */
const SECHSTE = 5;

/** Steht ein König vor dem Bauern (auf seiner Linie, in Zugrichtung davor)? */
export function vorDemBauern(koenig: Square, bauer: Square, farbe: Color): boolean {
  return (
    squareFile(koenig) === squareFile(bauer) &&
    eigeneReihe(koenig, farbe) > eigeneReihe(bauer, farbe)
  );
}

/**
 * Ist die Philidor-Stellung das Bild? Der verteidigende König steht vor dem Bauern, und der
 * angreifende König steht noch nicht vor seinem Bauern.
 *
 * Regel: Kapitel 9, „Die Philidor-Stellung“ (Abb. 9.3, 9.4); kurze und lange Seite gelten erst,
 * „wenn Philidor nicht mehr geht“. Präzisierung (C2.16, bestätigt): Steht der angreifende König
 * schon vor seinem Bauern (Übung 9.46, König f6 vor f5), ist Philidor nicht mehr zu erreichen.
 */
export function philidorMoeglich(lage: Turmlage): boolean {
  const reihe = eigeneReihe(lage.bauer, lage.angreifer);
  const koenigVorn = eigeneReihe(lage.koenigAngreifer, lage.angreifer) > reihe;
  return vorDemBauern(lage.koenigVerteidiger, lage.bauer, lage.angreifer) && !koenigVorn;
}

/**
 * Steht der verteidigende Turm wie in der Philidor-Stellung? Bauer bis zur 5. Reihe: auf der
 * Reihe vor dem Bauern (der 3. Reihe des Verteidigers, Abb. 9.3: Th6); Bauer ab der 6. Reihe:
 * hinter dem Bauern, um von hinten Schach zu geben (Abb. 9.4: Th1).
 */
export function philidorTurmRichtig(lage: Turmlage): boolean {
  const turm = lage.turmVerteidiger;
  if (turm === null) return false;
  const reihe = eigeneReihe(lage.bauer, lage.angreifer);
  const turmreihe = eigeneReihe(turm, lage.angreifer);
  return reihe < SECHSTE ? turmreihe === reihe + 1 : turmreihe < reihe;
}

/** Der am weitesten vorgerückte Freibauer einer Farbe. */
function vorderster(stellung: Stellung, farbe: Color): Square | null {
  const frei = bauernschwaechen(stellung.brett, farbe).freibauern.map((f) => f.feld);
  if (frei.length === 0) return null;
  return frei.reduce((a, b) => (eigeneReihe(b, farbe) > eigeneReihe(a, farbe) ? b : a));
}

/** Erster Turm einer Farbe. */
function turmVon(stellung: Stellung, farbe: Color): Square | null {
  return stellung.brett[farbe].intersect(stellung.brett.rook).first() ?? null;
}

/** Liegt c strikt zwischen a und b? */
function zwischen(c: number, a: number, b: number): boolean {
  return (a < c && c < b) || (b < c && c < a);
}

/**
 * Abschneiden: Steht ein Turm auf einer Linie zwischen dem gegnerischen König und dem Bauern,
 * oder auf einer Reihe zwischen diesem König und dem Umwandlungsfeld? Beispiel: Abb. 9.1, Turm e1
 * zwischen König g6 und Bauer c5: drei Linien (d, e, f) dazwischen. Abb. 9.18: Der Turm d1 sperrt
 * dem König e4 die d-Linie zu seinem eigenen Bauern b4. Übung 9.50: Tg5 sperrt die 5. Reihe.
 */
function abschneiden(
  turm: Square | null,
  koenig: Square,
  bauer: Square,
  umwandlungsfeld: Square,
): Abschneiden | null {
  if (turm === null) return null;
  const tl = squareFile(turm);
  const tr = squareRank(turm);
  if (zwischen(tl, squareFile(koenig), squareFile(bauer))) {
    const dazwischen = Math.abs(squareFile(koenig) - squareFile(bauer)) - 1;
    return { turm, koenig, richtung: "linie", dazwischen, von: tl, bis: LETZTE * 8 + tl };
  }
  if (zwischen(tr, squareRank(koenig), squareRank(umwandlungsfeld))) {
    const dazwischen = Math.abs(squareRank(koenig) - squareRank(bauer)) - 1;
    return { turm, koenig, richtung: "reihe", dazwischen, von: tr * 8, bis: tr * 8 + LETZTE };
  }
  return null;
}

/** Schachdistanz: Linien zwischen dem verteidigenden Turm und dem Bauern (Abb. 9.2: vier). */
function schachdistanz(turm: Square | null, bauer: Square): Schachdistanz | null {
  if (turm === null) return null;
  const linien = Math.max(0, Math.abs(squareFile(turm) - squareFile(bauer)) - 1);
  return { linien, reicht: linien >= SCHACHDISTANZ_LINIEN };
}

/** Auf welcher Seite des Bauern steht ein Feld? */
function seiteVon(feld: Square | null, bauer: Square, links: number, rechts: number) {
  if (feld === null || squareFile(feld) === squareFile(bauer)) return null;
  if (links === rechts) return "gleich";
  const linksDavon = squareFile(feld) < squareFile(bauer);
  return (linksDavon ? links : rechts) < (linksDavon ? rechts : links) ? "kurz" : "lang";
}

/** Kurze und lange Seite: „Die Linien neben dem angreifenden Bauern bilden zwei Seiten.“ */
function seiten(bauer: Square, koenig: Square, turm: Square | null): Seiten {
  const links = squareFile(bauer);
  const rechts = LETZTE - squareFile(bauer);
  return {
    links,
    rechts,
    koenigAuf: seiteVon(koenig, bauer, links, rechts),
    turmAuf: seiteVon(turm, bauer, links, rechts),
  };
}

/**
 * Bestimmt die Lage eines Turmendspiels mit Freibauer.
 *
 * Warum: „Wo steht der Freibauer? Steht der verteidigende König vor ihm, oder ist er
 * abgeschnitten? Kann der verteidigende Turm aktiv Schach geben?“ Angreifer ist die Seite mit
 * dem am weitesten vorgerückten Freibauern (bei beiden: die Seite am Zug zuerst).
 * Eingaben: Stellung, bevorzugte Farbe. Ausgabe: die Lage oder null ohne Freibauer, Könige oder
 * Türme (mindestens eine Seite braucht einen Turm).
 * Beispiel: Abb. 9.2: Angreifer Weiß, Bauer f5, König g8 auf der kurzen Seite, Turm a6 auf der
 * langen mit vier Linien Schachdistanz.
 */
export function turmlage(stellung: Stellung, bevorzugt: Color): Turmlage | null {
  if (stellung.brett.rook.isEmpty()) return null;
  for (const angreifer of [bevorzugt, gegner(bevorzugt)]) {
    const bauer = vorderster(stellung, angreifer);
    const koenigAngreifer = stellung.brett.kingOf(angreifer);
    const koenigVerteidiger = stellung.brett.kingOf(gegner(angreifer));
    if (bauer === null || koenigAngreifer === undefined || koenigVerteidiger === undefined)
      continue;
    const turmAngreifer = turmVon(stellung, angreifer);
    const turmVerteidiger = turmVon(stellung, gegner(angreifer));
    const linie = squareFile(bauer);
    const umwandlungsfeld = (angreifer === "white" ? LETZTE * 8 : 0) + linie;
    return {
      angreifer,
      bauer,
      umwandlungsfeld,
      koenigAngreifer,
      koenigVerteidiger,
      turmAngreifer,
      turmVerteidiger,
      // Erst der Turm des Angreifers gegen den verteidigenden König, sonst (Turm gegen Bauer,
      // Abb. 9.18) der verteidigende Turm gegen den König der Bauernseite.
      abschneiden:
        turmAngreifer !== null
          ? abschneiden(turmAngreifer, koenigVerteidiger, bauer, umwandlungsfeld)
          : abschneiden(turmVerteidiger, koenigAngreifer, bauer, umwandlungsfeld),
      schachdistanz: schachdistanz(turmVerteidiger, bauer),
      seiten: seiten(bauer, koenigVerteidiger, turmVerteidiger),
    };
  }
  return null;
}
