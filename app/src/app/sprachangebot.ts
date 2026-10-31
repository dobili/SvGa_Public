/**
 * Wann das Sprachangebot beim ersten Start erscheint (Logik ohne Oberfläche).
 *
 * Rolle im Gesamtbild: Teil von app/Sprachangebot.tsx (Wunsch des Autors, 31.10.2026): einmal je
 * Gerät, ohne gemerkte Sprachwahl, wenn die erste Sprache des Geräts nicht Deutsch ist und es
 * Englisch gibt.
 * Abhängigkeiten: app/merker.ts, app/sprachwahl.ts (Merker der Sprachwahl), i18n.
 */
import { verfuegbareSprachen } from "../i18n/sprache";
import { liesMerker } from "./merker";
import { MERKER_SPRACHE } from "./sprachwahl";

const ENGLISCH = "en";
const DEUTSCH = "de";

/** Merker: Das Angebot wurde auf diesem Gerät schon gezeigt. */
export const MERKER_SPRACHANGEBOT = "sprachangebot";

/** Die erste Sprache des Geräts als Kürzel, etwa „en“ aus „en-GB“ (ohne Angabe: Deutsch). */
export function ersteGeraetesprache(): string {
  if (typeof navigator === "undefined") return DEUTSCH;
  const erste = navigator.languages[0] ?? navigator.language;
  return (erste ?? DEUTSCH).toLowerCase().split("-")[0] ?? DEUTSCH;
}

/**
 * Soll das Angebot erscheinen? Einmal je Gerät, ohne gemerkte Sprachwahl, bei einer anderen
 * ersten Gerätesprache als Deutsch, und nur wenn es Englisch gibt.
 * Beispiel: iPhone auf „en-GB“, erster Start → ja; „de-AT“ → nein; schon gefragt → nein.
 */
export function sprachangebotFaellig(): boolean {
  return (
    liesMerker(MERKER_SPRACHANGEBOT) === null &&
    liesMerker(MERKER_SPRACHE) === null &&
    ersteGeraetesprache() !== DEUTSCH &&
    verfuegbareSprachen().includes(ENGLISCH)
  );
}
