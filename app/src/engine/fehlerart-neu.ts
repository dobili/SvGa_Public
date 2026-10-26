/**
 * Weitere Fehlerarten, gefunden in der Auswertung von etwa 2600 Lichess-Partien (Plan
 * „Bots, zweite Runde“, Teil A): Ein Drittel der Fehler ab einem halben Bauern passte in keine
 * der älteren Arten. Die häufigsten Merkmale dieser Fehler: Die Widerlegung schlägt einen Bauern
 * oder eine Figur mit Gewinn, der beste Zug wäre ein Schlag gewesen, oder der Fehler ist ein
 * ruhiger Bauern- oder Königszug.
 *
 * Rolle im Gesamtbild: Teil von fehlerbefundIn (engine/fehlerart.ts), nach „Taktik übersehen“.
 * Regeln: Kapitel 1 (Zählen von Angreifern und Verteidigern), Kapitel 8 (Bauern gehen nicht
 * zurück), Kapitel 11 (König vor dem Endspiel in Sicherheit).
 * Abhängigkeiten: engine/fehlerart-taktik.ts (Gewinn der Widerlegung), chessops.
 */
import type { Square } from "chessops/types";
import { parseUci } from "chessops/util";
import type { Fehlerart, Lage } from "./fehlerart-typen";
import { widerlegungsgewinn } from "./fehlerart-taktik";
import type { Zugprobe } from "./zugprobe";

/** Ein Bauer Gewinn genügt für „Bauer eingestellt“, zwei für eine eingestellte Figur. */
const BAUER_AB = 1;
const FIGUR_AB = 2;
/** Ein ausgelassener Schlag zählt ab einem Bauern Abtauschgewinn (Kapitel 1). */
const SCHLAG_AB = 1;
/** Ein König zieht bei der Rochade zwei Linien weit. */
const ROCHADE_LINIEN = 2;
const LINIEN = 8;
/** Ein Zug ohne Not ist erst ab einem halben Bauern Verlust ein Fehler (Grenze der Auswertung). */
const OHNE_NOT_AB = 0.5;

/** Was die Widerlegung eingestellt findet: Art und Feld der geschlagenen Figur. */
export interface Eingestellt {
  readonly art: "figurHaengen" | "bauerEingestellt";
  readonly haengt: Square;
}

/**
 * Eingestellt: Der erste Zug der Widerlegung schlägt eine Figur oder einen Bauern der ziehenden
 * Seite, und der Gegner gewinnt damit in fünf Halbzügen Material. Schließt die Lücke von „Figur
 * hängen“, dessen Abtauschrechnung nicht jede Widerlegung sieht.
 * Beispiel: Ein Bauer zieht vor, der Läufer dahinter ist ungedeckt, die Antwort schlägt ihn.
 * Sonderfall: Ohne Widerlegung oder ohne Schlag als Antwort null.
 */
export function eingestellt(p: Zugprobe, antwort: readonly string[]): Eingestellt | null {
  const roh = antwort[0] ? parseUci(antwort[0]) : undefined;
  if (!roh || !("from" in roh)) return null;
  const opfer = p.danach.board.get(roh.to);
  if (!opfer || opfer.color === p.danach.turn) return null;
  const gewinn = widerlegungsgewinn(p.danach, antwort, p.geschlagen);
  if (opfer.role === "pawn") {
    return gewinn >= BAUER_AB ? { art: "bauerEingestellt", haengt: roh.to } : null;
  }
  return gewinn >= FIGUR_AB ? { art: "figurHaengen", haengt: roh.to } : null;
}

/**
 * Schlag verpasst: Der beste Zug wäre ein Schlag mit Abtauschgewinn gewesen, gespielt wurde
 * kein Schlag. Regel: Kapitel 1, Zählen von Angreifern und Verteidigern.
 * Beispiel: Ein Springer hängt ungedeckt, der Spieler zieht stattdessen einen Bauern.
 */
export function schlagVerpasst(lage: Lage, p: Zugprobe, besterZug: string | null): boolean {
  if (p.geschlagen !== null || !besterZug) return false;
  return lage.schlaege.some((s) => s.uci === besterZug && s.bilanz >= SCHLAG_AB);
}

/**
 * Ruhiger Bauern- oder Königszug ohne Not (kein Schlag, kein Schach vorher). Königszüge zählen
 * nur vor dem Endspiel und ohne Rochade (Kapitel 11), Bauernzüge in jeder Phase (Kapitel 8).
 * Erst ab einem halben Bauern Verlust; sonst null.
 */
export function zugOhneNot(lage: Lage, p: Zugprobe, verlust: number | null): Fehlerart | null {
  if (verlust === null || verlust < OHNE_NOT_AB) return null;
  if (p.geschlagen !== null || lage.regeln.isCheck()) return null;
  if (p.figur.role === "pawn") return "bauernzugOhneNot";
  if (p.figur.role !== "king" || lage.phase === "endspiel") return null;
  const linien = Math.abs((p.zug.to % LINIEN) - (p.zug.from % LINIEN));
  const rochade = linien >= ROCHADE_LINIEN || lage.regeln.board.get(p.zug.to)?.role === "rook";
  return rochade ? null : "koenigszugOhneNot";
}
