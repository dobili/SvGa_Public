/**
 * Wann die Wochenkarte erscheint und der Merker für „Später“ (Gamifizierung P4).
 *
 * Rolle im Gesamtbild: Mit Wochenziel steht die Karte immer oben im Buch (Rang 20 in STARTKARTEN).
 * Ohne Ziel fragt sie erst, wenn der Leser schon einmal gelernt hat (beim allerersten Start nicht,
 * damit der Einstieg ruhig bleibt), und nach „Später“ erst in der nächsten Woche wieder.
 * Abhängigkeiten: app/merker.ts, speicher/aktivitaet.ts, training/wochenziel.ts.
 */
import { liesMerker, schreibeMerker } from "../../../app/merker";
import { lerntage, wochenbeginn } from "../../../speicher/aktivitaet";
import type { Nutzerdaten } from "../../../speicher/format";
import { tagesschluessel } from "../../../training/kurzplaene";

/** Merker: Montag der Woche, in der „Später“ getippt wurde. */
export const MERKER_WOCHENZIEL_SPAETER = "wochenzielSpaeter";

/** Montag der Woche (Tagesschlüssel). */
function montag(jetzt: Date): string {
  return tagesschluessel(wochenbeginn(jetzt));
}

/** Merkt „Später“ für die laufende Woche. */
export function merkeSpaeter(jetzt: Date): void {
  schreibeMerker(MERKER_WOCHENZIEL_SPAETER, montag(jetzt));
}

/**
 * Soll die Wochenkarte erscheinen? Mit Ziel immer; ohne Ziel nach dem ersten Lerntag und nicht in
 * der Woche, in der „Später“ getippt wurde.
 * Beispiel: frischer Start ohne Lerntag → false; eine Abbildung angesehen → true.
 */
export function wochenkarteSichtbar(daten: Nutzerdaten, jetzt: Date): boolean {
  if (daten.wochen.ziel !== null) return true;
  if (liesMerker(MERKER_WOCHENZIEL_SPAETER) === montag(jetzt)) return false;
  return lerntage(daten.aktivitaet, "", tagesschluessel(jetzt)).length > 0;
}
