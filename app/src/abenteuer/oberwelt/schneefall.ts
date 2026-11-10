/**
 * Schneefall über einer Winterkarte (Entscheidung 10.11.2026): leichte Flocken, die langsam fallen
 * und seitlich pendeln. Sie liegen über allem, auch über der Tönung, und folgen dem Bildausschnitt.
 *
 * Rolle im Gesamtbild: Die Bewegung ist reine Logik (getestet in schneefall.test.ts); die Klasse
 * `Schneeschicht` zeichnet sie je Bild mit einem Phaser-Grafikobjekt. Flocken liegen als Anteile
 * des Bildausschnitts (0 bis 1) vor, so passen sie zu jedem Zoom und jeder Kamera.
 * Abhängigkeiten: Phaser.
 */
import type Phaser from "phaser";

/** Eine Flocke: Lage im Bildausschnitt (Anteile), Fallgeschwindigkeit (Anteile je Sekunde). */
export interface Flocke {
  x: number;
  y: number;
  readonly fall: number;
  /** Phase und Weite des seitlichen Pendelns. */
  readonly phase: number;
  readonly weite: number;
  /** Größe in Weltpixeln (1 oder 2). */
  readonly groesse: number;
}

/** So viele Flocken je Bildausschnitt (genug für Schneefall, wenig für das Handy). */
export const FLOCKEN = 90;
const FALL_MIN = 0.04;
const FALL_STREUUNG = 0.06;
const WEITE_MAX = 0.01;
const VOLLKREIS = Math.PI * 2;
const PENDEL_JE_S = 1.3;
const GROSS_ANTEIL = 0.25;
/** Über allem, auch über der Tönung (toenungsschicht.ts: 200000). */
const TIEFE = 300000;
const FARBE = 0xffffff;
const DECKKRAFT = 0.85;

/** Neue Flocken, über den Bildausschnitt verteilt; `zufall` liefert Zahlen in [0, 1). */
export function neueFlocken(anzahl: number, zufall: () => number): Flocke[] {
  return Array.from({ length: anzahl }, () => ({
    x: zufall(),
    y: zufall(),
    fall: FALL_MIN + FALL_STREUUNG * zufall(),
    phase: VOLLKREIS * zufall(),
    weite: WEITE_MAX * zufall(),
    groesse: zufall() < GROSS_ANTEIL ? 2 : 1,
  }));
}

/**
 * Ein Bild weiter: Flocken fallen um `fall · dt`; wer unten hinausfällt, beginnt oben neu, an
 * derselben Stelle in x (damit das Bild ruhig bleibt). Beispiel: y 0,99, fall 0,1, dt 0,2 → y 0,01.
 */
export function bewegeFlocken(flocken: readonly Flocke[], dt: number): void {
  for (const f of flocken) {
    f.y = (f.y + f.fall * dt) % 1;
  }
}

/** Die waagerechte Lage mit Pendeln zur Zeit `sekunden` (Anteil, auf 0 bis 1 gefaltet). */
export function pendelX(f: Flocke, sekunden: number): number {
  const x = f.x + f.weite * Math.sin(f.phase + sekunden * PENDEL_JE_S);
  return ((x % 1) + 1) % 1;
}

/** Zeichnet den Schneefall einer Szene. */
export class Schneeschicht {
  private readonly flocken: Flocke[];
  private readonly grafik: Phaser.GameObjects.Graphics;
  private sekunden = 0;

  constructor(private readonly szene: Phaser.Scene) {
    this.flocken = neueFlocken(FLOCKEN, Math.random);
    this.grafik = szene.add.graphics().setDepth(TIEFE);
  }

  /** Ein Bild weiter (in update der Szene). */
  aktualisiere(deltaMs: number): void {
    const dt = deltaMs / 1000;
    this.sekunden += dt;
    bewegeFlocken(this.flocken, dt);
    const sicht = this.szene.cameras.main.worldView;
    this.grafik.clear().fillStyle(FARBE, DECKKRAFT);
    for (const f of this.flocken) {
      const x = sicht.x + pendelX(f, this.sekunden) * sicht.width;
      this.grafik.fillRect(x, sicht.y + f.y * sicht.height, f.groesse, f.groesse);
    }
  }
}
