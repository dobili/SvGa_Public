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
 * vor der Fassade). Ohne ganz gesperrte Reihe zählt die letzte Reihe mit einer Sperre: Ganz freie
 * Reihen darunter (Stufen vor dem Seiteneingang der Bibliothek in Cedar Creek) liegen vor dem Bild.
 * Ohne Maske, mit Form oder ohne jede Sperre bleibt die Bildunterkante.
 * Beispiel: Whitlock-Haus 13 Reihen, Reihe 9 ganz gesperrt → Tiefe y + 10 · 16 − 8.
 */
export function zeichentiefe(m: Moebel, kachel: number): number {
  const unten = m.y + m.angabe.hoehe - kachel / 2;
  const maske = m.angabe.maske;
  if (!maske || m.form) return unten;
  const letzte = (passt: (zeile: string) => boolean) =>
    maske.reduce((gefunden, zeile, reihe) => (passt(zeile) ? reihe : gefunden), -1);
  const letzteVolle = letzte((zeile) => zeile.length > 0 && !zeile.includes("."));
  const reihe = letzteVolle >= 0 ? letzteVolle : letzte((zeile) => zeile.includes("#"));
  if (reihe < 0) return unten;
  return Math.min(unten, m.y + (reihe + 1) * kachel - kachel / 2);
}

/**
 * Zeichentiefe eines Möbels mit der Tiefe aus der Karte. Warum: Der Kartenbauer schreibt jedem
 * Möbel eine Tiefe in die Tiled-Karte, als Vorgabe die Bildunterkante (pipeline/abenteuer/
 * kartenbau.py: y + Höhe − halbe Kachel). Diese Vorgabe verdeckte den Helden vor dem Whitlock-Haus
 * weiter (Spieltest Variante B, 16.11.2026: Tiefe 360, Held an der Tür auf 328), weil die Regel der
 * Maske nie griff. Die Vorgabe zählt deshalb wie eine fehlende Angabe; eine eigene Tiefe (an der
 * Wand, auf dem Tisch, Ebene aus dem Karteneditor) bleibt.
 * Beispiel: Whitlock-Haus auf y 160, Höhe 208, Tiefe 360 aus der Karte → 312 (Reihe 9 ganz gesperrt).
 */
export function moebeltiefe(m: Moebel, kachel: number): number {
  const vorgabe = m.y + m.angabe.hoehe - kachel / 2;
  if (m.tiefe === undefined || m.tiefe === vorgabe) return zeichentiefe(m, kachel);
  return m.tiefe;
}
