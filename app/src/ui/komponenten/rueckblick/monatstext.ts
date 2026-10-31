/**
 * Namen der Monate für den Monatsrückblick (Gamifizierung P12), aus de.json und en.json.
 *
 * Rolle im Gesamtbild: Startkarte, Bildschirm, Profilkarte und Bild zum Teilen nennen den Monat
 * („Dein Oktober“, „Oktober 2026“). Die Namen stehen als Texte „rueckblick.monat.1“ bis „…12“,
 * damit jede Sprache ihre eigenen hat. Dazu der ruhige Satz über den Lerntagen.
 * Abhängigkeiten: training/rueckblick.ts (Typ), i18n.
 */
import { t, tZahl, type Textschluessel } from "../../../i18n/sprache";
import type { Monat } from "../../../training/rueckblick";

/** Der Name des Monats. Beispiel: Oktober 2026 → „Oktober“. */
export function monatsname(monat: Monat): string {
  return t(`rueckblick.monat.${monat.nummer}` as Textschluessel);
}

/** Name und Jahr. Beispiel: Oktober 2026 → „Oktober 2026“. */
export function monatMitJahr(monat: Monat): string {
  return t("rueckblick.monatJahr", { monat: monatsname(monat), jahr: monat.jahr });
}

/** Bis zu so vielen Lerntagen steht „Jeder zählt.“ dabei. */
export const WENIGE_LERNTAGE = 5;
/** Der Satz über den Lerntagen. Beispiel: 3 Lerntage im Oktober → „… 3 Lerntage. Jeder zählt.“ */
export function lerntagesatz(anzahl: number, monat: string): string {
  if (anzahl > 1 && anzahl <= WENIGE_LERNTAGE)
    return t("rueckblick.lerntageWenige", { anzahl, monat });
  return tZahl("rueckblick.lerntage", anzahl, { anzahl, monat });
}
