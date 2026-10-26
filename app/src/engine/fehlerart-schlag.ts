/**
 * Schlagreflex und falscher Abtausch, seit 0.2.118 scharf voneinander getrennt.
 *
 * Rolle im Gesamtbild: Teil von fehlerbefundIn (engine/fehlerart.ts). Die Engine-Gegenprüfung in
 * Tiefe 20 (Plan „Bots, zweite Runde“, Teil A) zeigte, dass „falscher Abtausch“ oft eigentlich
 * Schlagreflex war und dass Schlagreflex jeden Schlag mit Verlust umfasste. Festlegung mit dem
 * Autor (22.10.2026):
 * - Schlagreflex (Glossar: „Der Drang, eine scheinbar ungedeckte Figur sofort zu schlagen“,
 *   Kapitel 1): Der Schlag sieht nach Gewinn aus (Abtauschrechnung mindestens ein Bauer), und
 *   die Bestrafung ist erzwungen und offensichtlich: Jeder Zug des Gegners in den ersten vier
 *   Halbzügen der Widerlegung ist ein Schlag, ein Schach oder greift eine Figur ab Leichtfigur an,
 *   und danach steht der Schlagende mindestens einen Bauern schlechter (Material oder Bewertung).
 * - Falscher Abtausch (Kapitel 8, Regel 4 „Tausche klug“): Wer mindestens zwei Bauern
 *   zurückliegt, tauscht eine Figur gleichwertig ab, obwohl er nicht zurückschlagen muss (der
 *   beste Zug der Engine schlägt nicht auf demselben Feld).
 * Ein Schlag, der schon laut Abtauschrechnung verliert, ist kein Reflex, sondern „Figur hängen“.
 * Abhängigkeiten: engine/fehlerart-taktik.ts (Gewinn der Widerlegung), chessops.
 */
import { attacks } from "chessops/attacks";
import { normalizeMove, type Chess } from "chessops/chess";
import type { Color } from "chessops/types";
import { opposite, parseUci } from "chessops/util";
import { FIGURENWERT } from "../schach/stellung";
import type { Lage } from "./fehlerart-typen";
import { widerlegungsgewinn } from "./fehlerart-taktik";
import type { Zugprobe } from "./zugprobe";

/** Ein Schlag „sieht nach Gewinn aus“ ab einem Bauern Abtauschgewinn. */
const SCHEINGEWINN_AB = 1;
/** In so vielen Halbzügen muss die Bestrafung sichtbar sein (Wunsch des Autors). */
const STRAFE_HALBZUEGE = 4;
/** So viel muss die Bestrafung netto kosten (ein Bauer). */
const STRAFE_AB = 1;
/** Ein Angriff auf eine Figur ab diesem Wert erzwingt eine Antwort. */
const DROHZIEL_AB = 3;
/** Materialrückstand, ab dem ein gleicher Abtausch falsch ist (Kapitel 8, Regel 4). */
const RUECKSTAND_AB = 2;

/** Die Abtauschbilanz des gespielten Schlags (Kapitel 1), sonst null. */
function abtauschbilanz(lage: Lage, p: Zugprobe): number | null {
  const schlag = lage.schlaege.find((s) => s.von === p.zug.from && s.nach === p.zug.to);
  return schlag ? schlag.bilanz : null;
}

/** Greift die gezogene Figur nach dem Zug eine fremde Figur ab Leichtfigur neu an? */
function drohtNeu(vorher: Chess, nachher: Chess, nach: number, farbe: Color): boolean {
  const figur = nachher.board.get(nach);
  if (!figur) return false;
  for (const ziel of attacks(figur, nach, nachher.board.occupied)) {
    const opfer = nachher.board.get(ziel);
    if (opfer?.color !== opposite(farbe) || opfer.role === "king") continue;
    if (FIGURENWERT[opfer.role] >= DROHZIEL_AB && vorher.board.get(ziel) === opfer) return true;
  }
  return false;
}

/**
 * Sind die Züge des Gegners in den ersten Halbzügen der Widerlegung erzwingend (Schlag, Schach
 * oder Angriff auf eine Figur ab Leichtfigur)? Die Züge des Schlagenden dazwischen sind frei.
 */
export function erzwungen(danach: Chess, antwort: readonly string[], halbzuege: number): boolean {
  const regeln = danach.clone();
  const gegner = danach.turn;
  for (const uci of antwort.slice(0, halbzuege)) {
    const roh = parseUci(uci);
    if (!roh || !("from" in roh)) return false;
    const zug = normalizeMove(regeln, roh);
    if (!regeln.isLegal(zug) || !("from" in zug)) return false;
    const amZug = regeln.turn;
    const vorher = regeln.clone();
    const schlag = regeln.board.get(zug.to)?.color === opposite(amZug);
    regeln.play(zug);
    const zwingt = schlag || regeln.isCheck() || drohtNeu(vorher, regeln, zug.to, amZug);
    if (amZug === gegner && !zwingt) return false;
  }
  return antwort.length > 0;
}

/**
 * Schlagreflex: scheinbarer Gewinn, erzwungene Bestrafung in höchstens vier Halbzügen.
 * Beispiel: Zweispringerspiel 5... Sxd5?! 6. Sxf7: Sxd5 nimmt einen Bauern, Sxf7 ist Schlag mit
 * Gabel. Sonderfall: Ohne Widerlegung der Engine kein Schlagreflex.
 */
export function istSchlagreflex(
  lage: Lage,
  p: Zugprobe,
  antwort: readonly string[],
  verlust: number | null,
): boolean {
  if (p.geschlagen === null) return false;
  const bilanz = abtauschbilanz(lage, p);
  if (bilanz === null || bilanz < SCHEINGEWINN_AB) return false;
  const strafe = widerlegungsgewinn(p.danach, antwort, p.geschlagen, STRAFE_HALBZUEGE);
  // Bestrafung ist Material oder ein erzwungener Angriff, den die Engine mit Verlust bewertet
  const bestraft = strafe >= STRAFE_AB || (verlust !== null && verlust >= STRAFE_AB);
  return bestraft && erzwungen(p.danach, antwort, STRAFE_HALBZUEGE);
}

/** Summe der Faustwerte einer Farbe ohne König. */
function material(lage: Lage, farbe: Color): number {
  let summe = 0;
  for (const feld of lage.regeln.board[farbe]) {
    const figur = lage.regeln.board.get(feld);
    if (figur && figur.role !== "king") summe += FIGURENWERT[figur.role];
  }
  return summe;
}

/**
 * Falscher Abtausch (Kapitel 8, Regel 4): zurück um mindestens zwei Bauern, gleichwertiger Tausch
 * einer Figur, und der beste Zug ist kein Schlag auf demselben Feld (sonst ist es ein Zurückschlagen).
 */
export function istFalscherAbtausch(lage: Lage, p: Zugprobe, besterZug: string | null): boolean {
  const farbe = lage.regeln.turn;
  if (lage.phase === "eroeffnung" || p.geschlagen === null || p.geschlagen === "pawn") return false;
  if (material(lage, farbe) > material(lage, opposite(farbe)) - RUECKSTAND_AB) return false;
  if (abtauschbilanz(lage, p) !== 0) return false;
  return !schlaegtAuchDort(p, besterZug);
}

/** Schlägt der beste Zug auf demselben Feld (Zurückschlagen ist Pflicht, kein Tauschentschluss)? */
function schlaegtAuchDort(p: Zugprobe, besterZug: string | null): boolean {
  const roh = besterZug ? parseUci(besterZug) : undefined;
  return roh !== undefined && "from" in roh && roh.to === p.zug.to;
}
