/**
 * Merker „Gerät des Autors“: gesetzt, sobald auf diesem Gerät die Aufgabenseite geöffnet wurde.
 *
 * Warum (Entscheidung F2 des Hauptchats, 20.11.2026, docs/spiel/auftraege/vor_main_checkliste.md):
 * Bis 1.0 baut main die Fassung des Autors mit Aufgabenseite. Kommt das Schach-Abenteuer dorthin,
 * sähe jeder unter /app/#abenteuer die Testleiste („Gewinnen“, „Bestehen“ …). Die Aufgabenseite
 * öffnet nur, wer drei Sekunden auf „Profil“ drückt oder #aufgaben kennt, also praktisch nur der
 * Autor. Ab dann zeigt dieses Gerät die Testhilfen, auf main wie auf beta; Leser sehen sie nie.
 * Rolle im Gesamtbild: Bequemlichkeit im Gerätespeicher (app/merker.ts), keine Nutzerdaten; „Alle
 * Daten löschen“ entfernt ihn mit. Abhängigkeiten: app/merker.ts.
 */
import { liesMerker, schreibeMerker } from "../app/merker";

/** Name des Merkers (im Gerätespeicher als „svga.autorgeraet“). */
export const MERKER_AUTORGERAET = "autorgeraet";
const GESETZT = "ja";

/** Merkt sich, dass dieses Gerät dem Autor gehört (beim Öffnen der Aufgabenseite). */
export function merkeAutorgeraet(): void {
  if (liesMerker(MERKER_AUTORGERAET) !== GESETZT) schreibeMerker(MERKER_AUTORGERAET, GESETZT);
}

/**
 * Wurde auf diesem Gerät die Aufgabenseite schon einmal geöffnet?
 * Sonderfall: Ein gesperrter Gerätespeicher (privates Fenster) ergibt nein.
 */
export function istAutorgeraet(): boolean {
  return liesMerker(MERKER_AUTORGERAET) === GESETZT;
}
