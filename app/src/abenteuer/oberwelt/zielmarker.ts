/**
 * Zielhinweis auf der Karte (Spieltest „einstieg“, 15.11.2026, R1): ein kleines goldenes Dreieck,
 * das über dem nächsten Ziel auf und ab wippt; liegt das Ziel außerhalb des Bildes, steht am
 * Bildrand ein Pfeil, der dorthin zeigt.
 *
 * Warum: Ein Kind wusste an mehreren Stellen nicht, wohin (Mama in der Küche außerhalb des Bildes,
 * die Schule 45 Kacheln weiter). Gute Einsteigerspiele zeigen das Ziel im Bild, dezent, ohne den
 * Weg vorzulaufen. Welches Feld das Ziel ist, sagt oberwelt/zielsuche.ts; abschalten lässt sich der
 * Hinweis im Spielmenü (anbindung/Zielhinweiswahl.tsx).
 * Rolle im Gesamtbild: Hilfe für oberwelt/szene.ts; zeichnet mit Phaser-Grafik, keine Bilder.
 * Die Kamera vergrößert (Variante B, weltmassstab.ts): gerechnet wird in Kartenpixeln der
 * sichtbaren Fläche (worldView), der feste Pfeil wird mit kameraregie.ts/festerPunkt gesetzt.
 * Abhängigkeiten: Phaser, kameraregie.ts.
 */
import type Phaser from "phaser";
import { festerPunkt } from "./kameraregie";

/** Gold des Hinweises und dunkler Rand (Farben des Spiels, spielfarben.css). */
const GOLD = 0xf2c14e;
const RAND = 0x1a1612;
/** Halbe Breite und Höhe des Dreiecks in Spielpixeln. */
const HALB = 5;
const HOEHE = 6;
/** Abstand des Pfeils vom Bildrand und Abstand des Dreiecks über der Kachel. */
const RANDABSTAND = 10;
const UEBER_KACHEL = 8;
/** Wippen: Weg in Pixeln und Dauer einer halben Bewegung. */
const WIPPEN = 2;
const WIPPDAUER_MS = 500;
/** Über allem auf der Karte (Figuren liegen nach ihrer y-Position, höchstens einige Tausend). */
const TIEFE = 100000;

/** Ein Feld in Kachelkoordinaten. */
export interface Zielfeld {
  readonly x: number;
  readonly y: number;
}

/**
 * Zeichnet ein goldenes Dreieck mit dunklem Rand um den Ursprung, Spitze nach rechts (der Pfeil,
 * wird gedreht) oder nach unten (über dem Ziel, ungedreht: Drehen macht Pixelkanten unruhig).
 */
function zeichneDreieck(g: Phaser.GameObjects.Graphics, nachUnten: boolean): void {
  const ecken: [number, number, number, number, number, number] = nachUnten
    ? [0, HOEHE, HALB, -HOEHE, -HALB, -HOEHE]
    : [HOEHE, 0, -HOEHE, -HALB, -HOEHE, HALB];
  g.fillStyle(GOLD, 1).fillTriangle(...ecken);
  g.lineStyle(1, RAND, 1).strokeTriangle(...ecken);
}

/**
 * Wo der Pfeil am Rand steht: auf dem Rand des freien Rechtecks (abzüglich Randabstand), in
 * Richtung des Ziels von der Bildmitte aus. Eingaben in Bildschirm-Spielpixeln.
 * Beispiel: Bild 130 × 201, Ziel weit rechts auf halber Höhe → x = 120, y = 100,5.
 */
export function randpunkt(
  breite: number,
  hoehe: number,
  ziel: { x: number; y: number },
): { x: number; y: number; winkel: number } {
  const mx = breite / 2;
  const my = hoehe / 2;
  const dx = ziel.x - mx;
  const dy = ziel.y - my;
  const winkel = Math.atan2(dy, dx);
  const rx = mx - RANDABSTAND;
  const ry = my - RANDABSTAND;
  const faktor = Math.min(rx / Math.max(Math.abs(dx), 1e-6), ry / Math.max(Math.abs(dy), 1e-6));
  return { x: mx + dx * faktor, y: my + dy * faktor, winkel };
}

/** Der Hinweis einer Szene. */
export class Zielmarker {
  private readonly ueber: Phaser.GameObjects.Graphics;
  private readonly pfeil: Phaser.GameObjects.Graphics;
  private ziel: Zielfeld | null = null;
  private an = true;

  /**
   * Legt beide Zeichen an (unsichtbar bis zum ersten Ziel). `verdeckt` liefert die Höhe des
   * Streifens unten unter den Knöpfen in Spielpixeln (kamera.ts).
   */
  constructor(
    private readonly szene: Phaser.Scene,
    private readonly kachel: number,
    private readonly verdeckt: () => number,
  ) {
    this.ueber = szene.add.graphics().setDepth(TIEFE).setVisible(false);
    zeichneDreieck(this.ueber, true);
    this.pfeil = szene.add.graphics().setDepth(TIEFE).setScrollFactor(0).setVisible(false);
    zeichneDreieck(this.pfeil, false);
  }

  /** Neues Ziel (Kachelfeld) oder null; `an` false blendet alles aus (Spielmenü). */
  setze(ziel: Zielfeld | null, an: boolean): void {
    this.ziel = ziel;
    this.an = an;
  }

  /** Je Bild: Dreieck über dem Ziel, wenn es im freien Bild liegt, sonst Pfeil am Rand. */
  aktualisiere(): void {
    const ziel = this.ziel;
    if (!ziel || !this.an) {
      this.ueber.setVisible(false);
      this.pfeil.setVisible(false);
      return;
    }
    const kamera = this.szene.cameras.main;
    const sicht = kamera.worldView;
    const hoehe = sicht.height - this.verdeckt();
    const sx = (ziel.x + 0.5) * this.kachel - sicht.x;
    const sy = (ziel.y + 0.5) * this.kachel - sicht.y;
    const drin = sx >= 0 && sx <= sicht.width && sy >= 0 && sy <= hoehe;
    this.ueber.setVisible(drin);
    this.pfeil.setVisible(!drin);
    if (drin) {
      const wippen = (Math.sin((this.szene.time.now / WIPPDAUER_MS) * Math.PI) * WIPPEN) / 2;
      const x = ziel.x * this.kachel + this.kachel / 2;
      this.ueber.setPosition(x, ziel.y * this.kachel - UEBER_KACHEL + wippen);
      return;
    }
    const p = randpunkt(sicht.width, hoehe, { x: sx, y: sy });
    const fest = festerPunkt(kamera, p.x, p.y);
    this.pfeil.setPosition(fest.x, fest.y).setRotation(p.winkel);
  }
}
