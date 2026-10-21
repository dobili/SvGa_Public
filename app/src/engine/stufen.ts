/**
 * Die zehn Spielstufen der Engine: Name, Ziel-Elo und Grundschicht (Konzept 8.2, Pflichtenheft 5.2).
 *
 * Rolle im Gesamtbild: Die Stufe entscheidet, wie stark die Engine im Spiel zieht
 * (engine/zugwahl.ts). Seit 0.2.117 (Vorschlag des Autors vom 21.10.2026) sind es zehn Stufen von
 * etwa 300 bis 3000 Elo in Schritten von 300. Eine Stufe ohne Zusatzfehler spielt nur ihre
 * Grundschicht (engine/grundschicht.ts): Die Engine bewertet die Züge in begrenzter Tiefe (in den
 * unteren Stufen alle legalen Züge) und wählt gewichtet mit dem Kern (1 + Verlust/tau)^(−Exponent);
 * Tiefe und tau sind so geeicht, dass die Stufe ihre Ziel-Elo erreicht (Messung in
 * engine/stufen.messung.ts, Ergebnis in engine/botstaerke-daten.ts). Stufe 10 ist die volle Engine.
 * Die Zusatzfehler der Menschen (engine/menschenwahl.ts) machen Bots menschlicher und schwächer;
 * sie nutzen die Lichess-Zahlen der Menschen mit der Ziel-Elo der Stufe.
 * Bis 0.2.116 gab es acht Stufen; gespeicherte Stufen rechnet speicher/format.ts um.
 * Abhängigkeiten: engine/engineDienst.ts (Staerke), engine/grundschicht.ts (Typ), i18n (Namen).
 */
import type { Textschluessel } from "../i18n/sprache";
import { VOLLE_STAERKE, type Staerke } from "./engineDienst";
import type { Grundschicht } from "./grundschicht";

export type Stufennummer = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface Stufe {
  readonly nummer: Stufennummer;
  readonly name: Textschluessel;
  /** Elo-Zahl, auf die die Stufe geeicht ist (300 je Stufe). */
  readonly zielElo: number;
  /** Grundschicht der Stufe; null: volle Engine (Stufe 10). */
  readonly grund: Grundschicht | null;
  /** Stärke der Engine, wenn die Stufe voll zieht (Stufe 10). */
  readonly staerke: Staerke;
  /** Rechenzeit je Auftrag in Millisekunden (Notanker; die Tiefe begrenzt die Suche). */
  readonly rechenzeitMs: number;
  /** Wertung der Menschen für Zusatzfehler und Bedenkzeit (die Ziel-Elo). */
  readonly wertung: number;
}

export const STUFEN_ZAHL = 10;
const ELO_JE_STUFE = 300;
const RECHENZEIT_MS = 1500;
const RECHENZEIT_VOLL_MS = 2000;
/** Alle legalen Züge bewerten (Stockfish begrenzt MultiPV selbst auf die Zahl der Züge). */
export const ALLE_ZUEGE = 256;
/** In tiefen Suchen genügen die besten Züge, die anderen haben bei kleinem tau kein Gewicht. */
const BESTE_ZUEGE = 8;

/**
 * Grundschicht je Stufe 1 bis 9: Suchtiefe und tau (Exponent 1). Geeicht am 21./22.10.2026 auf
 * 300 bis 2700 Elo (Bericht buch/arbeit/botelo3, nur lokal).
 */
const GRUNDSCHICHTEN: readonly (readonly [tiefe: number, tau: number])[] = [
  [1, 3],
  [1, 1],
  [2, 0.5],
  [3, 0.3],
  [4, 0.2],
  [6, 0.12],
  [8, 0.07],
  [10, 0.04],
  [12, 0.02],
];
const TIEF_AB = 8;

/** Grundschicht aus Tiefe und tau (die Breite folgt aus der Tiefe). */
export function grundschicht(tiefe: number, tau: number): Grundschicht {
  return { tiefe, tau, exponent: 1, breite: tiefe >= TIEF_AB ? BESTE_ZUEGE : ALLE_ZUEGE };
}

function stufeMit(nummer: Stufennummer, grund: Grundschicht | null): Stufe {
  const zielElo = nummer * ELO_JE_STUFE;
  return {
    nummer,
    name: `stufe.${nummer}` as Textschluessel,
    zielElo,
    grund,
    staerke: grund ? { art: "tiefe", tiefe: grund.tiefe } : VOLLE_STAERKE,
    rechenzeitMs: grund ? RECHENZEIT_MS : RECHENZEIT_VOLL_MS,
    wertung: zielElo,
  };
}

export const STUFEN: readonly Stufe[] = [
  ...GRUNDSCHICHTEN.map(([tiefe, tau], i) =>
    stufeMit((i + 1) as Stufennummer, grundschicht(tiefe, tau)),
  ),
  stufeMit(STUFEN_ZAHL, null),
];

const EINSTEIGER = STUFEN[0] as Stufe;

/** Die Stufe zu einer Nummer; unbekannte Nummern (alte Daten) ergeben Stufe 1. */
/**
 * Der nächste Schritt von einer Stufe zur Zielstufe, um höchstens eine Stufe je Zug (Wunsch des
 * Autors, 0.2.40: Beim Wechsel der Phase ändert sich die Stärke Zug für Zug, nicht ruckartig).
 * Beispiel: Eröffnung Stufe 1, Mittelspiel Stufe 4 → im ersten Zug des Mittelspiels 2, dann 3, dann 4.
 */
export function naechsteStufe(von: Stufennummer, ziel: Stufennummer): Stufennummer {
  if (von === ziel) return ziel;
  return (von < ziel ? von + 1 : von - 1) as Stufennummer;
}

export function stufe(nummer: number): Stufe {
  return STUFEN.find((s) => s.nummer === nummer) ?? EINSTEIGER;
}
