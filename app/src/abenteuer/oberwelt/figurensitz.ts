/**
 * Sitzende Figuren und Statisten zeichnen (Regeln in sitzrichtung.ts und sitzplatz.ts): Sitzbild
 * aus der Sitzreihe des Bogens oder das Standbild um SITZ_HUB Pixel höher, dazu (seit dem Spieltest
 * Variante B, F2) auf das Sitzmöbel verschoben (sitzplatz.ts), damit die Figur auf ihrem Stuhl
 * sitzt statt daneben. Verschoben wird nur das Bild über den Ursprung: Lage und Kachel bleiben; der
 * feste Körper deckt Fußkachel und Sitzpunkt (sitzplatz.ts, sitzsperre), damit der Held nicht in
 * der Sitzenden steht.
 * Rolle im Gesamtbild: Hilfe für figurenaufstellung.ts (Figuren) und belebungsschicht.ts (Statisten).
 * Abhängigkeiten: Phaser, figurbilder.ts (fester Körper), sitzrichtung.ts, sitzplatz.ts (Typ).
 */
import Phaser from "phaser";
import { legeFestkoerperAufKachel } from "./figurbilder";
import type { Bildversatz } from "./figurversatz";
import { sitzsperre, type Sitzlage } from "./sitzplatz";
import { hatSitzbilder, SITZ_HUB, sitzbild } from "./sitzrichtung";
import {
  legeAusschnitt,
  moebelbild,
  sitzausschnitt,
  VORDERGRUND_ABSTAND,
  zerstoere,
} from "./vordergrund";
import { SITZT } from "./zuwendungsschicht";
import type { Richtung } from "./szene";

/** Zahl der Rahmen eines Sprites (ohne den Grundrahmen „__BASE“ von Phaser). */
export function rahmenzahl(sprite: Phaser.GameObjects.Sprite): number {
  return sprite.texture.frameTotal - 1;
}

/** Datenschlüssel am Sprite: der Vordergrund seines Sitzmöbels (vordergrund.ts). */
const VORDERGRUND = "sitzvordergrund";

/**
 * Legt den vorderen Teil des Sitzmöbels über die Sitzende (vordergrund.ts): Vorderkante und Beine,
 * von hinten gesehen die Lehne; wer zum Betrachter schaut, bekommt keinen. Ein früherer Vordergrund
 * derselben Figur wird entfernt. Ohne gemerktes Möbelbild (etwa im Test) geschieht nichts.
 */
function legeSitzvordergrund(
  sprite: Phaser.GameObjects.Sprite,
  richtung: Richtung,
  lage?: Sitzlage | null,
): void {
  zerstoere(sprite.getData(VORDERGRUND));
  if (!lage?.moebel || !sprite.scene) return;
  const eintrag = moebelbild(sprite.scene, lage.moebel);
  const sichtbar = eintrag?.sichtbar();
  if (!eintrag || !sichtbar) return;
  const ausschnitt = sitzausschnitt(sichtbar, eintrag.art, richtung, eintrag.angabe);
  sprite.setData(
    VORDERGRUND,
    legeAusschnitt(eintrag, ausschnitt, lage.tiefe + VORDERGRUND_ABSTAND),
  );
}

/**
 * Setzt einen Sprite, der schon auf seiner Kachel steht (stelleAufKachel oder fussUrsprungY),
 * auf das Sitzbild. Ohne Sitzreihe hebt der Ursprung das Bild um SITZ_HUB an; mit `lage`
 * (sitzplatz.ts) rückt das Bild um dx, dy Kartenpixel auf das Sitzmöbel. Ein fester Körper deckt
 * danach die Fußkachel und den Sitzpunkt. Ausgabe: die Verschiebung des Bildes in Kartenpixeln
 * (für die Sperrfläche der Statisten, belebungsschicht.ts).
 * Beispiel: Sam im Clubraum, lage dx 6, dy −5 → Bild 6 nach rechts und 9 nach oben (5 an die
 * Stuhlbeine, 4 Hub bei 2/3), Körper von (5, 8) bis 9 Pixel in (5, 7) und 6 Pixel nach rechts.
 */
export function setzeSitzend(
  sprite: Phaser.GameObjects.Sprite,
  richtung: Richtung,
  lage?: Sitzlage | null,
): { readonly dx: number; readonly dy: number } {
  const rahmen = rahmenzahl(sprite);
  // Sitzende drehen sich im Gespräch nicht zum Helden (zuwendung.ts).
  sprite.setData(SITZT, true);
  // Am Boden der Schneidersitz aus der Bodenreihe, wenn der Bogen sie hat (sitzrichtung.ts).
  sprite.setFrame(sitzbild(rahmen, richtung, lage?.amBoden));
  // Alles in Kartenpixeln; der Hub zählt in Figurenpixeln, also mal Maßstab (PixelLab 2/3).
  // Am Boden (BODENSITZ, Lily auf dem Bordstein) gibt es keine Sitzfläche, also keinen Hub.
  legeSitzvordergrund(sprite, richtung, lage);
  const hub = hatSitzbilder(rahmen) || lage?.amBoden ? 0 : SITZ_HUB * sprite.scaleY;
  const dx = lage?.dx ?? 0;
  const dy = (lage?.dy ?? 0) - hub;
  if (dx === 0 && dy === 0) return { dx, dy };
  const breite = sprite.frame.width * sprite.scaleX;
  const hoehe = sprite.frame.height * sprite.scaleY;
  sprite.setOrigin(sprite.originX - dx / breite, sprite.originY - dy / hoehe);
  // Der feste Körper hängt an der Bildecke: neu legen, auf Fußkachel und Sitzpunkt.
  const koerper = sprite.body;
  if (koerper instanceof Phaser.Physics.Arcade.StaticBody) {
    const kachel = koerper.width;
    legeFestkoerperAufKachel(sprite, kachel, sitzsperre(dx, dy, kachel));
  }
  return { dx, dy };
}

/**
 * Rückt nur das Bild einer aufgestellten Figur um ihren feinen Versatz (figurversatz.ts), stehend
 * oder sitzend; Punkt, Fußkachel und fester Körper bleiben, wo sie waren.
 * Eingaben: Sprite (schon auf Kachel oder Sitz gesetzt), Versatz in Kartenpixeln, Kachelgröße und
 * die Verschiebung durch das Sitzen (setzeSitzend), damit die Sitzsperre erhalten bleibt.
 * Warum über den Ursprung: So gilt der Versatz auch, wenn später nur das Bild wechselt (Drehen zum
 * Helden im Gespräch, Sitzbild), denn ein Bildwechsel lässt den Ursprung stehen.
 * Beispiel: Sam sitzt im Clubraum, versatz [0, -3] → Bild 3 Pixel höher, die Beine liegen auf der
 * Sitzfläche statt darin.
 */
export function verschiebeFigurbild(
  sprite: Phaser.GameObjects.Sprite,
  versatz: Bildversatz,
  kachel: number,
  sitz: { readonly dx: number; readonly dy: number } = { dx: 0, dy: 0 },
): void {
  const breite = sprite.frame.width * sprite.scaleX;
  const hoehe = sprite.frame.height * sprite.scaleY;
  sprite.setOrigin(sprite.originX - versatz.dx / breite, sprite.originY - versatz.dy / hoehe);
  const gesessen = sitz.dx !== 0 || sitz.dy !== 0;
  legeFestkoerperAufKachel(
    sprite,
    kachel,
    gesessen ? sitzsperre(sitz.dx, sitz.dy, kachel) : undefined,
  );
}
