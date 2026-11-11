/**
 * Begehbarkeit bei Möbeln, die nicht auf dem Kachelraster stehen (Grenze des Lauftests,
 * Auftrag 11.11.2026).
 *
 * Warum: Der Lauftest rechnet in Kacheln, das Spiel in Pixeln. Die Sorge war, dass zwischen zwei
 * pixelversetzten Möbeln ein Spalt bleibt, den der Lauftest für frei hält und der für den Helden
 * zu eng ist. Diese Tests halten fest, warum das nicht geht: Ein Möbel sperrt jede Kachel, die es
 * berührt. Was der Lauftest frei nennt, ist also eine ganze Kachel (16 Pixel) breit, und der
 * Körper des Helden misst 12 Pixel (szene.ts). Der Lauftest irrt nur zur sicheren Seite: Er
 * meldet einen 14 Pixel breiten Spalt als gesperrt, obwohl der Held hindurchpasst.
 */
import { describe, expect, it } from "vitest";
import { begehbar, sperrkacheln, type Sperrangabe, type Tiledkarte } from "./begehbar";

const KACHEL = 16;
const KISTE: Sperrangabe = { breite: 16, hoehe: 16, kollision: true };

/** Karte 6 × 1 mit Kisten an den genannten Pixelstellen (x). */
function karteMitKisten(...stellen: number[]): Tiledkarte {
  const objects = stellen.map((x) => ({ name: "kiste", type: "moebel", x, y: 0 }));
  return { width: 6, height: 1, layers: [{ type: "objectgroup", objects }] };
}

function freieSpalten(karte: Tiledkarte): number[] {
  const frei = begehbar(karte, sperrkacheln(karte, { kiste: KISTE }, KACHEL));
  return [0, 1, 2, 3, 4, 5].filter((x) => frei(x, 0));
}

describe("Möbel neben dem Kachelraster", () => {
  it("sperrt jede berührte Kachel: eine Kiste um 6 Pixel versetzt sperrt zwei Kacheln", () => {
    expect(freieSpalten(karteMitKisten(22))).toEqual([0, 3, 4, 5]);
  });

  it("nennt einen Spalt von 14 Pixeln zwischen zwei versetzten Kisten gesperrt", () => {
    // Kisten auf 6..22 und 36..52 Pixel: Dazwischen liegen 14 Pixel, aber keine ganze Kachel.
    expect(freieSpalten(karteMitKisten(6, 36))).toEqual([4, 5]);
  });

  it("nennt nur frei, was eine ganze Kachel breit ist", () => {
    // Kisten auf 0..16 und 34..50 Pixel: Kachel 1 (16..32) ist ganz frei, der Held (12 Pixel) passt.
    expect(freieSpalten(karteMitKisten(0, 34))).toEqual([1, 4, 5]);
  });
});
