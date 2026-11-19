/**
 * Kameraführung der Oberwelt: richtet die Kamera ein (kameraregie.ts) und führt ihren Folgeversatz
 * Bild für Bild nach den Regeln der vorausschauenden Kamera (kameravoraus.ts).
 *
 * Warum: Die Szene (szene.ts) ist an ihrer Größengrenze; hier liegt der Zustand der Nachführung
 * (aktueller Versatz) und die Umrechnung auf Phaser. Phaser zielt auf „Held − Folgeversatz“; der
 * Grundversatz legt den Helden in die Mitte der freien Fläche, der Vorausversatz schiebt das Ziel
 * in Laufrichtung. An den Kartengrenzen hält Phaser die Kamera an (setBounds).
 * Abhängigkeiten: Phaser (Typen), kamera.ts, kameraregie.ts, kameravoraus.ts.
 */
import type Phaser from "phaser";
import type { Ausloeser } from "./ausloeserebene";
import type { Raender } from "./kamera";
import { richteKameraEin, sichtflaeche } from "./kameraregie";
import {
  naehere,
  OHNE_VERSATZ,
  zielVersatz,
  type Laufrichtung,
  type Versatz,
} from "./kameravoraus";

export class Kamerafuehrung {
  private grund: Versatz = OHNE_VERSATZ;
  private voraus: Versatz = OHNE_VERSATZ;
  private raender: Raender | null = null;

  constructor(
    private readonly kamera: Phaser.Cameras.Scene2D.Camera,
    private readonly kachel: number,
    private readonly ausloeser: () => readonly Ausloeser[],
  ) {}

  /** Kamera für eine Welt einrichten (auch nach dem Drehen); Ausgabe: die verdeckten Ränder. */
  richteEin(breite: number, hoehe: number, zoom: number): Raender {
    const raender = richteKameraEin(this.kamera, breite, hoehe, zoom);
    this.raender = raender;
    this.grund = { x: this.kamera.followOffset.x, y: this.kamera.followOffset.y };
    this.setzeVersatz();
    return raender;
  }

  /**
   * Ein Bild weiter: Laufrichtung (null beim Stehen) und Held in Kartenpixeln; Ziele sind die
   * Auslöser der Karte (Mitte ihrer Kachel), Figuren zählen nicht.
   * Beispiel: Held läuft nach oben auf eine Tür zu → die Kamera rückt weich nach oben.
   */
  schritt(deltaMs: number, richtung: Laufrichtung | null, held: Versatz): void {
    if (!this.raender) return;
    const k = this.kachel;
    const ziele = this.ausloeser()
      .filter((a) => a.typ === "ausloeser")
      .map((a) => ({ x: a.x * k + k / 2, y: a.y * k + k / 2 }));
    const { sichtBreite, sichtHoehe } = sichtflaeche(this.kamera);
    const sicht = { x: sichtBreite, y: sichtHoehe };
    const ziel = zielVersatz(richtung, held, ziele, sicht, this.raender, this.kachel);
    this.voraus = naehere(this.voraus, ziel, deltaMs, richtung !== null);
    this.setzeVersatz();
    this.protokolliere(richtung !== null);
  }

  /**
   * Messhilfe für tests/e2e/abenteuer-kamera.spec.ts: Legt ein Test `window.__kameraprotokoll` als
   * Liste an, kommt je Bild Zeit, Kamerastand und Vorausversatz hinein; sonst geschieht nichts.
   */
  private protokolliere(laeuft: boolean): void {
    const protokoll = (globalThis as { __kameraprotokoll?: unknown }).__kameraprotokoll;
    if (!Array.isArray(protokoll)) return;
    const k = this.kamera;
    protokoll.push({ t: performance.now(), x: k.scrollX, y: k.scrollY, laeuft, zoom: k.zoomX });
  }

  /**
   * Folgeversatz = Grundversatz − Vorausversatz, auf ganze Bildschirmpixel (kein Flimmern).
   * Warum nicht auf ganze Kartenpixel: Bei Zoom 3 ist ein Kartenpixel drei Bildschirmpixel; der
   * Ausschnitt sprang beim Zurücklaufen in 36 Stufen zu je 3 Pixeln (Messung 19.11.2026,
   * tests/e2e/abenteuer-kamera.spec.ts, „ruckelt“ laut Autor). Phaser rundet die Darstellung bei
   * ganzzahligem Zoom ohnehin auf Bildschirmpixel (roundPixels), feiner muss es nicht sein.
   */
  private setzeVersatz(): void {
    const zoom = this.kamera.zoomX || 1;
    const aufBildpixel = (wert: number) => Math.round(wert * zoom) / zoom;
    this.kamera.setFollowOffset(
      aufBildpixel(this.grund.x - this.voraus.x),
      aufBildpixel(this.grund.y - this.voraus.y),
    );
  }
}
