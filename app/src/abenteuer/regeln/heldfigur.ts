/**
 * Figur des Helden: Held oder Heldin (Wunsch des Autors, 22.11.2026: „Am Anfang optional eine
 * Heldin wählbar machen“).
 *
 * Warum nur ein Bild: Die Dialoge sind geschlechtsneutral (Stilregel 5.2, Dokument 02: Name
 * wählbar, keine Substantive mit Geschlecht für {held}; Dauertest pipeline/abenteuer/heldneutral.py).
 * Die Wahl ändert deshalb nur den Figurenbogen in der Welt. Die Heldin erstellt der Autor noch in
 * PixelLab; solange ihr Bogen im Paket fehlt, zeigt die Welt den Helden (weltdaten.ts) und die
 * Wahl einen Platzhalter (anbindung/Heldwahl.tsx).
 * Rolle im Gesamtbild: regeln/spielstand.ts liest das Feld `held.figur`; weltdaten.ts lädt den Bogen.
 * Abhängigkeiten: schnittstelle/spielstand.ts (Typ).
 */
import type { Heldfigur } from "../schnittstelle/spielstand";

/** Die wählbaren Figuren in der Reihenfolge der Wahl. */
export const HELDFIGUREN: readonly Heldfigur[] = ["held-0", "heldin-0"];

/** Figur ohne Wahl und Ersatz, solange ein Bogen fehlt. */
export const ERSATZFIGUR: Heldfigur = "held-0";

/**
 * Die Figur aus Rohdaten des Spielstands. Sonderfall: Ältere Stände hatten `variante: 0` statt
 * `figur`; sie und alles Unbekannte werden zum Helden.
 * Beispiel: heldfigurAus("heldin-0") → "heldin-0"; heldfigurAus(undefined) → "held-0".
 */
export function heldfigurAus(roh: unknown): Heldfigur {
  return HELDFIGUREN.find((f) => f === roh) ?? ERSATZFIGUR;
}

/**
 * Pfad des Bogens im Paket (alter Ordner; figurbogen.ts sucht zuerst unter figuren32/).
 * Beispiel: heldbogenpfad("heldin-0") → "figuren/heldin-0.png".
 */
export function heldbogenpfad(figur: Heldfigur): string {
  return `figuren/${figur}.png`;
}
