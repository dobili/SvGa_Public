/**
 * Tests: Kamera mit Vergrößerung (Variante B, Wunsch des Autors, 16.11.2026; kameraregie.ts).
 * Das Bild hat volle Auflösung, die Kamera vergrößert mit ZOOM; der sichtbare Ausschnitt in
 * Kartenpixeln bleibt so groß wie vorher, als das Bild selbst um ZOOM kleiner war.
 */
import { describe, expect, it } from "vitest";
import type Phaser from "phaser";
import { festerPunkt, richteKameraEin, sichtflaeche } from "./kameraregie";
import { FIGUR_SCHIRMPIXEL, GROSS_MASSSTAB, ZOOM } from "./weltmassstab";

/** Eine Kamera mit den Feldern, die kameraregie.ts liest und setzt. */
function kamera(breite: number, hoehe: number) {
  const k = {
    width: breite,
    height: hoehe,
    zoomX: 1,
    zoomY: 1,
    grenzen: [0, 0, 0, 0],
    versatz: [0, 0],
    setZoom(z: number) {
      k.zoomX = z;
      k.zoomY = z;
      return k;
    },
    setBounds(x: number, y: number, b: number, h: number) {
      k.grenzen = [x, y, b, h];
      return k;
    },
    setFollowOffset(x: number, y: number) {
      k.versatz = [x, y];
      return k;
    },
  };
  return k;
}

const alsKamera = (k: ReturnType<typeof kamera>) => k as unknown as Phaser.Cameras.Scene2D.Camera;

describe("Kamera mit Vergrößerung", () => {
  it("Karte drei, Figur zwei Bildschirmpixel: Figuren mit 2/3", () => {
    expect(ZOOM).toBe(3);
    expect(GROSS_MASSSTAB * ZOOM).toBe(FIGUR_SCHIRMPIXEL);
  });

  it("sichtbare Fläche und verdeckter Streifen wie zuvor (Hochformat 390 × 843)", () => {
    const k = kamera(390, 843);
    // Dachboden 224 × 176: früher Bild 130 × 281, 80 verdeckt, Karte mittig in 201 freien Pixeln.
    const verdeckt = richteKameraEin(alsKamera(k), 224, 176, ZOOM);
    expect(k.zoomX).toBe(ZOOM);
    expect(sichtflaeche(alsKamera(k))).toEqual({ sichtBreite: 130, sichtHoehe: 281 });
    expect(verdeckt).toBe(80);
    expect(k.grenzen).toEqual([0, -12, 224, 281]);
    expect(k.versatz).toEqual([0, -40]);
  });

  it("feste Objekte: Ansichtspunkt auf den Platz vor der Vergrößerung um die Bildmitte", () => {
    const k = kamera(390, 843);
    k.setZoom(ZOOM);
    expect(festerPunkt(alsKamera(k), 0, 0)).toEqual({ x: 130, y: 281 });
    expect(festerPunkt(alsKamera(k), 130, 281)).toEqual({ x: 260, y: 562 });
  });
});
