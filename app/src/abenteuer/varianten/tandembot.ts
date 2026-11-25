/**
 * Bots im Tandem: der Gegner des Helden auf Brett A, Sam und sein Gegner auf Brett B. Zug von
 * Fairy-Stockfish (`crazyhouse`, eine Stellung mit Taschen), zufällig unter den guten; ohne Engine
 * ein einfacher Plan.
 *
 * Warum: Fairy-Stockfish kennt Crazyhouse und Bughouse (src/variant.cpp). Für einen Zug reicht die
 * Crazyhouse-Stellung des eigenen Bretts; die Übergabe an den Partner führt tandem.ts. Der Notplan
 * hält die Partie am Laufen, wenn das Zusatzpaket fehlt: matt setzen, sonst den wertvollsten Stein
 * schlagen, sonst einsetzen oder ziehen.
 * Abhängigkeiten: tandem.ts, botwahl.ts, chessops.
 */
import type { Move, Role } from "chessops/types";
import { makeUci } from "chessops/util";
import type { Crazyhouse } from "chessops/variant";
import { waehle, type Bewerteterzug, type Botstil, type Zugbewerter } from "./botwahl";
import { normalisiert, tandemFen, tandemzugAus, type Brettname, type Tandempartie } from "./tandem";

const WERT: Record<Role, number> = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 0 };
const EINSETZBAR: readonly Role[] = ["queen", "rook", "bishop", "knight", "pawn"];

/** Alle erlaubten Züge einer Crazyhouse-Stellung: Figurenzüge und Einsetzen aus der Tasche. */
export function alleZuege(pos: Crazyhouse): Move[] {
  const zuege: Move[] = [];
  for (const [from, ziele] of pos.allDests()) {
    for (const to of ziele) {
      const zug: Move = { from, to };
      const umwandlung: Move = { from, to, promotion: "queen" };
      zuege.push(pos.isLegal(zug) ? zug : umwandlung);
    }
  }
  const tasche = pos.pockets?.[pos.turn];
  for (const role of EINSETZBAR) {
    if (!tasche || tasche[role] <= 0) continue;
    for (const to of pos.dropDests()) {
      const einsatz: Move = { role, to };
      if (pos.isLegal(einsatz)) zuege.push(einsatz);
    }
  }
  return zuege.filter((z) => pos.isLegal(z));
}

/** Wert eines Zuges für den Notplan: Matt vor allem, dann der Wert des Geschlagenen. */
function notwert(pos: Crazyhouse, zug: Move): number {
  const nach = pos.clone();
  nach.play(zug);
  if (nach.isCheckmate()) return Number.MAX_SAFE_INTEGER;
  const ziel = "from" in zug ? pos.board.get(zug.to) : undefined;
  return ziel ? WERT[ziel.role] : 0;
}

/** Notplan ohne Engine: Matt, sonst bester Schlag, sonst zufällig. */
export function tandemNotzug(pos: Crazyhouse, stil: Botstil): Move {
  const zuege = alleZuege(pos);
  if (zuege.length === 0) throw new Error("Der Tandembot hat keinen Zug.");
  const werte = zuege.map((z) => notwert(pos, z));
  const bester = Math.max(...werte);
  const auswahl = bester > 0 ? zuege.filter((_, i) => werte[i] === bester) : zuege;
  return auswahl[Math.floor(stil.zufall() * auswahl.length)] as Move;
}

/**
 * Zug eines Bots auf `brett` (das am Zug ist): Engine mit Wahl unter den guten Zügen, nur Züge,
 * die nach chessops erlaubt sind; sonst der Notplan.
 * Beispiel: Sam (Schwarz, B) hat einen Springer in der Tasche und setzt ihn mit Gabel ein.
 */
export async function tandembotZug(
  p: Tandempartie,
  brett: Brettname,
  bewerter: Zugbewerter,
  stil: Botstil,
): Promise<Move> {
  const pos = p[brett];
  const liste = await bewerter(tandemFen(p, brett), stil.varianten).catch((fehler: unknown) => {
    console.warn("Tandembot: Engine ohne Antwort, Notplan.", fehler);
    return [];
  });
  const gute = liste.filter((b) => {
    const zug = tandemzugAus(b.zug);
    return zug !== null && pos.isLegal(normalisiert(pos, zug));
  });
  if (gute.length === 0) return tandemNotzug(pos, stil);
  return tandemzugAus((gute[waehle(gute, stil)] as Bewerteterzug).zug) ?? tandemNotzug(pos, stil);
}

/** Zug als UCI für Anzeige und Speicher. */
export const tandemUci = (zug: Move): string => makeUci(zug);
