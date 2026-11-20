/**
 * Tests für gefuehrterweg.ts: Tags `#gehe` und `#stelle` lesen, kürzester Weg auf den Kacheln,
 * Endfelder neben Figuren und der Blick am Ende (geführte Wege, 20.11.2026).
 */
import { describe, expect, it } from "vitest";
import { tagsAus } from "../dialog/geschichte";
import { blickZu, endfelder, stellauftrag, wegauftraege, wegZu } from "./gefuehrterweg";

/** Ein 6 × 5 Raum mit einer Wand bei x = 2 (y 0 bis 3), unten offen. */
const frei = (x: number, y: number) => x >= 0 && y >= 0 && x < 6 && y < 5 && !(x === 2 && y < 4);

describe("Tags", () => {
  it("lesen Figur, Ziel als Name oder Feld, mehrere Wege einer Zeile", () => {
    const tags = tagsAus(["sprecher:erzaehler", "gehe:mutterAussen>haustuer", "gehe:held>3,21"]);
    expect(wegauftraege(tags.gehe)).toEqual([
      { wer: "mutterAussen", ziel: { name: "haustuer" } },
      { wer: "held", ziel: { feld: { x: 3, y: 21 } } },
    ]);
  });

  it("übergehen kaputte Teile und lesen #stelle mit Haltung", () => {
    expect(wegauftraege("held;>ambrose;held>")).toEqual([]);
    expect(stellauftrag("held>13,8>liegt")).toEqual({
      wer: "held",
      feld: { x: 13, y: 8 },
      liegt: true,
    });
    expect(stellauftrag("held>13,8")?.liegt).toBe(false);
    expect(stellauftrag("held>bett")).toBeNull();
  });
});

describe("Weg", () => {
  it("geht um die Wand herum, kürzester Weg, ohne den Start", () => {
    const weg = wegZu({ x: 0, y: 0 }, [{ x: 4, y: 0 }], frei);
    expect(weg?.at(-1)).toEqual({ x: 4, y: 0 });
    expect(weg).toHaveLength(12);
    expect(weg?.some((f) => f.x === 2 && f.y < 4)).toBe(false);
  });

  it("ist leer am Ziel und null ohne Weg; ein gesperrter Start (Bett) ist erlaubt", () => {
    expect(wegZu({ x: 1, y: 1 }, [{ x: 1, y: 1 }], frei)).toEqual([]);
    expect(wegZu({ x: 0, y: 0 }, [{ x: 9, y: 9 }], frei)).toBeNull();
    expect(wegZu({ x: 2, y: 0 }, [{ x: 1, y: 0 }], frei)).toEqual([{ x: 1, y: 0 }]);
  });

  it("endet neben einer Figur auf freien Feldern und schaut sie an", () => {
    expect(endfelder({ x: 3, y: 1 }, true, frei)).toEqual([
      { x: 4, y: 1 },
      { x: 3, y: 2 },
      { x: 3, y: 0 },
    ]);
    expect(endfelder({ x: 3, y: 1 }, false, frei)).toEqual([{ x: 3, y: 1 }]);
    expect(blickZu({ x: 3, y: 2 }, { x: 3, y: 1 })).toBe("oben");
    expect(blickZu({ x: 4, y: 1 }, { x: 3, y: 1 })).toBe("links");
    expect(blickZu({ x: 3, y: 1 }, { x: 3, y: 1 })).toBeNull();
  });
});
