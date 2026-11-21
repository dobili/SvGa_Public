/**
 * Gehen oder Rennen (Wunsch des Autors, 21.11.2026: „Der Held kann draußen rennen“).
 *
 * Bedienung: Zieht man den Finger auf dem Steuerkreuz über den Rand hinaus nach außen (ab dem
 * 1,4-Fachen des Tastenabstands von der Mitte), rennt der Held; zurück nach innen heißt wieder
 * gehen (Hysterese, damit es am Rand nicht flackert). Auf der Tastatur rennt er mit gehaltener
 * Umschalttaste. Gerannt wird nur auf Außenkarten (orte.json, `innen`); auf dem Fahrrad gilt das
 * Fahrradtempo, Rennen ändert dort nichts.
 * Warum eine eigene Datei: szene.ts ist an der Größengrenze; hier liegen die reine Regel
 * (gangartZu) und der kleine Zustand (Gangart), den die Szene je Bild fragt.
 * Bild: bis Rennbilder im Bogen liegen (Reihe 6, figurbilder.ts von mittel-4), spielen die
 * Laufbilder schneller (bildrate). Auslöser prüft die Szene weiter je Bild auf der eigenen und der
 * nächsten Kachel; bei 1,8-fachem Tempo sind das unter 2 Pixel je Bild, nichts wird übersprungen.
 * Abhängigkeiten: Phaser (nur Typen).
 */
import type Phaser from "phaser";

/** Abstand von der Mitte des Kreuzes zur Mitte einer Pfeiltaste (48 px Taste + 8 px Fuge). */
export const TASTENABSTAND_PX = 56;
/** Ab diesem Vielfachen des Tastenabstands rennt der Held. */
export const RENNEN_AB = 1.4;
/** Unter diesem Vielfachen geht er wieder (Hysterese). */
export const GEHEN_UNTER = 1.25;
/** So viel schneller ist Rennen als Gehen. */
export const RENNFAKTOR = 1.8;

export type Gangart = "gehen" | "rennen";

/** Tastencode der Umschalttaste. */
const UMSCHALTTASTE = 16;

/**
 * Die Gangart zur Lage (dx, dy) des Fingers relativ zur Mitte des Kreuzes.
 * Eingaben: Versatz in CSS-Pixeln, bisherige Gangart, Tastenabstand (Vorgabe 56 px).
 * Beispiel: (90, 0) → rennen; danach (75, 0) → rennen (Hysterese); (60, 0) → gehen.
 */
export function gangartZu(
  dx: number,
  dy: number,
  alt: Gangart,
  tastenabstand = TASTENABSTAND_PX,
): Gangart {
  const abstand = Math.hypot(dx, dy) / tastenabstand;
  if (abstand >= RENNEN_AB) return "rennen";
  if (abstand < GEHEN_UNTER) return "gehen";
  return alt;
}

/**
 * Zustand des Rennens für die Szene: Steuerkreuz (setzeKreuz) und Umschalttaste.
 * `erlaubt` ist false innen und auf dem Fahrrad; dann bleibt es immer beim Gehen.
 */
export class Gangartsteuerung {
  private kreuz = false;
  private readonly umschalt: Phaser.Input.Keyboard.Key | null;

  /**
   * Eingaben: ob Rennen hier erlaubt ist, die Tastatur der Szene (oder null, etwa im Test). Die
   * Umschalttaste wird nur gelesen, nicht im Dokument abgefangen (eingabepause.ts).
   */
  constructor(
    private readonly erlaubt: boolean,
    tastatur: Phaser.Input.Keyboard.KeyboardPlugin | null = null,
  ) {
    this.umschalt = tastatur ? tastatur.addKey(UMSCHALTTASTE, false) : null;
  }

  /** Das Steuerkreuz meldet: Finger weit draußen (true) oder nicht. */
  setzeKreuz(rennen: boolean): void {
    this.kreuz = rennen;
  }

  /** Rennt der Held gerade? */
  rennt(): boolean {
    return this.erlaubt && (this.kreuz || this.umschalt?.isDown === true);
  }

  /** Faktor auf das Tempo und auf die Bildrate der Laufbilder. */
  faktor(): number {
    return this.rennt() ? RENNFAKTOR : 1;
  }
}
