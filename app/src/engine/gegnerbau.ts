/**
 * Bauplan eines vorgefertigten Gegners: Typ, Fehlerlisten und der Prüfhelfer `gegner`.
 *
 * Rolle im Gesamtbild: Von den Listen engine/gegnerliste1.ts und gegnerliste2.ts gebraucht, die
 * engine/gegnerliste.ts zusammenführt; getrennt, damit kein Modul im Kreis importiert.
 * Abhängigkeiten: engine/stufen.ts (Stufennummer), engine/blindeFlecken.ts, engine/fehlerart.ts,
 * engine/stil.ts, schach/phase.ts, i18n.
 */
import type { Textschluessel } from "../i18n/sprache";
import type { BlinderFleck } from "./blindeFlecken";
import type { Fehlerart } from "./fehlerart";
import type { Phase } from "../schach/phase";
import { STIL_MAX, STIL_MIN } from "./stil";
import type { Stufennummer } from "./stufen";

export interface Gegner {
  readonly kennung: string;
  readonly name: string;
  readonly beschreibung: Textschluessel;
  readonly stufenJePhase: Readonly<Record<Phase, Stufennummer>>;
  /** Erlaubte absichtliche Fehler (Stufe 1 bis 4); leer: keine (0.2.46, Persönlichkeit). */
  readonly fehlerarten: readonly Fehlerart[];
  /** Zugarten, die dieser Gegner nicht sieht (engine/blindeFlecken.ts), in jeder Stufe. */
  readonly blindeFlecken: readonly BlinderFleck[];
  /** Spielstil von −2 (sehr defensiv) bis 2 (sehr aggressiv), engine/stil.ts (0.2.65). */
  readonly stil: number;
}

/** Streuung um das Mittelspiel, höchstens zwei Stufen (Vorgabe des Autors). */
const STREUUNG = 2;

/** Die groben Fehler der Einsteiger (Kapitel 1 und 4). */
export const GROB: readonly Fehlerart[] = [
  "figurHaengen",
  "schlagreflex",
  "drohungIgnoriert",
  "verfruehteDame",
  "koenigMitte",
  "bauernraub",
];
/** Die feineren Fehler der Anfänger (Kapitel 5 bis 8). */
export const FEIN: readonly Fehlerart[] = [
  "taktikUebersehen",
  "tempoverlust",
  "koenigsschild",
  "falscherAbtausch",
  "koenigPassiv",
  "bauernvorstoss",
  "pattGesetzt",
  "ungenau",
];

/**
 * Baut einen Gegner und prüft Streuung und Stil. Beispiel: gegner("nina", "Nina", [3, 3, 3],
 * ["taktikUebersehen"], ["abzug"], 0). Sonderfall: Streuung über 2 oder Stil außerhalb −2 bis 2
 * ist ein Programmierfehler und wirft.
 */
export function gegner(
  kennung: string,
  name: string,
  stufen: readonly [Stufennummer, Stufennummer, Stufennummer],
  fehlerarten: readonly Fehlerart[],
  blindeFlecken: readonly BlinderFleck[],
  stil: number,
): Gegner {
  const [eroeffnung, mittelspiel, endspiel] = stufen;
  if (
    Math.abs(eroeffnung - mittelspiel) > STREUUNG ||
    Math.abs(endspiel - mittelspiel) > STREUUNG
  ) {
    throw new Error(`Gegner ${kennung}: Streuung über ${STREUUNG} Stufen`);
  }
  if (stil < STIL_MIN || stil > STIL_MAX) throw new Error(`Gegner ${kennung}: Stil ${stil}`);
  return {
    kennung,
    name,
    beschreibung: `gegner.${kennung}` as Textschluessel,
    stufenJePhase: { eroeffnung, mittelspiel, endspiel },
    fehlerarten,
    blindeFlecken,
    stil,
  };
}
