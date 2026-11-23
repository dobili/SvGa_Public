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
 * Rolle im Gesamtbild: weltdaten.ts lädt die Bilder hierüber; figurbilder.ts fragt beim Laden in
 * Phaser, welche Rahmengröße eine Adresse hat. Ohne Phaser, damit weltdaten.ts klein bleibt.
 * Abhängigkeiten: paket/paketlader.ts, figurhoehen.json.
 */
import { paketdateiAlsAdresseOderNull } from "../paket/paketlader";
import figurhoehen from "./figurhoehen.json";

/** Adressen der geladenen Bögen mit Rahmen 32 × 32. */
const grossbogen = new Set<string>();
/** Höhenfaktor je Adresse eines PixelLab-Bogens (nur wo er von 1 abweicht). */
const faktorJeAdresse = new Map<string, number>();
const FAKTOREN: Readonly<Record<string, number>> = figurhoehen.faktoren;

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
): Promise<string | null> {
  if (ALT.test(pfad)) {
    const neu = await lies(grosspfad(pfad));
    if (neu) {
      grossbogen.add(neu);
      const faktor = hoehenfaktor(bogenname(pfad));
      if (faktor !== 1) faktorJeAdresse.set(neu, faktor);
      return neu;
    }
  }
  return lies(pfad);
}
