/**
 * Die Modulmatrix des QR-Codes nach ISO/IEC 18004: feste Muster zeichnen, Datenbits im Zickzack
 * setzen, Masken anwenden, Format- und Versionsinformation eintragen.
 *
 * Rolle im Gesamtbild: qrcode.ts baut die Bytes und wählt die Maske; hier steht, wo jedes Modul
 * liegt. Zeile y, Spalte x, dunkel = true. `funktion` merkt sich die festen Module, die weder
 * Daten tragen noch maskiert werden.
 * Abhängigkeiten: qrtabellen.ts, galoisfeld.ts (bit).
 */
import { bit, BITS_JE_BYTE } from "./galoisfeld";
import {
  ausrichtungspositionen,
  formatbits,
  kantenlaenge,
  VERSIONSINFO_AB,
  versionsbits,
} from "./qrtabellen";

/** Die Matrix im Bau. */
export interface Modulmatrix {
  readonly groesse: number;
  readonly dunkel: boolean[][];
  readonly funktion: boolean[][];
}

/** Halbe Breite eines Suchmusters mit hellem Rand (7 × 7 plus Rand = 9 × 9). */
const SUCHMUSTER_RADIUS = 4;
/** Abstand der Suchmuster-Mitte vom Rand. */
const SUCHMUSTER_MITTE = 3;
/** Halbe Breite eines Ausrichtungsmusters (5 × 5). */
const AUSRICHTUNG_RADIUS = 2;
/** Zeile und Spalte der Taktmuster. */
const TAKTLINIE = 6;
/** Zeile und Spalte der Formatinformation neben dem Suchmuster oben links. */
const FORMATLINIE = 8;
/** Anzahl der Formatbits und der Versionsbits. */
const FORMATBITS = 15;
const VERSIONSBITS = 18;
/** Die Versionsinformation steht in einem Block aus 3 × 6 Modulen. */
const VERSIONSBLOCK_BREITE = 3;
const VERSIONSBLOCK_ABSTAND = 11;

/** Eine leere Matrix der Version. */
export function leereMatrix(version: number): Modulmatrix {
  const groesse = kantenlaenge(version);
  const feld = () => Array.from({ length: groesse }, () => new Array<boolean>(groesse).fill(false));
  return { groesse, dunkel: feld(), funktion: feld() };
}

/** Setzt ein festes Modul (außerhalb der Matrix: nichts). */
function setzeFest(m: Modulmatrix, x: number, y: number, dunkel: boolean): void {
  const zeile = m.dunkel[y];
  const merker = m.funktion[y];
  if (!zeile || !merker || x < 0 || x >= m.groesse) return;
  zeile[x] = dunkel;
  merker[x] = true;
}

/** Suchmuster (7 × 7 mit hellem Rand) um die Mitte (x, y): Ringe mit Abstand 2 und 4 hell. */
function suchmuster(m: Modulmatrix, x: number, y: number): void {
  for (let dy = -SUCHMUSTER_RADIUS; dy <= SUCHMUSTER_RADIUS; dy++) {
    for (let dx = -SUCHMUSTER_RADIUS; dx <= SUCHMUSTER_RADIUS; dx++) {
      const abstand = Math.max(Math.abs(dx), Math.abs(dy));
      setzeFest(m, x + dx, y + dy, abstand !== 2 && abstand !== SUCHMUSTER_RADIUS);
    }
  }
}

/** Ausrichtungsmuster (5 × 5) um die Mitte: nur der Ring mit Abstand 1 ist hell. */
function ausrichtungsmuster(m: Modulmatrix, x: number, y: number): void {
  for (let dy = -AUSRICHTUNG_RADIUS; dy <= AUSRICHTUNG_RADIUS; dy++) {
    for (let dx = -AUSRICHTUNG_RADIUS; dx <= AUSRICHTUNG_RADIUS; dx++) {
      setzeFest(m, x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }
  }
}

/** Alle Ausrichtungsmuster außer denen, die mit den Suchmustern zusammenfielen. */
function alleAusrichtungsmuster(m: Modulmatrix, version: number): void {
  const positionen = ausrichtungspositionen(version);
  const letzte = positionen.length - 1;
  positionen.forEach((py, i) =>
    positionen.forEach((px, j) => {
      const ecke = (i === 0 && j === 0) || (i === 0 && j === letzte) || (i === letzte && j === 0);
      if (!ecke) ausrichtungsmuster(m, px, py);
    }),
  );
}

/**
 * Zeichnet alle festen Muster: Taktlinien, drei Suchmuster, Ausrichtungsmuster, Platzhalter der
 * Formatinformation (Maske 0, wird später überschrieben) und ab Version 7 die Versionsinformation.
 */
export function zeichneFunktionsmuster(m: Modulmatrix, version: number): void {
  for (let i = 0; i < m.groesse; i++) {
    setzeFest(m, TAKTLINIE, i, i % 2 === 0);
    setzeFest(m, i, TAKTLINIE, i % 2 === 0);
  }
  const fern = m.groesse - 1 - SUCHMUSTER_MITTE;
  suchmuster(m, SUCHMUSTER_MITTE, SUCHMUSTER_MITTE);
  suchmuster(m, fern, SUCHMUSTER_MITTE);
  suchmuster(m, SUCHMUSTER_MITTE, fern);
  alleAusrichtungsmuster(m, version);
  setzeFormat(m, 0);
  if (version >= VERSIONSINFO_AB) setzeVersion(m, version);
}

/**
 * Trägt die 15 Formatbits zweimal ein (um das Suchmuster oben links, geteilt an den beiden
 * anderen) und das stets dunkle Modul neben dem Suchmuster unten links (Norm, Abschnitt 7.9).
 */
export function setzeFormat(m: Modulmatrix, maske: number): void {
  const bits = formatbits(maske);
  const kante = m.groesse;
  for (let i = 0; i < FORMATBITS; i++) {
    const an = bit(bits, i);
    // Erste Kopie: Spalte 8 von oben (ohne Taktzeile), dann Zeile 8 nach links.
    if (i < TAKTLINIE) setzeFest(m, FORMATLINIE, i, an);
    else if (i < FORMATLINIE) setzeFest(m, FORMATLINIE, i + 1, an);
    else if (i === FORMATLINIE) setzeFest(m, FORMATLINIE - 1, FORMATLINIE, an);
    else setzeFest(m, FORMATBITS - 1 - i, FORMATLINIE, an);
    // Zweite Kopie: Zeile 8 von rechts, dann Spalte 8 unten.
    if (i < FORMATLINIE) setzeFest(m, kante - 1 - i, FORMATLINIE, an);
    else setzeFest(m, FORMATLINIE, kante - FORMATBITS + i, an);
  }
  setzeFest(m, FORMATLINIE, kante - FORMATLINIE, true);
}

/** Die 18 Versionsbits in zwei Blöcken 3 × 6 (oben rechts, unten links). */
function setzeVersion(m: Modulmatrix, version: number): void {
  const bits = versionsbits(version);
  for (let i = 0; i < VERSIONSBITS; i++) {
    const an = bit(bits, i);
    const a = m.groesse - VERSIONSBLOCK_ABSTAND + (i % VERSIONSBLOCK_BREITE);
    const b = Math.floor(i / VERSIONSBLOCK_BREITE);
    setzeFest(m, a, b, an);
    setzeFest(m, b, a, an);
  }
}

/**
 * Setzt die Bytes im Zickzack: Spaltenpaare von rechts nach links, abwechselnd aufwärts und
 * abwärts, die Taktspalte 6 übersprungen; freie Restmodule bleiben hell (Norm, Abschnitt 7.7.3).
 */
export function setzeDaten(m: Modulmatrix, bytes: readonly number[]): void {
  const bitanzahl = bytes.length * BITS_JE_BYTE;
  let n = 0;
  for (let rechts = m.groesse - 1; rechts >= 1; rechts -= 2) {
    if (rechts === TAKTLINIE) rechts = TAKTLINIE - 1;
    const aufwaerts = ((rechts + 1) & 2) === 0;
    for (let schritt = 0; schritt < m.groesse; schritt++) {
      const y = aufwaerts ? m.groesse - 1 - schritt : schritt;
      for (let j = 0; j < 2; j++) {
        const x = rechts - j;
        if (m.funktion[y]?.[x] || n >= bitanzahl) continue;
        const zeile = m.dunkel[y];
        const byte = bytes[Math.floor(n / BITS_JE_BYTE)] ?? 0;
        if (zeile) zeile[x] = bit(byte, BITS_JE_BYTE - 1 - (n % BITS_JE_BYTE));
        n++;
      }
    }
  }
}

/** Die acht Masken der Norm (Tabelle 10): true heißt, das Modul wird umgekehrt. */
const MASKEN: readonly ((x: number, y: number) => boolean)[] = [
  (x, y) => (x + y) % 2 === 0,
  (_x, y) => y % 2 === 0,
  (x) => x % 3 === 0,
  (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
  (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
  (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
  (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
];

/** Anzahl der Masken. */
export const MASKENANZAHL = MASKEN.length;

/**
 * Kehrt die Datenmodule nach Maske `maske` um (zweimal angewandt hebt sie sich auf).
 * Feste Module bleiben unberührt.
 */
export function wendeMaskeAn(m: Modulmatrix, maske: number): void {
  const regel = MASKEN[maske];
  if (!regel) throw new Error(`Unbekannte QR-Maske ${maske}`);
  m.dunkel.forEach((zeile, y) =>
    zeile.forEach((an, x) => {
      if (!m.funktion[y]?.[x] && regel(x, y)) zeile[x] = !an;
    }),
  );
}
