/**
 * Welcher Figurenbogen gilt (Wunsch des Haupt-Chats, 13.11.2026): Figuren aus PixelLab liegen als
 * Bogen mit Rahmen 32 × 32 unter `figuren32/<name>.png` (zusammengesetzt von
 * skripte/figurenbogen.mjs beim Paketbau); fehlt einer, gilt der alte Bogen von LimeZu unter
 * `figuren/<name>.png` (Rahmen 16 × 32). Beide haben dieselbe Ordnung der Rahmen.
 *
 * Höhenfaktor (Auftrag des Haupt-Chats, 23.11.2026): PixelLab hält die Größen der Prompts nicht
 * ein (Jugendliche so groß wie Erwachsene, manche Erwachsene drei Pixel kleiner). Je PixelLab-Bogen
 * steht in figurhoehen.json ein Faktor, mit dem die Figur gezeichnet wird (gemessen und berechnet von
 * pipeline/abenteuer/pixellabhoehen.py, Zielhöhen je Altersgruppe). figurbilder.ts liest ihn je
 * Adresse und nimmt ihn in den Maßstab der Figur.
 *
 * Hohe Rahmen (Auftrag des Haupt-Chats, 25.11.2026): Ein Bogen kann Rahmen von 32 × 48 haben (der
 * Schiffskoch, dessen Mütze auf 32 × 32 abgeschnitten war). Welche, steht im Index
 * figuren32/rahmenhoehen.json des Pakets (skripte/figurenbogen.mjs schreibt ihn, nur Figuren mit
 * einer Höhe über 32); ohne Index oder Eintrag gilt 32.
 *
 * Schrägen (Wunsch des Autors, 26.11.2026, diagonales Laufen): Held, Heldin, Juno und Mama haben am Ende ihres
 * Bogens drei Reihen mit Standbildern, Gehen und Rennen in den vier Schrägen. Wo sie beginnen, steht
 * im Index figuren32/diagonalen.json (skripte/figurdiagonalen.mjs); ohne Eintrag hat der Bogen keine.
 *
 * Rolle im Gesamtbild: weltdaten.ts lädt die Bilder hierüber; figurbilder.ts fragt beim Laden in
 * Phaser, welche Rahmengröße eine Adresse hat. Ohne Phaser, damit weltdaten.ts klein bleibt.
 * Abhängigkeiten: paket/paketlader.ts, figurhoehen.json.
 */
import { liesPaketJson, paketdateiAlsAdresseOderNull } from "../paket/paketlader";
import figurhoehen from "./figurhoehen.json";

/** Adressen der geladenen Bögen mit Rahmen 32 × 32. */
const grossbogen = new Set<string>();
/** Höhenfaktor je Adresse eines PixelLab-Bogens (nur wo er von 1 abweicht). */
const faktorJeAdresse = new Map<string, number>();
const FAKTOREN: Readonly<Record<string, number>> = figurhoehen.faktoren;
/** Rahmenhöhe je Adresse eines PixelLab-Bogens (nur wo sie von 32 abweicht). */
const hoeheJeAdresse = new Map<string, number>();
/** Rahmenhöhe der gewöhnlichen PixelLab-Bögen. */
export const GROSS_HOEHE = 32;

/** Bogenname → Rahmenhöhe (Index des Pakets); Einträge nur für Höhen über 32. */
export type Rahmenhoehen = Readonly<Record<string, number>>;
const RAHMENINDEX = "figuren32/rahmenhoehen.json";
let rahmenvorrat: Promise<Rahmenhoehen> | null = null;

/** Der Index der Rahmenhöhen, einmal je Sitzung; leer ohne Datei (ältere Pakete, CI). */
export function ladeRahmenhoehen(): Promise<Rahmenhoehen> {
  rahmenvorrat ??= liesPaketJson<Rahmenhoehen>(RAHMENINDEX).catch(() => ({}));
  return rahmenvorrat;
}

/** Rahmenhöhe des PixelLab-Bogens hinter einer Adresse (32, beim Schiffskoch 48). */
export function rahmenhoeheDerAdresse(adresse: string): number {
  return hoeheJeAdresse.get(adresse) ?? GROSS_HOEHE;
}

/** Bogenname → erster Rahmen der Schrägen (Index des Pakets). */
export type Diagonalindex = Readonly<Record<string, number>>;
const DIAGONALINDEX = "figuren32/diagonalen.json";
let diagonalvorrat: Promise<Diagonalindex> | null = null;
/** Erster Rahmen der Schrägen je Adresse eines PixelLab-Bogens (nur Bögen mit Schrägen). */
const diagonalJeAdresse = new Map<string, number>();

/** Der Index der Schrägen, einmal je Sitzung; leer ohne Datei (ältere Pakete, CI). */
export function ladeDiagonalindex(): Promise<Diagonalindex> {
  diagonalvorrat ??= liesPaketJson<Diagonalindex>(DIAGONALINDEX).catch(() => ({}));
  return diagonalvorrat;
}

/** Erster Rahmen der Schrägen im Bogen hinter einer Adresse, oder null (keine Schrägen). */
export function diagonalbeginnDerAdresse(adresse: string): number | null {
  return diagonalJeAdresse.get(adresse) ?? null;
}

/** Name eines Bogens aus seinem Pfad. Beispiel: figuren/juno.png → juno. */
function bogenname(pfad: string): string {
  return pfad.replace(/^.*\//, "").replace(/\.png$/, "");
}

/** Höhenfaktor eines Bogens nach Namen (figurhoehen.json), sonst 1. Beispiel: „held-0“ → 0,887. */
export function hoehenfaktor(name: string): number {
  return FAKTOREN[name] ?? 1;
}

/** Höhenfaktor des PixelLab-Bogens hinter einer Adresse, sonst 1 (LimeZu-Bögen bleiben, wie sie sind). */
export function hoehenfaktorDerAdresse(adresse: string): number {
  return faktorJeAdresse.get(adresse) ?? 1;
}

/** Ordner der PixelLab-Bögen statt `figuren/`. */
const ALT = /^figuren\//;
const NEU = "figuren32/";

/** Pfad des PixelLab-Bogens zu einem alten Pfad. Beispiel: figuren/juno.png → figuren32/juno.png. */
export function grosspfad(pfad: string): string {
  return pfad.replace(ALT, NEU);
}

/** Hat der Bogen hinter dieser Adresse Rahmen von 32 × 32? */
export function istGrossbogen(adresse: string): boolean {
  return grossbogen.has(adresse);
}

/**
 * Die Adresse des Bogens einer Figur: zuerst PixelLab, sonst LimeZu, sonst null.
 * Eingabe: alter Pfad (figuren/…). `lies` ist im Test austauschbar.
 */
export async function figurenbildAdresse(
  pfad: string,
  lies: (pfad: string) => Promise<string | null> = paketdateiAlsAdresseOderNull,
  hoehen: () => Promise<Rahmenhoehen> = ladeRahmenhoehen,
  diagonalen: () => Promise<Diagonalindex> = ladeDiagonalindex,
): Promise<string | null> {
  if (ALT.test(pfad)) {
    const neu = await lies(grosspfad(pfad));
    if (neu) {
      grossbogen.add(neu);
      const name = bogenname(pfad);
      const faktor = hoehenfaktor(name);
      if (faktor !== 1) faktorJeAdresse.set(neu, faktor);
      const hoehe = (await hoehen())[name];
      if (hoehe && hoehe !== GROSS_HOEHE) hoeheJeAdresse.set(neu, hoehe);
      const schraeg = (await diagonalen())[name];
      if (typeof schraeg === "number") diagonalJeAdresse.set(neu, schraeg);
      return neu;
    }
  }
  return lies(pfad);
}
