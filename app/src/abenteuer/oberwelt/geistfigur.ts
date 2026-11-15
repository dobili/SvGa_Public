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

/** Dauer des Einblendens einer erscheinenden Figur (ms). */
const ERSCHEINEN_MS = 1200;
/** So viele Felder vor dem Helden erscheint eine Figur (hinter dem Gegenstand, den er ansieht). */
const ERSCHEINEN_ABSTAND = 2;

/** Versatz je Blickrichtung in Feldern. */
const BLICKVERSATZ = {
  oben: [0, -1],
  unten: [0, 1],
  links: [-1, 0],
  rechts: [1, 0],
} as const;

/**
 * Mitte des Feldes, auf dem eine Figur erscheint: zwei Felder in Blickrichtung des Helden.
 * Eingaben: Mitte des Helden in Pixeln, Blickrichtung, Kachelgröße. Beispiel: Held auf Feld 7,7
 * schaut nach oben auf das Brett (7,6) → Feld 7,5, also Pixel 120, 88 bei Kachel 16.
 */
export function erscheinungsfeld(
  held: { readonly x: number; readonly y: number },
  blick: keyof typeof BLICKVERSATZ,
  kachel: number,
): { x: number; y: number } {
  const [dx, dy] = BLICKVERSATZ[blick];
  const mitte = (wert: number, felder: number) =>
    (Math.floor(wert / kachel) + felder * ERSCHEINEN_ABSTAND) * kachel + kachel / 2;
  return { x: mitte(held.x, dx), y: mitte(held.y, dy) };
}

/**
 * Lässt eine Figur, die nicht auf der Karte steht, als Geist erscheinen (Spieltest „einstieg“,
 * 15.11.2026, R8: „Über dem Brett steht jemand“, aber im Bild war niemand). Der Sprite blendet in
 * gut einer Sekunde ein, schwebt wie jeder Geist und sperrt keinen Weg; er bleibt bis zum
 * Verlassen der Karte. Eingaben: Szene, Objektname (wird Name des Sprites, so findet ihn
 * figurblende.ts), Bildschlüssel und Bild des Bogens (Blick nach unten), Mitte des Feldes in
 * Pixeln, Ursprung y für die Fußkachel. Beispiel: Ambrose auf dem Dachboden über dem Brett.
 */
export function lasseGeistErscheinen(
  szene: Phaser.Scene,
  name: string,
  bild: { readonly schluessel: string; readonly nummer: number },
  mitte: { readonly x: number; readonly y: number },
  ursprungY: (sprite: Phaser.GameObjects.Sprite) => number,
): Phaser.GameObjects.Sprite {
  const sprite = szene.add.sprite(mitte.x, mitte.y, bild.schluessel, bild.nummer).setName(name);
  sprite.setOrigin(0.5, ursprungY(sprite)).setDepth(sprite.y);
  zeigeAlsGeist(szene, sprite);
  sprite.setAlpha(0);
  szene.tweens.add({ targets: sprite, alpha: GEIST_DECKKRAFT, duration: ERSCHEINEN_MS });
  return sprite;
}
