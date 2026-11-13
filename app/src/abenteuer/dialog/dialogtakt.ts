/**
 * Takt des Dialogs: wie lange eine Zeile stehen bleibt, bevor „Weiter“ wieder geht (Marke `#pause`).
 *
 * Rolle im Gesamtbild: Technik für Atmosphäre T3 (docs/spiel/23_Technik_Atmosphaere.md). Der Roman
 * zu Akt 1 braucht echte Pausen („drei Sekunden vollkommene Stille“, Kapitel 13); bis 13.11.2026
 * stand `#pause` in 49 Zeilen, wirkte aber nicht. Reine Logik für dialog/Dialog.tsx.
 * Abhängigkeiten: keine.
 */

/** Dauer von `#pause` ohne Angabe, in Sekunden. */
export const PAUSE_STANDARD_S = 1;
/** Längste erlaubte Pause, in Sekunden: länger wirkt wie ein hängendes Spiel. */
export const PAUSE_HOECHSTENS_S = 10;
const MS_JE_S = 1000;
/** Wert einer Marke ohne Doppelpunkt (dialog/geschichte.ts, tagsAus). */
const OHNE_WERT = "ja";

/**
 * Wie lange die Zeile mit diesen Marken „Weiter“ sperrt, in Millisekunden; 0 ohne `#pause`.
 *
 * Eingaben: die Marken der Zeile (`{ pause: "3" }`). Ausgabe: Millisekunden.
 * Beispiele: `#pause` → 1000; `#pause:3` → 3000; `#pause:1,5` und `#pause:1.5` → 1500.
 * Sonderfälle: Unlesbare oder negative Angaben gelten als Standard; mehr als zehn Sekunden werden
 * auf zehn gekürzt.
 */
export function pausendauer(tags: Readonly<Record<string, string>>): number {
  const wert = tags.pause;
  if (wert === undefined) return 0;
  const zahl = wert === OHNE_WERT ? PAUSE_STANDARD_S : Number(wert.replace(",", "."));
  const sekunden = Number.isFinite(zahl) && zahl > 0 ? zahl : PAUSE_STANDARD_S;
  return Math.round(Math.min(sekunden, PAUSE_HOECHSTENS_S) * MS_JE_S);
}
