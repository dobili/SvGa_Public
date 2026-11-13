/**
 * Welcher Figurenbogen gilt (Wunsch des Haupt-Chats, 13.11.2026): Figuren aus PixelLab liegen als
 * Bogen mit Rahmen 32 × 32 unter `figuren32/<name>.png` (zusammengesetzt von
 * skripte/figurenbogen.mjs beim Paketbau); fehlt einer, gilt der alte Bogen von LimeZu unter
 * `figuren/<name>.png` (Rahmen 16 × 32). Beide haben dieselbe Ordnung der Rahmen.
 *
 * Rolle im Gesamtbild: weltdaten.ts lädt die Bilder hierüber; figurbilder.ts fragt beim Laden in
 * Phaser, welche Rahmengröße eine Adresse hat. Ohne Phaser, damit weltdaten.ts klein bleibt.
 * Abhängigkeiten: paket/paketlader.ts.
 */
import { paketdateiAlsAdresseOderNull } from "../paket/paketlader";

/** Adressen der geladenen Bögen mit Rahmen 32 × 32. */
const grossbogen = new Set<string>();

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
      return neu;
    }
  }
  return lies(pfad);
}
