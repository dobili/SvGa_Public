/**
 * Liegelage im Bett: Eine Liegende rückt mit dem Kopf ans Kopfende ihres Betts, auf das Kissen.
 *
 * Warum: Eine Figur ist kürzer als ein Bett. Mittig gelegt lag Oma Ruths Kopf (gekippt, ohne
 * Liegebild) mitten im Bett unter der Decke, und auf dem Kissen lag niemand (Verdeckungsfotos,
 * 23.11.2026). Die Decke (vordergrund.ts, bettausschnitt) lässt nur die Kopfseite frei; dort muss
 * der Kopf liegen.
 * Rolle im Gesamtbild: aufgerufen von figurenaufstellung.ts (Tagesablauf, Statisten) und
 * fuehrungsschicht.ts (`#stelle … >liegt`), vor dem Zudecken. Abhängigkeiten: sitzumriss.ts
 * (sichtbarer Teil des Figurenbilds), vordergrund.ts (Bett unter einem Punkt).
 */
import type Phaser from "phaser";
import type { Umriss } from "./sitzplatz";
import type { Kopfseite } from "./sitzrichtung";
import { sichtbarImSprite } from "./sitzumriss";
import { bettUnter } from "./vordergrund";

/** So viele Kartenpixel bleibt der Kopf vom Rand des Betts weg (Kopfteil, Kissenrand). */
const RAND = 2;

/**
 * Abstand des Kopfendes von der Bildmitte einer Liegenden in Kartenpixeln. Gekippt (Standbild um
 * eine Vierteldrehung) liegt der Kopf am oberen Rand des Standbilds, im Liegebild am Rand der
 * Kopfseite. Beispiel: Standbild 32 × 32, sichtbar ab Zeile 2, Maßstab 0,7, gekippt → 9,8.
 */
export function kopfabstand(
  sichtbar: Umriss,
  rahmen: { readonly breite: number; readonly hoehe: number },
  massstab: number,
  kopf: Kopfseite,
  gekippt: boolean,
): number {
  if (gekippt) return (rahmen.hoehe / 2 - sichtbar.y) * massstab;
  const rand = kopf === "links" ? sichtbar.x : rahmen.breite - sichtbar.x - sichtbar.breite;
  return (rahmen.breite / 2 - rand) * massstab;
}

/**
 * Mitte der Liegenden waagerecht, damit der Kopf RAND Pixel vom Kopfende liegt.
 * Beispiel: Bett sichtbar 128 bis 168, Kopf links, Kopfabstand 9,8 → 128 + 2 + 9,8 = 139,8.
 */
export function liegemitte(
  bett: { readonly links: number; readonly rechts: number },
  kopf: Kopfseite,
  abstand: number,
): number {
  return kopf === "links" ? bett.links + RAND + abstand : bett.rechts - RAND - abstand;
}

/**
 * Rückt das Bild einer liegenden Figur (Ursprung in der Mitte, Liegebild oder gekippt) waagerecht
 * ans Kopfende des Betts unter (x, y). Ohne Bett oder gemessene Bilder bleibt es, wo es ist.
 */
export function rueckeAnsKopfende(
  figur: Phaser.GameObjects.Sprite,
  x: number,
  y: number,
  kopf: Kopfseite,
): void {
  const bett = figur.scene ? bettUnter(figur.scene, x, y) : undefined;
  const imBett = bett?.sichtbar();
  const imBild = sichtbarImSprite(figur);
  if (!bett || !imBett || !imBild) return;
  const grenzen = bett.bild.getBounds();
  const massstab = Math.abs(bett.bild.scaleX);
  const vonLinks = bett.bild.flipX ? bett.bild.frame.width - imBett.x - imBett.breite : imBett.x;
  const links = grenzen.x + vonLinks * massstab;
  const rahmen = { breite: figur.frame.width, hoehe: figur.frame.height };
  const abstand = kopfabstand(imBild, rahmen, figur.scaleY, kopf, figur.rotation !== 0);
  const ziel = liegemitte({ links, rechts: links + imBett.breite * massstab }, kopf, abstand);
  verschiebeBild(figur, ziel - figur.x);
}

/**
 * Verschiebt nur das Bild um dx Kartenpixel waagerecht, über den Ursprung (wie figurensitz.ts):
 * Lage und Kachel der Figur bleiben, sonst stünde der Held nach dem Aufstehen auf einer anderen
 * Kachel (abenteuer-gefuehrt.spec.ts). Der Ursprung gilt im ungedrehten Bild; gekippt wird die
 * Verschiebung zurückgedreht.
 */
function verschiebeBild(figur: Phaser.GameObjects.Sprite, dx: number): void {
  const [cos, sin] = [Math.cos(figur.rotation), Math.sin(figur.rotation)];
  const breite = figur.frame.width * figur.scaleX;
  const hoehe = figur.frame.height * figur.scaleY;
  figur.setOrigin(figur.originX - (dx * cos) / breite, figur.originY + (dx * sin) / hoehe);
}
