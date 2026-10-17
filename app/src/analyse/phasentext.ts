/**
 * Der Satz zur Phase mit ihrem Grund, für das Werkzeug „Phase“ und für die Erklärung am
 * Phasenwechsel im Rückblick (Wunsch des Autors, 17.10.2026, Version 0.2.44).
 *
 * Rolle im Gesamtbild: Beide Anzeigen sollen denselben Wortlaut haben, damit der Leser die Regel
 * wiedererkennt. Die Zusatzregel (wenig Material) bekommt ihren eigenen Satz mit dem Hinweis
 * „nicht aus dem Buch“ (k11-phase.ts hängt ihn als zweite Zeile an).
 * Abhängigkeiten: schach/phase.ts, analyse/texte.ts (Farbnamen), i18n.
 */
import { t } from "../i18n/sprache";
import { ENDSPIEL_BIS_PUNKTE, type Phasenbefund } from "../schach/phase";
import { farbname } from "./texte";

/**
 * Beispiel: Abb. 12.1 → „Mittelspiel: Beide Seiten sind entwickelt …“; Berliner Verteidigung nach
 * 9. Sc3 → „Mittelspiel: Weiß ist entwickelt (höchstens eine Leichtfigur zu Hause) …“.
 */
export function phasensatz(p: Phasenbefund): string {
  if (p.grund === "eineEntwickelt" && p.entwickelt) {
    return t("phase.ist.eineEntwickelt", { farbe: farbname(p.entwickelt) });
  }
  return t(`phase.ist.${p.grund}`);
}

/** Die Zeile zur Zusatzregel, falls sie die Phase bestimmt hat; sonst null. */
export function zusatzsatz(p: Phasenbefund): string | null {
  if (!p.zusatz) return null;
  return t(`phase.zusatz.${p.zusatz}`, {
    punkte: ENDSPIEL_BIS_PUNKTE,
    buch: t(`phase.name.${p.buchphase}`),
  });
}
