/**
 * Tests der Möbelbögen (skripte/moebelboegen.mjs) und ihrer Nutzung in der Szene
 * (oberwelt/moebel.ts: bildquelle, rahmenJeTextur) und ihrer Aufteilung je Ort
 * (skripte/abenteuerpaket-moebel.mjs, lageFuer).
 */
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { BOGEN_RAND, baueMoebelboegen, packeRegal } from "../../../skripte/moebelboegen.mjs";
import { moebelJeOrt } from "../../../skripte/abenteuerpaket-moebel.mjs";
import { bildquelle, lageFuer, rahmenJeTextur, type Moebel } from "../oberwelt/moebel";

/** Ein einfarbiges PNG. */
function flaeche(breite: number, hoehe: number, rot: number): Promise<Buffer> {
  return sharp({
    create: {
      width: breite,
      height: hoehe,
      channels: 4,
      background: { r: rot, g: 0, b: 0, alpha: 1 },
    },
  })
    .png()
    .toBuffer();
}

describe("Möbelbögen: Packen", () => {
  it("legt Bilder überschneidungsfrei in einen Bogen", () => {
    const eintraege = [
      { name: "a", breite: 18, hoehe: 18 },
      { name: "b", breite: 10, hoehe: 34 },
      { name: "c", breite: 50, hoehe: 6 },
    ];
    const [bogen, zuviel] = packeRegal(eintraege);
    expect(zuviel).toBeUndefined();
    const plaetze = bogen?.plaetze ?? [];
    expect(plaetze.map((p) => p.name).sort()).toEqual(["a", "b", "c"]);
    for (const p of plaetze) {
      expect(p.x + p.breite).toBeLessThanOrEqual(bogen?.breite ?? 0);
      expect(p.y + p.hoehe).toBeLessThanOrEqual(bogen?.hoehe ?? 0);
      for (const q of plaetze) {
        if (q === p) continue;
        const getrennt =
          p.x + p.breite <= q.x ||
          q.x + q.breite <= p.x ||
          p.y + p.hoehe <= q.y ||
          q.y + q.hoehe <= p.y;
        expect(getrennt).toBe(true);
      }
    }
  });

  it("beginnt einen zweiten Bogen, wenn der erste voll ist", () => {
    const eintraege = Array.from({ length: 5 }, (_, i) => ({
      name: `m${i}`,
      breite: 40,
      hoehe: 40,
    }));
    const boegen = packeRegal(eintraege, 80);
    expect(boegen.length).toBe(2);
    expect(boegen.flatMap((b) => b.plaetze).length).toBe(5);
  });

  it("bricht bei einem Bild über Bogengröße ab", () => {
    expect(() => packeRegal([{ name: "riese", breite: 90, hoehe: 10 }], 80)).toThrow(/riese/);
  });
});

describe("Möbelbögen: Bau", () => {
  it("setzt jedes Bild mit wiederholtem Rand an seinen Rahmen", async () => {
    const { boegen, rahmen } = await baueMoebelboegen("ort", [
      { name: "rot", bild: await flaeche(16, 32, 200) },
      { name: "dunkel", bild: await flaeche(32, 16, 50) },
    ]);
    expect(boegen.map((b) => b.name)).toEqual(["ort-1"]);
    const roh = await sharp(boegen[0]?.png).raw().toBuffer({ resolveWithObject: true });
    const pixel = (x: number, y: number) => roh.data[(y * roh.info.width + x) * 4];
    for (const [name, rot] of [
      ["rot", 200],
      ["dunkel", 50],
    ] as const) {
      const lage = rahmen[name];
      expect(lage?.bogen).toBe("ort-1");
      const [x, y, b, h] = lage?.rahmen ?? [0, 0, 0, 0];
      expect([b, h]).toEqual(name === "rot" ? [16, 32] : [32, 16]);
      expect(pixel(x, y)).toBe(rot);
      expect(pixel(x + b - 1, y + h - 1)).toBe(rot);
      // Der Rand wiederholt die Randpixel.
      expect(pixel(x - BOGEN_RAND, y - BOGEN_RAND)).toBe(rot);
    }
  });
});

describe("Möbel aus Bögen in der Szene", () => {
  const angabe = { quelle: "x.png", breite: 16, hoehe: 16 };

  it("nimmt den Bogen, wenn moebel.json ihn nennt, sonst das Einzelbild", () => {
    expect(
      bildquelle("sofa", { ...angabe, bogen: "maple-falls-1", rahmen: [1, 1, 16, 16] }),
    ).toEqual({
      pfad: "moebelboegen/maple-falls-1.png",
      schluessel: "moebelbogen:maple-falls-1",
    });
    expect(bildquelle("sofa", angabe)).toEqual({
      pfad: "moebel/sofa.png",
      schluessel: "moebel:sofa",
    });
  });

  it("sammelt die Rahmen je Textur, ein Einzelbild ohne Rahmen", () => {
    const rahmen = [1, 1, 16, 16] as const;
    const moebel: Moebel[] = [
      { name: "a", x: 0, y: 0, angabe, adresse: "blob:a", schluessel: "moebelbogen:o-1", rahmen },
      {
        name: "b",
        x: 0,
        y: 0,
        angabe,
        adresse: "blob:a",
        schluessel: "moebelbogen:o-1",
        rahmen: [19, 1, 8, 8],
      },
      { name: "a2", x: 32, y: 0, angabe, adresse: "blob:a", schluessel: "moebelbogen:o-1", rahmen },
      { name: "c", x: 0, y: 0, angabe, adresse: "blob:c", schluessel: "moebel:c" },
    ];
    const karte = rahmenJeTextur(moebel);
    expect(karte.get("moebelbogen:o-1")?.length).toBe(2);
    expect(karte.get("moebel:c")).toEqual([]);
  });
});

describe("Möbelbögen je Ort", () => {
  /** Eine Tiled-Karte mit Möbeln als Text. */
  const karte = (...namen: string[]) =>
    JSON.stringify({ layers: [{ objects: namen.map((name) => ({ name, type: "moebel" })) }] });

  it("sammelt die Möbel aller Karten eines Orts samt Zuständen, nur bekannte", () => {
    const orte = {
      orte: [
        {
          kennung: "mapleFalls",
          karten: [
            { datei: "karten/mf-park.json" },
            { datei: "karten/mf-club.json", zustaende: { leer: "karten/mf-club-leer.json" } },
          ],
        },
        { kennung: "riverton", karten: [{ datei: "karten/rv.json" }] },
        { kennung: "leer", karten: [{ datei: "karten/fehlt.json" }] },
      ],
    };
    const texte = new Map([
      ["mf-park.json", karte("bank", "stuhl", "unbekannt")],
      ["mf-club.json", karte("tisch")],
      ["mf-club-leer.json", karte("kiste")],
      ["rv.json", karte("stuhl")],
    ]);
    const moebel = { bank: {}, stuhl: {}, tisch: {}, kiste: {} };
    expect(Object.fromEntries(moebelJeOrt(orte, texte, moebel))).toEqual({
      mapleFalls: ["bank", "kiste", "stuhl", "tisch"],
      riverton: ["stuhl"],
    });
  });

  it("wählt den Bogen des Orts, sonst den ersten", () => {
    const angabe = {
      quelle: "x.png",
      breite: 16,
      hoehe: 16,
      bogen: "mapleFalls-1",
      rahmen: [1, 1, 16, 16] as const,
      jeOrt: {
        mapleFalls: { bogen: "mapleFalls-1", rahmen: [1, 1, 16, 16] as const },
        riverton: { bogen: "riverton-1", rahmen: [19, 1, 16, 16] as const },
      },
    };
    expect(lageFuer(angabe, "riverton")).toEqual({ bogen: "riverton-1", rahmen: [19, 1, 16, 16] });
    expect(lageFuer(angabe, "cedarCreek").bogen).toBe("mapleFalls-1");
    expect(lageFuer(angabe).bogen).toBe("mapleFalls-1");
  });
});
