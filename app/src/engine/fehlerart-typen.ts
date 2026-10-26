/**
 * Gemeinsame Typen und Konstanten der Fehlerarten: die Namen der Fehlerarten, der blinden Flecken
 * und die Lage vor dem Zug.
 *
 * Rolle im Gesamtbild: engine/fehlerart.ts und seine Teildateien (fehlerart-taktik.ts,
 * fehlerart-phasen.ts, fehlerart-schlag.ts, fehlerart-koenig.ts, fehlerart-eroeffnung.ts,
 * fehlerart-neu.ts), dazu engine/opfer.ts, engine/engineZuege.ts, engine/blindeFlecken.ts und
 * engine/spielbewerter.ts brauchen dieselben Typen. Stehen sie hier, benutzen sich diese Dateien
 * nicht mehr gegenseitig (Ordnung im Code, docs/codefuehrer/8-verbesserungen.md). Wer von außen
 * kommt, importiert weiter aus engine/fehlerart.ts und engine/blindeFlecken.ts; beide reichen die
 * Typen weiter.
 * Abhängigkeiten: chessops (Typ), schach/drohungen.ts (Typen), schach/phase.ts (Typ).
 */
import type { Chess } from "chessops/chess";
import type { Drohung, Schlagzug } from "../schach/drohungen";
import type { Phase } from "../schach/phase";

/** Die blinden Flecken eines Gegners (engine/blindeFlecken.ts, seit 0.2.46; drei mehr seit 0.2.57). */
export type BlinderFleck =
  | "rueckzug"
  | "diagonale"
  | "springer"
  | "dame"
  | "turm"
  | "ruhig"
  | "abzug"
  | "bauer"
  | "roentgen"
  | "zwischenzug"
  | "grundreihe";

export type Fehlerart =
  | "figurHaengen"
  | "schlagreflex"
  | "verfruehteDame"
  | "koenigMitte"
  | "taktikUebersehen"
  | "drohungIgnoriert"
  // Seit 0.2.40, typische Fehler je Phase (engine/fehlerart-phasen.ts, Liste in ENTSCHEIDUNGEN):
  | "tempoverlust"
  | "bauernraub"
  | "koenigsschild"
  | "falscherAbtausch"
  | "koenigPassiv"
  | "bauernvorstoss"
  | "pattGesetzt"
  // Seit 0.2.118 aus der Auswertung von Lichess-Partien (engine/fehlerart-neu.ts):
  | "bauerEingestellt"
  | "schlagVerpasst"
  | "bauernzugOhneNot"
  | "koenigszugOhneNot"
  | "ungenau"
  // Seit 0.2.46: blinde Flecken eines Gegners (engine/blindeFlecken.ts), nur im Protokoll.
  | `blind${Capitalize<BlinderFleck>}`;

/** Die typischen Fehlerarten (ohne blinde Flecken), für Fehlerprofile, Speicher und Oberfläche. */
export const FEHLERARTEN: readonly Fehlerart[] = [
  "figurHaengen",
  "schlagreflex",
  "verfruehteDame",
  "koenigMitte",
  "taktikUebersehen",
  "drohungIgnoriert",
  "tempoverlust",
  "bauernraub",
  "koenigsschild",
  "falscherAbtausch",
  "koenigPassiv",
  "bauernvorstoss",
  "pattGesetzt",
  "bauerEingestellt",
  "schlagVerpasst",
  "bauernzugOhneNot",
  "koenigszugOhneNot",
  "ungenau",
];

/** Die Lage vor dem Zug, einmal je Stellung berechnet, damit viele Züge schnell geprüft sind. */
export interface Lage {
  readonly regeln: Chess;
  /** Phase der Stellung (Kapitel 11), für die Fehlerarten je Phase. */
  readonly phase: Phase;
  /** Drohungen des Gegners, als wäre er am Zug (leer, wenn die Seite am Zug im Schach steht). */
  readonly drohungen: readonly Drohung[];
  /** Alle Schläge der Seite am Zug mit ihrer Abtauschbilanz. */
  readonly schlaege: readonly Schlagzug[];
  /** Schlüssel der Gabelfelder des Gegners (W6) vor dem Zug. */
  readonly gabeln: ReadonlySet<string>;
  /** Schlüssel der gefährlichen Linien (W2) gegen die Seite am Zug vor dem Zug. */
  readonly linien: ReadonlySet<string>;
}
