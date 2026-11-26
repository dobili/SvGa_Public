/**
 * Laufbewegung des Helden in der Szene: Tippschritt bis zur Mitte der Nachbarkachel und die
 * Laufhilfe, die ihn quer zur Richtung zur Kachelmitte rückt.
 *
 * Rolle im Gesamtbild: ausgelagert aus szene.ts (Größengrenze, 20.11.2026, geführte Wege); die
 * Regeln selbst stehen in tippschritt.ts und laufhilfe.ts.
 * Seit dem 26.11.2026 auch die Bewegung in acht Richtungen (bewegeHeld, schraeglauf.ts).
 * Abhängigkeiten: phaser, achtrichtung.ts, tippschritt.ts, laufhilfe.ts, schraeglauf.ts.
 */
import type Phaser from "phaser";
import { geschwindigkeit, istSchraege, type Achtrichtung } from "./achtrichtung";
import { querziel } from "./laufhilfe";
import { schraegschritt } from "./schraeglauf";
import { zielErreicht, type Tippschritt } from "./tippschritt";

type Richtung = Tippschritt["richtung"];

/** Höchstens so viele Kachelpixel je Bild rückt die Laufhilfe den Helden zur Kachelmitte. */
const MITTENSCHRITT = 1;

/**
 * Richtung des laufenden Tippschritts; am Ziel (oder an einer Wand) endet er genau dort. Ausgabe:
 * Richtung (null: steht) und der Tippschritt, der weiterläuft (null: beendet).
 */
export function tippRichtung(
  held: Phaser.Physics.Arcade.Sprite,
  tipp: Tippschritt | null,
): { richtung: Richtung | null; tipp: Tippschritt | null } {
  if (!tipp) return { richtung: null, tipp: null };
  const koerper = held.body as Phaser.Physics.Arcade.Body;
  const seite = { oben: "up", unten: "down", links: "left", rechts: "right" } as const;
  const steht = koerper.blocked[seite[tipp.richtung]];
  if (!zielErreicht(tipp, held) && !steht) return { richtung: tipp.richtung, tipp };
  if (!steht) held.setPosition(tipp.ziel.x, tipp.ziel.y);
  return { richtung: null, tipp: null };
}

/**
 * Laufhilfe: Beim Gehen rückt der Held quer zur Richtung sanft zur Mitte seiner Kachel, damit er
 * an Ecken von Möbeln und Wänden nicht hängen bleibt (auf dem Handy trifft man selten genau);
 * vor einer schmalen Lücke neben der Mitte bis zu 4 Pixel daneben (laufhilfe.ts, Editor 1.6).
 */
export function rueckeZurMitte(
  held: Phaser.Physics.Arcade.Sprite,
  richtung: Richtung,
  kachel: number,
  zellfrei: (x: number, y: number) => boolean,
): void {
  const quer = richtung === "oben" || richtung === "unten" ? "x" : "y";
  const koerper = (held.body as Phaser.Physics.Arcade.Body).center;
  const abstand = querziel(koerper, richtung, kachel, zellfrei) - koerper[quer];
  held[quer] += Math.sign(abstand) * Math.min(Math.abs(abstand), MITTENSCHRITT);
}

const MS_JE_SEKUNDE = 1000;

/**
 * Setzt die Geschwindigkeit des Helden für ein Bild in einer der acht Richtungen.
 * Geradeaus mit Laufhilfe (rueckeZurMitte); schräg normiert, an Wänden rutschend und in Durchlässe
 * von Körperbreite einrastend (schraeglauf.ts). Eingaben: Held, Richtung, Tempo in Kartenpixeln je
 * Sekunde, Dauer des Bildes in Millisekunden, Kachelgröße, Abfrage „Zelle frei?“ (4 Pixel).
 * Beispiel: rechtsOben bei 56 im Freien → (39,6; −39,6); an einer Wand oben → (56, 0).
 */
export function bewegeHeld(
  held: Phaser.Physics.Arcade.Sprite,
  richtung: Achtrichtung,
  tempo: number,
  delta: number,
  kachel: number,
  zellfrei: (x: number, y: number) => boolean,
): void {
  const koerper = held.body as Phaser.Physics.Arcade.Body;
  if (!istSchraege(richtung)) {
    rueckeZurMitte(held, richtung, kachel, zellfrei);
    const v = geschwindigkeit(richtung, tempo);
    koerper.setVelocity(v.x, v.y);
    return;
  }
  const weg = (tempo * delta) / MS_JE_SEKUNDE;
  const schritt = schraegschritt(koerper.center, richtung, tempo, weg, zellfrei);
  if (schritt.einrasten) {
    const { achse, wert } = schritt.einrasten;
    held[achse] += wert - koerper.center[achse];
  }
  if (schritt.rutscht) rueckeZurMitte(held, schritt.rutscht, kachel, zellfrei);
  koerper.setVelocity(schritt.vx, schritt.vy);
}
