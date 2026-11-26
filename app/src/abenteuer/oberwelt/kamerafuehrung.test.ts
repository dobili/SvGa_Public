/**
 * Tests des Schwenks in der Kameraführung (oberwelt/kamerafuehrung.ts, schwenk.ts) mit einer
 * nachgebauten Kamera: hinfahren, dort bleiben, Weitertippen springt, zurück zum Helden, die
 * vorausschauende Kamera ruht währenddessen, Anmeldung unter der Szene.
 */
import type Phaser from "phaser";
import { describe, expect, it } from "vitest";
import { Kamerafuehrung, kamerafuehrungVon } from "./kamerafuehrung";

/** Länger als jede Fahrt in diesen Tests (gut 8 s für 100 Kacheln). */
const LANGE_MS = 20000;

/** Die Teile der Phaser-Kamera, die die Kameraführung benutzt. */
function nachgebauteKamera() {
  const kamera = {
    scene: {},
    width: 390,
    height: 844,
    zoomX: 1,
    zoomY: 1,
    scrollX: 0,
    scrollY: 0,
    originX: 0.5,
    originY: 0.5,
    followOffset: { x: 0, y: 0 },
    setZoom(z: number) {
      kamera.zoomX = kamera.zoomY = z;
    },
    setBounds() {},
    setFollowOffset(x: number, y: number) {
      kamera.followOffset = { x, y };
    },
  };
  return kamera;
}

function aufbau() {
  const kamera = nachgebauteKamera();
  const fuehrung = new Kamerafuehrung(
    kamera as unknown as Phaser.Cameras.Scene2D.Camera,
    16,
    () => [],
  );
  const raender = fuehrung.richteEin(2000, 2000, 1);
  return { kamera, fuehrung, raender };
}

const HELD = { x: 500, y: 500 };

describe("Kameraschwenk", () => {
  it("meldet sich unter seiner Szene an", () => {
    const { kamera, fuehrung } = aufbau();
    expect(kamerafuehrungVon(kamera.scene)).toBe(fuehrung);
  });

  it("fährt zum Ziel, bleibt dort und kommt zurück", () => {
    const { kamera, fuehrung, raender } = aufbau();
    const grund = { ...kamera.followOffset };
    fuehrung.schritt(16, null, HELD);
    fuehrung.schwenke({ x: 700, y: 300 }, raender, false);
    fuehrung.schritt(1000, null, HELD);
    // unterwegs (nach einer Sekunde, der Anfang ist langsam): weder am Anfang noch am Ziel
    expect(kamera.followOffset.x).toBeLessThan(grund.x);
    expect(kamera.followOffset.x).toBeGreaterThan(grund.x - 200);
    fuehrung.schritt(LANGE_MS, null, HELD);
    expect(kamera.followOffset).toEqual({ x: grund.x - 200, y: grund.y + 200 });
    // Er bleibt beim Ziel, auch wenn Zeit vergeht und jemand eine Richtung meldet.
    fuehrung.schritt(500, "oben", HELD);
    expect(kamera.followOffset).toEqual({ x: grund.x - 200, y: grund.y + 200 });
    expect(fuehrung.schwenkt).toBe(true);
    fuehrung.schwenke(null, raender, false);
    fuehrung.schritt(LANGE_MS, null, HELD);
    expect(kamera.followOffset).toEqual(grund);
    expect(fuehrung.schwenkt).toBe(false);
  });

  it("Weitertippen springt ans Ziel; sofort ohne Fahrt", () => {
    const { kamera, fuehrung, raender } = aufbau();
    const grund = { ...kamera.followOffset };
    fuehrung.schritt(16, null, HELD);
    fuehrung.schwenke({ x: 500, y: 100 }, raender, false);
    fuehrung.schritt(50, null, HELD);
    fuehrung.ueberspringe();
    expect(kamera.followOffset).toEqual({ x: grund.x, y: grund.y + 400 });
    fuehrung.schwenke(null, raender, true);
    expect(kamera.followOffset).toEqual(grund);
  });

  it("zurück ohne Schwenk tut nichts", () => {
    const { kamera, fuehrung, raender } = aufbau();
    const vorher = { ...kamera.followOffset };
    fuehrung.schwenke(null, raender, false);
    expect(fuehrung.schwenkt).toBe(false);
    expect(kamera.followOffset).toEqual(vorher);
  });
});
