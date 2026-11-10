/**
 * Belebung der Oberwelt: Statisten und Tiere aus der Objektebene der Tiled-Karte lesen, ihnen
 * Bilder zuordnen, ihre Sätze finden und entscheiden, wann sie da sind.
 *
 * Rolle im Gesamtbild: Reine Logik ohne Phaser (getestet in belebung.test.ts). Die Bewegung steht
 * in belebungsbewegung.ts, das Zeichnen in belebungsschicht.ts. Die Regeln kommen aus
 * docs/spiel/16_Statisten_und_Tiere.md (Abschnitte 3.1 und 5) und dem Auftrag der Runde 7.
 * Bilder baut `pipeline/abenteuer/belebungsbilder.py` ins private Repository: Statisten als
 * `figuren/statist-NN.png` (Vorrat von 40), Tiere als `tiere/<art>.png`; die Rahmengrößen in
 * TIERBILDER sind dieselben wie dort.
 * Beispiel: Objekt „tauben“ (type tier, verhalten ausweichen) → Art „taube“, eine Schar aus drei
 * bis fünf Tauben, Bild „tiere/taube.png“ mit Rahmen 16 × 16.
 */

/** Tageszeit, zu der ein Statist unterwegs ist (Eigenschaft `wann`; ohne Angabe: immer). */
export type Tageszeit = "morgen" | "tag" | "abend" | "nacht" | "immer";

/** Verhalten eines Tiers (Dokument 16, Abschnitt 5.1). */
export type Tierverhalten =
  "sitzen" | "schlafen" | "fliegen" | "ausweichen" | "flitzen" | "folgen" | "rennen" | "schwimmen";

/** Ein Feld der Karte in Kachelkoordinaten. */
export interface Feld {
  readonly x: number;
  readonly y: number;
}

/** Ein Statist oder ein Tier der Karte, gelesen aus der Objektebene. */
export interface Belebung {
  readonly name: string;
  readonly typ: "statist" | "tier";
  readonly feld: Feld;
  readonly von: Feld;
  readonly bis: Feld;
  readonly wann: Tageszeit;
  /** Textschlüssel des ersten Satzes (nur ansprechbare Statisten), sonst null. */
  readonly sagt: string | null;
  /** Eigenes Bild (Eigenschaft `bild`, etwa „statist-07“ oder „hund“), sonst null. */
  readonly bild: string | null;
  readonly verhalten: Tierverhalten;
}

const VERHALTEN: readonly Tierverhalten[] = [
  "sitzen",
  "schlafen",
  "fliegen",
  "ausweichen",
  "flitzen",
  "folgen",
  "rennen",
  "schwimmen",
];
const TAGESZEITEN: readonly Tageszeit[] = ["morgen", "tag", "abend", "nacht", "immer"];
const KACHEL = 16;

interface Tiledobjekt {
  readonly name?: string;
  readonly type?: string;
  readonly x?: number;
  readonly y?: number;
  readonly properties?: readonly { readonly name?: string; readonly value?: unknown }[];
}

/** „24,14“ → { x: 24, y: 14 }; sonst null. */
function liesFeld(text: string | undefined): Feld | null {
  const teile = (text ?? "").split(",").map((t) => Number(t.trim()));
  const [x, y] = teile;
  if (teile.length !== 2 || x === undefined || y === undefined) return null;
  return Number.isFinite(x) && Number.isFinite(y) ? { x, y } : null;
}

/** Eine Eigenschaft eines Tiled-Objekts als Text, sonst undefined. */
function eigenschaft(objekt: Tiledobjekt, name: string): string | undefined {
  const wert = objekt.properties?.find((p) => p.name === name)?.value;
  return typeof wert === "string" && wert.length > 0 ? wert : undefined;
}

/** Ein Objekt mit type statist oder tier als Belebung; andere Objekte → null. */
function alsBelebung(o: Tiledobjekt): Belebung | null {
  if ((o.type !== "statist" && o.type !== "tier") || !o.name) return null;
  const feld = { x: Math.round((o.x ?? 0) / KACHEL), y: Math.round((o.y ?? 0) / KACHEL) };
  const wann = eigenschaft(o, "wann") as Tageszeit | undefined;
  const verhalten = eigenschaft(o, "verhalten") as Tierverhalten | undefined;
  return {
    name: o.name,
    typ: o.type,
    feld,
    von: liesFeld(eigenschaft(o, "von")) ?? feld,
    bis: liesFeld(eigenschaft(o, "bis")) ?? feld,
    wann: wann && TAGESZEITEN.includes(wann) ? wann : "immer",
    sagt: o.type === "statist" ? (eigenschaft(o, "sagt") ?? null) : null,
    bild: eigenschaft(o, "bild") ?? null,
    // Unbekanntes Verhalten (etwa „wirbeln“ beim Staubteufel) steht still wie „sitzen“.
    verhalten: verhalten && VERHALTEN.includes(verhalten) ? verhalten : "sitzen",
  };
}

/**
 * Alle Statisten und Tiere einer Tiled-Karte (Objekte mit type statist oder tier, gleich in
 * welcher Objektebene). Eigenschaften `von`/`bis` als „x,y“; fehlen sie, gilt das eigene Feld.
 */
export function liesBelebung(karte: object): Belebung[] {
  const ebenen = (karte as { layers?: readonly { objects?: readonly Tiledobjekt[] }[] }).layers;
  return (ebenen ?? []).flatMap((e) =>
    (e.objects ?? []).flatMap((o) => {
      const b = alsBelebung(o);
      return b ? [b] : [];
    }),
  );
}

/** Stunden [von, bis) je Tageszeit; ein Bereich über Mitternacht hat bis < von. */
const STUNDEN: Readonly<Record<Exclude<Tageszeit, "immer">, readonly [number, number]>> = {
  morgen: [5, 12],
  tag: [6, 22],
  abend: [16, 24],
  nacht: [20, 6],
};

/**
 * Ist ein Statist zu dieser Stunde unterwegs? Das Spiel hat keine eigene Uhr; es gilt die Uhr des
 * Geräts. Die Bereiche sind großzügig (Tag 6 bis 22 Uhr), damit die Karten am Abend nicht leer
 * wirken (Entscheidung von mittel-2 in Runde 7, Widerspruch genügt).
 * Beispiel: wann „morgen“ um 9 Uhr → true, um 14 Uhr → false; „immer“ → true.
 */
export function passtZurStunde(wann: Tageszeit, stunde: number): boolean {
  if (wann === "immer") return true;
  const [von, bis] = STUNDEN[wann];
  return von < bis ? stunde >= von && stunde < bis : stunde >= von || stunde < bis;
}

/**
 * Die Sätze eines Statisten in der Reihenfolge des Ansprechens: der Schlüssel selbst (wenn es ihn
 * gibt), dann `.1`, `.2` … solange vorhanden (Dokument 16, Abschnitt 3.1).
 * Beispiel: „statist.x.a“ mit Texten für „statist.x.a“ und „statist.x.a.1“ → beide, in dieser Folge.
 */
export function saetzeVon(schluessel: string, gibt: (s: string) => boolean): string[] {
  const saetze = gibt(schluessel) ? [schluessel] : [];
  for (let i = 1; gibt(`${schluessel}.${i}`); i++) saetze.push(`${schluessel}.${i}`);
  return saetze;
}

/** Der Satz beim n-ten Ansprechen (ab 0), reihum; null ohne Sätze. */
export function satzBeim(saetze: readonly string[], besuch: number): string | null {
  if (saetze.length === 0) return null;
  return saetze[besuch % saetze.length] ?? null;
}

/** Fester Streuwert eines Namens (FNV-1a), damit derselbe Name immer gleich aussieht. */
export function streuwert(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

/** Größe des Statistenvorrats (pipeline/abenteuer/belebungsbilder.py, STATISTEN). */
export const STATISTENVORRAT = 40;

/**
 * Bild eines Statisten im Paket: Eigenschaft `bild` („statist-07“ oder Name einer Figur), sonst
 * fest nach dem Namen aus dem Vorrat. Beispiel: „passanten“ → immer dasselbe „figuren/statist-NN.png“.
 */
export function statistenbild(b: Pick<Belebung, "name" | "bild">): string {
  if (b.bild) return `figuren/${b.bild}.png`;
  const nummer = (streuwert(b.name) % STATISTENVORRAT) + 1;
  return `figuren/statist-${String(nummer).padStart(2, "0")}.png`;
}

/** Was ein Statist beim Ansprechen sagt: Schlüssel des Satzes und der Antwort Ambroses. */
export interface Statistensatz {
  readonly satz: string;
  /** Ambroses Antwort (`<sagt>.ambrose`), wenn es eine gibt (höchstens bei jedem fünften). */
  readonly ambrose: string | null;
}

/**
 * Der Satz beim n-ten Ansprechen (ab 0) und Ambroses Antwort; null ohne Satz in den Texten.
 * Beispiel: sagt „statist.rivertonAussen.taubenmann“, zweites Ansprechen → „….taubenmann.1“,
 * dazu „….taubenmann.ambrose“, wenn dieser Text existiert.
 */
export function statistensatz(
  sagt: string,
  besuch: number,
  gibt: (s: string) => boolean,
): Statistensatz | null {
  const satz = satzBeim(saetzeVon(sagt, gibt), besuch);
  if (!satz) return null;
  return { satz, ambrose: gibt(`${sagt}.ambrose`) ? `${sagt}.ambrose` : null };
}
