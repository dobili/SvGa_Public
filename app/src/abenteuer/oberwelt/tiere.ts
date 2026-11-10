/**
 * Tiere der Oberwelt: welche Tierart ein Objekt der Karte zeigt, welches Bild dazu gehört (mit
 * nahem Ersatz, solange es keine eigene Zeichnung gibt) und wie viele Tiere eine Schar hat.
 *
 * Rolle im Gesamtbild: Reine Logik für belebungsschicht.ts (getestet in tiere.test.ts). Arten,
 * Quellen, Rahmengrößen und Wortstämme stehen in tierarten.json, die auch der Bogenbau
 * (`pipeline/abenteuer/belebungsbilder.py`, `tiere/<art>.png`) und die Vorschau lesen. Regeln: Dokument 16, Abschnitt 5.2
 * („Bis dahin steht ein naher Ersatz“) und Auftrag Runde 7 („Eine Schar wird als drei bis fünf
 * Tiere gezeichnet“).
 */
import { streuwert } from "./belebung";
import tierarten from "./tierarten.json";

/** Rahmengröße eines Tierbogens in Pixeln. */
export interface Tierbild {
  readonly breite: number;
  readonly hoehe: number;
}

/** Die Bögen, die belebungsbilder.py baut: Art → Rahmengröße (aus tierarten.json, wie dort). */
export const TIERBILDER: Readonly<Record<string, Tierbild>> = Object.fromEntries(
  Object.entries(tierarten.arten).map(([art, a]) => [art, { breite: a.breite, hoehe: a.hoehe }]),
);

/**
 * Wortstamm im Objektnamen → Bild (eigenes oder naher Ersatz, tierarten.json). Längere Stämme
 * gehen vor („werkskatzeAussen“ → katze, „praeriehunde“ → hase, nicht hund). Ohne Treffer wird
 * nichts gezeichnet (Wind, Nebel, Roboter, Libellen und Tiere ohne Ersatz wie Eidechse, Delfin).
 */
const STAEMME: Readonly<Record<string, string>> = tierarten.staemme;

/** Wörter, an denen eine Schar zu erkennen ist (Mehrzahl im Objektnamen). */
const SCHARWOERTER = [
  "tauben",
  "moewen",
  "kraehen",
  "raben",
  "enten",
  "gaense",
  "huehner",
  "ziegen",
  "schafe",
  "kuehe",
  "rinder",
  "pelikane",
  "herde",
  "schar",
  "spatzen",
  "amseln",
  "lerchen",
  "seeschwalben",
  "wildpferde",
  "praeriehunde",
  "murmeltiere",
] as const;

const STAEMME_NACH_LAENGE = Object.keys(STAEMME).sort((a, b) => b.length - a.length);

/** Kleinschreibung und Umlaute wie in den Objektnamen („Möwen“ → „moewen“). */
function grundform(name: string): string {
  return name
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss");
}

/**
 * Die Bildart eines Tiers: Eigenschaft `bild`, wenn es dazu einen Bogen gibt, sonst nach dem
 * Namen über die Ersatztabelle. Beispiel: „reh“ → „ziege“, „moewen“ → „taube“, „wind“ → null.
 */
export function tierartVon(name: string, bild: string | null = null): string | null {
  if (bild && TIERBILDER[bild]) return bild;
  const form = grundform(name);
  const stamm = STAEMME_NACH_LAENGE.find((s) => form.includes(s));
  return stamm ? (STAEMME[stamm] ?? null) : null;
}

/** Kleinste und größte Schar (Auftrag Runde 7). */
const SCHAR_MIN = 3;
const SCHAR_MAX = 5;

/**
 * Wie viele Tiere ein Objekt zeigt: eine Schar (Mehrzahl im Namen) drei bis fünf, fest nach dem
 * Namen; sonst eins. Beispiel: „tauben“ → 3, 4 oder 5 (immer dieselbe Zahl), „hund“ → 1.
 */
export function scharGroesse(name: string): number {
  const form = grundform(name);
  if (!SCHARWOERTER.some((w) => form.includes(w))) return 1;
  return SCHAR_MIN + (streuwert(name) % (SCHAR_MAX - SCHAR_MIN + 1));
}

/** Versatz der Tiere einer Schar um das Feld des Objekts, in Kacheln (das erste steht darauf). */
const SCHARVERSATZ: readonly { readonly x: number; readonly y: number }[] = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 1, y: 1 },
];

/** Versatz des i-ten Tiers einer Schar (ab 0). */
export function scharversatz(i: number): { readonly x: number; readonly y: number } {
  return SCHARVERSATZ[i % SCHARVERSATZ.length] ?? { x: 0, y: 0 };
}

/** Schwimmer zeigen nur den Teil über der Wasserlinie (Regel 10.55; wie belebungsvorschau.py). */
export const WASSERLINIE = 0.85;

/**
 * Sichtbare Höhe und Ursprung eines Tiers in Pixeln (Ursprung y als Anteil der Bildhöhe): Der
 * Ursprung liegt eine halbe Kachel über dem Fuß; ein Schwimmer verliert unten den Teil unter der
 * Wasserlinie und sinkt um genau diesen Teil tiefer, damit er im Wasser liegt statt darauf steht.
 * Beispiel: Ente 32 hoch, Kachel 16, schwimmend → sichtbar 27, Ursprung (27 − 8) / 32.
 */
export function tierAnsicht(
  hoehe: number,
  kachel: number,
  schwimmt: boolean,
): { readonly sichtbar: number; readonly ursprungY: number } {
  const sichtbar = schwimmt ? Math.round(hoehe * WASSERLINIE) : hoehe;
  return { sichtbar, ursprungY: (sichtbar - kachel / 2) / hoehe };
}

/**
 * Versatz des i-ten Schwimmers einer Schar: in einer Reihe entlang des Schwimmwegs (von → bis),
 * damit keiner ans Ufer gerät (Kanal von Norden nach Süden: untereinander).
 * Beispiel: von (22, 30), bis (22, 44), i = 2, Abstand 2 → (0, 4).
 */
export function schwimmversatz(
  von: { readonly x: number; readonly y: number },
  bis: { readonly x: number; readonly y: number },
  i: number,
  abstand: number,
): { readonly x: number; readonly y: number } {
  const senkrecht = Math.abs(bis.y - von.y) >= Math.abs(bis.x - von.x);
  return senkrecht ? { x: 0, y: i * abstand } : { x: i * abstand, y: 0 };
}
