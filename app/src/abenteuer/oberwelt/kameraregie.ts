/**
 * Kamera der Oberwelt einrichten: Grenzen nach kamera.ts und ein Versatz, damit der Held in der
 * Mitte der freien Fläche neben den Bedienelementen steht (Spieltest „einstieg“, 15.11.2026, R7:
 * Steuerkreuz und Leiste deckten den Helden am unteren Kartenrand zu; Spieltest Variante B,
 * 16.11.2026, F3/F4: quer Steuerkreuz und Knopfspalte, oben Münzen und abgeschnittener Kopf).
 *
 * Rolle im Gesamtbild: Gemeinsame Hilfe für oberwelt/szene.ts (Aufbau) und oberwelt/oberweltspiel.ts
 * (Drehen des Geräts). Abhängigkeiten: Phaser (Typen), kamera.ts.
 */
import type Phaser from "phaser";
import { kameragrenzen, verdeckteRaender, type Raender } from "./kamera";

/**
 * Setzt Vergrößerung, Grenzen und Folgeversatz der Kamera für eine Welt der Größe `breite` ×
 * `hoehe` (Kartenpixel). Das Bild hat volle Auflösung (oberweltspiel.ts), die Kamera vergrößert
 * mit `zoom`; gerechnet wird mit der sichtbaren Fläche in Kartenpixeln (Variante B,
 * weltmassstab.ts). Ausgabe: die verdeckten Ränder in Kartenpixeln (für den Zielhinweis).
 * Beispiel: Hochformat 390 × 843 bei ZOOM 3 → sichtbar 130 × 281, unten 80 und oben 19 verdeckt,
 * der Held steht 31 Kartenpixel über der Mitte.
 */
export function richteKameraEin(
  kamera: Phaser.Cameras.Scene2D.Camera,
  breite: number,
  hoehe: number,
  zoom: number,
): Raender {
  kamera.setZoom(zoom);
  const { sichtBreite, sichtHoehe } = sichtflaeche(kamera);
  const raender = verdeckteRaender(sichtBreite, sichtHoehe, zoom);
  const g = kameragrenzen(breite, hoehe, sichtBreite, sichtHoehe, raender);
  kamera.setBounds(g.x, g.y, g.breite, g.hoehe);
  // Phaser zielt auf (Held − Versatz): Ist unten mehr verdeckt als oben, legt ein negativer
  // Versatz die Bildmitte unter den Helden, er steht damit in der Mitte der freien Fläche.
  kamera.setFollowOffset(
    Math.round((raender.links - raender.rechts) / 2),
    Math.round((raender.oben - raender.unten) / 2),
  );
  return raender;
}

/** Sichtbare Fläche der Kamera in Kartenpixeln (Bildgröße geteilt durch die Vergrößerung). */
export function sichtflaeche(kamera: Phaser.Cameras.Scene2D.Camera): {
  sichtBreite: number;
  sichtHoehe: number;
} {
  return { sichtBreite: kamera.width / kamera.zoomX, sichtHoehe: kamera.height / kamera.zoomY };
}

/**
 * Wo ein Punkt der Ansicht (Kartenpixel ab der linken oberen Bildecke) für ein festes Objekt
 * (`setScrollFactor(0)`) liegen muss: Phaser vergrößert auch feste Objekte um die Bildmitte.
 * Beispiel: Bild 390 breit, ZOOM 3 → Ansicht x 0 liegt bei 130, x 130 (rechter Rand) bei 260.
 */
export function festerPunkt(
  kamera: Phaser.Cameras.Scene2D.Camera,
  x: number,
  y: number,
): { x: number; y: number } {
  const { sichtBreite, sichtHoehe } = sichtflaeche(kamera);
  return { x: x + (kamera.width - sichtBreite) / 2, y: y + (kamera.height - sichtHoehe) / 2 };
}
