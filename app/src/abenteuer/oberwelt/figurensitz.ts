/**
 * Sitzende Figuren und Statisten zeichnen (regeln in sitzrichtung.ts): Sitzbild aus der Sitzreihe
 * des Bogens oder das Standbild um SITZ_HUB Pixel höher, sodass die Figur hinter dem Tisch zu
 * sitzen scheint. Die Zeichentiefe bleibt die des Fußes, der Tisch davor verdeckt die Beine.
 * Rolle im Gesamtbild: Hilfe für szene.ts (Figuren) und belebungsschicht.ts (Statisten).
 * Abhängigkeiten: Phaser, sitzrichtung.ts.
 */
import Phaser from "phaser";
import { hatSitzbilder, SITZ_HUB, sitzbild } from "./sitzrichtung";
import type { Richtung } from "./szene";

/** Zahl der Rahmen eines Sprites (ohne den Grundrahmen „__BASE“ von Phaser). */
export function rahmenzahl(sprite: Phaser.GameObjects.Sprite): number {
  return sprite.texture.frameTotal - 1;
}

/**
 * Setzt einen Sprite, der schon auf seiner Kachel steht (stelleAufKachel oder fussUrsprungY),
 * auf das Sitzbild. Ohne Sitzreihe hebt der Ursprung das Bild um SITZ_HUB an; ein fester Körper
 * bleibt auf der Fußkachel.
 */
export function setzeSitzend(sprite: Phaser.GameObjects.Sprite, richtung: Richtung): void {
  const rahmen = rahmenzahl(sprite);
  sprite.setFrame(sitzbild(rahmen, richtung));
  if (hatSitzbilder(rahmen)) return;
  sprite.setOrigin(sprite.originX, sprite.originY + SITZ_HUB / sprite.frame.height);
  const koerper = (sprite as Phaser.Physics.Arcade.Sprite).body;
  if (koerper instanceof Phaser.Physics.Arcade.StaticBody) {
    koerper.setOffset(koerper.offset.x, koerper.offset.y + SITZ_HUB);
    (sprite as Phaser.Physics.Arcade.Sprite).refreshBody();
  }
}
