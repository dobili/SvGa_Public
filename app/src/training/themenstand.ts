/**
 * Auswertung des Antwortprotokolls je Thema (Gamifizierung G1): Quote, stärkstes und schwächstes
 * Thema.
 *
 * Rolle im Gesamtbild: Lesende Seite zu speicher/themenprotokoll.ts. „Dein nächster Schritt“ (P1)
 * schlägt das schwächste Thema vor, der Monatsrückblick (P12) nennt das stärkste; die Meisterschaft
 * (P3) baut auf demselben Stand auf. Erst ab 8 Antworten gilt ein Thema als aussagekräftig, damit
 * zwei Fehler am Anfang nicht gleich als Schwäche gelten.
 * Abhängigkeiten: speicher/gamifizierung.ts.
 */
import type { Themenstand } from "../speicher/gamifizierung";

/** So viele Antworten braucht ein Thema, bevor es als stark oder schwach gilt. */
export const MINDESTANTWORTEN = 8;

/** Ein Thema mit seiner Quote. */
export interface Themenquote {
  readonly thema: string;
  /** Anteil richtiger Antworten an den letzten (bis 20) Antworten, 0 bis 1. */
  readonly quote: number;
  readonly antworten: number;
}

/**
 * Quote der letzten Antworten eines Themas, 0 bis 1; ohne Antworten 0.
 * Beispiel: letzte „rrfr“ → 0,75.
 */
export function themenquote(stand: Themenstand): number {
  if (stand.letzte.length === 0) return 0;
  return [...stand.letzte].filter((z) => z === "r").length / stand.letzte.length;
}

/** Alle aussagekräftigen Themen (mindestens 8 Antworten) mit Quote. */
export function aussagekraeftigeThemen(
  themen: Readonly<Record<string, Themenstand>>,
): Themenquote[] {
  return Object.entries(themen)
    .map(([thema, stand]) => ({
      thema,
      quote: themenquote(stand),
      antworten: stand.richtig + stand.falsch,
    }))
    .filter((t) => t.antworten >= MINDESTANTWORTEN);
}

/**
 * Das stärkste Thema (höchste Quote, bei Gleichstand das mit mehr Antworten); null ohne
 * aussagekräftiges Thema.
 */
export function staerkstesThema(themen: Readonly<Record<string, Themenstand>>): Themenquote | null {
  const liste = aussagekraeftigeThemen(themen);
  liste.sort((a, b) => b.quote - a.quote || b.antworten - a.antworten);
  return liste[0] ?? null;
}

/**
 * Das schwächste Thema (niedrigste Quote, bei Gleichstand das mit mehr Antworten); null ohne
 * aussagekräftiges Thema. Beispiel: Fesselung 5 von 9 richtig, Gabel 9 von 10 → Fesselung.
 */
export function schwaechstesThema(
  themen: Readonly<Record<string, Themenstand>>,
): Themenquote | null {
  const liste = aussagekraeftigeThemen(themen);
  liste.sort((a, b) => a.quote - b.quote || b.antworten - a.antworten);
  return liste[0] ?? null;
}
