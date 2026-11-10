/**
 * Tiere der Oberwelt: welche Tierart ein Objekt der Karte zeigt, welches Bild dazu gehört (mit
 * nahem Ersatz, solange es keine eigene Zeichnung gibt) und wie viele Tiere eine Schar hat.
 *
 * Rolle im Gesamtbild: Reine Logik für belebungsschicht.ts (getestet in tiere.test.ts). Die
 * Bilder baut `pipeline/abenteuer/belebungsbilder.py` (TIERE) als `tiere/<art>.png` im
 * Spielformat; die Rahmengrößen hier müssen dazu passen. Regeln: Dokument 16, Abschnitt 5.2
 * („Bis dahin steht ein naher Ersatz“) und Auftrag Runde 7 („Eine Schar wird als drei bis fünf
 * Tiere gezeichnet“).
 */
import { streuwert } from "./belebung";

/** Rahmengröße eines Tierbogens in Pixeln. */
export interface Tierbild {
  readonly breite: number;
  readonly hoehe: number;
}

/** Die Bögen, die belebungsbilder.py baut: Art → Rahmengröße (dieselben Zahlen wie dort). */
export const TIERBILDER: Readonly<Record<string, Tierbild>> = {
  taube: { breite: 16, hoehe: 16 },
  huhn: { breite: 16, hoehe: 16 },
  ente: { breite: 32, hoehe: 32 },
  hase: { breite: 32, hoehe: 32 },
  schwein: { breite: 32, hoehe: 32 },
  ziege: { breite: 32, hoehe: 48 },
  schaf: { breite: 32, hoehe: 32 },
  kuh: { breite: 48, hoehe: 48 },
  esel: { breite: 48, hoehe: 48 },
  hund: { breite: 48, hoehe: 32 },
  katze: { breite: 32, hoehe: 32 },
};

/**
 * Wortstamm im Objektnamen → Bild (eigenes oder naher Ersatz). Längere Stämme gehen vor
 * („werkskatzeAussen“ → katze, „bisonherde“ → kuh). Ohne Treffer wird nichts gezeichnet (Wind,
 * Nebel, Roboter, Libellen und Tiere ohne passenden Ersatz wie Eidechse oder Delfin).
 */
const STAEMME: Readonly<Record<string, string>> = {
  taube: "taube",
  moewe: "taube",
  kraehe: "taube",
  rabe: "taube",
  geier: "taube",
  falke: "taube",
  adler: "taube",
  specht: "taube",
  eule: "taube",
  eichelhaeher: "taube",
  austernfischer: "taube",
  huhn: "huhn",
  huehner: "huhn",
  roadrunner: "huhn",
  ente: "ente",
  gans: "ente",
  gaense: "ente",
  reiher: "ente",
  pelikan: "ente",
  hase: "hase",
  kaninchen: "hase",
  eichhoernchen: "hase",
  murmeltier: "hase",
  praeriehund: "hase",
  schwein: "schwein",
  ziege: "ziege",
  reh: "ziege",
  schaf: "schaf",
  kuh: "kuh",
  kueh: "kuh",
  rind: "kuh",
  bison: "kuh",
  esel: "esel",
  pferd: "esel",
  hund: "hund",
  kojote: "hund",
  katze: "katze",
};

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
