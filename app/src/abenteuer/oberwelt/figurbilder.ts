/**
 * Figurenbilder im Format von LimeZu (Charakter-Generator aus Modern Interiors): Rahmen 16 × 32,
 * obere Reihe vier Standbilder (rechts, oben, links, unten), untere Reihe Laufen mit sechs Bildern
 * je Richtung in derselben Reihenfolge (zugeschnitten von werkzeuge/figuren.py im privaten
 * Repository). Fehlt ein Bild, nimmt die Szene den Platzhalter (16 × 16, ein Bild je Richtung).
 *
 * Bögen aus PixelLab (oberwelt/figurbogen.ts) haben dieselbe Ordnung mit Rahmen 32 × 32; die
 * Figur steht dort mit den Füßen auf Zeile 30 (zwei Pixel Rand), etwa 28 Pixel hoch.
 *
 * Rolle im Gesamtbild: Hilfen für oberwelt/szene.ts, ausgelagert, damit die Szene klein bleibt.
 * Abhängigkeiten: Phaser.
 */
import Phaser from "phaser";
import { istGrossbogen } from "./figurbogen";
import type { Richtung } from "./szene";

/** Rahmen einer Figur von LimeZu. */
export const FIGUR_BREITE = 16;
export const FIGUR_HOEHE = 32;
/** Rahmen eines PixelLab-Bogens und Abstand der Füße vom unteren Rand. */
export const GROSS_RAHMEN = 32;
const GROSS_FUSSRAND = 2;
/**
 * PixelLab-Figuren werden auf 80 % verkleinert (Wunsch des Autors, 16.11.2026): Sie waren mit etwa
 * 30 Pixeln Höhe größer als die Türen der Grafiksätze; mit 80 % passen sie in die Haustüren.
 */
export const GROSS_MASSSTAB = 0.8;
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

/** Lädt einen Bogen im Format von LimeZu oder PixelLab (Rahmengröße nach figurbogen.ts). */
export function ladeFigurbogen(szene: Phaser.Scene, schluessel: string, adresse: string): void {
  const gross = istGrossbogen(adresse);
  szene.load.spritesheet(schluessel, adresse, {
    frameWidth: gross ? GROSS_RAHMEN : FIGUR_BREITE,
    frameHeight: gross ? GROSS_RAHMEN : FIGUR_HOEHE,
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

/** Zeile der Füße im Rahmen: LimeZu am unteren Rand, PixelLab zwei Pixel darüber. */
function fusszeile(sprite: Phaser.GameObjects.Sprite): number {
  const { width, height } = sprite.frame;
  return width >= GROSS_RAHMEN ? height - GROSS_FUSSRAND : height;
}

/** Maßstab, mit dem eine Figur gezeichnet wird: PixelLab-Bögen 80 %, LimeZu-Figuren 100 %. */
export function figurmassstab(sprite: Phaser.GameObjects.Sprite): number {
  return sprite.frame.width >= GROSS_RAHMEN ? GROSS_MASSSTAB : 1;
}

/**
 * Ursprung (Anteil der Höhe) so, dass die Mitte der Fußkachel auf dem Punkt der Figur liegt; für
 * Figuren und Statisten. Setzt dabei auch den Maßstab der Figur (figurmassstab), damit jeder Weg,
 * der eine Figur aufstellt, die verkleinerten PixelLab-Figuren richtig auf die Kachel stellt.
 * Beispiel: LimeZu 16 × 32, Kachel 16 → 0,75; PixelLab 32 × 32 bei 80 % → (30 − 10) / 32 = 0,625.
 */
export function fussUrsprungY(sprite: Phaser.GameObjects.Sprite, kachel: number): number {
  const massstab = figurmassstab(sprite);
  sprite.setScale(massstab);
  return (fusszeile(sprite) - kachel / 2 / massstab) / sprite.frame.height;
}

/**
 * Stellt einen Figuren-Sprite auf die Kachel: Die Füße stehen auf der Kachel, der Kopf ragt in die
 * Kachel darüber. Der Körper für Kollisionen ist nur die Kachel der Füße. Gilt für LimeZu
 * (16 × 32, Füße am unteren Rand) und PixelLab (32 × 32, Füße zwei Pixel über dem Rand).
 */
export function stelleAufKachel(sprite: Phaser.Physics.Arcade.Sprite, kachel: number): void {
  const breite = sprite.frame.width;
  const fuss = fusszeile(sprite);
  sprite.setOrigin(0.5, fussUrsprungY(sprite, kachel));
  // Körpermaße im Rahmen des Bildes: Phaser multipliziert sie mit dem Maßstab der Figur, damit der
  // Körper in der Welt wieder genau die Fußkachel ist (2 Pixel Rand beim Helden).
  const m = figurmassstab(sprite);
  const koerper = sprite.body;
  if (koerper instanceof Phaser.Physics.Arcade.Body) {
    const seite = (kachel - 4) / m;
    koerper.setSize(seite, seite).setOffset(breite / 2 - seite / 2, fuss + (2 - kachel) / m);
  } else if (koerper instanceof Phaser.Physics.Arcade.StaticBody) {
    // Ein fester Körper rechnet Größe und Versatz in Weltpixeln ab der linken oberen Bildecke.
    koerper.setSize(kachel, kachel).setOffset((breite * m - kachel) / 2, fuss * m - kachel);
    sprite.refreshBody();
  }
}
