/**
 * Die Sonderformen mit eigenen Regeln und eigenem Brett (Nebel, Ente, Tandem) und ihre Erkennung.
 * Warum: Partiehülle und Begegnungen fragen, ob eine Variante das eigene Brett braucht; die Liste
 * steht an einer Stelle (Auftrag des Hauptchats, 26.11.2026). Abhängigkeiten: keine.
 */

/** Die Sonderformen mit eigenen Regeln. */
export type Sonderform = "nebel" | "ente" | "tandem";

/** Ist diese Variante eine Sonderform mit eigenem Brett? Beispiel: „nebel“ → ja, „schach960“ → nein. */
export function istSonderform(variante: string | undefined): variante is Sonderform {
  return variante === "nebel" || variante === "ente" || variante === "tandem";
}
