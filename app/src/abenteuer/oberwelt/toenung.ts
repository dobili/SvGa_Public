/**
 * Tönung einer Karte (Nebel, Nacht, Abend, Sepia, Dunkel) und Lichtkreis der Laterne.
 *
 * Rolle im Gesamtbild: Reine Logik für oberwelt/toenungsschicht.ts und weltdaten.ts (getestet in
 * toenung.test.ts). Die Tönung steht in der Szene (`toenung`, vom Kartenbauer als Eigenschaft der
 * Karte geschrieben); ein Dialog kann sie mit `setzeToenung(name)` für die aktuelle Karte ändern
 * (Dialogvariable `toenung.<karte>`, „keine“ hebt sie auf). Auf dunklen Karten sieht der Held nur
 * einen kleinen Kreis, mit Laterne vier Felder weit (Auftrag Runde 6; Sperren S4, S9, S11, S14).
 * Beispiel: Stollen des Steinbruchs mit `toenung: dunkel`, Held mit Laterne → Lichtkreis 4 Felder.
 */

/** Die Tönungen einer Karte. */
export type Toenung = "nebel" | "nacht" | "abend" | "sepia" | "dunkel";

const TOENUNGEN: readonly Toenung[] = ["nebel", "nacht", "abend", "sepia", "dunkel"];
/** Wert der Dialogvariable, der eine Tönung aufhebt. */
export const KEINE_TOENUNG = "keine";

/** Farbe und Deckkraft einer Tönung als Schleier über der Karte (Sepia geht über CSS). */
export interface Schleier {
  readonly farbe: number;
  readonly deckkraft: number;
}

/** Schleier je Tönung; Sepia und Dunkel haben eigene Wege (CSS-Filter, Lichtkreis). */
export const SCHLEIER: Readonly<Partial<Record<Toenung, Schleier>>> = {
  nebel: { farbe: 0xd8dde0, deckkraft: 0.45 },
  nacht: { farbe: 0x0b1530, deckkraft: 0.55 },
  abend: { farbe: 0xff8a3d, deckkraft: 0.18 },
};

/** Lichtkreis in Feldern: mit Laterne vier Felder (Auftrag Runde 6), ohne nur das Nächste. */
export const LICHT_MIT_LATERNE = 4;
export const LICHT_OHNE_LATERNE = 1.5;
/** Deckkraft der Dunkelheit außerhalb des Lichtkreises. */
export const DUNKEL_DECKKRAFT = 0.94;

/** Ist der Text eine bekannte Tönung? */
export function istToenung(wert: unknown): wert is Toenung {
  return typeof wert === "string" && (TOENUNGEN as readonly string[]).includes(wert);
}

/** Name der Dialogvariable, mit der ein Dialog die Tönung einer Karte setzt. */
export function toenungsvariable(karte: string): string {
  return `toenung.${karte}`;
}

/** Eigenschaft `toenung` einer Tiled-Karte, sonst null. */
function toenungAusKarte(karte: object): Toenung | null {
  const eigenschaften = (karte as { properties?: readonly { name?: string; value?: unknown }[] })
    .properties;
  const wert = eigenschaften?.find((e) => e.name === "toenung")?.value;
  return istToenung(wert) ? wert : null;
}

/**
 * Die Tönung, die gerade gilt: die Dialogvariable `toenung.<karte>` vor der Eigenschaft der Karte.
 * Beispiel: Karte mit „nebel“, Variable „keine“ → null (der Nebel hat sich verzogen).
 */
export function aktuelleToenung(
  karte: object,
  kennung: string,
  variablen: Readonly<Record<string, unknown>>,
): Toenung | null {
  const gesetzt = variablen[toenungsvariable(kennung)];
  if (gesetzt === KEINE_TOENUNG) return null;
  if (istToenung(gesetzt)) return gesetzt;
  return toenungAusKarte(karte);
}

/** Halbmesser des Lichtkreises in Feldern. */
export function lichtkreis(laterne: boolean): number {
  return laterne ? LICHT_MIT_LATERNE : LICHT_OHNE_LATERNE;
}
