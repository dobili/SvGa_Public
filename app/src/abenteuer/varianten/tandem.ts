/**
 * Tandem (Bughouse) am Lagerfeuer im Pinewood Camp: zwei gegen zwei auf zwei Brettern. Der Held
 * spielt auf Brett A, sein Partner (Sam, ein Bot) auf Brett B mit der anderen Farbe. Was einer
 * schlägt, bekommt sein Partner in die Tasche und darf es auf seinem Brett einsetzen.
 *
 * Warum: Auftrag des Hauptchats (26.11.2026, Varianten Teil 3); docs/spiel/10, Abschnitt 3a
 * (Gruppenszenen). Grundlage ist das Crazyhouse von chessops je Brett (Einsetzen, Schach, Matt mit
 * Einsetzen); die Übergabe an den Partner führt diese Datei.
 * Abhängigkeiten: chessops (Crazyhouse, FEN, UCI).
 *
 * Regel (Tandem, vereinfachte Fassung für das Spiel ohne Uhr): Beide Bretter ziehen im Takt. Nach
 * jedem Zug des Helden und seines Gegners auf Brett A macht Brett B einen Zug (abwechselnd Sam und
 * sein Gegner). Ein Matt auf einem Brett entscheidet für beide Teams; Patt ist remis. Eine
 * umgewandelte Figur geht beim Schlagen als Bauer weiter (wie im Crazyhouse). Echte Tandempartien
 * laufen mit Uhr und ohne Takt; ohne Uhr braucht das Spiel aber einen festen Ablauf, sonst
 * bestimmte die Rechenzeit der Bots, wer wann ziehen darf.
 */
import { normalizeMove } from "chessops/chess";
import { makeFen, parseFen } from "chessops/fen";
import type { Color, Move, Role } from "chessops/types";
import { makeUci, opposite, parseUci } from "chessops/util";
import { Crazyhouse } from "chessops/variant";

/** Die beiden Bretter: A mit dem Helden, B mit seinem Partner. */
export type Brettname = "a" | "b";

/** Wie die Tandempartie endete: das siegreiche Team und wo. */
export interface Tandemende {
  /** „held“: der Held und sein Partner; „gegner“: die beiden anderen; null: remis. */
  readonly sieger: "held" | "gegner" | null;
  readonly brett: Brettname;
  readonly grund: "matt" | "patt";
}

/** Die Partie: zwei Stellungen, die Farbe des Helden auf A, die Züge je Brett. */
export interface Tandempartie {
  readonly a: Crazyhouse;
  readonly b: Crazyhouse;
  readonly heldFarbe: Color;
  readonly zuegeA: readonly string[];
  readonly zuegeB: readonly string[];
  readonly ende: Tandemende | null;
}

const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR[] w KQkq - 0 1";

/** Eine Crazyhouse-Stellung aus FEN (mit Taschen in eckigen Klammern). */
export function crazyhouseAus(fen: string): Crazyhouse {
  return Crazyhouse.fromSetup(parseFen(fen).unwrap()).unwrap();
}

/** Neue Partie: Der Held hat auf A `heldFarbe`, sein Partner auf B die andere Farbe. */
export function neueTandempartie(heldFarbe: Color, fenA = START, fenB = START): Tandempartie {
  return {
    a: crazyhouseAus(fenA),
    b: crazyhouseAus(fenB),
    heldFarbe,
    zuegeA: [],
    zuegeB: [],
    ende: null,
  };
}

/** Die Farbe des Teams des Helden auf einem Brett (auf B spielt der Partner die andere Farbe). */
export function heldenfarbe(p: Tandempartie, brett: Brettname): Color {
  return brett === "a" ? p.heldFarbe : opposite(p.heldFarbe);
}

/** FEN eines Bretts mit Taschen, für die Engine (Fairy-Stockfish `crazyhouse`). */
export function tandemFen(p: Tandempartie, brett: Brettname): string {
  return makeFen(p[brett].toSetup());
}

/** Wer auf welchem Brett als Nächstes zieht (Takt, siehe Dateikopf): erst A zweimal, dann B einmal. */
export function amZug(p: Tandempartie): Brettname {
  const halbzuegeA = p.zuegeA.length;
  const halbzuegeB = p.zuegeB.length;
  return halbzuegeB < Math.floor(halbzuegeA / 2) ? "b" : "a";
}

/** Ist der Held selbst am Zug (Brett A, seine Farbe)? */
export function heldAmZug(p: Tandempartie): boolean {
  return !p.ende && amZug(p) === "a" && p.a.turn === p.heldFarbe;
}

/**
 * Der Zug in der Schreibweise von chessops: Rochade als König auf das Turmfeld (e1g1 → e1h1), wie
 * sie Spieler und Engine schreiben. Andere Züge bleiben.
 */
export function normalisiert(pos: Crazyhouse, zug: Move): Move {
  return normalizeMove(pos, zug);
}

/** Erlaubter Zug auf dem Brett, das am Zug ist? Einsetzen eingeschlossen, Rochade auch als e1g1. */
export function erlaubt(p: Tandempartie, brett: Brettname, zug: Move): boolean {
  return !p.ende && amZug(p) === brett && p[brett].isLegal(normalisiert(p[brett], zug));
}

/**
 * Was der Zug schlägt, als Figurenart für die Tasche (umgewandelte Figur → Bauer, en passant → Bauer).
 * null ohne Schlag.
 */
function geschlageneArt(pos: Crazyhouse, zug: Move): Role | null {
  if (!("from" in zug)) return null;
  const ziel = pos.board.get(zug.to);
  // Rochade schreibt chessops als König auf das Turmfeld (e1h1): kein Schlag.
  if (ziel?.color === pos.turn) return null;
  if (ziel) return pos.board.promoted.has(zug.to) ? "pawn" : ziel.role;
  const bauer = pos.board.get(zug.from)?.role === "pawn";
  return bauer && zug.to === pos.epSquare ? "pawn" : null;
}

/** Ende nach einem Zug auf `brett`: Matt entscheidet für beide Teams, Patt ist remis. */
function endeNach(p: Tandempartie, brett: Brettname): Tandemende | null {
  const pos = p[brett];
  if (pos.isCheckmate()) {
    const gewinner = opposite(pos.turn);
    return { sieger: gewinner === heldenfarbe(p, brett) ? "held" : "gegner", brett, grund: "matt" };
  }
  return pos.isStalemate() ? { sieger: null, brett, grund: "patt" } : null;
}

/**
 * Spielt einen Zug auf `brett` und gibt die geschlagene Figur an den Partner weiter: Sie kommt aus
 * der Tasche des Schlagenden (Crazyhouse legt sie dort ab) in die Tasche des Partners, in dessen
 * Farbe. Wirft bei einem nicht erlaubten Zug.
 * Beispiel: Held (Weiß, A) schlägt einen schwarzen Springer → Sam (Schwarz, B) hat einen Springer.
 */
export function spieleTandemzug(p: Tandempartie, brett: Brettname, eingabe: Move): Tandempartie {
  const zug = normalisiert(p[brett], eingabe);
  if (!erlaubt(p, brett, zug))
    throw new Error(`Zug ${makeUci(zug)} ist auf Brett ${brett} nicht erlaubt.`);
  const hier = p[brett].clone();
  const dort = p[brett === "a" ? "b" : "a"].clone();
  const schlaeger = hier.turn;
  const art = geschlageneArt(hier, zug);
  hier.play(zug);
  if (art && hier.pockets && dort.pockets) {
    hier.pockets[schlaeger][art] -= 1;
    dort.pockets[opposite(schlaeger)][art] += 1;
  }
  const liste = brett === "a" ? "zuegeA" : "zuegeB";
  const neu: Tandempartie = {
    ...p,
    a: brett === "a" ? hier : dort,
    b: brett === "a" ? dort : hier,
    [liste]: [...p[liste], makeUci(zug)],
  };
  return { ...neu, ende: endeNach(neu, brett) };
}

/** Zug aus UCI („e2e4“, „N@f3“); null bei unlesbarem Text. */
export function tandemzugAus(text: string): Move | null {
  return parseUci(text) ?? null;
}
