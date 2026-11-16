/**
 * Zeichentiefe der Möbel und Gebäude auf der Oberwelt (ohne Phaser, damit sie testbar ist).
 * Rolle im Gesamtbild: oberwelt/moebel.ts setzt damit die Tiefe jedes Bildes; Figuren haben als
 * Tiefe ihre Fußlinie und stehen so vor allem, dessen Unterkante über ihnen liegt.
 */
import type { Moebel } from "./moebel";

/**
 * Zeichentiefe eines Möbels: die Mitte seiner untersten Kachelreihe, damit Figuren davor stehen.
 * Warum die Maske zählt: Bei Häusern mit Veranda oder Stufen im Bild (Whitlock-Haus) sind die
 * untersten Reihen begehbar; die Figur stand dort im Bild und wurde vom Haus verdeckt. Hat die Maske
 * eine ganz gesperrte Reihe, zählt deshalb die Reihe darunter als Unterkante (die Figur steht dort
 * vor der Fassade). Ohne Maske, mit Form oder ohne ganz gesperrte Reihe bleibt die Bildunterkante.
 * Beispiel: Whitlock-Haus 13 Reihen, Reihe 9 ganz gesperrt → Tiefe y + 10 · 16 − 8.
 */
export function zeichentiefe(m: Moebel, kachel: number): number {
  const unten = m.y + m.angabe.hoehe - kachel / 2;
  const maske = m.angabe.maske;
  if (!maske || m.form) return unten;
  const letzteVolle = maske.reduce(
    (gefunden, zeile, reihe) => (zeile.length > 0 && !zeile.includes(".") ? reihe : gefunden),
    -1,
  );
  if (letzteVolle < 0) return unten;
  return Math.min(unten, m.y + (letzteVolle + 1) * kachel - kachel / 2);
}
