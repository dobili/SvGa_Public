/**
 * Fortschritt eines Abzeichens als Anteil (Profil neu, 31.10.2026): Grundlage des Feldes
 * `fortschritt` in den Teillisten von ABZEICHEN (abzeichen-grund.ts und je Paket eine Datei).
 *
 * Rolle im Gesamtbild: Eigene Datei, damit die Teillisten sie einbinden können, ohne einen Kreis
 * über abzeichen.ts zu bilden (abzeichen.ts bindet die Teillisten ein).
 * Abhängigkeiten: speicher/fortschritt.ts (Typ Anteil).
 */
import type { Anteil } from "../../../speicher/fortschritt";

/**
 * Ein Anteil mit Obergrenze: erreicht höchstens das Ziel.
 * Beispiel: zielanteil(41, 50) → { erreicht: 41, gesamt: 50 }; zielanteil(60, 50) → 50 von 50.
 */
export function zielanteil(erreicht: number, ziel: number): Anteil {
  return { erreicht: Math.min(erreicht, ziel), gesamt: ziel };
}
