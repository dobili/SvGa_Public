/**
 * Takt der Schreibanimation einer Tagebuchseite (Roman Kap. 9): wie viele Zeichen nach wie viel
 * Zeit stehen. Rein, getestet; die Ansicht steht in oberwelt/Tagebuchseite.tsx.
 * Abhängigkeiten: keine.
 */

/** Millisekunden je Zeichen: langsam, wie mit der Hand geschrieben. */
export const MS_JE_ZEICHEN = 90;
/** Nach einem Satzzeichen eine Pause, so lang wie diese Zahl Zeichen. */
const PAUSE_NACH_SATZZEICHEN = 4;
const SATZZEICHEN = /[.,!?:;…]/;

/**
 * Wie viele Zeichen des Textes nach `ms` Millisekunden geschrieben sind.
 * Beispiel: „Ich will.“ nach 270 ms → 3 Zeichen. Sonderfall: nie mehr als der Text.
 */
export function geschriebeneZeichen(text: string, ms: number): number {
  let zeit = 0;
  for (let i = 0; i < text.length; i++) {
    zeit += MS_JE_ZEICHEN;
    if (zeit > ms) return i;
    if (SATZZEICHEN.test(text.charAt(i))) zeit += PAUSE_NACH_SATZZEICHEN * MS_JE_ZEICHEN;
  }
  return text.length;
}
