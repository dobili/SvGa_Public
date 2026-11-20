/**
 * Laufbewegung des Helden in der Szene: Tippschritt bis zur Mitte der Nachbarkachel und die
 * Laufhilfe, die ihn quer zur Richtung zur Kachelmitte rückt.
 *
 * Rolle im Gesamtbild: ausgelagert aus szene.ts (Größengrenze, 20.11.2026, geführte Wege); die
 * Regeln selbst stehen in tippschritt.ts und laufhilfe.ts.
 * Abhängigkeiten: phaser, tippschritt.ts, laufhilfe.ts.
 */
import type Phaser from "phaser";
import { querziel } from "./laufhilfe";
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
