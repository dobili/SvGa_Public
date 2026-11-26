/**
 * Eingangsdialog einer Karte: ein Dialog, der beim Betreten von selbst läuft (Feld `eingang` in
 * orte.json), solange seine Bedingung gilt.
 *
 * Rolle im Gesamtbild: Die Oberwelt (oberwelt/Oberwelt.tsx) fragt nach dem Laden einer Karte hier
 * nach und öffnet den Dialog wie einen angesprochenen Auslöser. Die Bedingung schreibt der Dialog
 * selbst falsch (etwa `einleitungGesehen = true`), sonst liefe er bei jedem Betreten.
 * Warum: Wunsch des Autors (19.11.2026): Das Spiel beginnt mit einer Einleitung vor dem Haus und
 * dem Gespräch mit Mama im Wohnzimmer, statt den Spieler auf den Dachboden zu werfen.
 * Ankunft zu Fuß (26.11.2026): Ein Übergang mit `nachher` (orte.json) merkt sich seinen Dialog
 * hier, wechselt die Karte, und der Dialog läuft dann auf der Zielkarte wie ein Eingang. So sieht
 * man, was der Ankunftstext beschreibt, und die Kamera kann dorthin schwenken (schwenk.ts).
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

/** Der Dialog einer Ankunft zu Fuß, der nach dem Wechsel laufen soll (einer zur Zeit). */
let ankunft: string | null = null;

/**
 * Läuft der Dialog dieses Übergangs nach dem Wechsel? Ja mit `nachher`, wenn seine Bedingung gilt
 * (sonst bleibt der Held, und der Dialog sagt, warum: wie bisher vor dem Wechsel). Merkt ihn vor.
 * Beispiel: weiterCedar (nachher) → true, „cedar-creek-aussen.ankunft_zu_fuss“ ist vorgemerkt.
 */
export function ankunftNachher(
  uebergang: { readonly dialog?: string; readonly nachher?: boolean; readonly wenn?: string },
  bedingungen: Readonly<Record<string, unknown>>,
): boolean {
  if (!uebergang.nachher || !uebergang.dialog) return false;
  if (uebergang.wenn && !erfuellt(uebergang.wenn, bedingungen)) return false;
  ankunft = uebergang.dialog;
  return true;
}

/**
 * Der Dialog beim Betreten: eine vorgemerkte Ankunft (einmal), sonst der Eingang der Karte.
 * Eingaben und Sonderfälle wie eingangsdialog.
 */
export function dialogBeimBetreten(
  ort: Ortdaten,
  karte: string,
  variablen: Readonly<Record<string, unknown>>,
): string | null {
  const vorgemerkt = ankunft;
  ankunft = null;
  return vorgemerkt ?? eingangsdialog(ort, karte, variablen);
}
