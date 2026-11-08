/**
 * QR-Code aus einem Text, ganz auf dem Gerät (ISO/IEC 18004, Byte-Modus, Stufe M, Version 1–10).
 *
 * Rolle im Gesamtbild: „App weitergeben“ (AppWeitergeben.tsx) zeigt die Adresse der
 * Installationsseite als QR-Code, damit ein Freund sie vom Bildschirm abscannt. Wunsch des
 * Autors (8.11.2026): offline, ohne Server, ohne große Abhängigkeit; deshalb eine kleine eigene
 * Umsetzung statt einer Bibliothek. Geprüft gegen Referenzmatrizen eines verbreiteten Erzeugers
 * (qrcode.test.ts). Ablauf: Text als UTF-8 → kleinste passende Version → Bitfolge mit Modus,
 * Länge, Daten, Abschluss und Füllbytes → Blöcke mit Reed-Solomon-Korrektur, verschränkt →
 * Matrix → beste der acht Masken nach Strafpunkten.
 * Abhängigkeiten: galoisfeld.ts, qrtabellen.ts, qrmatrix.ts, qrstrafe.ts.
 */
import { bit, BITS_JE_BYTE, generatorpolynom, korrekturbytes } from "./galoisfeld";
import {
  leereMatrix,
  MASKENANZAHL,
  setzeDaten,
  setzeFormat,
  wendeMaskeAn,
  zeichneFunktionsmuster,
} from "./qrmatrix";
import { strafpunkte } from "./qrstrafe";
import { HOECHSTE_VERSION, versionsangaben, type Versionsangaben } from "./qrtabellen";

/** Der fertige Code: Kantenlänge, Zeilen der Module (dunkel = true), Version und Maske. */
export interface QrCode {
  readonly groesse: number;
  readonly module: readonly (readonly boolean[])[];
  readonly version: number;
  readonly maske: number;
}

/** Moduskennung „Byte“ (Norm, Tabelle 2). */
const MODUS_BYTE = 0b0100;
const MODUSBITS = 4;
/** Bits der Längenangabe im Byte-Modus: Version 1–9 acht, ab 10 sechzehn (Norm, Tabelle 3). */
const LAENGENBITS_KLEIN = 8;
const LAENGENBITS_GROSS = 16;
const GROSSE_LAENGE_AB = 10;
/** Höchstens vier Nullbits als Abschluss. */
const ABSCHLUSSBITS = 4;
/** Die abwechselnden Füllbytes (Norm, Abschnitt 7.4.10). */
const FUELLBYTES = [0xec, 0x11] as const;

/** Bits der Längenangabe einer Version. */
function laengenbits(version: number): number {
  return version < GROSSE_LAENGE_AB ? LAENGENBITS_KLEIN : LAENGENBITS_GROSS;
}

/** Die kleinste Version, in die `anzahl` Bytes passen; Fehler, wenn keine reicht. */
function waehleVersion(anzahl: number): Versionsangaben {
  for (let version = 1; version <= HOECHSTE_VERSION; version++) {
    const angaben = versionsangaben(version);
    const noetig = MODUSBITS + laengenbits(version) + anzahl * BITS_JE_BYTE;
    if (noetig <= angaben.datenbytes * BITS_JE_BYTE) return angaben;
  }
  throw new Error(`Text zu lang für den QR-Code (${anzahl} Bytes)`);
}

/** Hängt `anzahl` Bits von `wert` an (höchstes zuerst). */
function haengeAn(bits: boolean[], wert: number, anzahl: number): void {
  for (let i = anzahl - 1; i >= 0; i--) bits.push(bit(wert, i));
}

/**
 * Die Datenbytes: Modus, Länge, Bytes, Abschluss, auf volle Bytes, dann Füllbytes.
 * Beispiel: „HELLO WORLD“ in Version 1 → 16 Bytes, beginnend mit 0x40 0xB4 (Modus 4, Länge 11).
 */
export function datenbytes(inhalt: readonly number[], angaben: Versionsangaben): number[] {
  const bits: boolean[] = [];
  haengeAn(bits, MODUS_BYTE, MODUSBITS);
  haengeAn(bits, inhalt.length, laengenbits(angaben.version));
  for (const byte of inhalt) haengeAn(bits, byte, BITS_JE_BYTE);
  const platz = angaben.datenbytes * BITS_JE_BYTE;
  haengeAn(bits, 0, Math.min(ABSCHLUSSBITS, platz - bits.length));
  haengeAn(bits, 0, (BITS_JE_BYTE - (bits.length % BITS_JE_BYTE)) % BITS_JE_BYTE);
  const bytes: number[] = [];
  for (let i = 0; i < bits.length; i += BITS_JE_BYTE) {
    bytes.push(
      bits.slice(i, i + BITS_JE_BYTE).reduce((summe, an) => (summe << 1) | (an ? 1 : 0), 0),
    );
  }
  for (let i = 0; bytes.length < angaben.datenbytes; i++) {
    bytes.push(FUELLBYTES[i % FUELLBYTES.length] ?? 0);
  }
  return bytes;
}

/**
 * Teilt die Datenbytes in Blöcke (kurze zuerst, lange haben ein Byte mehr), hängt an jeden seine
 * Korrekturbytes und verschränkt alles spaltenweise (Norm, Abschnitt 7.6).
 */
export function mitKorrektur(daten: readonly number[], angaben: Versionsangaben): number[] {
  const { bloecke, korrekturJeBlock, bytes } = angaben;
  const kurze = bloecke - (bytes % bloecke);
  const kurzeDaten = Math.floor(bytes / bloecke) - korrekturJeBlock;
  const generator = generatorpolynom(korrekturJeBlock);
  const datenbloecke: number[][] = [];
  const korrekturbloecke: number[][] = [];
  let stelle = 0;
  for (let i = 0; i < bloecke; i++) {
    const laenge = kurzeDaten + (i < kurze ? 0 : 1);
    const block = daten.slice(stelle, stelle + laenge);
    stelle += laenge;
    datenbloecke.push(block);
    korrekturbloecke.push(korrekturbytes(block, generator));
  }
  return [
    ...verschraenke(datenbloecke, kurzeDaten + 1),
    ...verschraenke(korrekturbloecke, korrekturJeBlock),
  ];
}

/** Nimmt Byte für Byte der Reihe nach aus jedem Block; kürzere Blöcke werden übersprungen. */
function verschraenke(bloecke: readonly (readonly number[])[], laenge: number): number[] {
  const folge: number[] = [];
  for (let i = 0; i < laenge; i++) {
    for (const block of bloecke) {
      const byte = block[i];
      if (byte !== undefined) folge.push(byte);
    }
  }
  return folge;
}

/**
 * Der QR-Code eines Textes.
 * Eingaben: Text (UTF-8), wahlweise eine feste Maske 0–7 (für Tests); ohne Maske die beste.
 * Beispiel: „https://schach-von-grund-auf.com/installieren/“ → Version 4 (33 × 33), Maske 2.
 * Sonderfälle: Mehr als 213 Bytes übersteigen Version 10 und werfen einen Fehler.
 */
export function erzeugeQrCode(text: string, festeMaske?: number): QrCode {
  const inhalt = [...new TextEncoder().encode(text)];
  const angaben = waehleVersion(inhalt.length);
  const bytes = mitKorrektur(datenbytes(inhalt, angaben), angaben);
  const matrix = leereMatrix(angaben.version);
  zeichneFunktionsmuster(matrix, angaben.version);
  setzeDaten(matrix, bytes);
  let maske = festeMaske ?? 0;
  if (festeMaske === undefined) {
    let beste = Number.POSITIVE_INFINITY;
    for (let kandidat = 0; kandidat < MASKENANZAHL; kandidat++) {
      wendeMaskeAn(matrix, kandidat);
      setzeFormat(matrix, kandidat);
      const strafe = strafpunkte(matrix.dunkel);
      if (strafe < beste) [beste, maske] = [strafe, kandidat];
      wendeMaskeAn(matrix, kandidat);
    }
  }
  wendeMaskeAn(matrix, maske);
  setzeFormat(matrix, maske);
  return { groesse: matrix.groesse, module: matrix.dunkel, version: angaben.version, maske };
}

/** Ruhezone um den Code in Modulen (ISO/IEC 18004, Abschnitt 6.3.8). */
export const RUHEZONE = 4;

/**
 * Pfad aller dunklen Module, je eines als Quadrat 1 × 1, um die Ruhezone verschoben.
 * Beispiel: dunkles Modul oben links → „M4 4h1v1h-1z“.
 */
export function qrPfad(code: QrCode): string {
  const teile: string[] = [];
  code.module.forEach((zeile, y) =>
    zeile.forEach((dunkel, x) => {
      if (dunkel) teile.push(`M${x + RUHEZONE} ${y + RUHEZONE}h1v1h-1z`);
    }),
  );
  return teile.join("");
}
