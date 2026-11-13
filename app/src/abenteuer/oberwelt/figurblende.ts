/**
 * Eine Figur der Karte ein- oder ausblenden (Atmosphäre T9, `#figur:<name>:aus|ein|halb`).
 *
 * Rolle im Gesamtbild: Werkzeug der Oberwelt für die Bühnenanweisungen (buehne.ts). Die Figuren
 * legt szene.ts als Sprites mit dem Objektnamen der Karte an; hier wird nur ihre Deckkraft in
 * einer Sekunde verändert. Eine ausgeblendete Figur sperrt den Weg nicht mehr.
 * Abhängigkeiten: Phaser.
 */
import Phaser from "phaser";

/** Dauer des Blendens (ms). */
const BLENDEN_MS = 1000;

/**
 * Blendet die Figur `name` auf die Deckkraft `ziel` (0 bis 1). Eingaben: Szene, Objektname,
 * Ziel. Ausgabe: true, wenn es die Figur gibt. Beispiel: („ambrose“, 0.5) → Ambrose als Geist.
 */
export function blendeFigur(szene: Phaser.Scene, name: string, ziel: number): boolean {
  const figur = szene.children.getByName(name);
  if (!(figur instanceof Phaser.Physics.Arcade.Sprite)) return false;
  szene.tweens.killTweensOf(figur);
  szene.tweens.add({ targets: figur, alpha: ziel, duration: BLENDEN_MS });
  // Unsichtbare Figuren stehen nicht im Weg; sichtbare sperren wieder (szene.ts, Kollision).
  if (figur.body) figur.body.enable = ziel > 0;
  return true;
}
