/**
 * „Nicht jetzt“ für „Dein nächster Schritt“ (Gamifizierung P1): Die Karte bleibt bis zum nächsten
 * Tag ausgeblendet.
 *
 * Rolle im Gesamtbild: Der Merker hält den Tag, an dem der Leser „Nicht jetzt“ gewählt hat; die
 * Liste STARTKARTEN fragt hier, ob die Karte heute erscheint. Ein Merker genügt, weil das
 * Ausblenden nur eine Bequemlichkeit ist und verloren gehen darf (gamifizierung.md P1: kein
 * Speicherfeld).
 * Abhängigkeiten: app/merker.ts, training/kurzplaene.ts (Tagesschlüssel).
 */
import { liesMerker, schreibeMerker } from "../../../app/merker";
import { tagesschluessel } from "../../../training/kurzplaene";

/** Name des Merkers; Wert ist der Tagesschlüssel, etwa „2026-10-31“. */
export const MERKER_NAECHSTER_AUS = "naechsterSchrittAus";

/**
 * Erscheint die Karte an diesem Tag? Nein nur am Tag von „Nicht jetzt“.
 * Beispiel: „Nicht jetzt“ am 31.10. → am 31.10. nein, am 1.11. wieder ja.
 */
export function naechsterSchrittSichtbar(jetzt: Date): boolean {
  return liesMerker(MERKER_NAECHSTER_AUS) !== tagesschluessel(jetzt);
}

/** Blendet die Karte bis zum nächsten Tag aus. */
export function blendeNaechsterSchrittAus(jetzt: Date): void {
  schreibeMerker(MERKER_NAECHSTER_AUS, tagesschluessel(jetzt));
}
