/**
 * Tönung in der Phaser-Szene: ein Schleier über dem Bildausschnitt (Nebel, Nacht, Abend) oder
 * Dunkelheit mit Lichtkreis um den Helden (Dunkel, mit Laterne vier Felder weit).
 *
 * Rolle im Gesamtbild: Teil von oberwelt/szene.ts, ausgelagert, damit die Szene klein bleibt. Die
 * Werte stehen in toenung.ts; Sepia ist ein CSS-Filter der Hülle (Oberwelt.tsx), hier nichts.
 * Leistung: Die Dunkelheit ist ein einziges vorgezeichnetes Bild (Canvas) mit Loch, das dem Helden
 * folgt; kein Zeichnen je Bild.
 * Übergang (Atmosphäre T6): Ein Wechsel während des Besuchs blendet in zwei Sekunden um (alter
 * Schleier aus, neuer ein); beim Betreten der Karte steht das Licht sofort.
 * Abhängigkeiten: Phaser, toenung.ts.
 */
import Phaser from "phaser";
import { DUNKEL_DECKKRAFT, lichtkreis, SCHLEIER, type Toenung } from "./toenung";

/** Über allem, auch über fliegenden Vögeln (belebungsschicht.ts). */
const TIEFE = 200000;
/** Weicher Rand des Lichtkreises: Anteil des Halbmessers, auf dem das Licht ausläuft. */
const WEICHER_RAND = 0.35;
/** Dauer des Umblendens bei einem Lichtwechsel (ms, Atmosphäre T6). */
const UMBLENDEN_MS = 2000;

type Schicht = Phaser.GameObjects.Rectangle | Phaser.GameObjects.Image;

export class Toenungsschicht {
  private schleier: Phaser.GameObjects.Rectangle | null = null;
  private dunkel: Phaser.GameObjects.Image | null = null;
  /** Schon einmal gesetzt? Erst danach wird umgeblendet. */
  private gesetzt = false;

  constructor(
    private readonly szene: Phaser.Scene,
    private readonly kachel: number,
  ) {}

  /** Setzt die Tönung neu (null: keine) und ob der Held eine Laterne trägt. */
  setze(toenung: Toenung | null, laterne: boolean): void {
    const sofort = !this.gesetzt;
    this.gesetzt = true;
    this.blendeAus(this.schleier, sofort);
    this.blendeAus(this.dunkel, sofort);
    this.schleier = null;
    this.dunkel = null;
    if (toenung === "dunkel") {
      this.dunkel = this.szene.add
        .image(0, 0, this.dunkelbild(lichtkreis(laterne)))
        .setDepth(TIEFE);
      this.blendeEin(this.dunkel, 1, sofort);
      return;
    }
    const schleier = toenung ? SCHLEIER[toenung] : undefined;
    if (!schleier) return;
    const kamera = this.szene.cameras.main;
    this.schleier = this.szene.add
      .rectangle(0, 0, kamera.width, kamera.height, schleier.farbe, schleier.deckkraft)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(TIEFE);
    this.blendeEin(this.schleier, 1, sofort);
  }

  /** Alte Schicht entfernen, im Besuch mit Ausblenden. */
  private blendeAus(schicht: Schicht | null, sofort: boolean): void {
    if (!schicht) return;
    if (sofort) {
      schicht.destroy();
      return;
    }
    this.szene.tweens.add({
      targets: schicht,
      alpha: 0,
      duration: UMBLENDEN_MS,
      onComplete: () => schicht.destroy(),
    });
  }

  /** Neue Schicht zeigen, im Besuch aus dem Nichts eingeblendet. */
  private blendeEin(schicht: Schicht, ziel: number, sofort: boolean): void {
    if (sofort) return;
    schicht.setAlpha(0);
    this.szene.tweens.add({ targets: schicht, alpha: ziel, duration: UMBLENDEN_MS });
  }

  /** Der Lichtkreis folgt dem Helden (Weltpixel). */
  folge(x: number, y: number): void {
    this.dunkel?.setPosition(x, y);
  }

  /** Ist es gerade dunkel (für Tests und Anzeige)? */
  istDunkel(): boolean {
    return this.dunkel !== null;
  }

  /**
   * Ein Bild doppelter Bildschirmgröße, schwarz bis auf ein weiches Loch in der Mitte; einmal je
   * Halbmesser gezeichnet. So deckt es den Bildausschnitt, wo der Held auch steht.
   */
  private dunkelbild(felder: number): string {
    const schluessel = `dunkel:${felder}`;
    if (this.szene.textures.exists(schluessel)) return schluessel;
    const kamera = this.szene.cameras.main;
    const breite = Math.max(1, kamera.width * 2);
    const hoehe = Math.max(1, kamera.height * 2);
    const textur = this.szene.textures.createCanvas(schluessel, breite, hoehe);
    const ctx = textur?.getContext();
    if (!textur || !ctx) return schluessel;
    ctx.fillStyle = `rgba(0, 0, 0, ${DUNKEL_DECKKRAFT})`;
    ctx.fillRect(0, 0, breite, hoehe);
    const halbmesser = felder * this.kachel;
    const verlauf = ctx.createRadialGradient(
      breite / 2,
      hoehe / 2,
      halbmesser * (1 - WEICHER_RAND),
      breite / 2,
      hoehe / 2,
      halbmesser,
    );
    verlauf.addColorStop(0, "rgba(0, 0, 0, 1)");
    verlauf.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = verlauf;
    ctx.fillRect(0, 0, breite, hoehe);
    textur.refresh();
    return schluessel;
  }
}
