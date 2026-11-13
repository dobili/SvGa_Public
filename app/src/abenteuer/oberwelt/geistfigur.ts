/**
 * Geisterhafte Figur auf der Karte zeichnen (Regeln in regeln/geist.ts): leicht durchsichtig, ganz
 * leicht kühl getönt und sanft auf und ab schwebend. Der feste Körper für die Kollision bleibt auf
 * der Fußkachel; nur das Bild schwebt.
 * Rolle im Gesamtbild: Hilfe für szene.ts (Figuren mit geist: true).
 * Abhängigkeiten: Phaser, regeln/geist.ts.
 */
import type Phaser from "phaser";
import {
  GEIST_DECKKRAFT,
  GEIST_SCHWEBEDAUER,
  GEIST_SCHWEBEN,
  GEIST_TOENUNG,
} from "../regeln/geist";

/**
 * Lässt einen Figuren-Sprite als Geist erscheinen. Eingabe: Szene (für das Schweben) und der Sprite,
 * der schon auf seiner Kachel steht. Beispiel: Ambrose auf dem Dachboden.
 */
export function zeigeAlsGeist(szene: Phaser.Scene, sprite: Phaser.GameObjects.Sprite): void {
  sprite.setAlpha(GEIST_DECKKRAFT).setTint(GEIST_TOENUNG);
  szene.tweens.add({
    targets: sprite,
    y: sprite.y - GEIST_SCHWEBEN,
    duration: GEIST_SCHWEBEDAUER,
    ease: "Sine.easeInOut",
    yoyo: true,
    repeat: -1,
  });
}
