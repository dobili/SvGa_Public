/**
 * Tafeln und kleine Rechnungen des QR-Codes nach ISO/IEC 18004: Größe je Version, Blöcke der
 * Fehlerkorrektur, Lage der Ausrichtungsmuster, Format- und Versionsinformation.
 *
 * Rolle im Gesamtbild: Grundlage für qrcode.ts und qrmatrix.ts. Die App braucht nur kurze
 * Adressen (die Installationsseite, etwa 50 Zeichen); deshalb nur die Versionen 1 bis 10 und nur
 * die Stufe M der Fehlerkorrektur (etwa 15 % der Module dürfen fehlen), die übliche Wahl für
 * Links. Längere Texte lehnt qrcode.ts mit einem Fehler ab.
 * Abhängigkeiten: galoisfeld.ts (bit).
 */
import { BITS_JE_BYTE } from "./galoisfeld";

/** Höchste unterstützte Version (21 + 4·9 = 57 Module Kantenlänge). */
export const HOECHSTE_VERSION = 10;
/** Kantenlänge der Version 1 in Modulen. */
const GRUNDGROESSE = 17;
/** Zuwachs der Kantenlänge je Version. */
const MODULE_JE_VERSION = 4;
/** Ab dieser Version trägt der Code eine Versionsinformation. */
export const VERSIONSINFO_AB = 7;

/** Stufe M: Korrekturbytes je Block, Version 1 bis 10 (Norm, Tabelle 9). */
const KORREKTUR_JE_BLOCK_M = [10, 16, 26, 18, 24, 16, 18, 22, 22, 26] as const;
/** Stufe M: Anzahl der Blöcke, Version 1 bis 10 (Norm, Tabelle 9). */
const BLOECKE_M = [1, 1, 1, 2, 2, 4, 4, 4, 5, 5] as const;
/** Formatbits der Stufe M (Norm, Tabelle 12: L = 01, M = 00, Q = 11, H = 10). */
const STUFE_M_BITS = 0b00;

/** BCH-Polynom der Formatinformation und deren XOR-Maske (Norm, Anhang C). */
const FORMAT_POLYNOM = 0x537;
const FORMAT_MASKE = 0x5412;
const FORMAT_PRUEFBITS = 10;
/** BCH-Polynom der Versionsinformation (Norm, Anhang D). */
const VERSION_POLYNOM = 0x1f25;
const VERSION_PRUEFBITS = 12;
const BITS_DER_MASKENNUMMER = 3;

/** Was eine Version für die Stufe M bereithält. */
export interface Versionsangaben {
  readonly version: number;
  readonly groesse: number;
  /** Bytes insgesamt (Daten und Korrektur). */
  readonly bytes: number;
  readonly bloecke: number;
  readonly korrekturJeBlock: number;
  /** Datenbytes, die übrig bleiben. */
  readonly datenbytes: number;
}

/** Kantenlänge einer Version. Beispiel: 1 → 21, 4 → 33. */
export function kantenlaenge(version: number): number {
  return GRUNDGROESSE + MODULE_JE_VERSION * version;
}

/** Anzahl der Ausrichtungsmuster je Zeile (Version 1: keine). */
function ausrichtungsanzahl(version: number): number {
  return version === 1 ? 0 : Math.floor(version / VERSIONSINFO_AB) + 2;
}

/**
 * Module, die für Daten und Korrektur frei bleiben (alles außer Such-, Takt-, Ausrichtungsmustern,
 * Format- und Versionsinformation). Geschlossene Form nach Nayuki (MIT), aus der Norm hergeleitet:
 * (16v + 128)·v + 64 ist die Fläche ohne Such- und Taktmuster und Formatbereiche; je Zahl a der
 * Ausrichtungsmuster in einer Achse fallen (25a − 10)·a − 55 Module weg, ab Version 7 dazu
 * 2 · 18 Versionsbits. Beispiel: Version 1 → 208 (26 Bytes), Version 4 → 807 (100 Bytes).
 */
export function freieModule(version: number): number {
  let frei = (16 * version + 128) * version + 64;
  const anzahl = ausrichtungsanzahl(version);
  if (anzahl > 0) frei -= (25 * anzahl - 10) * anzahl - 55;
  if (version >= VERSIONSINFO_AB) frei -= 36;
  return frei;
}

/** Die Angaben einer Version in Stufe M. Beispiel: 4 → 100 Bytes, 2 Blöcke, 64 Datenbytes. */
export function versionsangaben(version: number): Versionsangaben {
  const stelle = version - 1;
  const bloecke = BLOECKE_M[stelle] ?? 1;
  const korrekturJeBlock = KORREKTUR_JE_BLOCK_M[stelle] ?? 0;
  const bytes = Math.floor(freieModule(version) / BITS_JE_BYTE);
  return {
    version,
    groesse: kantenlaenge(version),
    bytes,
    bloecke,
    korrekturJeBlock,
    datenbytes: bytes - bloecke * korrekturJeBlock,
  };
}

/**
 * Mittelpunkte der Ausrichtungsmuster in einer Achse (Norm, Anhang E), gleichmäßig verteilt vom
 * Rand (Kante − 7) zurück bis 6. Beispiel: Version 2 → [6, 18], Version 7 → [6, 22, 38].
 */
export function ausrichtungspositionen(version: number): number[] {
  const anzahl = ausrichtungsanzahl(version);
  if (anzahl === 0) return [];
  const kante = kantenlaenge(version);
  const schritt = Math.ceil((kante - 13) / (anzahl * 2 - 2)) * 2;
  const positionen = [6];
  for (let pos = kante - 7; positionen.length < anzahl; pos -= schritt) {
    positionen.splice(1, 0, pos);
  }
  return positionen;
}

/**
 * Die 15 Formatbits für Stufe M und eine Maske 0 bis 7: 5 Datenbits, 10 BCH-Prüfbits, XOR-Maske.
 * Beispiel: Maske 0 → 0b101010000010010 (Norm, Anhang C, Tabelle C.1).
 */
export function formatbits(maske: number): number {
  const daten = (STUFE_M_BITS << BITS_DER_MASKENNUMMER) | maske;
  let rest = daten;
  for (let i = 0; i < FORMAT_PRUEFBITS; i++) {
    rest = (rest << 1) ^ ((rest >>> (FORMAT_PRUEFBITS - 1)) * FORMAT_POLYNOM);
  }
  return ((daten << FORMAT_PRUEFBITS) | rest) ^ FORMAT_MASKE;
}

/**
 * Die 18 Versionsbits ab Version 7: 6 Datenbits und 12 BCH-Prüfbits.
 * Beispiel: Version 7 → 0x07c94 (Norm, Anhang D, Tabelle D.1).
 */
export function versionsbits(version: number): number {
  let rest = version;
  for (let i = 0; i < VERSION_PRUEFBITS; i++) {
    rest = (rest << 1) ^ ((rest >>> (VERSION_PRUEFBITS - 1)) * VERSION_POLYNOM);
  }
  return (version << VERSION_PRUEFBITS) | rest;
}
