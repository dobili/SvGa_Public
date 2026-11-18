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
import type { Umriss } from "./sitzplatz";
import type { Richtung } from "./szene";
import { GROSS_MASSSTAB } from "./weltmassstab";

/** Rahmen einer Figur von LimeZu. */
export const FIGUR_BREITE = 16;
export const FIGUR_HOEHE = 32;
/** Rahmen eines PixelLab-Bogens und Abstand der Füße vom unteren Rand. */
export const GROSS_RAHMEN = 32;
const GROSS_FUSSRAND = 2;
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

/**
 * Maßstab, mit dem eine Figur gezeichnet wird: PixelLab-Bögen 2/3 (zwei Bildschirmpixel je
 * Figurenpixel bei ZOOM 3, Variante B in weltmassstab.ts), LimeZu-Figuren 1.
 */
export function figurmassstab(sprite: Phaser.GameObjects.Sprite): number {
  return sprite.frame.width >= GROSS_RAHMEN ? GROSS_MASSSTAB : 1;
}

/**
 * Ursprung (Anteil der Höhe) so, dass die Mitte der Fußkachel auf dem Punkt der Figur liegt; für
 * Figuren und Statisten. Setzt dabei auch den Maßstab der Figur (figurmassstab), damit jeder Weg,
 * der eine Figur aufstellt, die PixelLab-Figuren in ihrem Maßstab richtig auf die Kachel stellt.
 * Beispiel: LimeZu 16 × 32, Kachel 16 → 0,75; PixelLab 32 × 32 bei 2/3 → (30 − 12) / 32 = 0,5625.
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
  sprite.setOrigin(0.5, fussUrsprungY(sprite, kachel));
  // Körpermaße im Rahmen des Bildes: Phaser multipliziert sie mit dem Maßstab der Figur, damit der
  // Körper in der Welt wieder genau die Fußkachel ist (2 Pixel Rand beim Helden).
  const koerper = sprite.body;
  if (koerper instanceof Phaser.Physics.Arcade.Body) {
    const m = figurmassstab(sprite);
    const seite = (kachel - 4) / m;
    const links = sprite.frame.width / 2 - seite / 2;
    koerper.setSize(seite, seite).setOffset(links, fusszeile(sprite) + (2 - kachel) / m);
  } else {
    legeFestkoerperAufKachel(sprite, kachel);
  }
}

/**
 * Legt den festen Körper einer Figur genau auf ihre Fußkachel (die Kachel um den Punkt der Figur).
 *
 * Warum: `refreshBody()` setzt einen festen Körper auf das ganze Bild zurück und verwirft Größe und
 * Versatz. Eine LimeZu-Figur (16 × 32) sperrte so auch die Kachel über sich: Die Truppe der
 * Wegsperre S15 stand unter dem Weg und nahm ihm eine seiner zwei Reihen (Befund im Browser,
 * 18.11.2026). Pipeline und Simulation rechnen mit genau einer Kachel (figurensperre.py).
 * Eingaben: Sprite, dessen Punkt (x, y) die Mitte der Fußkachel ist, auch wenn das Bild verschoben
 * ist (figurensitz.ts), und die Kachelgröße. Ohne festen Körper geschieht nichts. Mit `flaeche`
 * (relativ zur Mitte der Fußkachel) sperrt die Figur diese Fläche statt der Kachel: Sitzende
 * sperren auch ihren Sitzpunkt (sitzplatz.ts, sitzsperre).
 * Beispiel: Imani auf (138, 16) sperrt nur (138, 16); der Held geht auf (138, 15) vorbei.
 */
export function legeFestkoerperAufKachel(
  sprite: Phaser.GameObjects.Sprite,
  kachel: number,
  flaeche: Umriss = { x: -kachel / 2, y: -kachel / 2, breite: kachel, hoehe: kachel },
): void {
  const koerper = sprite.body;
  if (!(koerper instanceof Phaser.Physics.Arcade.StaticBody)) return;
  // Größe ohne Zentrieren aufs Bild; der Versatz zählt in Weltpixeln ab der linken oberen
  // Bildecke, reset() legt den Körper danach neu an diese Ecke plus Versatz.
  const ecke = sprite.getTopLeft();
  koerper.setSize(flaeche.breite, flaeche.hoehe, false);
  koerper.setOffset(sprite.x + flaeche.x - ecke.x, sprite.y + flaeche.y - ecke.y);
  koerper.reset();
}
