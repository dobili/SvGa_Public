/**
 * Sprachwahl der App: Startsprache, Wechsel durch den Leser, Abonnement für React.
 *
 * Rolle im Gesamtbild: Technik für die englische Fassung (AP 18, seit 0.2.94). Die Wahl des
 * Lesers liegt als Merker auf dem Gerät (wie Koordinaten und Wischen): Sie muss beim Start sofort
 * da sein, bevor die Nutzerdaten aus IndexedDB geladen sind, und folgt ohne Wahl der Sprache des
 * Geräts. Ein Wechsel vergisst die geladenen Buch- und Trainerdaten; App.tsx zeichnet die ganze
 * Oberfläche neu, sodass jeder Bildschirm die Daten der neuen Sprache lädt.
 * Abhängigkeiten: i18n/sprache.ts, app/merker.ts, daten/laden.ts, daten/trainerdaten.ts, React.
 */
import { useSyncExternalStore } from "react";
import { vergissBuchdaten } from "../daten/laden";
import { vergissTrainerdaten } from "../daten/trainerdaten";
import { beiSprachwechsel, setzeSprache, sprache, startsprache } from "../i18n/sprache";
import { liesMerker, schreibeMerker } from "./merker";

/** Name des Merkers mit der Wahl des Lesers; fehlt er, gilt die Sprache des Geräts. */
export const MERKER_SPRACHE = "sprache";

/** Die Sprachen des Geräts in Vorzugsreihenfolge (ohne Angabe: keine). */
function geraetesprachen(): readonly string[] {
  if (typeof navigator === "undefined") return [];
  return navigator.languages.length > 0 ? navigator.languages : [navigator.language];
}

/** Setzt beim Start die Sprache (Wahl des Lesers, sonst Gerät) und `<html lang>`. */
export function starteSprache(): void {
  setzeSprache(startsprache(liesMerker(MERKER_SPRACHE), geraetesprachen()));
  document.documentElement.lang = sprache();
}

/**
 * Wechselt die Sprache auf Wunsch des Lesers und merkt die Wahl.
 * Beispiel: „en“ → Texte, Buchdaten und `<html lang="en">` auf Englisch.
 */
export function waehleSprache(sprachcode: string): void {
  schreibeMerker(MERKER_SPRACHE, sprachcode);
  vergissBuchdaten();
  vergissTrainerdaten();
  setzeSprache(sprachcode);
}

/** Die Sprache der App; die Komponente zeichnet sich bei einem Wechsel neu. */
export function useSprache(): string {
  return useSyncExternalStore(beiSprachwechsel, sprache, sprache);
}
