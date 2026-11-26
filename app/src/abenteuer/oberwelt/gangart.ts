/**
 * Gehen oder Rennen (Wunsch des Autors, 21.11.2026: „Der Held kann draußen rennen“).
 *
 * Bedienung seit dem Joystick (Wunsch des Autors, 26.11.2026): kleiner Ausschlag des Knopfs heißt
 * gehen, großer rennen. Ab RENNEN_AB des Daumenradius rennt der Held, unter GEHEN_UNTER geht er
 * wieder (Hysterese, damit es an der Grenze nicht flackert). Die Schwelle liegt im Ring; der
 * Daumen muss nicht mehr über den Rand des Kreuzes hinaus, darum gibt es keine eigene Schwelle
 * zum Bildschirmrand mehr (früher rennschwelle.ts). Auf der Tastatur rennt er mit gehaltener
 * Umschalttaste. Gerannt wird nur auf Außenkarten (orte.json, `innen`); auf dem Fahrrad gilt das
 * Fahrradtempo, Rennen ändert dort nichts.
 * Warum eine eigene Datei: szene.ts ist an der Größengrenze; hier liegen die reine Regel
 * (gangartZu) und der kleine Zustand (Gangart), den die Szene je Bild fragt.
 * Bild: Figuren ohne Rennreihe rennen mit schnelleren Laufbildern (figurbilder.ts, rennname).
 * Auslöser prüft die Szene weiter je Bild auf der eigenen und der nächsten Kachel; bei 1,8-fachem
 * Tempo sind das unter 2 Pixel je Bild, nichts wird übersprungen.
 * Kartenwechsel: Die neue Gangartsteuerung übernimmt Joystick und Umschalttaste, die schon gehalten
 * sind (gehalteneeingabe.ts).
 * Abhängigkeiten: Phaser (nur Typen), gehalteneeingabe.ts.
 */
import type Phaser from "phaser";
import { gehaltenerJoystick, umschaltGehalten } from "./gehalteneeingabe";

/** Ab diesem Anteil des Daumenradius rennt der Held (Joystick, joystick.ts). */
export const RENNEN_AB = 0.8;
/** Unter diesem Anteil geht er wieder (Hysterese). */
export const GEHEN_UNTER = 0.7;
/** So viel schneller ist Rennen als Gehen. */
export const RENNFAKTOR = 1.8;

export type Gangart = "gehen" | "rennen";

/** Tastencode der Umschalttaste. */
const UMSCHALTTASTE = 16;

/**
 * Die Gangart zum Ausschlag des Joysticks (0 in der Mitte, 1 am Ring).
 * Beispiel: 0,5 → gehen; 0,9 → rennen; danach 0,75 → rennen (Hysterese); 0,6 → gehen.
 */
export function gangartZu(ausschlag: number, alt: Gangart): Gangart {
  if (ausschlag >= RENNEN_AB) return "rennen";
  if (ausschlag < GEHEN_UNTER) return "gehen";
  return alt;
}

/**
 * Zustand des Rennens für die Szene: Joystick (setzeKreuz) und Umschalttaste.
 * `erlaubt` ist false innen und auf dem Fahrrad; dann bleibt es immer beim Gehen.
 */
export class Gangartsteuerung {
  private kreuz = gehaltenerJoystick().rennen;
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

  /** Der Joystick meldet: großer Ausschlag (true) oder nicht. */
  setzeKreuz(rennen: boolean): void {
    this.kreuz = rennen;
  }

  /** Rennt der Held gerade? */
  rennt(): boolean {
    return this.erlaubt && (this.kreuz || this.umschalt?.isDown === true || umschaltGehalten());
  }

  /** Faktor auf das Tempo und auf die Bildrate der Laufbilder. */
  faktor(): number {
    return this.rennt() ? RENNFAKTOR : 1;
  }
}
