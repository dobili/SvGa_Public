/**
 * Funde für die Fensterbank (Atmosphäre T15), getrennt von der Ansicht Fensterbank.tsx.
 * Abhängigkeiten: daten/laden.ts.
 */
import type { Funddaten } from "../daten/laden";
import type { Abenteuerstand } from "../schnittstelle/spielstand";

/**
 * Die Funde in der Reihenfolge des Findens, mit ihren Daten; unbekannte Kennungen (Fund aus
 * einer älteren Fassung) fallen weg. Beispiel: [finchLaeuferA, schluessel] → beide mit Namen.
 */
export function fensterbankfunde(
  gefunden: Abenteuerstand["funde"],
  funde: readonly Funddaten[],
): Funddaten[] {
  return gefunden.flatMap((g) => funde.filter((f) => f.kennung === g.kennung).slice(0, 1));
}
