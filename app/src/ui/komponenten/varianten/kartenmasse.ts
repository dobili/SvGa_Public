/**
 * Maße der Variantenkarte: Abstand der Spalten und Zeilen, Größe der Knoten, Mitte eines Knotens
 * und Größe der ganzen Karte bei Zoom 1.
 *
 * Rolle im Gesamtbild: Kartenflaeche.tsx zeichnet damit, die Knöpfe „Alles zeigen“ und „Zur
 * Stellung“ rechnen damit; eigene Datei, damit die Komponentendatei nur Komponenten ausgibt.
 * Abhängigkeiten: schach/baumlayout.ts (Typen).
 */
import type { Kartenknoten, Kartenlayout } from "../../../schach/baumlayout";

/** Maße der Karte in Bildpunkten bei Zoom 1. */
export const KARTE = { spalte: 88, zeile: 50, breite: 76, hoehe: 32, rand: 24, ecke: 8 } as const;
/** Radius des Kommentarpunkts und sein Abstand von der Ecke. */
export const PUNKT = { radius: 3.5, abstand: 7 } as const;
/** Grundlinie der Schrift relativ zur Mitte des Knotens. */
export const SCHRIFTVERSATZ = 4.5;

/** Mitte eines Knotens auf der Karte (bei Zoom 1). */
export function knotenmitte(k: Pick<Kartenknoten, "spalte" | "zeile">): { x: number; y: number } {
  return {
    x: KARTE.rand + k.spalte * KARTE.spalte + KARTE.breite / 2,
    y: KARTE.rand + k.zeile * KARTE.zeile + KARTE.hoehe / 2,
  };
}

/** Größe der ganzen Karte (bei Zoom 1). */
export function kartengroesse(layout: Kartenlayout): { breite: number; hoehe: number } {
  return {
    breite: 2 * KARTE.rand + (layout.spalten - 1) * KARTE.spalte + KARTE.breite,
    hoehe: 2 * KARTE.rand + (layout.zeilen - 1) * KARTE.zeile + KARTE.hoehe,
  };
}
