/**
 * Filter der Partienliste nach Ergebnis und Wertung (seit 0.2.99, Wunsch des Autors vom
 * 19.10.2026).
 *
 * Rolle im Gesamtbild: Die Liste im Bereich Spielen hält bis zu 50 Partien; mit dem Filter findet
 * der Leser etwa alle gewonnenen oder alle ungewerteten (die er löschen kann). Das Ergebnis zählt
 * aus Sicht des Lesers; bei Mensch gegen Mensch gibt es kein „gewonnen“ oder „verloren“, solche
 * Partien erscheinen dort nur unter „alle“ und „remis“.
 * Abhängigkeiten: spiel/partie.ts.
 */
import type { Partie } from "./partie";

export const ERGEBNISFILTER = ["alle", "gewonnen", "remis", "verloren"] as const;
export type Ergebnisfilter = (typeof ERGEBNISFILTER)[number];
export const WERTUNGSFILTER = ["alle", "gewertet", "ungewertet"] as const;
export type Wertungsfilter = (typeof WERTUNGSFILTER)[number];

export interface Partienfilter {
  readonly ergebnis: Ergebnisfilter;
  readonly wertung: Wertungsfilter;
}

export const OHNE_FILTER: Partienfilter = { ergebnis: "alle", wertung: "alle" };

/** Ergebnis einer beendeten Partie aus Sicht des Lesers; null bei laufender oder Mensch gegen Mensch mit Sieger. */
export function ergebnisFuerLeser(partie: Partie): Exclude<Ergebnisfilter, "alle"> | null {
  const ende = partie.ende;
  if (!ende) return null;
  if (!("sieger" in ende)) return "remis";
  if (partie.einstellung.gegner === "mensch") return null;
  return ende.sieger === partie.einstellung.eigeneFarbe ? "gewonnen" : "verloren";
}

/**
 * Passt die Partie zum Filter? Beispiel: gewonnene, gewertete Partie gegen Lotta →
 * passt zu {gewonnen, alle} und {alle, gewertet}, nicht zu {verloren, alle}.
 */
export function passtZumFilter(partie: Partie, filter: Partienfilter): boolean {
  if (filter.ergebnis !== "alle" && ergebnisFuerLeser(partie) !== filter.ergebnis) return false;
  if (filter.wertung === "gewertet") return partie.einstellung.gewertet;
  if (filter.wertung === "ungewertet") return !partie.einstellung.gewertet;
  return true;
}
