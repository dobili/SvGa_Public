/**
 * Eingangsdialog einer Karte: ein Dialog, der beim Betreten von selbst läuft (Feld `eingang` in
 * orte.json), solange seine Bedingung gilt.
 *
 * Rolle im Gesamtbild: Die Oberwelt (oberwelt/Oberwelt.tsx) fragt nach dem Laden einer Karte hier
 * nach und öffnet den Dialog wie einen angesprochenen Auslöser. Die Bedingung schreibt der Dialog
 * selbst falsch (etwa `einleitungGesehen = true`), sonst liefe er bei jedem Betreten.
 * Warum: Wunsch des Autors (19.11.2026): Das Spiel beginnt mit einer Einleitung vor dem Haus und
 * dem Gespräch mit Mama im Wohnzimmer, statt den Spieler auf den Dachboden zu werfen.
 * Abhängigkeiten: regeln/bedingung.ts (Sprache der Bedingungen), daten/laden.ts (Ortdaten).
 */
import type { Ortdaten } from "../daten/laden";
import { erfuellt } from "../regeln/bedingung";

/**
 * Der Dialog („datei.knoten“), der beim Betreten dieser Karte von selbst läuft, oder null.
 *
 * Eingaben: Ort, Kennung der Karte und die Dialogvariablen des Spielstands.
 * Beispiel: mapleFalls.aussen mit {} → „maple-falls-aussen.einleitung“; mit
 * { einleitungGesehen: true } → null. Sonderfälle: Karte ohne `eingang` oder unbekannte Karte → null.
 */
export function eingangsdialog(
  ort: Ortdaten,
  karte: string,
  variablen: Readonly<Record<string, unknown>>,
): string | null {
  const eingang = ort.karten.find((k) => k.kennung === karte)?.eingang;
  if (!eingang) return null;
  return erfuellt(eingang.wenn, variablen) ? eingang.dialog : null;
}
