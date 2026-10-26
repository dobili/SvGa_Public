/**
 * Schriftgröße der App: in Schritten von 10 % kleiner oder größer als die Vorgabe des Geräts.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (24.10.2026): Die Schrift folgt dem Gerät (alle Größen
 * in rem, basis.css), aber man will sie auch unabhängig vom System größer oder kleiner haben. Die
 * Wahl ist ein Merker auf dem Gerät (wie der Nachtmodus), denn Lesbarkeit hängt am Gerät, nicht
 * am Lernstand. Angewendet wird sie als Variable `--schriftfaktor` am Wurzelelement, die
 * basis.css in die Grundschrift einrechnet; ein kleines Skript in app/index.html setzt sie schon
 * vor dem ersten Zeichnen (gleicher Merker „svga.schriftgroesse“), damit nichts springt.
 * Abhängigkeiten: app/merker.ts, ui/stil/basis.css, app/index.html.
 */
import { liesMerker, schreibeMerker } from "./merker";

const MERKER = "schriftgroesse";
/** Schrittweite in Prozent (Wunsch des Autors: 10-%-Schritte). */
export const SCHRITT = 10;
/** Kleinste Schrift in Prozent der Gerätevorgabe. */
export const KLEINSTE = 80;
/** Größte Schrift in Prozent der Gerätevorgabe. */
export const GROESSTE = 150;
/** Schrift wie vom Gerät vorgegeben (100 %), die Grundeinstellung. */
export const NORMAL = 100;
const PROZENT = 100;

/** Rundet auf einen gültigen Schritt innerhalb der Grenzen. Beispiel: 123 → 120, 170 → 150. */
export function gueltig(prozent: number): number {
  const gerundet = Math.round(prozent / SCHRITT) * SCHRITT;
  return Math.max(KLEINSTE, Math.min(GROESSTE, gerundet));
}

/** Die gespeicherte Schriftgröße in Prozent; ohne Wahl (oder unbrauchbar) 100. */
export function liesSchriftgroesse(): number {
  const wert = Number(liesMerker(MERKER));
  return Number.isFinite(wert) && wert > 0 ? gueltig(wert) : NORMAL;
}

/** Setzt die Variable am Wurzelelement; bei 100 % entfällt sie (reine Gerätevorgabe). */
export function wendeSchriftgroesseAn(prozent: number = liesSchriftgroesse()): void {
  const wurzel = document.documentElement;
  if (prozent === NORMAL) wurzel.style.removeProperty("--schriftfaktor");
  else wurzel.style.setProperty("--schriftfaktor", String(prozent / PROZENT));
}

/**
 * Speichert die Wahl und wendet sie sofort an. Beispiel: setzeSchriftgroesse(120) → alle Texte
 * und Abstände in rem um ein Fünftel größer, das Brett passt sich der Breite an.
 */
export function setzeSchriftgroesse(prozent: number): number {
  const wert = gueltig(prozent);
  schreibeMerker(MERKER, String(wert));
  wendeSchriftgroesseAn(wert);
  return wert;
}
