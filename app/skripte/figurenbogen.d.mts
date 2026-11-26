// Typen zu skripte/figurenbogen.mjs, damit der Komponententest sie ohne any nutzen kann.

/** Rahmengröße des Bogens in Pixeln (32). */
export const RAHMEN: number;

/** Baut den Bogen einer Figur (PNG) aus ihrem PixelLab-Ordner; null, wenn kein Bild da ist. */
export function baueFigurenbogen(ordner: string): Promise<Buffer | null>;

/** Weitere Standbilder im Bogen: erster Rahmen und Kennungen in der Ordnung des Bogens. */
export interface Standbildindex {
  readonly beginn: number;
  readonly kennungen: readonly string[];
}

/** Bogen und Index der weiteren Standbilder (figurstandbilder.mjs); null, wenn kein Bild da ist. */
export function baueFigurenbogenMitStandbildern(ordner: string): Promise<{
  readonly bild: Buffer;
  readonly standbilder: Standbildindex | null;
  /** Rahmenhöhe des Bogens: 32, bei hoher Leinwand (Schiffskoch, 25.11.2026) etwa 48. */
  readonly rahmenhoehe: number;
  /** Erster Rahmen der Schrägen (figurdiagonalen.mjs, nur Held, Heldin, Juno, Mama), sonst null. */
  readonly diagonalen: number | null;
} | null>;

/**
 * Setzt ein Bild unten bündig und waagrecht mittig in einen Rahmen 32 × `zeilen` (Standard 32),
 * ohne Schatten.
 */
export function imRahmen(pixel: Buffer, breite: number, hoehe: number, zeilen?: number): Buffer;

/** Breite und Rahmenhöhe der Leinwand aus metadata.json (Breite höchstens 32, Höhe ab 32). */
export function leinwandmasse(
  ordner: string,
  ersatz?: number | null,
): Promise<{ readonly breite: number; readonly hoehe: number }>;

/** Rahmenhöhe einer Figur aus ihrem Ordner (32, beim Schiffskoch 48). */
export function rahmenhoehe(ordner: string): Promise<number>;

/** Zeilen eines Rahmens (Breite 32) aus der Länge seines Puffers. */
export function zeilenVon(rahmen: Buffer): number;

/** Fußzeile eines Rahmens dieser Höhe (Höhe − 2). */
export function fusszeileFuer(hoehe: number): number;

/** Zeile, auf der die Füße der Standbilder im Bogen stehen (30). */
export const FUSSZEILE: number;

/** Verschiebt einen Rahmen um dy Zeilen (positiv nach unten). */
export function verschoben(rahmen: Buffer, dy: number): Buffer;

/** Die unterste Zeile mit einem deckenden Pixel, oder -1. */
export function untersteZeile(rahmen: Buffer): number;
