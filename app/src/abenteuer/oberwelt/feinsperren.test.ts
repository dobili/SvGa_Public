/**
 * Kollision fein (Karteneditor 1.6): gleiche Fälle wie die Pipeline, Physik-Rechtecke, Ankunft und
 * Tippschritt vor teilweise gesperrten Kacheln.
 *
 * Warum: Pipeline (pipeline/abenteuer/kollisionfein.py) und App müssen eine Kachel gleich als
 * gesperrt zählen, wenn der Held (12 × 12 Pixel) mittig auf ihr eine gesperrte Zelle berührte. Die
 * Fälle in feinsperren.faelle.json baut der Kartenbau; pipeline/tests/test_abenteuer_kollisionfein.py
 * prüft, dass die Datei zu ihm passt, dieser Test, dass die App dasselbe ausrechnet.
 */
import { describe, expect, it } from "vitest";
import { ankunftsort } from "./ankunft";
import { begehbar, sperrkacheln, type Sperrangabe, type Tiledkarte } from "./begehbar";
import faelle from "./feinsperren.faelle.json";
import {
  feinsperrenAus,
  feinsperrRechtecke,
  kachelnMitFeinsperre,
  moebelRechtecke,
  zellrechtecke,
} from "./feinsperren";
import { querziel } from "./laufhilfe";
import { tippschrittBeimLoslassen } from "./tippschritt";

const KACHEL = 16;
const MOEBEL = faelle.moebel as Readonly<Record<string, Sperrangabe>>;

describe("Gemeinsame Fälle mit der Pipeline", () => {
  for (const fall of faelle.faelle) {
    it(fall.name, () => {
      const karte = fall.karte as Tiledkarte;
      const gesperrt = [...sperrkacheln(karte, MOEBEL, KACHEL)].sort();
      expect(gesperrt).toEqual(fall.gesperrt.map(([x, y]) => `${x},${y}`).sort());
    });
  }
});

describe("Physik-Rechtecke aus Zellen", () => {
  it("fasst eine obere Hälfte zu einem Rechteck zusammen", () => {
    expect(zellrechtecke(["####", "####", "....", "...."], 4)).toEqual([
      { x: 0, y: 0, b: 16, h: 8 },
    ]);
  });

  it("trennt Läufe verschiedener Breite und hält Lücken frei", () => {
    expect(zellrechtecke(["#..#", "#..#", "####"], 4)).toEqual([
      { x: 0, y: 0, b: 4, h: 8 },
      { x: 12, y: 0, b: 4, h: 8 },
      { x: 0, y: 8, b: 16, h: 4 },
    ]);
  });

  it("legt die feinen Sperren der Karte auf ihre Kachel", () => {
    const fein = feinsperrenAus([{ name: "sperren_fein", value: "1,1,########........;2,0,bad" }]);
    expect([...fein.keys()]).toEqual(["1,1"]);
    expect(kachelnMitFeinsperre(fein)).toEqual(["1,1"]);
    expect(feinsperrRechtecke(fein, KACHEL)).toEqual([{ x: 16, y: 16, b: 16, h: 8 }]);
  });

  it("rechnet die feine Maske eines Möbels ab seiner Ecke, auch mit Feinschub", () => {
    expect(moebelRechtecke({ x: 8, y: 16 }, ["##..", "##..", "....", "...."], KACHEL)).toEqual([
      { x: 8, y: 16, b: 8, h: 8 },
    ]);
  });
});

/** Raum 4 × 3 ohne Wände, ein Auslöser „tuer“ auf (0, 1), feine Sperren als Eigenschaft. */
function raum(feinsperren: string): Tiledkarte {
  return {
    width: 4,
    height: 3,
    properties: [{ name: "sperren_fein", value: feinsperren }],
    layers: [{ type: "objectgroup", objects: [{ name: "tuer", type: "ausloeser", x: 0, y: 16 }] }],
  };
}

describe("Ganzkachel-Rechner bei teilweise gesperrten Kacheln", () => {
  it("begehbar: ein Viertel genügt, die Kachel zu sperren; die Nachbarn bleiben frei", () => {
    const karte = raum("1,1,#...#...#...#...");
    const frei = begehbar(karte, sperrkacheln(karte, {}, KACHEL));
    expect([frei(1, 1), frei(0, 1), frei(2, 1)]).toEqual([false, true, true]);
  });

  it("Ankunft: nie auf einer teilweise gesperrten Kachel", () => {
    // Rechts neben der Tür ist am meisten Platz; mit einer feinen Sperre dort geht es nach oben.
    expect(ankunftsort(raum(""), {}, "tuer", KACHEL)).toMatchObject({ x: 1, y: 1 });
    const an = ankunftsort(raum("1,1,....####........"), {}, "tuer", KACHEL);
    expect(an).not.toMatchObject({ x: 1, y: 1 });
    expect(an?.aufAusloeser).toBe(false);
  });

  it("Tippschritt: endet vor einer teilweise gesperrten Kachel in der Mitte der eigenen", () => {
    const karte = raum("2,1,............####");
    const frei = begehbar(karte, sperrkacheln(karte, {}, KACHEL));
    const schritt = tippschrittBeimLoslassen("rechts", "1,1", { x: 27, y: 24 }, KACHEL, frei);
    expect(schritt?.ziel).toEqual({ x: 24, y: 24 });
    const offen = tippschrittBeimLoslassen("unten", "1,1", { x: 24, y: 27 }, KACHEL, frei);
    expect(offen?.ziel).toEqual({ x: 24, y: 40 });
  });
});

describe("Laufhilfe an schmalen Lücken (laufhilfe.ts)", () => {
  /** Zellen frei außer den gesperrten der Zellreihe 15 (Kachelreihe 3, unterstes Viertel). */
  const mitSperre =
    (...spalten: number[]) =>
    (zx: number, zy: number) =>
      !(zy === 15 && spalten.includes(zx));
  const unten = { x: 104, y: 72 }; // Mitte von Kachel (6, 4), der Held geht nach oben

  it("bleibt in der Kachelmitte, wenn vor ihm frei ist", () => {
    expect(querziel(unten, "oben", KACHEL, () => true)).toBe(104);
  });

  it("gleitet vor einem gesperrten rechten Viertel 2 Pixel nach links (Lücke 12 Pixel)", () => {
    expect(querziel(unten, "oben", KACHEL, mitSperre(27))).toBe(102);
  });

  it("bleibt in der Mitte, wenn die Lücke nur eine halbe Kachel breit ist", () => {
    expect(querziel(unten, "oben", KACHEL, mitSperre(26, 27))).toBe(104);
  });
});
