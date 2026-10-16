/**
 * Opposition der Könige: direkt, fern oder diagonal, und welche Züge sie nehmen.
 *
 * Rolle im Gesamtbild: Baustein für k8-opposition und k8-regeln (Regel 2). Pflichtenheft 6.3,
 * Kapitel 8: „Opposition: Grau: Oppositionslinie, Gold: Feld“.
 * Abhängigkeiten: chessops, stellung.ts.
 * Buchbezug: Kapitel 8, Regel 2 („Die Könige stehen sich auf einer Linie, Reihe oder Diagonale
 * mit genau einem Feld Abstand gegenüber … Die Opposition hat also der Spieler, der nicht am Zug
 * ist“) und „Fern- und Diagonalopposition“ (drei oder fünf Felder dazwischen; diagonal ein oder
 * drei Felder).
 */
import { makeSan } from "chessops/san";
import type { Color, NormalMove, Square } from "chessops/types";
import { squareFile, squareRank } from "chessops/util";
import { gegner, type Stellung } from "./stellung";

/** Art der Opposition, wie das Buch sie nennt. */
export type Oppositionsart = "direkt" | "fern" | "diagonal";

/** Eine Oppositionslage der beiden Könige. */
export interface Opposition {
  readonly art: Oppositionsart;
  /** Die Felder zwischen den Königen (die Oppositionslinie). */
  readonly zwischen: readonly Square[];
  /** Auf welcher Linie, Reihe oder Diagonale. */
  readonly richtung: "linie" | "reihe" | "diagonale";
}

/** Ein Königszug, der die Opposition nimmt. */
export interface Oppositionszug {
  readonly zug: NormalMove;
  readonly san: string;
  readonly lage: Opposition;
}

/** Felder dazwischen auf Linie und Reihe: eins (direkt), drei oder fünf (fern). */
const GERADE_ABSTAENDE: readonly number[] = [1, 3, 5];
/** Felder dazwischen auf der Diagonale: eins oder drei. */
const DIAGONALE_ABSTAENDE: readonly number[] = [1, 3];

/** Die Felder zwischen zwei Feldern auf einer gemeinsamen Linie, Reihe oder Diagonale. */
function felderZwischen(a: Square, b: Square): Square[] {
  const dl = Math.sign(squareFile(b) - squareFile(a));
  const dr = Math.sign(squareRank(b) - squareRank(a));
  const felder: Square[] = [];
  let linie = squareFile(a) + dl;
  let reihe = squareRank(a) + dr;
  while (linie !== squareFile(b) || reihe !== squareRank(b)) {
    felder.push(reihe * 8 + linie);
    linie += dl;
    reihe += dr;
  }
  return felder;
}

/**
 * Stehen zwei Könige in Opposition?
 *
 * Eingaben: die Felder der beiden Könige. Ausgabe: die Lage oder null.
 * Beispiel: Abb. 8.19, Könige e4 und e6 → direkt, dazwischen e5. Abb. 8.23 nach 1. Kf3: f3 und
 * f7 → fern (drei Felder). Abb. 8.24 nach 1. Kd3: d3 und f5 → diagonal (e4 dazwischen).
 */
export function oppositionslage(a: Square, b: Square): Opposition | null {
  const dl = Math.abs(squareFile(a) - squareFile(b));
  const dr = Math.abs(squareRank(a) - squareRank(b));
  if (dl === 0 && GERADE_ABSTAENDE.includes(dr - 1)) {
    return { art: dr === 2 ? "direkt" : "fern", zwischen: felderZwischen(a, b), richtung: "linie" };
  }
  if (dr === 0 && GERADE_ABSTAENDE.includes(dl - 1)) {
    return { art: dl === 2 ? "direkt" : "fern", zwischen: felderZwischen(a, b), richtung: "reihe" };
  }
  if (dl === dr && DIAGONALE_ABSTAENDE.includes(dl - 1)) {
    return { art: "diagonal", zwischen: felderZwischen(a, b), richtung: "diagonale" };
  }
  return null;
}

/** Die Lage der Könige einer Stellung; null, wenn ein König fehlt oder keine Opposition besteht. */
export function oppositionDerStellung(stellung: Stellung): Opposition | null {
  const weiss = stellung.brett.kingOf("white");
  const schwarz = stellung.brett.kingOf("black");
  if (weiss === undefined || schwarz === undefined) return null;
  return oppositionslage(weiss, schwarz);
}

/**
 * Wer hat die Opposition? Die Seite, die nicht am Zug ist (Regel 2).
 *
 * Beispiel: Abb. 8.19, Weiß am Zug → Schwarz hat sie und hält remis.
 */
export function hatOpposition(stellung: Stellung): Color | null {
  return oppositionDerStellung(stellung) ? gegner(stellung.amZug) : null;
}

/**
 * Königszüge der Seite am Zug, nach denen die Könige in Opposition stehen.
 *
 * Warum: „In Abb. 8.23 und 8.24 gewinnt jeweils nur der Zug, der die Opposition nimmt.“ Nach dem
 * Zug ist der Gegner am Zug, also hat der Ziehende die Opposition.
 * Eingabe: Stellung mit Regeln. Ausgabe: Züge mit SAN und der erreichten Lage, leer ohne Regeln.
 * Beispiel: Abb. 8.23 → Kf3 (fern). Abb. 8.20 → Ke5 (direkt).
 */
export function oppositionszuege(stellung: Stellung): Oppositionszug[] {
  const { regeln, brett } = stellung;
  const eigener = brett.kingOf(stellung.amZug);
  const fremder = brett.kingOf(gegner(stellung.amZug));
  if (!regeln || eigener === undefined || fremder === undefined || regeln.isCheck()) return [];
  const zuege: Oppositionszug[] = [];
  for (const ziel of regeln.dests(eigener)) {
    const lage = oppositionslage(ziel, fremder);
    if (!lage) continue;
    const zug: NormalMove = { from: eigener, to: ziel };
    zuege.push({ zug, san: makeSan(regeln, zug), lage });
  }
  return zuege;
}
