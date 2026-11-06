/**
 * Mattsuche: Erzwingt ein Zug Matt in höchstens n eigenen Zügen? Beweis durch vollständiges
 * Durchrechnen aller Antworten des Gegners, eigene Folgezüge nur Schachs.
 *
 * Rolle im Gesamtbild: Baustein für den Taktiktrainer (training/taktiktrainer.ts). Frage des
 * Autors (6.11.2026): „Alle zulässigen Lösungen akzeptieren.“ Bei Mattaufgaben ist ein anderer
 * Zug genauso gut, wenn er ebenso schnell mattsetzt (Abb. 7.60: nach 1. Th8+ Kxh8 setzt 2. Dh1+
 * genauso in zwei Zügen matt wie 2. Dh5+). Die Suche beweist das ohne Engine: Jede Antwort des
 * Gegners wird geprüft; nur bei den eigenen Folgezügen beschränkt sie sich auf Schachs. Das kann
 * ein Matt übersehen (dann bleibt der Zug falsch wie bisher), meldet aber nie eines, das es nicht
 * gibt. Reine Funktionen.
 * Abhängigkeiten: chessops.
 * Buchbezug: Kapitel 7, „Erzwingende Züge zuerst: Schachs, Schläge, Drohungen“; Kapitel 0, Matt.
 */
import type { Chess } from "chessops/chess";
import { makeSan } from "chessops/san";
import type { NormalMove, Role } from "chessops/types";
import { squareRank } from "chessops/util";

/** Höchstens so viele eigene Züge rechnet die Suche (Rechenzeit auf dem Handy). */
export const MATTSUCHE_HOECHSTENS = 3;
/** Reihen 1 und 8 als Zahl (chessops zählt ab 0). */
const ERSTE_REIHE = 0;
const LETZTE_REIHE = 7;
const UMWANDLUNGEN: readonly Role[] = ["queen", "knight", "rook", "bishop"];

/** Alle legalen Züge der Seite am Zug. */
function alleZuege(pos: Chess): NormalMove[] {
  const zuege: NormalMove[] = [];
  for (const [von, ziele] of pos.allDests())
    for (const nach of ziele) zuege.push({ from: von, to: nach });
  return zuege.flatMap((z) => mitUmwandlung(pos, z));
}

/**
 * Ein Bauernzug auf die letzte Reihe als Umwandlung in jede Figur. Alle vier, weil der Beweis
 * jede Antwort des Gegners braucht, auch eine Unterverwandlung (Kapitel 7, Motiv 11).
 */
function mitUmwandlung(pos: Chess, zug: NormalMove): NormalMove[] {
  const figur = pos.board.get(zug.from);
  const reihe = squareRank(zug.to);
  if (figur?.role !== "pawn" || (reihe !== ERSTE_REIHE && reihe !== LETZTE_REIHE)) return [zug];
  return UMWANDLUNGEN.map((rolle) => ({ ...zug, promotion: rolle }));
}

/** Die Stellung nach dem Zug (Kopie). */
function nach(pos: Chess, zug: NormalMove): Chess {
  const kopie = pos.clone();
  kopie.play(zug);
  return kopie;
}

/**
 * Die kürzeste Mattzahl der Seite am Zug in höchstens `tiefe` eigenen Zügen, nur mit Schachs;
 * null, wenn keine gefunden.
 */
function mattIn(pos: Chess, tiefe: number): number | null {
  if (tiefe <= 0) return null;
  let beste: number | null = null;
  for (const zug of alleZuege(pos)) {
    const danach = nach(pos, zug);
    if (!danach.isCheck()) continue;
    if (danach.isCheckmate()) return 1;
    if (tiefe === 1 || (beste !== null && beste <= 2)) continue;
    const abwehr = laengsteAbwehr(danach, tiefe - 1);
    if (abwehr !== null && (beste === null || abwehr.matt + 1 < beste)) beste = abwehr.matt + 1;
  }
  return beste;
}

/** Die zäheste Verteidigung: die Antwort mit dem spätesten Matt und die Zahl eigener Züge danach. */
interface Abwehr {
  readonly zug: NormalMove;
  readonly matt: number;
}

/**
 * Die Antwort des Gegners (am Zug), die das Matt am längsten hinauszögert, und die Mattzahl danach;
 * null, wenn eine Antwort dem Matt in `tiefe` Zügen entkommt oder der Gegner keinen Zug hat (Patt).
 */
function laengsteAbwehr(pos: Chess, tiefe: number): Abwehr | null {
  const zuege = alleZuege(pos);
  if (zuege.length === 0) return null;
  let laengste: Abwehr | null = null;
  for (const zug of zuege) {
    const matt = mattIn(nach(pos, zug), tiefe);
    if (matt === null) return null;
    if (laengste === null || matt > laengste.matt) laengste = { zug, matt };
  }
  return laengste;
}

/** Ergebnis der Mattprüfung eines Zuges. */
export type Mattbeweis =
  | { readonly art: "matt" }
  | { readonly art: "erzwungen"; readonly antwort: string; readonly zuege: number }
  | { readonly art: "keins" };

/**
 * Prüft, ob ein Zug in höchstens `zuege` eigenen Zügen (ihn eingerechnet) mattsetzt.
 *
 * Eingaben: Stellung vor dem Zug (Kopie wird nicht verändert), Zug, Höchstzahl eigener Züge
 * (gedeckelt auf MATTSUCHE_HOECHSTENS).
 * Ausgabe: „matt“, wenn der Zug selbst mattsetzt; „erzwungen“ mit der zähesten Antwort des
 * Gegners (SAN) und der Zahl eigener Züge bis Matt; sonst „keins“.
 * Beispiel: Abb. 7.60 nach 1. Th8+ Kxh8, Zug Dh1+, zwei Züge → erzwungen, Antwort „Kg8“, 2.
 * Sonderfall: Patt oder eine Antwort, nach der kein Schachmatt in der Frist folgt → keins.
 */
export function erzwingtMatt(pos: Chess, zug: NormalMove, zuege: number): Mattbeweis {
  if (!pos.isLegal(zug)) return { art: "keins" };
  const danach = nach(pos, zug);
  if (danach.isCheckmate()) return { art: "matt" };
  const tiefe = Math.min(zuege, MATTSUCHE_HOECHSTENS) - 1;
  if (tiefe <= 0) return { art: "keins" };
  const abwehr = laengsteAbwehr(danach, tiefe);
  return abwehr
    ? { art: "erzwungen", antwort: makeSan(danach, abwehr.zug), zuege: abwehr.matt + 1 }
    : { art: "keins" };
}
