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
import { begehbar, sitzkacheln, sperrkacheln, type Sperrangabe, type Tiledkarte } from "./begehbar";

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

describe("Kollisionspinsel (Karteneditor 1.3, Wunsch des Autors, 16.11.2026)", () => {
  const SOFA: Sperrangabe = { breite: 48, hoehe: 16, kollision: true };
  /** Karte 6 × 2: Sofa auf (0, 0) bis (2, 0), eine Figur auf (4, 1), Pinsel als Eigenschaften. */
  function karte(sperren: string, freigeben: string): Tiledkarte {
    const objects = [
      { name: "sofa", type: "moebel", x: 0, y: 0 },
      { name: "mutter", type: "figur", x: 64, y: 16 },
    ];
    const properties = [
      { name: "sperren", value: sperren },
      { name: "freigeben", value: freigeben },
    ];
    return { width: 6, height: 2, properties, layers: [{ type: "objectgroup", objects }] };
  }
  const frei = (k: Tiledkarte, x: number, y: number) =>
    begehbar(k, sperrkacheln(k, { sofa: SOFA }, KACHEL))(x, y);

  it("gemalte Sperren sperren freie Kacheln", () => {
    expect(frei(karte("", ""), 5, 0)).toBe(true);
    expect(frei(karte("5,0;3,1", ""), 5, 0)).toBe(false);
    expect(frei(karte("5,0;3,1", ""), 3, 1)).toBe(false);
  });

  it("gemalte Freigaben stechen Möbel, aber keine Figuren", () => {
    expect(frei(karte("", ""), 1, 0)).toBe(false);
    expect(frei(karte("", "1,0;4,1"), 1, 0)).toBe(true);
    expect(frei(karte("", "1,0;4,1"), 0, 0)).toBe(false);
    expect(frei(karte("", "1,0;4,1"), 4, 1)).toBe(false);
  });

  it("übergeht kaputte Angaben", () => {
    expect(frei(karte("x;5", "1;"), 5, 0)).toBe(true);
    expect(frei(karte("x;5", "1;"), 1, 0)).toBe(false);
  });
});

describe("Sitzende sperren die Kachel über sich (Angleichung an die Szene, 18.11.2026)", () => {
  // Schulstuhl 16 × 32 von LimeZu: Die obere Kachel bleibt frei (hohes Möbel), auf der unteren
  // sitzt die Figur; ihr Bild rückt in der Szene bis zu einer Kachel nach oben.
  const STUHL: Sperrangabe = { breite: 16, hoehe: 32, kollision: false, art: "stuhl" };
  /** Karte 3 × 3: Stuhl auf (1, 1) bis (1, 2), darauf eine Figur oder ein Statist auf (1, 2). */
  function karte(typ: "figur" | "statist", sitzt: boolean, mitStuhl = true): Tiledkarte {
    const properties = sitzt ? [{ name: "sitzt", value: "rechts" }] : [];
    const objects = [
      ...(mitStuhl ? [{ name: "stuhl", type: "moebel", x: 16, y: 16 }] : []),
      { name: "sam", type: typ, x: 16, y: 32, properties },
    ];
    return { width: 3, height: 3, layers: [{ type: "objectgroup", objects }] };
  }
  const frei = (k: Tiledkarte, x: number, y: number) =>
    begehbar(k, sperrkacheln(k, { stuhl: STUHL }, KACHEL))(x, y);

  it("eine sitzende Figur sperrt Fußkachel und die Kachel darüber", () => {
    expect(frei(karte("figur", true), 1, 2)).toBe(false);
    expect(frei(karte("figur", true), 1, 1)).toBe(false);
    expect(frei(karte("figur", true), 1, 0)).toBe(true);
    expect(sitzkacheln(karte("figur", true), { stuhl: STUHL }, KACHEL)).toEqual(["1,1"]);
  });

  it("rückt das Bild nach unten (Bank unter der Fußlinie), bleibt die Kachel darüber frei", () => {
    // Ward abends in Summit City: Bank 32 × 16 auf der Kachel unter ihr (Ansprechprobe 24.11.2026).
    const BANK: Sperrangabe = { breite: 32, hoehe: 24, kollision: false, art: "bank" };
    const objects = [
      { name: "bank", type: "moebel", x: 8, y: 24 },
      {
        name: "ward",
        type: "figur",
        x: 16,
        y: 16,
        properties: [{ name: "sitzt", value: "unten" }],
      },
    ];
    const k: Tiledkarte = { width: 3, height: 3, layers: [{ type: "objectgroup", objects }] };
    expect(sitzkacheln(k, { bank: BANK }, KACHEL)).toEqual([]);
    // Dieselbe Bank auf ihrer Kachel (Unterkante auf der Fußlinie): Das Bild rückt nach oben.
    const oben = objects.map((o) => (o.name === "bank" ? { ...o, y: 8 } : o));
    const k2: Tiledkarte = { ...k, layers: [{ type: "objectgroup", objects: oben }] };
    expect(sitzkacheln(k2, { bank: BANK }, KACHEL)).toEqual(["1,0"]);
  });

  it("ein sitzender Statist auch, selbst ohne `von` und `bis`", () => {
    expect(frei(karte("statist", true), 1, 1)).toBe(false);
  });

  it("wer steht oder am Boden sitzt, sperrt nur seine Kachel", () => {
    expect(frei(karte("figur", false), 1, 1)).toBe(true);
    expect(frei(karte("figur", true, false), 1, 1)).toBe(true);
  });

  it("ohne Figuren (Durchgang eines Übergangs) zählt auch die Sitzkachel nicht", () => {
    const k = karte("figur", true);
    expect(sperrkacheln(k, { stuhl: STUHL }, KACHEL, false).has("1,1")).toBe(false);
  });
});
