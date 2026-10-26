/**
 * Mattbilder aus Kapitel 7: Erstickungsmatt, Grundreihenmatt, Anastasia-Matt, Arabisches Matt,
 * Treppenmatt, Boden-Matt, Damiano-Matt, Lolli-Matt, Dame auf h7 (Läufer) und g7 (Springer).
 *
 * Rolle im Gesamtbild: Baustein für k7-motiv („Motiv benennen“: Lösung einem Mattbild zuordnen).
 * Abhängigkeiten: chessops, angreifer.ts (wer deckt das Mattfeld).
 * Buchbezug: Kapitel 7, „Typische Mattbilder“ (Abb. 7.35 bis 7.43, 7.8, 7.17).
 */
import { attacks, kingAttacks, knightAttacks } from "chessops/attacks";
import type { Chess } from "chessops/chess";
import { SquareSet } from "chessops/squareSet";
import type { Color, Role, Square } from "chessops/types";
import { squareFile, squareRank } from "chessops/util";
import { eigeneReihe } from "./bauernprofil";

export type Mattbild =
  | "erstickung"
  | "grundreihe"
  | "anastasia"
  | "arabisch"
  | "treppe"
  | "boden"
  | "damiano"
  | "lolli"
  | "h7"
  | "g7"
  | "matt";

const RANDLINIEN: readonly number[] = [0, 7];
const SCHWERFIGUREN: readonly Role[] = ["rook", "queen"];

/** Die Figuren einer Farbe, die ein Feld angreifen (ohne Batterien). */
function deckerVon(pos: Chess, feld: Square, farbe: Color): Role[] {
  const rollen: Role[] = [];
  for (const von of pos.board[farbe]) {
    const figur = pos.board.get(von);
    if (figur && von !== feld && attacks(figur, von, pos.board.occupied).has(feld))
      rollen.push(figur.role);
  }
  return rollen;
}

/** Erstickungsmatt: ein Springer gibt Schach, alle Nachbarfelder tragen eigene Figuren des Mattgesetzten. */
function istErstickung(pos: Chess, koenig: Square, schachgeber: Role): boolean {
  return schachgeber === "knight" && kingAttacks(koenig).diff(pos.board[pos.turn]).isEmpty();
}

/** Felder, die eine Farbe angreift (ohne Batterien). */
function angegriffenVon(pos: Chess, farbe: Color): SquareSet {
  let felder = SquareSet.empty();
  for (const von of pos.board[farbe]) {
    const figur = pos.board.get(von);
    if (figur) felder = felder.union(attacks(figur, von, pos.board.occupied));
  }
  return felder;
}

/** Grundreihenmatt: Schwerfigur auf der Grundreihe des Königs, davor eigene Figuren oder beherrschte Felder. */
function istGrundreihe(
  pos: Chess,
  koenig: Square,
  schach: Square,
  schachgeber: Role,
  angreifer: Color,
): boolean {
  if (!SCHWERFIGUREN.includes(schachgeber) || squareRank(schach) !== squareRank(koenig))
    return false;
  if (eigeneReihe(koenig, pos.turn) !== 0) return false;
  const vorn = kingAttacks(koenig).intersect(
    SquareSet.fromRank(squareRank(koenig) + (pos.turn === "white" ? 1 : -1)),
  );
  const frei = vorn.diff(pos.board[pos.turn]);
  return frei.diff(angegriffenVon(pos, angreifer)).isEmpty() && frei.size() < vorn.size();
}

/** Anastasia-Matt: Schwerfigur auf der Randlinie des Königs, ein Springer sperrt die Nachbarlinie. */
function istAnastasia(
  pos: Chess,
  koenig: Square,
  schach: Square,
  schachgeber: Role,
  angreifer: Color,
): boolean {
  if (!SCHWERFIGUREN.includes(schachgeber) || squareFile(schach) !== squareFile(koenig))
    return false;
  if (!RANDLINIEN.includes(squareFile(koenig))) return false;
  const nachbarlinie = squareFile(koenig) === 0 ? 1 : 6;
  const gesperrt = kingAttacks(koenig)
    .intersect(SquareSet.fromFile(nachbarlinie))
    .diff(pos.board[pos.turn]);
  return [...pos.board.knight.intersect(pos.board[angreifer])].some((s) =>
    gesperrt.diff(knightAttacks(s)).isEmpty(),
  );
}

/** Arabisches Matt: Turm neben dem König, ein Springer deckt ihn und das letzte Fluchtfeld. */
function istArabisch(
  pos: Chess,
  koenig: Square,
  schach: Square,
  schachgeber: Role,
  angreifer: Color,
): boolean {
  if (schachgeber !== "rook" || !kingAttacks(koenig).has(schach)) return false;
  // Arabisch nur in der Ecke (Abb. 7.39); sonst ist es ein Grundreihenmatt mit Springerdeckung (Abb. 7.13).
  if (!RANDLINIEN.includes(squareFile(koenig)) || !RANDLINIEN.includes(squareRank(koenig)))
    return false;
  return [...pos.board.knight.intersect(pos.board[angreifer])].some(
    (s) =>
      knightAttacks(s).has(schach) && knightAttacks(s).intersect(kingAttacks(koenig)).nonEmpty(),
  );
}

/** Treppenmatt: Schwerfigur auf der Reihe des Königs am Rand, eine zweite sperrt die Reihe davor. */
function istTreppe(
  pos: Chess,
  koenig: Square,
  schach: Square,
  schachgeber: Role,
  angreifer: Color,
): boolean {
  if (!SCHWERFIGUREN.includes(schachgeber) || squareRank(schach) !== squareRank(koenig))
    return false;
  if (!RANDLINIEN.includes(squareRank(koenig))) return false;
  const davor = squareRank(koenig) === 0 ? 1 : 6;
  const schwere = pos.board.rook
    .union(pos.board.queen)
    .intersect(pos.board[angreifer])
    .without(schach);
  return [...schwere].some((s) => squareRank(s) === davor);
}

/**
 * Boden-Matt: ein Läufer gibt Schach, ein zweiter beherrscht ein Nachbarfeld des Königs, und die
 * beiden Läufer geben das Matt allein: Jedes Nachbarfeld, das nicht eine eigene Figur des Königs
 * versperrt, beherrscht einer der Läufer (durch den König hindurch gerechnet, denn er kann auf der
 * Schachlinie nicht zurückweichen).
 *
 * Regel: Kapitel 7, Typische Mattbilder (Abb. 7.41: zwei Läufer kreuzen sich, der König hält sich
 * mit eigenen Figuren selbst gefangen). Entscheidung des Autors zu C1.17: Deckt eine
 * andere Figur ein Fluchtfeld mit, ist es kein Boden-Matt (Abb. 7.21 nach 8... Lg4#: Der Springer
 * e4 deckt d2 und f2, also nur „Matt“).
 */
function istBoden(
  pos: Chess,
  koenig: Square,
  schach: Square,
  schachgeber: Role,
  angreifer: Color,
): boolean {
  if (schachgeber !== "bishop") return false;
  const laeufer = pos.board.bishop.intersect(pos.board[angreifer]);
  const figur = { role: "bishop", color: angreifer } as const;
  const kreuzt = [...laeufer.without(schach)].some((s) =>
    attacks(figur, s, pos.board.occupied).intersect(kingAttacks(koenig)).nonEmpty(),
  );
  if (!kreuzt) return false;
  const ohneKoenig = pos.board.occupied.without(koenig);
  let beherrscht = SquareSet.empty();
  for (const s of laeufer) beherrscht = beherrscht.union(attacks(figur, s, ohneKoenig));
  return kingAttacks(koenig).diff(pos.board[pos.turn]).diff(beherrscht).isEmpty();
}

/** Dame neben dem König: Damiano (Bauer deckt, Randlinie), Lolli (Bauer deckt, vor dem König), h7 (Läufer), g7 (Springer). */
function damenmatt(pos: Chess, koenig: Square, schach: Square, angreifer: Color): Mattbild | null {
  if (!kingAttacks(koenig).has(schach)) return null;
  const decker = deckerVon(pos, schach, angreifer);
  const vorDemKoenig = squareFile(schach) === squareFile(koenig);
  if (decker.includes("pawn")) {
    if (RANDLINIEN.includes(squareFile(schach))) return "damiano";
    if (vorDemKoenig) return "lolli";
  }
  if (decker.includes("bishop") && RANDLINIEN.includes(squareFile(schach))) return "h7";
  if (decker.includes("knight")) return "g7";
  return null;
}

/**
 * Ordnet eine Mattstellung einem Mattbild aus Kapitel 7 zu.
 *
 * Eingaben: die Mattstellung (die mattgesetzte Seite ist am Zug). Ausgabe: das Mattbild, „matt“
 * ohne bekanntes Bild, null, wenn es kein Matt ist.
 * Beispiele: Abb. 7.35 Erstickungsmatt, 7.36 Grundreihenmatt, 7.38 Anastasia, 7.39 Arabisch,
 * 7.40 Treppe, 7.41 Boden, 7.42 Damiano, 7.43 Lolli, 7.13 (Te8#, Springer deckt) Grundreihe.
 */
export function mattbild(pos: Chess): Mattbild | null {
  if (!pos.isCheckmate()) return null;
  const koenig = pos.board.kingOf(pos.turn);
  const schach = pos.ctx().checkers.first();
  const geber = schach === undefined ? undefined : pos.board.get(schach);
  if (koenig === undefined || schach === undefined || !geber) return "matt";
  const angreifer = geber.color;
  const rolle = geber.role;
  if (istErstickung(pos, koenig, rolle)) return "erstickung";
  if (istAnastasia(pos, koenig, schach, rolle, angreifer)) return "anastasia";
  if (istArabisch(pos, koenig, schach, rolle, angreifer)) return "arabisch";
  if (istBoden(pos, koenig, schach, rolle, angreifer)) return "boden";
  if (rolle === "queen") {
    const dame = damenmatt(pos, koenig, schach, angreifer);
    if (dame) return dame;
  }
  if (istTreppe(pos, koenig, schach, rolle, angreifer)) return "treppe";
  if (istGrundreihe(pos, koenig, schach, rolle, angreifer)) return "grundreihe";
  return "matt";
}
