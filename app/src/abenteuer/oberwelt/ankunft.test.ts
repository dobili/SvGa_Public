import { describe, expect, it } from "vitest";
import { ankunftsort } from "./ankunft";
import type { Tiledkarte } from "./begehbar";

/** Raum 5 × 4 mit Wand ringsum (GID 2 sperrt), Tür unten in der Mitte. */
function raum(objekte: { name: string; x: number; y: number }[]): Tiledkarte {
  const reihen = ["#####", "#...#", "#...#", "##.##"];
  return {
    width: 5,
    height: 4,
    tilesets: [
      { firstgid: 1, tiles: [{ id: 1, properties: [{ name: "kollision", value: true }] }] },
    ],
    layers: [
      { type: "tilelayer", data: [...reihen.join("")].map((z) => (z === "#" ? 2 : 0)) },
      {
        type: "objectgroup",
        objects: objekte.map((o) => ({
          name: o.name,
          type: "ausloeser",
          x: o.x * 16,
          y: o.y * 16,
        })),
      },
    ],
  };
}

describe("Ankunft nach einem Übergang", () => {
  it("steht vor der Tür im Raum und schaut von ihr weg", () => {
    const karte = raum([{ name: "tuer", x: 2, y: 3 }]);
    expect(ankunftsort(karte, {}, "tuer", 16)).toEqual({
      x: 2,
      y: 2,
      richtung: "oben",
      aufAusloeser: false,
    });
  });

  it("steht neben der Luke, nicht darauf, und nimmt das Feld mit dem meisten Platz", () => {
    const luke = [
      { name: "treppe", x: 1, y: 1 },
      { name: "treppe", x: 1, y: 2 },
    ];
    const an = ankunftsort(raum(luke), {}, "treppe", 16);
    expect(an).toMatchObject({ x: 2, y: 2, richtung: "rechts", aufAusloeser: false });
  });

  it("meldet, wenn neben dem Auslöser nichts frei ist, und kennt fehlende Auslöser", () => {
    const voll = raum([
      { name: "tuer", x: 2, y: 3 },
      { name: "anderer", x: 2, y: 2 },
    ]);
    expect(ankunftsort(voll, {}, "tuer", 16)).toMatchObject({ x: 2, y: 3, aufAusloeser: true });
    expect(ankunftsort(voll, {}, "fehlt", 16)).toBeNull();
  });
});
