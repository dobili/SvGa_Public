/**
 * Kleine Texthelfer des Zähltrainers, die Aufgabe und Antwort (Zaehltrainer.tsx,
 * Zaehlantwort.tsx) gemeinsam brauchen.
 * Abhängigkeiten: i18n.
 */
import { t } from "../../i18n/sprache";

/**
 * Ein Ergebnis als Text: „lohnt nicht“ bei 0, sonst „+3“ (Bauerneinheiten).
 * Beispiel: bilanztext(1) → „+1“.
 */
export function bilanztext(wert: number): string {
  return wert === 0 ? t("zaehltrainer.lohntNicht") : `+${wert}`;
}
