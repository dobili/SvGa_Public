/**
 * Tönung einer Karte (Nebel, Dunst, Nacht, Abend, Sepia, Dunkel) und Lichtkreis der Laterne.
 *
 * Rolle im Gesamtbild: Reine Logik für oberwelt/toenungsschicht.ts und weltdaten.ts (getestet in
 * toenung.test.ts). Die Tönung steht in der Szene (`toenung`, vom Kartenbauer als Eigenschaft der
 * Karte geschrieben); ein Dialog kann sie mit `setzeToenung(name)` für die aktuelle Karte ändern
 * (Dialogvariable `toenung.<karte>`, „keine“ hebt sie auf). Auf dunklen Karten sieht der Held nur
 * einen kleinen Kreis, mit Laterne vier Felder weit (Auftrag Runde 6; Sperren S4, S9, S11, S14).
 * Beispiel: Stollen des Steinbruchs mit `toenung: dunkel`, Held mit Laterne → Lichtkreis 4 Felder.
 * Lichtstimmung (Atmosphäre T6): `licht` und `licht_zustaende` je Karte in orte.json gehen vor der
 * Eigenschaft der Szene, ohne die Szene des Kartenbauers anzufassen; `tag` heißt kein Schleier.
 * Abhängigkeiten: regeln/bedingung.ts.
 */
import { erfuellt } from "../regeln/bedingung";

/** Die Tönungen einer Karte. */
export type Toenung = "nebel" | "dunst" | "nacht" | "abend" | "serverblau" | "sepia" | "dunkel";

const TOENUNGEN: readonly Toenung[] = [
  "nebel",
  "dunst",
  "nacht",
  "abend",
  "serverblau",
  "sepia",
  "dunkel",
];
/** Wert der Dialogvariable, der eine Tönung aufhebt. */
export const KEINE_TOENUNG = "keine";

/** Farbe und Deckkraft einer Tönung als Schleier über der Karte (Sepia geht über CSS). */
export interface Schleier {
  readonly farbe: number;
  readonly deckkraft: number;
}

/** Schleier je Tönung; Sepia und Dunkel haben eigene Wege (CSS-Filter, Lichtkreis). */
export const SCHLEIER: Readonly<Partial<Record<Toenung, Schleier>>> = {
  // Nebel 0,30 statt 0,45 (10.11.2026): Bayou und Riesenbäume waren zu blass, um Dinge zu
  // unterscheiden; gleich wie pipeline/abenteuer/toenung.py.
  nebel: { farbe: 0xd8dde0, deckkraft: 0.3 },
  // Dunst: Morgennebel im Wald, halb so dicht, damit Weg und Figuren lesbar bleiben (Gutachter
  // zu den Riesenbäumen, Runde 9).
  dunst: { farbe: 0xd8dde0, deckkraft: 0.22 },
  nacht: { farbe: 0x0b1530, deckkraft: 0.55 },
  abend: { farbe: 0xff8a3d, deckkraft: 0.18 },
  // Serverblau: kaltes blaues Licht im Serverraum von Silicon Bay (Gutachten 10.11.2026: der
  // Raum war hell wie ein Büro); gleich wie pipeline/abenteuer/toenung.py.
  serverblau: { farbe: 0x1e50c8, deckkraft: 0.3 },
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

/** Licht ohne Schleier (Atmosphäre T6). */
export const TAGESLICHT = "tag";

/** Lichtangaben eines Karteneintrags in orte.json (Atmosphäre T6). */
export interface Lichtangabe {
  readonly licht?: string;
  readonly licht_zustaende?: Readonly<Record<string, string>>;
}

/**
 * Das Licht aus orte.json: der letzte Zustand, dessen Bedingung gilt, sonst `licht`; undefined,
 * wenn orte.json nichts sagt (dann gilt die Szene).
 * Beispiel: licht „tag“, Zustand {"nachtGesehen": "nacht"} mit nachtGesehen = true → „nacht“.
 */
export function lichtAusOrten(
  angabe: Lichtangabe | undefined,
  variablen: Readonly<Record<string, unknown>>,
): Toenung | null | undefined {
  const passend = Object.entries(angabe?.licht_zustaende ?? {}).filter(([b]) =>
    erfuellt(b, variablen),
  );
  const licht = passend.at(-1)?.[1] ?? angabe?.licht;
  if (licht === undefined) return undefined;
  return istToenung(licht) ? licht : null;
}

/** Eigenschaft `toenung` einer Tiled-Karte, sonst null. */
function toenungAusKarte(karte: object): Toenung | null {
  const eigenschaften = (karte as { properties?: readonly { name?: string; value?: unknown }[] })
    .properties;
  const wert = eigenschaften?.find((e) => e.name === "toenung")?.value;
  return istToenung(wert) ? wert : null;
}

/**
 * Die Tönung, die gerade gilt: die Dialogvariable `toenung.<karte>`, dann das Licht aus orte.json
 * (Zustände vor `licht`), dann die Eigenschaft der Karte.
 * Beispiel: Karte mit „nebel“, Variable „keine“ → null (der Nebel hat sich verzogen); Karte mit
 * „nebel“ und licht „tag“ → null.
 */
export function aktuelleToenung(
  karte: object,
  kennung: string,
  variablen: Readonly<Record<string, unknown>>,
  licht?: Lichtangabe,
): Toenung | null {
  const gesetzt = variablen[toenungsvariable(kennung)];
  if (gesetzt === KEINE_TOENUNG) return null;
  if (istToenung(gesetzt)) return gesetzt;
  const ausOrten = lichtAusOrten(licht, variablen);
  return ausOrten === undefined ? toenungAusKarte(karte) : ausOrten;
}

/** Halbmesser des Lichtkreises in Feldern. */
export function lichtkreis(laterne: boolean): number {
  return laterne ? LICHT_MIT_LATERNE : LICHT_OHNE_LATERNE;
}
