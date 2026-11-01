/**
 * Maße der Variantenkarte: Abstand der Spalten und Zeilen, Größe der Knoten und der Bretter an den
 * Abzweigen, Mitte eines Knotens und Größe der ganzen Karte bei Zoom 1.
 *
 * Rolle im Gesamtbild: Kartenflaeche.tsx zeichnet damit, die Knöpfe „Alles zeigen“ und „Zur
 * Stellung“ rechnen damit; eigene Datei, damit die Komponentendatei nur Komponenten ausgibt.
 * Abhängigkeiten: schach/baumlayout.ts (Typen).
 */
import type { Kartenknoten, Kartenlayout } from "../../../schach/baumlayout";

/**
 * Maße der Karte in Bildpunkten bei Zoom 1. Die Spalte ist so breit, dass das Brett eines
 * Abzweigs (ABZWEIGBRETT) zwischen die senkrechten Linien der Nachbarspalten passt.
 */
export const KARTE = { spalte: 152, zeile: 50, breite: 76, hoehe: 32, rand: 24, ecke: 8 } as const;
/**
 * Brett unter einem Abzweig: Kantenlänge und Abstand zum Knoten. Es hängt mittig unter dem Knoten
 * und füllt die BRETTZEILEN freien Zeilen (schach/baumlayout.ts): 32 + 6 + 136 < 4 × 50. Zwischen
 * Brett und den senkrechten Linien links und rechts bleiben (152 − 136) / 2 = 8 Bildpunkte.
 */
export const ABZWEIGBRETT = { groesse: 136, abstand: 6 } as const;
/**
 * Aufteilung der 136 Bildpunkte: Brett, Lücke, Bewertungsbalken rechts daneben (Wunsch des
 * Autors, 1.11.2026: „welche Variante die beste für Schwarz und welche für Weiß wäre“).
 */
export const BRETTTEILE = { brett: 124, luecke: 4, balken: 8 } as const;
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

/** Linke obere Ecke des Brettes unter einem Abzweig (bei Zoom 1). */
export function brettecke(k: Pick<Kartenknoten, "spalte" | "zeile">): { x: number; y: number } {
  const m = knotenmitte(k);
  return {
    x: m.x - ABZWEIGBRETT.groesse / 2,
    y: m.y + KARTE.hoehe / 2 + ABZWEIGBRETT.abstand,
  };
}

/** Linke obere Ecke des Endbretts rechts neben dem letzten Zug einer Linie (bei Zoom 1). */
export function endbrettecke(k: Pick<Kartenknoten, "spalte" | "zeile">): { x: number; y: number } {
  const m = knotenmitte(k);
  return { x: m.x + KARTE.breite / 2 + ABZWEIGBRETT.abstand, y: m.y - KARTE.hoehe / 2 };
}

/** Größe der ganzen Karte (bei Zoom 1); rechts und unten mit Platz für ein Endbrett. */
export function kartengroesse(layout: Kartenlayout): { breite: number; hoehe: number } {
  return {
    breite:
      2 * KARTE.rand +
      (layout.spalten - 1) * KARTE.spalte +
      KARTE.breite +
      ABZWEIGBRETT.abstand +
      ABZWEIGBRETT.groesse,
    hoehe: 2 * KARTE.rand + (layout.zeilen - 1) * KARTE.zeile + ABZWEIGBRETT.groesse,
  };
}
