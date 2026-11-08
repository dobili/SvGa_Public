/**
 * Fehlerkorrektur des QR-Codes (Reed-Solomon über dem Galoisfeld GF(256)), nach ISO/IEC 18004.
 *
 * Rolle im Gesamtbild: Der QR-Code für „App weitergeben“ (qrcode.ts) entsteht ganz auf dem Gerät,
 * ohne Server und ohne fremde Bibliothek (Wunsch des Autors, 8.11.2026: offline, keine große
 * Abhängigkeit). Hier nur die Rechnung, die zu jedem Datenblock die Korrekturbytes liefert; damit
 * bleibt der Code lesbar, auch wenn ein Teil des Bildschirms spiegelt oder verdeckt ist.
 * Abhängigkeiten: keine.
 */

/** Das erzeugende Polynom des Feldes: x⁸ + x⁴ + x³ + x² + 1 (Norm, Abschnitt 7.5.2). */
const FELDPOLYNOM = 0x11d;
/** Bits je Byte. */
const BITS_JE_BYTE = 8;
/** Das höchste Bit eines Bytes, an dem die Reduktion ansetzt. */
const HOECHSTES_BIT = 7;
/** Die erzeugende Wurzel α = 2. */
const ALPHA = 0x02;

/**
 * Multipliziert zwei Elemente des Feldes (ohne Tafeln, Bit für Bit).
 * Warum ohne Tafeln: Ein QR-Code der App braucht nur einige hundert Produkte; das bleibt schnell
 * und spart Speicher. Beispiel: gfMal(2, 128) → 29 (0x1d, denn 2·128 = 256 wird reduziert).
 */
export function gfMal(a: number, b: number): number {
  let produkt = 0;
  for (let bit = HOECHSTES_BIT; bit >= 0; bit--) {
    produkt = (produkt << 1) ^ ((produkt >>> HOECHSTES_BIT) * FELDPOLYNOM);
    produkt ^= ((b >>> bit) & 1) * a;
  }
  return produkt;
}

/**
 * Das Generatorpolynom vom Grad `grad`: (x − α⁰)(x − α¹)…(x − α^(grad−1)), ohne die führende 1.
 * Eingabe: Anzahl der Korrekturbytes je Block. Ausgabe: `grad` Koeffizienten, höchster zuerst.
 * Beispiel: grad 2 → [3, 2] (x² + 3x + 2).
 */
export function generatorpolynom(grad: number): number[] {
  const koeffizienten: number[] = new Array<number>(grad - 1).fill(0);
  koeffizienten.push(1);
  let wurzel = 1;
  for (let i = 0; i < grad; i++) {
    for (let j = 0; j < koeffizienten.length; j++) {
      const naechster = j + 1 < koeffizienten.length ? (koeffizienten[j + 1] ?? 0) : 0;
      koeffizienten[j] = gfMal(koeffizienten[j] ?? 0, wurzel) ^ naechster;
    }
    wurzel = gfMal(wurzel, ALPHA);
  }
  return koeffizienten;
}

/**
 * Die Korrekturbytes eines Datenblocks: Rest der Polynomdivision durch das Generatorpolynom.
 * Eingaben: Datenbytes, Generatorpolynom (generatorpolynom). Ausgabe: so viele Bytes wie sein Grad.
 * Sonderfall: Leere Daten ergeben lauter Nullen.
 */
export function korrekturbytes(daten: readonly number[], generator: readonly number[]): number[] {
  const rest: number[] = new Array<number>(generator.length).fill(0);
  for (const byte of daten) {
    const faktor = byte ^ (rest.shift() ?? 0);
    rest.push(0);
    generator.forEach((koeffizient, i) => {
      rest[i] = (rest[i] ?? 0) ^ gfMal(koeffizient, faktor);
    });
  }
  return rest;
}

/** Bit `stelle` (0 = niedrigstes) einer Zahl. Beispiel: bit(0b100, 2) → true. */
export function bit(zahl: number, stelle: number): boolean {
  return ((zahl >>> stelle) & 1) !== 0;
}

export { BITS_JE_BYTE };
