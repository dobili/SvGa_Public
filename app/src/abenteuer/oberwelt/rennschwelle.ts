/**
 * Rennschwelle am Bildschirmrand (Befund des Autors, 24.11.2026 mittags: „Sprinten nach rechts
 * lässt sich im Hochformat nicht auslösen“).
 *
 * Warum: Rennen beginnt, wenn der Finger das 1,4-Fache des Tastenabstands (78 px) von der Mitte
 * des Kreuzes entfernt ist (gangart.ts). Das Kreuz steht 16 px vom Rand, seine Mitte also 96 px.
 * Zum nahen Rand blieben dem Finger damit nur die letzten 18 px, und dort liegen der gerundete
 * Geräterand und die Wischgesten des Systems: Rennen nach rechts (hoch) und nach links (quer, das
 * Kreuz steht dort links) ging praktisch nicht. Zu den anderen Seiten ist reichlich Platz.
 * Lösung: Die Schwelle rückt zum Rand hin nach innen, sodass vor dem Rand mindestens
 * RAND_RESERVE_PX frei bleiben, aber nie unter KLEINSTE_SCHWELLE (sonst rennte schon ein Druck auf
 * die Mitte der Pfeiltaste). Wo genug Platz ist, bleibt alles wie bisher. Das Kreuz bleibt, wo
 * der Autor es hingestellt hat.
 * Abhängigkeiten: gangart.ts (RENNEN_AB, TASTENABSTAND_PX).
 */
import { RENNEN_AB, TASTENABSTAND_PX } from "./gangart";

/** So viel Platz bleibt zwischen Schwelle und Bildschirmrand (CSS-Pixel). */
export const RAND_RESERVE_PX = 24;
/** Kleinste Schwelle als Vielfaches des Tastenabstands (64 px): über der Mitte der Pfeiltaste. */
export const KLEINSTE_SCHWELLE = 1.15;

/** Ein Punkt in Bildschirmkoordinaten. */
export interface Punkt {
  readonly x: number;
  readonly y: number;
}

/** Breite und Höhe des sichtbaren Bildes. */
export interface Bildgroesse {
  readonly breite: number;
  readonly hoehe: number;
}

/**
 * Abstand von der Mitte des Kreuzes bis zum Bildschirmrand in der Richtung, in die der Finger
 * zieht (die stärkere Achse von dx, dy).
 * Beispiel: Mitte (294, 600) auf 390 × 844, Finger nach rechts → 96.
 */
export function randabstand(dx: number, dy: number, mitte: Punkt, bild: Bildgroesse): number {
  if (Math.abs(dx) >= Math.abs(dy)) return dx >= 0 ? bild.breite - mitte.x : mitte.x;
  return dy >= 0 ? bild.hoehe - mitte.y : mitte.y;
}

/**
 * Ab welchem Vielfachen des Tastenabstands der Finger in dieser Richtung rennt.
 * Beispiel: 96 px bis zum Rand → (96 − 24) / 56 ≈ 1,29; 200 px → 1,4; 60 px → 1,15.
 */
export function rennenAbZumRand(abstand: number, tastenabstand = TASTENABSTAND_PX): number {
  const passt = (abstand - RAND_RESERVE_PX) / tastenabstand;
  return Math.min(RENNEN_AB, Math.max(KLEINSTE_SCHWELLE, passt));
}
