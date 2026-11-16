/**
 * Tests für mittenkacheln.ts: Kacheln, auf denen die Mitte des Helden trotz feiner Sperren steht.
 * Beispiel nach dem Wohnzimmer (Karteneditor des Autors, 16.11.2026): Ein Holm von einem Viertel
 * Breite sperrt die Kachel in ganzen Kacheln, die Mitte des Helden passt aber daneben.
 */
import { describe, expect, it } from "vitest";
import { sperrkacheln, type Tiledkarte } from "./begehbar";
import { freiMitMitte, mittenkacheln } from "./mittenkacheln";

const KACHEL = 16;

function karte(feinsperren: string): Tiledkarte {
  return {
    width: 3,
    height: 1,
    properties: [{ name: "sperren_fein", value: feinsperren }],
    layers: [],
  };
}

describe("Mitte des Helden mit Kollision fein", () => {
  it("ein Holm am linken Rand: in ganzen Kacheln gesperrt, die Mitte passt", () => {
    const k = karte("1,0,#...#...#...#...");
    expect(sperrkacheln(k, {}, KACHEL).has("1,0")).toBe(true);
    expect(mittenkacheln(k, {}, KACHEL).has("1,0")).toBe(true);
    expect(freiMitMitte(k, {}, KACHEL, sperrkacheln(k, {}, KACHEL))(1, 0)).toBe(true);
  });

  it("eine halb gesperrte Mittelkachel lässt keinen Platz für die Mitte", () => {
    const k = karte("1,0,##..##..##..##..;2,0,################");
    expect(mittenkacheln(k, {}, KACHEL).has("1,0")).toBe(false);
  });

  it("eine Figur bleibt gesperrt, auch wenn die Mitte passte", () => {
    const k = karte("");
    const frei = freiMitMitte(k, {}, KACHEL, new Set(["1,0"]));
    expect(frei(1, 0)).toBe(false);
    expect(frei(0, 0)).toBe(true);
    expect(frei(3, 0)).toBe(false);
  });
});
