/**
 * Zeichentiefe der Möbel und Gebäude auf der Oberwelt (ohne Phaser, damit sie testbar ist).
 * Rolle im Gesamtbild: oberwelt/moebel.ts setzt damit die Tiefe jedes Bildes; Figuren haben als
 * Tiefe ihre Fußlinie und stehen so vor allem, dessen Unterkante über ihnen liegt.
 */
import type { Moebel } from "./moebel";

/**
 * Tiefe eines Bildes der Bodenebene (`ebene: "boden"` im Katalog): wie flache Möbel des Kartenbaus
 * (pipeline/abenteuer/kartenbau.py, Tiefe 1), unter jeder Figur.
 */
export const BODENTIEFE = 1;
const ZUSCHNITT_OBEN = 1;

/**
 * Die Sortierlinie eines Möbels in Kartenpixeln oder undefined (Katalogfeld `sortierlinie`, Pixel ab
 * der Oberkante des Katalogbilds; pipeline/abenteuer/konturkollision.py, KARTENREGELN 10.95).
 * Warum: Steht der Fuß des Helden unter der Linie, gehört er vor das Bild, darüber dahinter; die
 * Linie folgt der Kontur des Bildes statt dem Kachelraster der Maske (Auftrag des Autors,
 * 28.11.2026: Stuhl, Laterne). Mit Zuschnitt rückt sie um den oberen Rand, mit Maßstab wächst sie;
 * gedreht gilt sie nicht (undefined, dann die Regel der Maske).
 * Beispiel: Laterne auf y 400 mit sortierlinie 64 → 464; mit Maßstab 0,75 → 448.
 */
export function sortierlinie(m: Moebel): number | undefined {
  const linie = m.angabe.sortierlinie;
  if (typeof linie !== "number" || (m.form && m.form.drehung !== 0)) return undefined;
  const oben = m.form?.zuschnitt?.[ZUSCHNITT_OBEN] ?? 0;
  return m.y + Math.max(0, linie - oben) * (m.form?.massstab ?? 1);
}

/**
 * Zeichentiefe eines Möbels: die Mitte seiner untersten Kachelreihe, damit Figuren davor stehen.
 * Warum die Maske zählt: Bei Häusern mit Veranda oder Stufen im Bild (Whitlock-Haus) sind die
 * untersten Reihen begehbar; die Figur stand dort im Bild und wurde vom Haus verdeckt. Hat die Maske
 * eine ganz gesperrte Reihe, zählt deshalb die Reihe darunter als Unterkante (die Figur steht dort
 * vor der Fassade). Ohne ganz gesperrte Reihe zählt die letzte Reihe mit einer Sperre: Ganz freie
 * Reihen darunter (Stufen vor dem Seiteneingang der Bibliothek in Cedar Creek) liegen vor dem Bild.
 * Ohne Maske oder ohne jede Sperre bleibt die Bildunterkante.
 * Auch mit Form (Maßstab, Drehung, Zuschnitt aus dem Karteneditor): `angabe` ist dann schon geformt,
 * die Maske liegt im Kachelraster des geformten Bildes (moebelform.ts, Maske am Kartenobjekt).
 * Warum (Notiz des Autors, 20.11.2026, Foto): Die Villen in Maple Falls stehen mit Maßstab 1,1; für
 * sie galt bisher immer die Bildunterkante, und das Haus des Helden lag über ihm, wenn er vor der
 * Haustür stand.
 * Beispiel: Whitlock-Haus 13 Reihen, Reihe 9 ganz gesperrt → Tiefe y + 10 · 16 − 8.
 * Vorrang (Kontur, 28.11.2026): Bodenebene (BODENTIEFE), dann die Sortierlinie des Katalogs, dann
 * die Regel der Maske.
 */
export function zeichentiefe(m: Moebel, kachel: number): number {
  if (m.angabe.ebene === "boden") return BODENTIEFE;
  const linie = sortierlinie(m);
  if (linie !== undefined) return linie;
  const unten = m.y + m.angabe.hoehe - kachel / 2;
  const maske = m.angabe.maske;
  if (!maske) return unten;
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
