/**
 * Kurze Eingabepause nach einem Kartenwechsel (Befund des Autors, 10.11.2026).
 *
 * Warum: Wer mit gehaltener Pfeiltaste durch eine Tür geht, lief im neuen Raum sofort weiter,
 * oft gleich in den nächsten Auslöser oder gegen ein Möbel. Nach jedem Kartenwechsel (und nach
 * dem Versetzen auf derselben Karte) bleibt der Held deshalb kurz stehen: bis die Zeit um ist
 * oder die Taste einmal losgelassen wurde, je nachdem, was zuerst kommt.
 * Rolle im Gesamtbild: reine Logik für oberwelt/szene.ts (getestet in eingabepause.test.ts),
 * dazu die Pfeiltasten der Szene ohne abgefangene Leertaste (pfeiltasten).
 * Beispiel: Rest 350 ms, Bild nach 16 ms mit gehaltener Taste → Rest 334 ms, der Held steht.
 */

import type Phaser from "phaser";

/** Tastencodes, die die Szene nicht braucht und deshalb nicht abfängt (Leertaste, Umschalttaste). */
const LEERTASTE = 32;
const UMSCHALTTASTE = 16;

/**
 * Die Pfeiltasten der Szene. createCursorKeys fängt auch Leertaste und Umschalttaste im ganzen
 * Dokument ab; die Szene braucht sie nicht, und so löste die Leertaste in keinem Fenster
 * (Tagebuch, Gespräch) einen Knopf aus (Prüfung „zugang“, 19.11.2026). Die Pfeiltasten bleiben
 * gefangen, damit die Seite beim Laufen nicht scrollt. Ohne Tastatur: null.
 */
export function pfeiltasten(
  tastatur: Phaser.Input.Keyboard.KeyboardPlugin | null | undefined,
): Phaser.Types.Input.Keyboard.CursorKeys | null {
  if (!tastatur) return null;
  const tasten = tastatur.createCursorKeys();
  tastatur.removeCapture([LEERTASTE, UMSCHALTTASTE]);
  return tasten;
}

/** Dauer der Pause in Millisekunden (spürbar, aber kürzer als ein bewusster Tastendruck). */
export const EINGABEPAUSE_MS = 350;

/** Die Gegenrichtung einer Blickrichtung („oben“ ↔ „unten“, „links“ ↔ „rechts“). */
export function gegenrichtung(richtung: string): string {
  return { oben: "unten", unten: "oben", links: "rechts", rechts: "links" }[richtung] ?? richtung;
}

/**
 * Ein Bild der Szene: der neue Rest der Pause. 0 heißt: Eingaben gelten wieder.
 * Eingaben: bisheriger Rest, vergangene Zeit seit dem letzten Bild, ob gerade eine Richtung
 * gedrückt ist, und ob sie zurück in den Durchgang zeigt, aus dem der Held kam.
 * Sonderfälle: Ist nichts gedrückt, endet die Pause sofort (die Taste war los). Zeigt die
 * gehaltene Taste zurück in den Durchgang, läuft die Zeit nicht ab: Sonst liefe der Held nach der
 * Pause wieder hinein und würde hin- und hergeschickt (unten an der Treppe mit „oben“ gehalten).
 */
export function pausenschritt(
  rest: number,
  delta: number,
  gedrueckt: boolean,
  zurueck = false,
): number {
  if (rest <= 0 || !gedrueckt) return 0;
  return zurueck ? rest : Math.max(0, rest - delta);
}
