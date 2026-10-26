/**
 * Texte zu einer Partie gegen die Engine, die mehrere Komponenten brauchen.
 *
 * Rolle im Gesamtbild: Ergebnis in einem Satz für Status, Ergebniskarte und Partienliste.
 * Eigene Datei, damit die Komponenten-Dateien nur Komponenten enthalten (schnelles Neuladen).
 * Abhängigkeiten: spiel/partie.ts, i18n.
 */
import { t } from "../../../i18n/sprache";
import type { Partie } from "../../../spiel/partie";

/**
 * Das Ergebnis in einem Satz aus Sicht des Lesers; bei Mensch gegen Mensch (0.2.41) mit den
 * Farben.
 *
 * Beispiel: Matt durch den Leser → „Matt! Du hast gewonnen.“; dreifache Wiederholung →
 * „Remis: dreimal dieselbe Stellung.“; zwei Menschen, Matt durch Weiß → „Matt! Weiß hat gewonnen.“
 */
export function kurzergebnis(partie: Partie): string {
  const ende = partie.ende;
  if (!ende) return "";
  if ("sieger" in ende) {
    if (partie.einstellung.gegner === "mensch") {
      const sieger = t(ende.sieger === "white" ? "farbe.w" : "farbe.b");
      const verlierer = t(ende.sieger === "white" ? "farbe.b" : "farbe.w");
      return t(`partie.ende.${ende.art}.mensch`, { sieger, verlierer });
    }
    const wer = ende.sieger === partie.einstellung.eigeneFarbe ? "leser" : "engine";
    return t(`partie.ende.${ende.art}.${wer}`);
  }
  return t(`partie.ende.${ende.art}`);
}
