/**
 * Texte zu einer Partie gegen die Engine, die mehrere Komponenten brauchen.
 *
 * Rolle im Gesamtbild: Ergebnis in einem Satz für Status, Ergebniskarte und Partienliste.
 * Eigene Datei, damit die Komponenten-Dateien nur Komponenten enthalten (schnelles Neuladen).
 * Abhängigkeiten: spiel/partie.ts, i18n.
 */
import { t } from "../../i18n/sprache";
import type { Partie } from "../../spiel/partie";

/**
 * Das Ergebnis in einem Satz aus Sicht des Lesers.
 *
 * Beispiel: Matt durch den Leser → „Matt! Du hast gewonnen.“; dreifache Wiederholung →
 * „Remis: dreimal dieselbe Stellung.“
 */
export function kurzergebnis(partie: Partie): string {
  const ende = partie.ende;
  if (!ende) return "";
  if ("sieger" in ende) {
    const wer = ende.sieger === partie.einstellung.eigeneFarbe ? "leser" : "engine";
    return t(`partie.ende.${ende.art}.${wer}`);
  }
  return t(`partie.ende.${ende.art}`);
}
