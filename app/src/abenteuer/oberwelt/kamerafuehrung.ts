/**
 * Kameraführung der Oberwelt: richtet die Kamera ein (kameraregie.ts) und führt ihren Folgeversatz
 * Bild für Bild nach den Regeln der vorausschauenden Kamera (kameravoraus.ts).
 *
 * Warum: Die Szene (szene.ts) ist an ihrer Größengrenze; hier liegt der Zustand der Nachführung
 * (aktueller Versatz) und die Umrechnung auf Phaser. Phaser zielt auf „Held − Folgeversatz“; der
 * Grundversatz legt den Helden in die Mitte der freien Fläche, der Vorausversatz schiebt das Ziel
 * in Laufrichtung. An den Kartengrenzen hält Phaser die Kamera an (setBounds).
 * Nebenbei meldet sie, in welcher Bildhälfte der Held steht (heldhaelfte.ts), damit kurze Hinweise
 * ihn nicht verdecken (Wunsch des Autors, 20.11.2026).
 * Schwenk (26.11.2026, schwenk.ts): Ein Dialog kann die Kamera zu einem Ziel fahren lassen; dann
 * ersetzt die Fahrt den Vorausversatz, bis die Kamera wieder beim Helden ist. Die Szene bleibt
 * unberührt (sie ist an ihrer Größengrenze): Jede Kameraführung meldet sich unter ihrer Szene an
 * (kamerafuehrungVon), dort findet sie oberwelt/schwenkschicht.ts.
 * Abhängigkeiten: Phaser (Typen), kamera.ts, kameraregie.ts, kameravoraus.ts, heldhaelfte.ts,
 * schwenk.ts.
 */
import type Phaser from "phaser";
import type { Ausloeser } from "./ausloeserebene";
import { heldhaelfte, type Heldhaelfte } from "./heldhaelfte";
import type { Raender } from "./kamera";
import { richteKameraEin, sichtflaeche } from "./kameraregie";
import {
  naehere,
  OHNE_VERSATZ,
  zielVersatz,
  type Laufrichtung,
  type Versatz,
} from "./kameravoraus";
import { fahre, profildauer, schwenkprofil, schwenkversatz, type Fahrt } from "./schwenk";
import type { Melder } from "./szenentypen";

/** Kameraführung je Szene (für den Schwenk aus dem Dialog, schwenkschicht.ts). */
const fuehrungen = new WeakMap<object, Kamerafuehrung>();

/** Die Kameraführung einer Szene, oder null (Szene noch nicht aufgebaut). */
export function kamerafuehrungVon(szene: object): Kamerafuehrung | null {
  return fuehrungen.get(szene) ?? null;
}

/** Ein Schwenk: Ziel in Kartenpixeln (null: zurück zum Helden), Ränder mit Dialog, Fahrt. */
interface Schwenkstand {
  readonly ziel: Versatz | null;
  readonly raender: Raender;
  fahrt: Fahrt;
  /** Wird einmal gerufen, wenn die Fahrt ankommt (der Dialog zeigt dann seine Zeile). */
  beiZiel: (() => void) | null;
}

export class Kamerafuehrung {
  private grund: Versatz = OHNE_VERSATZ;
  private voraus: Versatz = OHNE_VERSATZ;
  private raender: Raender | null = null;
  private haelfte: Heldhaelfte | null = null;
  private schwenkstand: Schwenkstand | null = null;
  private held: Versatz = OHNE_VERSATZ;

  constructor(
    private readonly kamera: Phaser.Cameras.Scene2D.Camera,
    private readonly kachel: number,
    private readonly ausloeser: () => readonly Ausloeser[],
    private readonly melder?: Melder,
  ) {
    // Ohne Szene (Komponententests mit nachgebauter Kamera) gibt es keinen Schwenk.
    if (kamera.scene) fuehrungen.set(kamera.scene, this);
  }

  /** Verdeckte Ränder der Bedienung in Kartenpixeln (null vor dem Einrichten). */
  get verdeckt(): Raender | null {
    return this.raender;
  }

  /**
   * Schwenk zu einem Punkt (Kartenpixel) oder zurück zum Helden (null). Eingaben: Ziel, verdeckte
   * Ränder samt Dialogfenster (schwenk.ts, raenderMitDialog), sofort (reduzierte Bewegung),
   * Rückruf bei Ankunft. Die Fahrt beginnt am aktuellen Versatz, im Tempo von schwenkprofil.
   * Ausgabe: false ohne Fahrt (Kamera noch nicht eingerichtet, oder zurück ohne Schwenk).
   */
  schwenke(
    ziel: Versatz | null,
    raender: Raender,
    sofort: boolean,
    beiZiel: (() => void) | null = null,
  ): boolean {
    if (!this.raender || (ziel === null && !this.schwenkstand)) return false;
    const von = { x: this.kamera.followOffset.x, y: this.kamera.followOffset.y };
    const nach = this.schwenkziel(ziel, raender);
    const profil = schwenkprofil(von, nach, this.kachel);
    const fahrt = { von, nach, profil, vergangenMs: 0 };
    this.schwenkstand = { ziel, raender, fahrt, beiZiel };
    this.voraus = OHNE_VERSATZ;
    if (sofort) this.ueberspringe();
    return true;
  }

  /** Ein laufender Schwenk springt ans Ziel (Weitertippen im Dialog). */
  ueberspringe(): void {
    const stand = this.schwenkstand;
    if (stand) this.schwenkschritt(profildauer(stand.fahrt.profil));
  }

  /** Läuft gerade ein Schwenk oder steht die Kamera bei einem Ziel? */
  get schwenkt(): boolean {
    return this.schwenkstand !== null;
  }

  /** Folgeversatz für das Ziel; zurück zum Helden ist es der Grundversatz. */
  private schwenkziel(ziel: Versatz | null, raender: Raender): Versatz {
    return ziel ? schwenkversatz(this.held, ziel, raender) : this.grund;
  }

  /** Ein Bild der Fahrt; am Helden angekommen, endet der Schwenk. */
  private schwenkschritt(deltaMs: number): void {
    const stand = this.schwenkstand;
    if (!stand) return;
    const nach = this.schwenkziel(stand.ziel, stand.raender);
    const { fahrt, versatz, da } = fahre({ ...stand.fahrt, nach }, deltaMs);
    stand.fahrt = fahrt;
    this.setzeRoh(versatz);
    if (!da) return;
    const beiZiel = stand.beiZiel;
    stand.beiZiel = null;
    beiZiel?.();
    if (stand.ziel === null && this.schwenkstand === stand) this.schwenkstand = null;
  }

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
    this.held = held;
    if (this.schwenkstand) {
      this.schwenkschritt(deltaMs);
      this.protokolliere(false, this.aufDemBild(held));
      return;
    }
    const k = this.kachel;
    const ziele = this.ausloeser()
      .filter((a) => a.typ === "ausloeser")
      .map((a) => ({ x: a.x * k + k / 2, y: a.y * k + k / 2 }));
    const { sichtBreite, sichtHoehe } = sichtflaeche(this.kamera);
    const sicht = { x: sichtBreite, y: sichtHoehe };
    const ziel = zielVersatz(richtung, held, ziele, sicht, this.raender, this.kachel);
    this.voraus = naehere(this.voraus, ziel, deltaMs, richtung !== null);
    this.setzeVersatz();
    const lage = this.aufDemBild(held);
    this.meldeHaelfte(lage.y);
    this.protokolliere(richtung !== null, lage);
  }

  /**
   * Der Held als Anteil des Bildes (0 bis 1, links oben 0): wie Phasers Sichtfenster
   * (worldView) aus Bildlage, Zoom und Ursprung der Kamera, ohne auf das nächste Bild zu warten.
   * Beispiel: Held genau in der Bildmitte → { x: 0.5, y: 0.5 }.
   */
  private aufDemBild(held: Versatz): Versatz {
    const k = this.kamera;
    const zoom = k.zoomX || 1;
    const links = k.scrollX + (k.width - k.width / zoom) * k.originX;
    const oben = k.scrollY + (k.height - k.height / zoom) * k.originY;
    return { x: ((held.x - links) * zoom) / k.width, y: ((held.y - oben) * zoom) / k.height };
  }

  /** Meldet die Bildhälfte des Helden nach oben, nur bei Änderung. */
  private meldeHaelfte(anteilY: number): void {
    const neu = heldhaelfte(anteilY, this.haelfte);
    if (neu === this.haelfte) return;
    this.haelfte = neu;
    this.melder?.beiHeldhaelfte?.(neu);
  }

  /**
   * Messhilfe für tests/e2e/abenteuer-kamera.spec.ts: Legt ein Test `window.__kameraprotokoll` als
   * Liste an, kommt je Bild Zeit, Kamerastand und der Held als Anteil des Bildes hinein (für
   * tests/e2e/abenteuer-hinweislage.spec.ts); sonst geschieht nichts.
   */
  private protokolliere(laeuft: boolean, held: Versatz): void {
    const protokoll = (globalThis as { __kameraprotokoll?: unknown }).__kameraprotokoll;
    if (!Array.isArray(protokoll)) return;
    const k = this.kamera;
    const eintrag = { t: performance.now(), x: k.scrollX, y: k.scrollY, laeuft, zoom: k.zoomX };
    protokoll.push({ ...eintrag, heldX: held.x, heldY: held.y });
  }

  /**
   * Folgeversatz = Grundversatz − Vorausversatz, auf ganze Bildschirmpixel (kein Flimmern).
   * Warum nicht auf ganze Kartenpixel: Bei Zoom 3 ist ein Kartenpixel drei Bildschirmpixel; der
   * Ausschnitt sprang beim Zurücklaufen in 36 Stufen zu je 3 Pixeln (Messung 19.11.2026,
   * tests/e2e/abenteuer-kamera.spec.ts, „ruckelt“ laut Autor). Phaser rundet die Darstellung bei
   * ganzzahligem Zoom ohnehin auf Bildschirmpixel (roundPixels), feiner muss es nicht sein.
   */
  private setzeVersatz(): void {
    this.setzeRoh({ x: this.grund.x - this.voraus.x, y: this.grund.y - this.voraus.y });
  }

  /** Setzt einen Folgeversatz, auf ganze Bildschirmpixel gerundet. */
  private setzeRoh(versatz: Versatz): void {
    const zoom = this.kamera.zoomX || 1;
    const aufBildpixel = (wert: number) => Math.round(wert * zoom) / zoom;
    this.kamera.setFollowOffset(aufBildpixel(versatz.x), aufBildpixel(versatz.y));
  }
}
