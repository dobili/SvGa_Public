/**
 * Zählrechnung der Münzanzeige (oberwelt/Muenzanzeige.tsx): welche Zahl während des Hoch- oder
 * Herunterzählens gerade steht.
 *
 * Warum (Wunsch des Autors, 20.11.2026): Die Münzen liefen oben dauerhaft mit. Jetzt erscheinen sie
 * nur, wenn sich die Zahl ändert; man sieht sie beim Bekommen hochzählen und beim Ausgeben
 * herunterzählen, danach blendet die Anzeige aus. Die Rechnung ist rein, damit sie ohne Browser
 * testbar ist.
 */

/** So lange zählt die Anzeige von der alten zur neuen Zahl. */
export const ZAEHLDAUER_MS = 900;
/** So lange bleibt die Anzeige nach dem Zählen stehen, bevor sie ausblendet. */
export const SICHTBAR_MS = 3000;

/**
 * Die Zahl nach `anteil` (0 bis 1) der Zähldauer, gerundet zur Zielzahl hin und mit sanftem
 * Auslaufen. Eingaben: alte Zahl, neue Zahl, Anteil. Ausgabe: ganze Zahl zwischen beiden.
 * Beispiel: 50 → 70 bei 0 ergibt 50, bei 1 ergibt 70, dazwischen steigt sie und erreicht 70 erst
 * am Ende. Sonderfall: Anteil außerhalb 0 bis 1 wird begrenzt.
 */
export function zwischenwert(von: number, nach: number, anteil: number): number {
  const t = Math.min(1, Math.max(0, anteil));
  // Auslaufen (ease-out): am Anfang schnell, zum Ende langsam, damit die letzte Zahl lesbar steht.
  const weich = 1 - (1 - t) ** 3;
  const wert = von + (nach - von) * weich;
  return nach >= von ? Math.floor(wert) : Math.ceil(wert);
}
