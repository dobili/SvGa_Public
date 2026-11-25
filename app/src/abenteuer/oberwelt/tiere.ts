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
import { streuwert, type Belebung, type Feld } from "./belebung";
import tierarten from "./tierarten.json";

/** Rahmengröße eines Tierbogens in Pixeln. */
export interface Tierbild {
  readonly breite: number;
  readonly hoehe: number;
  /**
   * Zeichengröße im Verhältnis zum Bogen (tierarten.json, Feld massstab; ohne Angabe 1). Hase und
   * Ente wirkten neben Reh und Figuren zu groß (Kartengutachten Akt 1).
   */
  readonly massstab: number;
  /**
   * Unterste Zeile der Standbilder im Rahmen (PixelLab-Bögen haben Rand um die Leinwand); bei den
   * übrigen Bögen der untere Rand.
   */
  readonly fuss: number;
  /** Verhalten mit eigenem Zustandsbild in Reihe 2 (PixelLab: sitzen, schlafen, grasen). */
  readonly zustaende: readonly string[];
  /** Mitte der Wasserfläche im Rahmen, wenn der Bogen Schwimmreihen hat (Reihen 3, 4); sonst null. */
  readonly schwimmMitte: number | null;
  /** Weg der Füße in einem Gehzyklus in Spielpixeln (pixellab_messung.py, fussweg); sonst null. */
  readonly schritt: number | null;
}

/** Die Bögen, die belebungsbilder.py baut: Art → Rahmengröße (aus tierarten.json, wie dort). */
export const TIERBILDER: Readonly<Record<string, Tierbild>> = Object.fromEntries(
  Object.entries(tierarten.arten).map(([art, a]) => [
    art,
    {
      breite: a.breite,
      hoehe: a.hoehe,
      massstab: "massstab" in a ? a.massstab : 1,
      fuss: "fuss" in a ? a.fuss : a.hoehe,
      zustaende: "zustaende" in a ? a.zustaende : [],
      schwimmMitte: "schwimmen" in a ? a.schwimmen.mitte : null,
      schritt: "schritt" in a ? a.schritt : null,
    },
  ]),
);

/** Dauer eines Gehzyklus bei normaler Bildrate (6 Bilder bei 10 je Sekunde, figurbilder.ts). */
const GEHZYKLUS_S = 0.6;
/** Schneller als 2,5-mal so schnell (25 Bilder je Sekunde) laufen die Gehbilder nie, sonst wirkt das Tier hektisch. */
const HOECHSTER_GANGFAKTOR = 2.5;

/**
 * Wie viel schneller die Gehbilder laufen, damit das Tier nicht rutscht: Ein Zyklus soll etwa so
 * weit tragen, wie die Füße gehen (Hauptchat, 23.11.2026). Zwischen 1 und 2,5; ohne gemessenen
 * Fußweg 1. Beispiel: Kuh, Fußweg 3,1 px, 0,8 Kacheln/s bei Kachel 16 → 7,7 px je Zyklus → 2,5.
 */
export function gangfaktor(bild: Tierbild, kachelnJeSekunde: number, kachel: number): number {
  if (!bild.schritt || kachelnJeSekunde <= 0) return 1;
  const weg = kachelnJeSekunde * kachel * GEHZYKLUS_S;
  return Math.min(HOECHSTER_GANGFAKTOR, Math.max(1, weg / bild.schritt));
}

/** Spalten eines Tierbogens, Bilder je Zustand (vier Richtungen) und erste Bilder der Reihen. */
const SPALTEN = 24;
const RICHTUNGEN_JE_ZUSTAND = 4;
const ZUSTAND_BEGINN = 2 * SPALTEN;
const SCHWIMM_STAND_BEGINN = 3 * SPALTEN;
/** Erstes Bild der Schwimmbewegung (Reihe 4, sechs je Richtung wie das Laufen). */
export const SCHWIMM_BEGINN = 4 * SPALTEN;

/** Schwimmt das Tier mit eigenen Schwimmbildern (PixelLab, Wasser in unserer Farbe)? */
export function mitSchwimmbildern(bild: Tierbild, verhalten: string): boolean {
  return verhalten === "schwimmen" && bild.schwimmMitte !== null;
}

/**
 * Erstes Bild der vier Standbilder, das zum Verhalten passt (dazu kommt die Richtung, 0 bis 3):
 * Schwimmer im Wasser Reihe 3, ein Verhalten mit eigenem Zustand (Katze „schlafen“) Reihe 2,
 * sonst Reihe 0. Beispiel: Kuh, zustaende [sitzen, grasen], „grasen“ → 48 + 4 = 52.
 */
export function standbasis(bild: Tierbild, verhalten: string): number {
  if (mitSchwimmbildern(bild, verhalten)) return SCHWIMM_STAND_BEGINN;
  const k = bild.zustaende.indexOf(verhalten);
  return k < 0 ? 0 : ZUSTAND_BEGINN + k * RICHTUNGEN_JE_ZUSTAND;
}

/**
 * Wortstamm im Objektnamen → Bild (eigenes oder naher Ersatz, tierarten.json). Längere Stämme
 * gehen vor („werkskatzeAussen“ → katze, „praeriehunde“ → hase, nicht hund). Ohne Treffer wird
 * nichts gezeichnet (Wind, Nebel und Tiere ohne Bild wie der Waschbär, bis der Autor ihn macht).
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
 * Ursprung liegt eine halbe Kachel über dem Fuß (`fuss`, ohne Angabe der untere Rand); ein Schwimmer verliert unten den Teil unter der
 * Wasserlinie und sinkt um genau diesen Teil tiefer, damit er im Wasser liegt statt darauf steht.
 * Beispiel: Ente 32 hoch, Kachel 16, schwimmend → sichtbar 27, Ursprung (27 − 8) / 32.
 */
export function tierAnsicht(
  hoehe: number,
  kachel: number,
  schwimmt: boolean,
  fuss: number = hoehe,
): { readonly sichtbar: number; readonly ursprungY: number } {
  const sichtbar = schwimmt ? Math.round(fuss * WASSERLINIE) : fuss;
  return { sichtbar, ursprungY: (sichtbar - kachel / 2) / hoehe };
}

/**
 * Ursprung eines Schwimmers mit eigenen Schwimmbildern: die Mitte seiner Wasserfläche liegt auf der
 * Mitte der Kachel, nichts wird abgeschnitten (die Wellen gehören zum Bild).
 * Beispiel: Ente, Rahmen 36, Wassermitte 20 → 20 / 36.
 */
export function schwimmUrsprungY(bild: Tierbild): number {
  return (bild.schwimmMitte ?? bild.hoehe / 2) / bild.hoehe;
}

/** Die Felder eines Laufwegs: erst waagerecht, dann senkrecht (wie belebungsbewegung.ts, geheZu). */
export function laufwegfelder(von: Feld, bis: Feld): Feld[] {
  const felder: Feld[] = [];
  for (let x = von.x; x !== bis.x; x += Math.sign(bis.x - von.x)) felder.push({ x, y: von.y });
  for (let y = von.y; y !== bis.y; y += Math.sign(bis.y - von.y)) felder.push({ x: bis.x, y });
  return [...felder, bis];
}

/**
 * Das i-te Tier einer Schar mit seinem Laufweg (Abstand `weite` Kacheln). An Land steht es um das
 * Feld des Objekts (scharversatz). Ein Schwimmer bleibt auf dem Weg, den der Autor ins Wasser gelegt
 * hat: Er beginnt i · weite Felder weiter auf diesem Weg, höchstens an dessen Ende, und schwimmt bis
 * zum Ende (Befund des Autors, 25.11.2026 abends: Bis dahin rückte der ganze Weg mit, und von fünf
 * Enten im Teich des Parks schwammen zwei über die Wiese).
 * Beispiel: Enten von (24, 27) bis (27, 27), i = 4, weite 1 → von (27, 27), bis (27, 27).
 */
export function scharplatz(v: Belebung, i: number, weite: number): Belebung {
  if (v.verhalten === "schwimmen") {
    const weg = laufwegfelder(v.von, v.bis);
    const start = weg[Math.min(i * weite, weg.length - 1)] ?? v.von;
    return { ...v, feld: start, von: start };
  }
  const d = scharversatz(i);
  const plus = (f: Feld) => ({ x: f.x + d.x * weite, y: f.y + d.y * weite });
  return { ...v, feld: plus(v.feld), von: plus(v.von), bis: plus(v.bis) };
}
