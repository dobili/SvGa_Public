/**
 * Sitzende Figuren und Statisten zeichnen (Regeln in sitzrichtung.ts und sitzplatz.ts): Sitzbild
 * aus der Sitzreihe des Bogens oder das Standbild um SITZ_HUB Pixel höher, dazu (seit dem Spieltest
 * Variante B, F2) auf das Sitzmöbel verschoben (sitzplatz.ts), damit die Figur auf ihrem Stuhl
 * sitzt statt daneben. Verschoben wird nur das Bild über den Ursprung: Lage, Kachel und Körper bleiben.
 * Rolle im Gesamtbild: Hilfe für figurenaufstellung.ts (Figuren) und belebungsschicht.ts (Statisten).
 * Abhängigkeiten: Phaser, sitzrichtung.ts, sitzplatz.ts (Typ).
 */
import Phaser from "phaser";
import type { Sitzlage } from "./sitzplatz";
import { hatSitzbilder, SITZ_HUB, sitzbild } from "./sitzrichtung";
import type { Richtung } from "./szene";

/** Zahl der Rahmen eines Sprites (ohne den Grundrahmen „__BASE“ von Phaser). */
export function rahmenzahl(sprite: Phaser.GameObjects.Sprite): number {
  return sprite.texture.frameTotal - 1;
}

/**
 * Setzt einen Sprite, der schon auf seiner Kachel steht (stelleAufKachel oder fussUrsprungY),
 * auf das Sitzbild. Ohne Sitzreihe hebt der Ursprung das Bild um SITZ_HUB an; mit `lage`
 * (sitzplatz.ts) rückt das Bild um dx, dy Kartenpixel auf das Sitzmöbel. Ein fester Körper bleibt
 * auf der Fußkachel. Beispiel: Sam im Clubraum, lage dx 6, dy −5 → Bild 6 nach rechts und 9 nach
 * oben (5 an die Stuhlbeine, 4 Hub bei 2/3), Körper unverändert auf (5, 8).
 */
export function setzeSitzend(
  sprite: Phaser.GameObjects.Sprite,
  richtung: Richtung,
  lage?: Sitzlage | null,
): void {
  const rahmen = rahmenzahl(sprite);
  sprite.setFrame(sitzbild(rahmen, richtung));
  // Alles in Kartenpixeln; der Hub zählt in Figurenpixeln, also mal Maßstab (PixelLab 2/3).
  const hub = hatSitzbilder(rahmen) ? 0 : SITZ_HUB * sprite.scaleY;
  const dx = lage?.dx ?? 0;
  const dy = (lage?.dy ?? 0) - hub;
  if (dx === 0 && dy === 0) return;
  const breite = sprite.frame.width * sprite.scaleX;
  const hoehe = sprite.frame.height * sprite.scaleY;
  sprite.setOrigin(sprite.originX - dx / breite, sprite.originY - dy / hoehe);
  const koerper = (sprite as Phaser.Physics.Arcade.Sprite).body;
  if (koerper instanceof Phaser.Physics.Arcade.StaticBody) {
    // Der feste Körper hängt an der linken oberen Bildecke: um die Verschiebung zurück.
    koerper.setOffset(koerper.offset.x - dx, koerper.offset.y - dy);
    (sprite as Phaser.Physics.Arcade.Sprite).refreshBody();
  }
}
