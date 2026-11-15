/**
 * Kamera der Oberwelt einrichten: Grenzen nach kamera.ts und ein Versatz nach oben, damit der Held
 * im Hochformat in der Mitte der freien Fläche über den Knöpfen steht (Spieltest „einstieg“,
 * 15.11.2026, R7: Steuerkreuz und Leiste deckten den Helden am unteren Kartenrand zu).
 *
 * Rolle im Gesamtbild: Gemeinsame Hilfe für oberwelt/szene.ts (Aufbau) und oberwelt/oberweltspiel.ts
 * (Drehen des Geräts). Abhängigkeiten: Phaser (Typen), kamera.ts.
 */
import type Phaser from "phaser";
import { kameragrenzen, verdeckteHoehe } from "./kamera";

/**
 * Setzt Grenzen und Folgeversatz der Kamera für eine Welt der Größe `breite` × `hoehe`
 * (Spielpixel). Ausgabe: die Höhe des verdeckten Streifens unten (für den Zielhinweis).
 * Beispiel: Hochformat 130 × 281 bei ZOOM 3 → 80 verdeckt, der Held steht 40 Pixel über der Mitte.
 */
export function richteKameraEin(
  kamera: Phaser.Cameras.Scene2D.Camera,
  breite: number,
  hoehe: number,
  zoom: number,
): number {
  const verdeckt = verdeckteHoehe(kamera.width, kamera.height, zoom);
  const g = kameragrenzen(breite, hoehe, kamera.width, kamera.height, verdeckt);
  kamera.setBounds(g.x, g.y, g.breite, g.hoehe);
  // Phaser zielt auf (Held − Versatz): Ein negativer Versatz legt die Bildmitte unter den Helden,
  // der Held steht damit höher, in der Mitte der freien Fläche.
  kamera.setFollowOffset(0, -Math.round(verdeckt / 2));
  return verdeckt;
}
