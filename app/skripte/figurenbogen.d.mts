// Typen zu skripte/figurenbogen.mjs, damit der Komponententest sie ohne any nutzen kann.

/** Rahmengröße des Bogens in Pixeln (32). */
export const RAHMEN: number;

/** Baut den Bogen einer Figur (PNG) aus ihrem PixelLab-Ordner; null, wenn kein Bild da ist. */
export function baueFigurenbogen(ordner: string): Promise<Buffer | null>;

/** Setzt ein Bild unten bündig und waagrecht mittig in einen 32er-Rahmen, ohne Schatten. */
export function imRahmen(pixel: Buffer, breite: number, hoehe: number): Buffer;
