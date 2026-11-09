/**
 * Figurenbilder im Format von LimeZu (Charakter-Generator aus Modern Interiors): Rahmen 16 × 32,
 * obere Reihe vier Standbilder (rechts, oben, links, unten), untere Reihe Laufen mit sechs Bildern
 * je Richtung in derselben Reihenfolge (zugeschnitten von werkzeuge/figuren.py im privaten
 * Repository). Fehlt ein Bild, nimmt die Szene den Platzhalter (16 × 16, ein Bild je Richtung).
 *
 * Rolle im Gesamtbild: Hilfen für oberwelt/szene.ts, ausgelagert, damit die Szene klein bleibt.
 * Abhängigkeiten: Phaser.
 */
import Phaser from "phaser";
import type { Richtung } from "./szene";

/** Rahmen einer Figur von LimeZu. */
export const FIGUR_BREITE = 16;
export const FIGUR_HOEHE = 32;
/** Laufbilder je Richtung und Bilder je Sekunde. */
const LAUFBILDER = 6;
const BILDRATE = 10;
/** Erstes Laufbild im Bogen (zweite Reihe, 24 Rahmen breit). */
const LAUF_BEGINN = 24;

/** Reihenfolge der Richtungen bei LimeZu. */
const REIHENFOLGE: readonly Richtung[] = ["rechts", "oben", "links", "unten"];

/** Standbild einer Blickrichtung. */
export function standbild(richtung: Richtung): number {
  return REIHENFOLGE.indexOf(richtung);
}

/** Name der Laufanimation eines Bildes in einer Richtung. */
export function laufname(schluessel: string, richtung: Richtung): string {
  return `${schluessel}:lauf:${richtung}`;
}

/** Lädt einen Bogen im Format von LimeZu. */
export function ladeFigurbogen(szene: Phaser.Scene, schluessel: string, adresse: string): void {
  szene.load.spritesheet(schluessel, adresse, {
    frameWidth: FIGUR_BREITE,
    frameHeight: FIGUR_HOEHE,
  });
}

/** Legt die vier Laufanimationen eines Bogens an (einmal je Schlüssel). */
export function erzeugeLaufanimationen(szene: Phaser.Scene, schluessel: string): void {
  REIHENFOLGE.forEach((richtung, i) => {
    const name = laufname(schluessel, richtung);
    if (szene.anims.exists(name)) return;
    const beginn = LAUF_BEGINN + i * LAUFBILDER;
    szene.anims.create({
      key: name,
      frames: szene.anims.generateFrameNumbers(schluessel, {
        start: beginn,
        end: beginn + LAUFBILDER - 1,
      }),
      frameRate: BILDRATE,
      repeat: -1,
    });
  });
}

/**
 * Stellt einen Sprite im Format von LimeZu auf die Kachel: Die untere Hälfte (die Füße) steht auf
 * der Kachel, der Kopf ragt in die Kachel darüber. Der Körper für Kollisionen ist die untere Kachel.
 */
export function stelleAufKachel(sprite: Phaser.Physics.Arcade.Sprite, kachel: number): void {
  sprite.setOrigin(0.5, 1 - kachel / 2 / FIGUR_HOEHE);
  const koerper = sprite.body;
  if (koerper instanceof Phaser.Physics.Arcade.Body) {
    koerper.setSize(kachel - 4, kachel - 4).setOffset(2, FIGUR_HOEHE - kachel + 2);
  } else if (koerper instanceof Phaser.Physics.Arcade.StaticBody) {
    koerper.setSize(kachel, kachel).setOffset(0, FIGUR_HOEHE - kachel);
    sprite.refreshBody();
  }
}
