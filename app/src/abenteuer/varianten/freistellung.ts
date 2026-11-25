/**
 * Stellung ohne Schachregel für Nebel- und Entenschach: Jede Figur zieht nach ihrer Gangart, ein
 * König darf ins Schach ziehen und geschlagen werden; wer den König schlägt, gewinnt.
 *
 * Warum: Im Nebelschach sieht man den Angreifer oft nicht, also kann es kein Schach geben (Regel
 * wie auf chess.com, „Fog of War“). Im Entenschach (duckchess.com, Fairy-Stockfish `duck`) gilt
 * dasselbe, dazu sperrt die Ente ein Feld. chessops prüft dagegen immer die Königssicherheit und
 * lehnt Stellungen ab, in denen der König des Gegners angegriffen ist; deshalb eine eigene, kleine
 * Zuglogik auf dem Brett von chessops (docs/spiel/10, Abschnitt 3a, L5 und L6).
 * Abhängigkeiten: chessops (Brett, Angriffe, FEN).
 *
 * Regel (Varianten L5 und L6): Rochade nach den gewohnten Bedingungen (König und Turm unbewegt,
 * Felder dazwischen leer), aber auch aus dem Schach und über angegriffene Felder, weil es kein
 * Schach gibt. Schlagen en passant und Umwandlung wie im Schach.
 */
import { attacks, pawnAttacks } from "chessops/attacks";
import { Board } from "chessops/board";
import { makeBoardFen, makeCastlingFen, parseFen } from "chessops/fen";
import { SquareSet } from "chessops/squareSet";
import type { Color, Piece, Role, Square } from "chessops/types";
import { makeSquare, opposite, parseSquare, squareFile, squareRank } from "chessops/util";

/** Ein Zug: von, nach, Umwandlung (Rochade als Königszug zwei Felder, wie in UCI). */
export interface Freizug {
  readonly von: Square;
  readonly nach: Square;
  readonly umwandlung?: Role;
}

/** Die Stellung; `rochaden` sind die Felder der Türme, die noch rochieren dürfen. */
export interface Freistellung {
  readonly brett: Board;
  readonly amZug: Color;
  readonly rochaden: SquareSet;
  readonly enPassant?: Square;
  readonly halbzuege: number;
  readonly zugnummer: number;
}

/** Nach einem Zug: die neue Stellung und, was geschlagen wurde. */
export interface Zugfolge {
  readonly stellung: Freistellung;
  readonly geschlagen?: Piece;
}

const UMWANDLUNGEN: readonly Role[] = ["queen", "rook", "bishop", "knight"];
/** Reihe der Grundlinie (0 für Weiß, 7 für Schwarz) und die letzte Reihe des Bauern. */
const GRUNDREIHE: Record<Color, number> = { white: 0, black: 7 };
const RICHTUNG: Record<Color, number> = { white: 8, black: -8 };
const BRETTBREITE = 8;
const KOENIG_LINIE = 4;
const LETZTE_REIHE = 7;

/**
 * Liest eine FEN ohne Prüfung der Königssicherheit (im Nebel darf der König angegriffen sein).
 * Beispiel: Grundstellung → Weiß am Zug, vier Rochaderechte.
 * Sonderfall: Eine unlesbare FEN wirft.
 */
export function ausFen(fen: string): Freistellung {
  const setup = parseFen(fen).unwrap();
  return {
    brett: setup.board,
    amZug: setup.turn,
    rochaden: setup.castlingRights,
    ...(setup.epSquare === undefined ? {} : { enPassant: setup.epSquare }),
    halbzuege: setup.halfmoves,
    zugnummer: setup.fullmoves,
  };
}

/** Die FEN der Stellung (für die Engine und den Speicher). */
export function alsFen(s: Freistellung): string {
  const ep = s.enPassant === undefined ? "-" : makeSquare(s.enPassant);
  const rochade = makeCastlingFen(s.brett, s.rochaden);
  return `${makeBoardFen(s.brett)} ${s.amZug[0]} ${rochade} ${ep} ${s.halbzuege} ${s.zugnummer}`;
}

/** Ziele einer Figur ohne Bauern und Rochade: angegriffene Felder ohne eigene Figuren und Sperren. */
function figurenziele(s: Freistellung, feld: Square, figur: Piece, sperre: SquareSet): SquareSet {
  const belegt = s.brett.occupied.union(sperre);
  return attacks(figur, feld, belegt).diff(s.brett[figur.color]).diff(sperre);
}

/** Ziele eines Bauern: ein oder zwei Felder vor, schräg nur zum Schlagen (auch en passant). */
function bauernziele(s: Freistellung, feld: Square, farbe: Color, sperre: SquareSet): SquareSet {
  const belegt = s.brett.occupied.union(sperre);
  const gegner = s.brett[opposite(farbe)];
  let ziele = pawnAttacks(farbe, feld).intersect(
    s.enPassant === undefined ? gegner : gegner.with(s.enPassant),
  );
  const eins = feld + RICHTUNG[farbe];
  if (eins >= 0 && eins < BRETTBREITE * BRETTBREITE && !belegt.has(eins)) {
    ziele = ziele.with(eins);
    const zwei = eins + RICHTUNG[farbe];
    const startreihe = GRUNDREIHE[farbe] + (farbe === "white" ? 1 : -1);
    if (squareRank(feld) === startreihe && !belegt.has(zwei)) ziele = ziele.with(zwei);
  }
  return ziele;
}

/** Rochaden des Ziehenden als Königszüge (e1g1, e1c1 …), ohne Prüfung auf Schach. */
function rochadezuege(s: Freistellung, sperre: SquareSet): Freizug[] {
  const farbe = s.amZug;
  const koenig = BRETTBREITE * GRUNDREIHE[farbe] + KOENIG_LINIE;
  const stein = s.brett.get(koenig);
  if (stein?.role !== "king" || stein.color !== farbe) return [];
  const zuege: Freizug[] = [];
  for (const turm of s.rochaden.intersect(SquareSet.backrank(farbe))) {
    const t = s.brett.get(turm);
    if (t?.role !== "rook" || t.color !== farbe) continue;
    const kurz = turm > koenig;
    const zwischen = SquareSet.fromRank(GRUNDREIHE[farbe]).intersect(spanne(koenig, turm));
    if (zwischen.intersects(s.brett.occupied.union(sperre))) continue;
    zuege.push({ von: koenig, nach: koenig + (kurz ? 2 : -2) });
  }
  return zuege;
}

/** Felder strikt zwischen a und b auf derselben Reihe. */
function spanne(a: Square, b: Square): SquareSet {
  let felder = SquareSet.empty();
  for (let f = Math.min(a, b) + 1; f < Math.max(a, b); f++) felder = felder.with(f);
  return felder;
}

/** Ziele einer Figur des Ziehenden (ohne Rochade). */
export function ziele(s: Freistellung, feld: Square, sperre = SquareSet.empty()): SquareSet {
  const figur = s.brett.get(feld);
  if (!figur) return SquareSet.empty();
  return figur.role === "pawn"
    ? bauernziele(s, feld, figur.color, sperre)
    : figurenziele(s, feld, figur, sperre);
}

/**
 * Alle Züge des Ziehenden nach Gangart, ohne Rücksicht auf Schach; `sperre` sind Felder, auf die
 * und über die niemand ziehen darf (die Ente). Umwandlung in jede Figur.
 * Beispiel: Grundstellung → 20 Züge; mit Ente auf e4 nur noch 19 (e2e4 fehlt).
 */
export function freizuege(s: Freistellung, sperre = SquareSet.empty()): Freizug[] {
  const zuege: Freizug[] = [];
  for (const feld of s.brett[s.amZug]) {
    const figur = s.brett.get(feld);
    for (const nach of ziele(s, feld, sperre)) {
      const letzte = squareRank(nach) === (s.amZug === "white" ? LETZTE_REIHE : 0);
      if (figur?.role === "pawn" && letzte) {
        UMWANDLUNGEN.forEach((umwandlung) => zuege.push({ von: feld, nach, umwandlung }));
      } else zuege.push({ von: feld, nach });
    }
  }
  return zuege.concat(rochadezuege(s, sperre));
}

/** Rochaderechte nach einem Zug: Bewegter König verliert beide, bewegter oder geschlagener Turm seins. */
function neueRochaden(s: Freistellung, zug: Freizug, figur: Piece): SquareSet {
  let rechte = s.rochaden.without(zug.von).without(zug.nach);
  if (figur.role === "king") rechte = rechte.diff(SquareSet.backrank(figur.color));
  return rechte;
}

/** Setzt bei der Rochade den Turm mit (Königszug zwei Felder auf der Grundreihe). */
function setzeRochadeturm(brett: Board, zug: Freizug): void {
  const kurz = zug.nach > zug.von;
  const reihe = squareRank(zug.von) * BRETTBREITE;
  const turmVon = reihe + (kurz ? LETZTE_REIHE : 0);
  const turm = brett.take(turmVon);
  if (turm) brett.set(zug.nach + (kurz ? -1 : 1), turm);
}

/**
 * Führt einen Zug aus (ohne Prüfung, ob er erlaubt ist; das macht der Aufrufer mit freizuege).
 * Ausgabe: neue Stellung und geschlagene Figur. Beispiel: e2e4 in der Grundstellung → en passant e3.
 */
export function ziehe(s: Freistellung, zug: Freizug): Zugfolge {
  const brett = s.brett.clone();
  const figur = brett.take(zug.von);
  if (!figur) throw new Error(`Auf ${makeSquare(zug.von)} steht keine Figur.`);
  const bauer = figur.role === "pawn";
  const schlagEp = bauer && zug.nach === s.enPassant && !brett.has(zug.nach);
  const geschlagen = schlagEp ? brett.take(zug.nach - RICHTUNG[figur.color]) : brett.take(zug.nach);
  const rochade = figur.role === "king" && Math.abs(zug.nach - zug.von) === 2;
  if (rochade) setzeRochadeturm(brett, zug);
  brett.set(zug.nach, zug.umwandlung ? { color: figur.color, role: zug.umwandlung } : figur);
  const doppel = bauer && Math.abs(zug.nach - zug.von) === 2 * BRETTBREITE;
  const stellung: Freistellung = {
    brett,
    amZug: opposite(s.amZug),
    rochaden: neueRochaden(s, zug, figur),
    ...(doppel ? { enPassant: zug.von + RICHTUNG[figur.color] } : {}),
    halbzuege: bauer || geschlagen ? 0 : s.halbzuege + 1,
    zugnummer: s.zugnummer + (s.amZug === "black" ? 1 : 0),
  };
  return geschlagen ? { stellung, geschlagen } : { stellung };
}

/** Hat diese Farbe noch einen König? (Fehlt er, hat der Gegner gewonnen.) */
export function hatKoenig(s: Freistellung, farbe: Color): boolean {
  return s.brett.pieces(farbe, "king").nonEmpty();
}

/** Zug als UCI (e2e4, e7e8q). */
export function alsUci(zug: Freizug): string {
  const umw = zug.umwandlung ? (zug.umwandlung === "knight" ? "n" : zug.umwandlung[0]) : "";
  return `${makeSquare(zug.von)}${makeSquare(zug.nach)}${umw}`;
}

/** UCI als Zug; null bei unlesbarem Text. */
export function ausUci(text: string): Freizug | null {
  const von = parseSquare(text.slice(0, 2));
  const nach = parseSquare(text.slice(2, 4));
  if (von === undefined || nach === undefined) return null;
  const zeichen: Record<string, Role> = { q: "queen", r: "rook", b: "bishop", n: "knight" };
  const umwandlung = zeichen[text[4] ?? ""];
  return umwandlung ? { von, nach, umwandlung } : { von, nach };
}

/** Gleiche Züge? */
export function gleich(a: Freizug, b: Freizug): boolean {
  return a.von === b.von && a.nach === b.nach && a.umwandlung === b.umwandlung;
}

/** Linie (0 bis 7) eines Feldes, für die Darstellung. */
export const linie = squareFile;
