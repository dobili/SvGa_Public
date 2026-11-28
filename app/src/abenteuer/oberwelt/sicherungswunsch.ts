/**
 * Verbindung zwischen Spielmenü und Oberwelt fürs Speichern (Sicherungen des Lesers, Wunsch des
 * Autors, 28.11.2026), wie wartewunsch.ts fürs Warten.
 *
 * Warum: Die Oberwelt schreibt Position und Spielzeit erst beim Verlassen der Karte oder wenn die
 * App in den Hintergrund geht (useWeltladen.ts). Eine Sicherung soll den Helden aber genau dort
 * festhalten, wo er gerade steht. Die Oberwelt meldet hier, wie sie ihren Stand jetzt liefert;
 * das Spielmenü (anbindung/Spielmenue.tsx) fragt beim Tipp auf „Speichern“ danach.
 * Rolle im Gesamtbild: Bindeglied ohne React-Kontext. Abhängigkeiten: schnittstelle/spielstand.ts.
 */
import type { Abenteuerstand } from "../schnittstelle/spielstand";

/** Liefert den Stand mit der Position von jetzt; null ohne Welt. */
type Standquelle = () => Abenteuerstand | null;

let quelle: Standquelle | null = null;

/** Die Oberwelt meldet ihre Quelle an (null beim Abbau der Karte). */
export function meldeStandquelle(neu: Standquelle | null): void {
  quelle = neu;
}

/**
 * Der Stand zum Sichern, mit Position und Spielzeit von jetzt; null, wenn keine Welt steht.
 * Die Spielzeit seit dem letzten Schreiben zählt die Oberwelt danach von vorn, weil der Stand
 * gleich geschrieben wird (useSpeicherplaetze.ts, sichere).
 */
export function standZumSichern(): Abenteuerstand | null {
  return quelle?.() ?? null;
}
