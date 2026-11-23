/**
 * Schwimmanimationen der PixelLab-Tiere: Reihe 4 des Tierbogens (sechs Bilder je Richtung, wie das
 * Laufen), für Schwimmer mit eigenen Schwimmbildern (tiere.ts, mitSchwimmbildern).
 *
 * Rolle im Gesamtbild: Hilfe für belebungsschicht.ts, ausgelagert, damit die Schicht unter 400
 * Zeilen bleibt (Regel 4). Abhängigkeiten: Phaser, tiere.ts.
 */
import Phaser from "phaser";
import type { Richtung } from "./szene";
import { SCHWIMM_BEGINN } from "./tiere";

/** Bilder der Schwimmbewegung je Richtung und Bildrate (wie das Laufen, figurbilder.ts). */
const SCHWIMMBILDER = 6;
const SCHWIMM_BILDRATE = 8;
const RICHTUNGEN: readonly Richtung[] = ["rechts", "oben", "links", "unten"];

export function schwimmname(bogen: string, richtung: Richtung): string {
  return `${bogen}:schwimm:${richtung}`;
}

/** Schwimmanimationen eines Tierbogens mit Schwimmreihen (PixelLab, Reihe 4), einmal je Bogen. */
export function erzeugeSchwimmanimationen(szene: Phaser.Scene, bogen: string): void {
  RICHTUNGEN.forEach((richtung, i) => {
    const name = schwimmname(bogen, richtung);
    if (szene.anims.exists(name)) return;
    const start = SCHWIMM_BEGINN + i * SCHWIMMBILDER;
    szene.anims.create({
      key: name,
      frames: szene.anims.generateFrameNumbers(bogen, { start, end: start + SCHWIMMBILDER - 1 }),
      frameRate: SCHWIMM_BILDRATE,
      repeat: -1,
    });
  });
}
