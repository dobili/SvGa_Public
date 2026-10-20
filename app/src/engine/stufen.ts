/**
 * Die acht Spielstufen der Engine mit Namen und Verfahren (Konzept 8.2, Pflichtenheft 5.2).
 *
 * Rolle im Gesamtbild: Die Stufe entscheidet, wie die Engine im Spiel ihren Zug wählt
 * (engine/zugwahl.ts). Seit 0.2.116 (Plan „menschlichere Bots und Uhr der Bots“, vom Autor
 * freigegeben am 20.10.2026) spielen die Stufen 1 bis 7 wie Menschen eines Wertungsbandes:
 * Fehler je Gelegenheit, blinde Flecken und eine gewichtete Wahl nach den Zahlen aus
 * gewerteten Lichess-Partien (engine/menschenwahl.ts, engine/menschenprofil.ts). Stufe 8 ist die
 * volle Engine ohne Fehler.
 * Bis 0.2.115 waren Stufe 1 bis 3 tiefenbegrenzt mit Fehlerwürfen (jeder dritte, vierte, fünfte
 * Zug), Stufe 4 bis 7 Stockfishs „Skill Level“; die Fehlerwürfe suchten gezielt Fehler, etwa eine
 * Figur direkt ins Schlagfeld, was Menschen selten tun (Rückmeldung des Autors, 20.10.2026).
 * Die Wertung je Stufe ist die Stärke der Menschen, deren Zahlen die Stufe nachspielt (Lichess-
 * Skala); die Elo-Zahl, die die App zeigt, misst die Leiter (engine/botstaerke-daten.ts).
 * Wer hier ändert, ändert nur diese Tabelle; die Oberfläche liest Namen und Nummer.
 * Abhängigkeiten: engine/engineDienst.ts (Staerke), i18n (Namen).
 */
import type { Textschluessel } from "../i18n/sprache";
import { VOLLE_STAERKE, type Staerke } from "./engineDienst";

export type Stufennummer = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface Stufe {
  readonly nummer: Stufennummer;
  readonly name: Textschluessel;
  /** Stärke der Kandidatensuche (Stufe 1 bis 7) oder der Züge (Stufe 8). */
  readonly staerke: Staerke;
  /** Rechenzeit je Auftrag in Millisekunden (Notanker; die Tiefe begrenzt die Suche). */
  readonly rechenzeitMs: number;
  /** Wertung der Menschen, die die Stufe nachspielt; null: volle Engine (Stufe 8). */
  readonly wertung: number | null;
}

/**
 * Suchtiefe der Kandidaten: genug, damit die Verluste der Fehlerzüge stimmen, und auf dem Handy
 * in etwa einer Sekunde je Auftrag (die Menschen-Daten wurden mit Tiefe 12 gerechnet).
 */
const SUCHTIEFE = 10;
const RECHENZEIT_MS = 1500;
const RECHENZEIT_VOLL_MS = 2000;
/** Die Wertung je Stufe 1 bis 7 (Lichess-Skala der Daten), je 300 Punkte auseinander. */
const WERTUNGEN = [600, 900, 1200, 1500, 1800, 2100, 2400] as const;
const STUFE_8: Stufennummer = 8;

function menschenstufe(nummer: Stufennummer, wertung: number): Stufe {
  return {
    nummer,
    name: `stufe.${nummer}` as Textschluessel,
    staerke: { art: "tiefe", tiefe: SUCHTIEFE },
    rechenzeitMs: RECHENZEIT_MS,
    wertung,
  };
}

export const STUFEN: readonly Stufe[] = [
  ...WERTUNGEN.map((w, i) => menschenstufe((i + 1) as Stufennummer, w)),
  {
    nummer: STUFE_8,
    name: "stufe.8",
    staerke: VOLLE_STAERKE,
    rechenzeitMs: RECHENZEIT_VOLL_MS,
    wertung: null,
  },
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
