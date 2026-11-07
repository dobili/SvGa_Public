/**
 * Der Startweg des Lesers („Ich lese das Buch“, „Ich will spielen“, „Erst umsehen“) und wie er die
 * Reihenfolge der Vorschläge auf der Karte „Heute“ verschiebt.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (6.11.2026, Q15-5): Die Vorschläge sollen zur Startwahl
 * passen und in den Einstellungen änderbar sein. Wer spielen will, bekommt Partie, Taktik und
 * Kurzplan zuerst, wer das Buch liest, Weiterlesen und Übungen (die Grundreihenfolge). Fällige
 * Wiederholungen bleiben immer vorn, weil sie sonst verfallen. Die Wahl liegt nur auf dem Gerät
 * (Merker, kein Speicherfeld); ohne Wahl gilt der Buchweg.
 * Abhängigkeiten: app/merker.ts.
 */
import { liesMerker, schreibeMerker } from "../app/merker";

export type Startweg = "buch" | "spielen" | "umsehen";
export const STARTWEGE: readonly Startweg[] = ["buch", "spielen", "umsehen"];

/** Merker des Startwegs auf dem Gerät. */
export const MERKER_STARTWEG = "startweg";

/**
 * Ränge, die der Spielweg vorzieht (zwischen Wiederholung, Rang 10, und Tagesaufgabe, Rang 20):
 * Partie, Muster und Schwäche aus den Partien, schwaches Thema (meist Taktik) und Kurzplan.
 */
const VORRANG_SPIELEN: Readonly<Record<string, number>> = {
  partie: 12,
  // Muster aus den Partien (Konzept „Fehler mit Buchbezug“ 4.3) vor der Phase, weil genauer.
  muster: 12.5,
  phase: 13,
  thema: 14,
  kurzplan: 16,
};

/** Der gemerkte Startweg; ohne gültigen Merker der Buchweg. */
export function liesStartweg(): Startweg {
  const wert = liesMerker(MERKER_STARTWEG);
  return STARTWEGE.find((w) => w === wert) ?? "buch";
}

/** Merkt den Startweg (Startwahl der ersten Tour, Einstellungen › Bedienung). */
export function merkeStartweg(weg: Startweg): void {
  schreibeMerker(MERKER_STARTWEG, weg);
}

/**
 * Der Rang einer Vorschlagsart für einen Startweg.
 * Beispiel: „partie“ hat Rang 90; auf dem Spielweg 12, also gleich nach den Wiederholungen.
 * Sonderfall: „Erst umsehen“ und der Buchweg behalten die Grundreihenfolge.
 */
export function rangFuerWeg(kennung: string, rang: number, weg: Startweg): number {
  return weg === "spielen" ? (VORRANG_SPIELEN[kennung] ?? rang) : rang;
}
