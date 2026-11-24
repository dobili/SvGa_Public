/**
 * Ambrose als Begleiter (Wunsch des Autors, 24.11.2026): Der Geist ist immer bei dem Helden und
 * wird neben ihm sichtbar, sobald er im Gespräch etwas sagt; danach blendet er aus. Er läuft nicht
 * hinterher. Nur der Held hört ihn: Seine Zeilen in Gesprächen mit anderen sind geflüstert, und
 * der Held kann in Gedanken antworten (`#gedanke`).
 *
 * Rolle im Gesamtbild: reine Regeln ohne Phaser und React. oberwelt/begleiterschicht.ts stellt den
 * Geist auf das Feld, oberwelt/useBuehne.ts fragt je Zeile, dialog/Dialog.tsx gestaltet Flüstern
 * und Gedanken.
 * Abhängigkeiten: keine.
 */

/** Blickrichtung wie in der Szene. */
export type Blick = "oben" | "unten" | "links" | "rechts";

/** Ein Feld der Karte in Kachelkoordinaten. */
export interface Kachelfeld {
  readonly x: number;
  readonly y: number;
}

/** So lange blendet der Begleiter ein und aus (ms): spürbar, aber kürzer als eine Zeile zu lesen. */
export const BEGLEITER_BLENDE_MS = 500;

/** Vorwärts je Blickrichtung in Feldern (y wächst nach unten). */
const VORWAERTS: Readonly<Record<Blick, readonly [number, number]>> = {
  oben: [0, -1],
  unten: [0, 1],
  links: [-1, 0],
  rechts: [1, 0],
};

/**
 * Die Nachbarfelder, auf denen der Begleiter stehen darf, in der Reihenfolge der Vorliebe:
 * seitlich rechts, seitlich links, schräg hinten rechts, schräg hinten links, zuletzt direkt
 * dahinter. Nie vor dem Helden: Dort steht, mit wem er spricht.
 * Schaut der Held nach links oder rechts, wäre „seitlich“ oben oder unten; unter dem Helden
 * verdeckt der Geist dessen Beine (Blickprobe 24.11.2026, Mrs. Calloway). Dann zuerst schräg hinten
 * oben, oben, dahinter, und die Felder unter dem Helden zuletzt.
 * Beispiel: Held auf (5, 5) mit Blick nach oben → (6, 5), (4, 5), (6, 6), (4, 6), (5, 6);
 * mit Blick nach rechts → (4, 4), (5, 4), (4, 5), (4, 6), (5, 6).
 */
export function begleiterfelder(held: Kachelfeld, blick: Blick): readonly Kachelfeld[] {
  const [vx, vy] = VORWAERTS[blick];
  // Rechts vom Blick aus: der Vorwärtsvektor um ein Viertel im Uhrzeigersinn gedreht.
  const [rx, ry] = [-vy, vx];
  const feld = (seite: number, zurueck: number): Kachelfeld => ({
    x: held.x + seite * rx - zurueck * vx,
    y: held.y + seite * ry - zurueck * vy,
  });
  if (vx === 0) return [feld(1, 0), feld(-1, 0), feld(1, 1), feld(-1, 1), feld(0, 1)];
  // Waagrechter Blick: „oben“ ist die Seite, deren Feld eine Zeile höher liegt.
  const oben = ry < 0 ? 1 : -1;
  return [feld(oben, 1), feld(oben, 0), feld(0, 1), feld(-oben, 1), feld(-oben, 0)];
}

/**
 * Das Feld, auf dem der Begleiter erscheint: das erste freie aus `begleiterfelder`, oder null.
 * Eingaben: Feld und Blick des Helden; `frei` sagt, ob ein Feld begehbar und unbesetzt ist (keine
 * Wand, kein Möbel, keine Figur). Beispiel: Held (5, 5) schaut nach oben, rechts steht eine Wand →
 * (4, 5). Sonderfall: Ist ringsum nichts frei (enger Steg), erscheint er nicht auf der Karte; das
 * Porträt im Gespräch bleibt.
 */
export function begleiterfeld(
  held: Kachelfeld,
  blick: Blick,
  frei: (x: number, y: number) => boolean,
): Kachelfeld | null {
  return begleiterfelder(held, blick).find((f) => frei(f.x, f.y)) ?? null;
}

/**
 * Wohin der Begleiter schaut: wie der Held zum Gegenüber. Schaut der Held nach oben, sähe man vom
 * Geist nur den Rücken; dann wendet er sich dem Helden zu (von der Seite), damit sein Gesicht zu
 * sehen ist. Beispiel: Held schaut nach unten → unten; Held schaut nach oben, Geist rechts neben
 * ihm → links; Geist direkt hinter ihm → oben.
 */
export function begleiterblick(feld: Kachelfeld, held: Kachelfeld, blick: Blick): Blick {
  if (blick !== "oben") return blick;
  if (feld.x > held.x) return "links";
  return feld.x < held.x ? "rechts" : "oben";
}

/** Steht der Begleiter noch neben dem Helden (Nachbarfeld, auch schräg, nicht dasselbe Feld)? */
export function nebenDemHelden(feld: Kachelfeld, held: Kachelfeld): boolean {
  const abstand = Math.max(Math.abs(feld.x - held.x), Math.abs(feld.y - held.y));
  return abstand === 1;
}

/** Was die Bühne über eine Dialogzeile weiß. */
export interface Begleiterlage {
  /** Sprecher der Zeile (`#sprecher`), ohne Tag undefined. */
  readonly sprecher: string | undefined;
  /** Kurznamen der geisterhaften Figuren (regeln/geist.ts). */
  readonly geister: ReadonlySet<string>;
  /** Erinnerung (Karte oder `#erinnerung` im Dialog): Dort lebt Ambrose noch. */
  readonly erinnerung: boolean;
  /** Ambrose ist nicht da (regeln/abwesenheit.ts, ambroseNichtDa). */
  readonly nichtDa: boolean;
  /** Die Figur steht schon auf der Karte (Dachboden) oder ist dort erschienen (`#erscheint`). */
  readonly aufKarte: boolean;
}

/**
 * Erscheint mit dieser Zeile der Begleiter neben dem Helden? Ja, wenn ein Geist spricht, der nicht
 * schon auf der Karte steht; nicht in Erinnerungen und nicht, solange er nicht da ist.
 * Beispiel: Ambrose mischt sich im Diner ein → ja; auf dem Dachboden steht er schon → nein;
 * zwischen Tiefpunkt und Versöhnung → nein.
 */
export function begleiterErscheint(lage: Begleiterlage): boolean {
  if (!lage.sprecher || !lage.geister.has(lage.sprecher)) return false;
  return !lage.erinnerung && !lage.nichtDa && !lage.aufKarte;
}

/** Sprecher, die nicht als „andere Figur“ im Gespräch zählen: der Erzähler und der Held. */
const KEIN_GEGENUEBER: ReadonlySet<string> = new Set(["erzaehler", "held"]);

/**
 * Hat mit dieser Zeile eine andere Figur als der Geist gesprochen? Der Dialog merkt sich das, um
 * die Zeilen des Geistes danach als geflüstert zu zeigen.
 * Beispiel: „juno“ → ja; „ambrose“, „erzaehler“ oder kein Sprecher → nein.
 */
export function istGegenueber(sprecher: string | undefined, geister: ReadonlySet<string>): boolean {
  if (!sprecher) return false;
  return !geister.has(sprecher) && !KEIN_GEGENUEBER.has(sprecher);
}

/**
 * Ist die Zeile geflüstert („nur du hörst ihn“)? Ja, wenn ein Geist spricht und in diesem Gespräch
 * schon jemand anderes gesprochen hat, oder wenn die Zeile `#fluestern` trägt (für Einwürfe, bevor
 * das Gegenüber das erste Wort sagt). Nicht in Erinnerungen: Dort lebt er und alle hören ihn.
 * Beispiel: Juno spricht, dann Ambrose → geflüstert; Ambrose allein auf dem Dachboden → nicht.
 */
export function gefluestert(
  tags: Readonly<Record<string, string>> | undefined,
  geister: ReadonlySet<string>,
  andereSprachen: boolean,
  erinnerung: boolean,
): boolean {
  const sprecher = tags?.sprecher;
  if (!sprecher || !geister.has(sprecher) || erinnerung) return false;
  return andereSprachen || tags?.fluestern !== undefined;
}

/** Ist die Zeile ein Gedanke des Helden (`#gedanke`)? Andere Figuren hören ihn nicht. */
export function istGedanke(tags: Readonly<Record<string, string>> | undefined): boolean {
  return tags?.gedanke !== undefined;
}
