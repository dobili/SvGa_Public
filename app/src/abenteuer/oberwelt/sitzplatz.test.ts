/**
 * Tests für sitzplatz.ts und sitzumriss.ts (umrissAusPixeln): Sitzende rücken auf ihr Sitzmöbel
 * und liegen in der Tiefe richtig (Spieltest Variante B, 16.11.2026, F2). Werte aus den Szenen von
 * Maple Falls (Clubraum, Terrasse vor dem Whitlock-Haus) und Riverton.
 */
import { describe, expect, it } from "vitest";
import type { Moebel } from "./moebel";
import {
  BODENSITZ,
  findeSitz,
  istSitzmoebel,
  SITZ_TIEFENABSTAND,
  sitzlage,
  sitzlageAuf,
  sitzmoebelAus,
  umrissInWelt,
  type Sitzmoebel,
} from "./sitzplatz";
import { umrissAusPixeln } from "./sitzumriss";

const K = 16;

/** Schulstuhl im Clubraum: Feld (5, 7), versatz [5, 5], 16 × 32, sichtbar 12 × 21, Tiefe 141. */
const stuhlrechteck: Sitzmoebel = {
  name: "mf8SchulstuhlRechts",
  x: 85,
  y: 117,
  breite: 16,
  hoehe: 32,
  tiefe: 141,
};
const schulstuhl: Sitzmoebel = {
  ...stuhlrechteck,
  sichtbar: { x: 88, y: 118, breite: 12, hoehe: 21 },
};

function moebel(name: string, x: number, y: number, art?: string, blick?: string): Moebel {
  return {
    name,
    x,
    y,
    adresse: "",
    schluessel: "",
    angabe: {
      quelle: "",
      breite: 16,
      hoehe: 32,
      ...(art ? { art } : {}),
      ...(blick ? { blick } : {}),
    },
  };
}

describe("istSitzmoebel", () => {
  it("erkennt Stühle, Bänke und Sessel an der Art", () => {
    expect(istSitzmoebel("x", "stuhl")).toBe(true);
    expect(istSitzmoebel("x", "bank")).toBe(true);
    expect(istSitzmoebel("cc5Tisch", "tisch")).toBe(false);
  });
  it("nimmt ohne Art den Namen, mit fremder Art nie", () => {
    expect(istSitzmoebel("cc4StuhlVorn")).toBe(true);
    expect(istSitzmoebel("rvBankgebaeude", "gebaeude")).toBe(false);
  });
});

describe("findeSitz", () => {
  it("findet den Stuhl, dessen ganzes Rechteck die Feldmitte enthält", () => {
    expect(findeSitz([schulstuhl], { x: 5, y: 8 }, K)).toBe(schulstuhl);
    expect(findeSitz([schulstuhl], { x: 6, y: 8 }, K)).toBeNull();
  });
  it("nimmt bei mehreren das kleinste", () => {
    const sofa: Sitzmoebel = { ...schulstuhl, name: "sofa", x: 64, y: 112, breite: 48 };
    expect(findeSitz([sofa, schulstuhl], { x: 5, y: 8 }, K)).toBe(schulstuhl);
  });
});

describe("sitzlage", () => {
  it("Sam sitzt auf der sichtbaren Mitte des verschobenen Schulstuhls, knapp über ihm", () => {
    // Sichtbar 88–100: Mitte 94, Feldmitte 88 → 6; Unterkante 139, Füße auf 144 → −5.
    const lage = sitzlage(schulstuhl, { x: 5, y: 8 }, K);
    expect(lage).toEqual({ dx: 6, dy: -5, tiefe: 141 + SITZ_TIEFENABSTAND });
  });
  it("Calloway rückt hoch an die Stuhlbeine (Stuhl ohne Versatz, Bild nur oben gefüllt)", () => {
    const stuhl: Sitzmoebel = {
      ...schulstuhl,
      x: 64,
      y: 480,
      tiefe: 504,
      sichtbar: { x: 66, y: 481, breite: 13, hoehe: 21 },
    };
    expect(sitzlage(stuhl, { x: 4, y: 31 }, K)).toEqual({
      dx: 1,
      dy: -10,
      tiefe: 504 + SITZ_TIEFENABSTAND,
    });
  });
  it("ohne gemessenen Umriss gilt das ganze Rechteck", () => {
    expect(sitzlage(stuhlrechteck, { x: 5, y: 8 }, K)).toMatchObject({ dx: 5, dy: 5 });
  });
  it("von hinten auf dem Stuhl mit hoher Lehne: auch davor (Akademie in Silicon Bay)", () => {
    const ruecken: Sitzmoebel = { ...schulstuhl, x: 80, y: 80, tiefe: 104 };
    expect(sitzlage(ruecken, { x: 5, y: 6 }, K).tiefe).toBe(104 + SITZ_TIEFENABSTAND);
  });
  it("von hinten auf einer Bank ohne Lehne: davor", () => {
    const bank: Sitzmoebel = { name: "bank", x: 80, y: 80, breite: 32, hoehe: 16, tiefe: 88 };
    expect(sitzlage(bank, { x: 5, y: 5 }, K).tiefe).toBe(88 + SITZ_TIEFENABSTAND);
  });
  it("auf einer breiten Bank zählt waagerecht nur der Feinschub gegen das Raster", () => {
    const bank: Sitzmoebel = {
      name: "rv8Zweierbank",
      x: 35,
      y: 176,
      breite: 32,
      hoehe: 32,
      tiefe: 200,
      sichtbar: { x: 35, y: 180, breite: 32, hoehe: 20 },
    };
    expect(sitzlage(bank, { x: 3, y: 12 }, K)).toMatchObject({ dx: 3, dy: -8 });
  });
  it("auf einer langen Bank (drei Kacheln hoch) senkrecht nur der Feinschub", () => {
    const bank: Sitzmoebel = { ...stuhlrechteck, name: "mfc9BankWest", x: 16, y: 144, hoehe: 48 };
    expect(sitzlage(bank, { x: 1, y: 10 }, K)).toMatchObject({ dx: 0, dy: 0 });
  });
  it("nie mehr als eine Kachel weit", () => {
    const weit = { ...schulstuhl, sichtbar: { x: 120, y: 60, breite: 12, hoehe: 21 } };
    expect(sitzlage(weit, { x: 5, y: 8 }, K)).toMatchObject({ dx: K, dy: -K });
  });
});

describe("umrissInWelt", () => {
  const innen = { x: 3, y: 1, breite: 12, hoehe: 21 };
  it("ungedreht: Umriss im Rahmen plus Ecke", () => {
    expect(umrissInWelt(innen, 16, 32, { x: 85, y: 117 })).toEqual({
      x: 88,
      y: 118,
      breite: 12,
      hoehe: 21,
    });
  });
  it("gespiegelt um die Mitte", () => {
    const lage = { mitteX: 93, mitteY: 133, massstab: 1, spiegeln: true, drehung: 0 };
    expect(umrissInWelt(innen, 16, 32, { x: 85, y: 117 }, lage)).toEqual({
      x: 86,
      y: 118,
      breite: 12,
      hoehe: 21,
    });
  });
  it("halb so groß und um 90 Grad im Uhrzeigersinn gedreht", () => {
    const lage = { mitteX: 100, mitteY: 100, massstab: 0.5, spiegeln: false, drehung: 90 };
    // Unterkante des Bildes (y 22, halbiert 3 unter der Mitte) liegt gedreht links bei x 97.
    expect(umrissInWelt(innen, 16, 32, { x: 0, y: 0 }, lage)).toEqual({
      x: 97,
      y: 97.5,
      breite: 10.5,
      hoehe: 6,
    });
  });
});

describe("umrissAusPixeln", () => {
  it("findet das Rechteck der deckenden Pixel, Schatten unter 40 zählen nicht", () => {
    const daten = new Uint8ClampedArray(4 * 3 * 4);
    daten[(1 * 4 + 1) * 4 + 3] = 255;
    daten[(2 * 4 + 2) * 4 + 3] = 200;
    daten[(0 * 4 + 3) * 4 + 3] = 20;
    expect(umrissAusPixeln(daten, 4, 3)).toEqual({ x: 1, y: 1, breite: 2, hoehe: 2 });
  });
  it("ganz durchsichtig: null", () => {
    expect(umrissAusPixeln(new Uint8ClampedArray(16), 2, 2)).toBeNull();
  });
});

describe("sitzmoebelAus und sitzlageAuf", () => {
  it("nimmt nur Sitzmöbel, mit Zeichentiefe und gemessenem Umriss", () => {
    const liste = [
      moebel("mf8SchulstuhlRechts", 85, 117, "stuhl", "rechts"),
      moebel("t1", 96, 112, "tisch"),
    ];
    const sitze = sitzmoebelAus(liste, K, () => ({ x: 88, y: 118, breite: 12, hoehe: 21 }));
    expect(sitze).toEqual([schulstuhl]);
    expect(sitzlageAuf(sitze, { x: 5, y: 8 }, K)?.tiefe).toBe(141 + SITZ_TIEFENABSTAND);
  });
  it("ohne Möbel unter dem Feld: null", () => {
    expect(sitzlageAuf([], { x: 5, y: 8 }, K)).toBeNull();
  });
});

describe("Sitzen am Boden (Lily auf dem Bordstein)", () => {
  it("ohne Sitzmöbel: keine Lage auf einem Möbel, dafür BODENSITZ ohne Verschiebung", () => {
    expect(sitzlageAuf([], { x: 14, y: 24 }, 16)).toBeNull();
    expect(BODENSITZ).toMatchObject({ dx: 0, dy: 0, amBoden: true });
  });
});
