/**
 * Eingaben für den Helden: Joystick, Tastatur (Pfeile und WASD) und der Tippschritt.
 *
 * Rolle im Gesamtbild: aus szene.ts gelöst (Größengrenze, Joystick und diagonales Laufen,
 * 26.11.2026). Die Szene fragt je Bild `wunsch` und bekommt Laufrichtung (acht Werte) und Blick
 * (vier Werte, achtrichtung.ts); der Joystick (Joystick.tsx) meldet über `setze`.
 * - Tastatur: gleichzeitig gehaltene Tasten ergeben eine Schräge (rechts + oben → rechtsOben);
 *   WASD wie die Pfeile. WASD wird nicht im Dokument abgefangen, Eingabefelder bekommen die
 *   Buchstaben weiter (die Pfeile fängt pfeiltasten in eingabepause.ts, damit nichts rollt).
 * - Tippschritt (tippschritt.ts, Spieltest „einstieg“, 15.11.2026): Ein kurzes Antippen des
 *   Joysticks läuft bis zur Mitte der nächsten Kachel in Blickrichtung, wenn der Held seine Kachel
 *   beim Loslassen noch nicht verlassen hat. Gilt nur für den Joystick, wie früher fürs Kreuz.
 * - Kartenwechsel: Die neue Szene baut eine neue Heldsteuerung. Sie übernimmt, was Joystick und
 *   Tastatur schon halten (gehalteneeingabe.ts); so läuft der Held nach der Eingabepause weiter.
 * Abhängigkeiten: phaser (Typen), achtrichtung.ts, tippschritt.ts, eingabepause.ts,
 * gehalteneeingabe.ts.
 */
import type Phaser from "phaser";
import { ausTasten, blickZu, type Achtrichtung, type Hauptrichtung } from "./achtrichtung";
import { pfeiltasten } from "./eingabepause";
import { gehaltenerJoystick, richtungGehalten } from "./gehalteneeingabe";
import { kachelVon, tippschrittBeimLoslassen, type Punkt, type Tippschritt } from "./tippschritt";

/** Was der Spieler will: Laufrichtung (acht) und Blick (vier, für Ansprechen und Auslöser). */
export interface Steuereingabe {
  readonly richtung: Achtrichtung;
  readonly blick: Hauptrichtung;
}

/** Tastencodes von W, A, S, D. */
const WASD: Readonly<Record<Hauptrichtung, number>> = {
  oben: 87,
  links: 65,
  unten: 83,
  rechts: 68,
};

type Tastenpaar = readonly Phaser.Input.Keyboard.Key[];

/** Die Pfeile und WASD je Hauptrichtung; ohne Tastatur null. */
function tastenAus(
  tastatur: Phaser.Input.Keyboard.KeyboardPlugin | null | undefined,
): Readonly<Record<Hauptrichtung, Tastenpaar>> | null {
  const pfeile = pfeiltasten(tastatur);
  if (!tastatur || !pfeile) return null;
  const mit = (pfeil: Phaser.Input.Keyboard.Key, r: Hauptrichtung): Tastenpaar => [
    pfeil,
    tastatur.addKey(WASD[r], false),
  ];
  return {
    oben: mit(pfeile.up, "oben"),
    unten: mit(pfeile.down, "unten"),
    links: mit(pfeile.left, "links"),
    rechts: mit(pfeile.right, "rechts"),
  };
}

export class Heldsteuerung {
  private eingabe: Steuereingabe | null = null;
  /** Kachel beim Aufsetzen des Daumens (für den Tippschritt) und der laufende Tippschritt. */
  private druck: string | null = null;
  tipp: Tippschritt | null = null;
  private readonly tasten: Readonly<Record<Hauptrichtung, Tastenpaar>> | null;

  /** Übernimmt den schon gehaltenen Joystick (Kartenwechsel); ohne Tippschritt beim Loslassen. */
  constructor(tastatur: Phaser.Input.Keyboard.KeyboardPlugin | null | undefined = null) {
    this.tasten = tastenAus(tastatur);
    this.eingabe = gehaltenerJoystick().eingabe;
  }

  /**
   * Der Joystick meldet eine neue Eingabe (null: Daumen weg). Eingaben: Mitte des Helden, ob
   * Eingaben gerade gelten (kein Dialog, keine Eingabepause), Kachelgröße, Abfrage „Kachel frei?“.
   */
  setze(
    eingabe: Steuereingabe | null,
    mitte: Punkt | null,
    gilt: boolean,
    kachel: number,
    frei: (x: number, y: number) => boolean,
  ): void {
    const vorher = this.eingabe;
    this.eingabe = eingabe;
    if (eingabe) {
      if (vorher) return;
      this.tipp = null;
      this.druck = mitte && gilt ? kachelVon(mitte, kachel) : null;
      return;
    }
    const druck = this.druck;
    this.druck = null;
    if (!druck || !mitte || !vorher) return;
    this.tipp = tippschrittBeimLoslassen(vorher.blick, druck, mitte, kachel, frei);
  }

  /** Dialog offen: Eingaben verwerfen. */
  leere(): void {
    this.eingabe = null;
    this.druck = null;
    this.tipp = null;
  }

  /**
   * Was der Spieler gerade will (Joystick vor Tastatur); null, wenn nichts gedrückt ist. Eine Taste
   * gilt als gehalten, wenn Phaser sie kennt oder sie schon vor dem Kartenwechsel gedrückt war.
   */
  wunsch(blick: Hauptrichtung): Steuereingabe | null {
    if (this.eingabe) return this.eingabe;
    const t = this.tasten;
    if (!t) return null;
    const gehalten = (r: Hauptrichtung): boolean =>
      t[r].some((taste) => taste.isDown) || richtungGehalten(r);
    const richtung = ausTasten({
      oben: gehalten("oben"),
      unten: gehalten("unten"),
      links: gehalten("links"),
      rechts: gehalten("rechts"),
    });
    return richtung ? { richtung, blick: blickZu(richtung, blick) } : null;
  }
}
