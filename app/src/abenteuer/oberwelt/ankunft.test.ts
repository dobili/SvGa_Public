import { describe, expect, it } from "vitest";
import { ankunftsfehler, ankunftsort } from "./ankunft";
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

  it("steht nach einer Reise genau auf dem Start und schaut in dessen Richtung", () => {
    const karte = raum([{ name: "tuer", x: 2, y: 3 }]);
    const ebene = karte.layers[1];
    const mitStart: Tiledkarte = {
      ...karte,
      layers: [
        karte.layers[0] ?? {},
        {
          ...ebene,
          objects: [
            ...(ebene?.objects ?? []),
            {
              name: "start",
              type: "ausloeser",
              x: 16,
              y: 16,
              properties: [{ name: "richtung", value: "rechts" }],
            },
          ],
        },
      ],
    };
    expect(ankunftsort(mitStart, {}, "start", 16)).toEqual({
      x: 1,
      y: 1,
      richtung: "rechts",
      aufAusloeser: false,
    });
    expect(ankunftsort(karte, {}, "start", 16)).toBeNull();
  });

  it("nimmt ein festes Ankunftsfeld der Szene mit Blick (Karteneditor 1.4)", () => {
    const karte = raum([{ name: "tuer", x: 2, y: 3 }]);
    const ebene = karte.layers[1];
    const mit = (eigenschaften: { name: string; value: string }[]): Tiledkarte => ({
      ...karte,
      layers: [
        karte.layers[0] ?? {},
        {
          ...ebene,
          objects: [{ name: "tuer", type: "ausloeser", x: 32, y: 48, properties: eigenschaften }],
        },
      ],
    });
    const mitBlick = mit([
      { name: "ankunft", value: "1,1" },
      { name: "blick", value: "links" },
    ]);
    expect(ankunftsort(mitBlick, {}, "tuer", 16)).toEqual({
      x: 1,
      y: 1,
      richtung: "links",
      aufAusloeser: false,
      festgelegt: true,
    });
    // Ohne Blick schaut der Held vom Durchgang weg; ein unlesbares Feld zählt nicht.
    const ohneBlick = mit([{ name: "ankunft", value: "2,1" }]);
    expect(ankunftsort(ohneBlick, {}, "tuer", 16)).toMatchObject({ x: 2, y: 1, richtung: "oben" });
    const kaputt = mit([{ name: "ankunft", value: "zwei" }]);
    expect(ankunftsort(kaputt, {}, "tuer", 16)).toMatchObject({ x: 2, y: 2, richtung: "oben" });
    expect(ankunftsort(kaputt, {}, "tuer", 16)?.festgelegt).toBeUndefined();
  });

  it("meldet ein festes Ankunftsfeld auf einem Auslöser oder einer Sperre", () => {
    const fest = { x: 2, y: 3, richtung: "oben", aufAusloeser: false, festgelegt: true } as const;
    const tuer = [{ name: "tuer", typ: "ausloeser", x: 2, y: 3 }] as const;
    const frei = () => true;
    expect(ankunftsfehler(fest, tuer, frei)).toBe(
      "festes Ankunftsfeld (2, 3) liegt auf dem Auslöser tuer",
    );
    expect(ankunftsfehler({ ...fest, y: 2 }, tuer, () => false)).toBe(
      "festes Ankunftsfeld (2, 2) ist gesperrt",
    );
    expect(ankunftsfehler({ ...fest, y: 2 }, tuer, frei)).toBeNull();
    expect(ankunftsfehler({ ...fest, festgelegt: undefined }, tuer, frei)).toBeNull();
  });
});
