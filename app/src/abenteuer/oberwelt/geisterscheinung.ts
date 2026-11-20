/**
 * Eine Figur erscheint als Geist, wenn der Dialog es sagt (`#erscheint`), sie aber nicht auf der
 * Karte steht (geistfigur.ts zeichnet sie).
 *
 * Rolle im Gesamtbild: ausgelagert aus szene.ts (Größengrenze, 20.11.2026); eigene Datei, weil
 * figurbilder.ts Phaser zur Laufzeit lädt und geistfigur.ts in Tests ohne Browser läuft.
 * Abhängigkeiten: phaser (Typen), geistfigur.ts, figurbilder.ts.
 */
import type Phaser from "phaser";
import { fussUrsprungY, standbild } from "./figurbilder";
import { erscheinungsfeld, lasseGeistErscheinen } from "./geistfigur";
/**
 * Eine Figur erscheint als Geist, wenn der Dialog es sagt (`#erscheint`), sie aber nicht auf der
 * Karte steht: zwei Felder vor dem Helden, dort, wohin er schaut (auf dem Dachboden über dem
 * Brett). Ohne geladenen Bogen der Figur oder wenn sie schon da ist: nichts. Ausgelagert aus
 * szene.ts (Größengrenze).
 */
export function erscheineAlsGeist(
  szene: Phaser.Scene,
  name: string,
  held: Phaser.GameObjects.Sprite,
  blick: "oben" | "unten" | "links" | "rechts",
  kachel: number,
): void {
  const schluessel = `figur:${name}`;
  if (szene.children.getByName(name) || !szene.textures.exists(schluessel)) return;
  const mitte = erscheinungsfeld(held, blick, kachel);
  const bild = { schluessel, nummer: standbild("unten") };
  lasseGeistErscheinen(szene, name, bild, mitte, (s) => fussUrsprungY(s, kachel));
}
