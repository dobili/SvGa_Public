/**
 * Wann das Sprachangebot beim ersten Start erscheint (Logik ohne Oberfläche).
 *
 * Rolle im Gesamtbild: Teil von app/Sprachangebot.tsx (Wunsch des Autors, 31.10.2026): einmal je
 * Gerät, ohne gemerkte Sprachwahl, wenn die erste Sprache des Geräts nicht Deutsch ist und es
 * Englisch gibt.
 * Abhängigkeiten: app/merker.ts, app/sprachwahl.ts (Merker der Sprachwahl), i18n, React.
 */
import { useSyncExternalStore } from "react";
import { verfuegbareSprachen } from "../i18n/sprache";
import { beobachteMerker, liesMerker } from "./merker";
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

/**
 * Ob das Angebot fällig ist, für eine Komponente: Sie zeichnet neu, sobald der Leser antwortet
 * (die Antwort schreibt einen Merker). Warum: Mit `?start=buch` (QR-Code im Buch) wartet die Tour,
 * bis die Frage nach der Sprache beantwortet ist; sonst lag die Tour über der Frage, und die Frage
 * war nicht bedienbar (Fehlertest f3, 01.11.2026).
 */
export function useSprachangebotFaellig(): boolean {
  return useSyncExternalStore(
    (geaendert) => beobachteMerker(() => geaendert()),
    sprachangebotFaellig,
    sprachangebotFaellig,
  );
}
