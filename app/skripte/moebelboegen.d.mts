// Typen zu skripte/moebelboegen.mjs, damit der Komponententest sie ohne any nutzen kann.

/** Größte Kante eines Bogens in Pixeln. */
export const BOGEN_HOECHSTENS: number;
/** Wiederholter Rand um jedes Bild in Pixeln. */
export const BOGEN_RAND: number;

/** Ein Rechteck zum Packen (Maße schon mit Rand). */
export interface Packeintrag {
  readonly name: string;
  readonly breite: number;
  readonly hoehe: number;
}

/** Ein gepackter Bogen mit den Plätzen seiner Bilder. */
export interface GepackterBogen {
  breite: number;
  hoehe: number;
  plaetze: { name: string; x: number; y: number; breite: number; hoehe: number }[];
}

/** Regalpacken in Bögen von höchstens `hoechstens` Pixeln Kante. */
export function packeRegal(
  eintraege: readonly Packeintrag[],
  hoechstens?: number,
): GepackterBogen[];

/** Die Bögen einer Gruppe als PNG und die Rahmen je Möbel (ohne Rand). */
export function baueMoebelboegen(
  praefix: string,
  bilder: readonly { readonly name: string; readonly bild: Uint8Array }[],
): Promise<{
  boegen: { name: string; png: Uint8Array }[];
  rahmen: Record<string, { bogen: string; rahmen: [number, number, number, number] }>;
}>;
