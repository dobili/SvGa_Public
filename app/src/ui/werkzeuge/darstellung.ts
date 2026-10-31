/**
 * Werkzeuge, deren Karte die Befunde in eigener, knapper Form zeigt; die ausführlichen Befunde
 * stehen dann vollständig hinter einem Infoknopf.
 *
 * Rolle im Gesamtbild: Runde „Weniger Text“, P10 (Wahl des Autors, 31.10.2026): Die Kandidaten
 * der Denkroutine erscheinen als Zeilen mit Bewertungsbalken, ▲/▼, Krone und Waage
 * (werkzeugkarten/KandidatenKarte.tsx); die Sätze der Schritte 2 bis 4 wandern hinter ⓘ.
 * Weitere Werkzeuge mit eigener Darstellung bekommen hier eine Zeile (eintragen statt umbauen).
 * Abhängigkeiten: keine.
 */

/** Werkzeuge mit eigener Darstellung der Befunde. */
export const BEFUNDE_HINTER_INFO: ReadonlySet<string> = new Set(["k12-kandidaten"]);

/**
 * Stehen die Befunde dieses Werkzeugs hinter dem Infoknopf?
 * Beispiel: befundeHinterInfo("k12-kandidaten") → true; befundeHinterInfo("k1-roentgen") → false.
 */
export function befundeHinterInfo(werkzeug: string): boolean {
  return BEFUNDE_HINTER_INFO.has(werkzeug);
}
