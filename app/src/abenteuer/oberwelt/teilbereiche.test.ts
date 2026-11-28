/**
 * Tests der Teilbereiche (teilbereiche.ts, KARTENREGELN 10.95, Phase 2B 28.11.2026) mit den echten
 * Katalogeinträgen aus inhalte/abenteuer/moebel/:
 * - Villa Port Delacroix (pd7Villa2): Der Held steht auf der Veranda vor der Hauswand und hinter dem
 *   Geländer; Pfosten und Geländer sperren, der Eingang links ist offen.
 * - Musikhaus (pd18MusikhausNeu): Stufen und Verandaboden vor der Tür begehbar, der Held steht dort
 *   vor der Tür.
 * Der Held ist ein Körper von 12 × 12 Pixeln um seinen Fußpunkt (figurbilder.ts, heldtiefe.ts).
 */
import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { moebelRechtecke, type Rechteck } from "./feinsperren";
import { heldtiefe, tiefenmoebelAus } from "./heldtiefe";
import type { Moebel, Moebelangabe } from "./moebel";
import { abziehen, bildteile, bodenbereiche } from "./teilbereiche";

const KACHEL = 16;
const KOERPER_HALB = 6;
const ORDNER = new URL("../../../../inhalte/abenteuer/moebel/", import.meta.url);
const katalog: Record<string, Moebelangabe> = {};
for (const datei of readdirSync(ORDNER).filter((d) => d.endsWith(".json"))) {
  const inhalt = JSON.parse(readFileSync(new URL(datei, ORDNER), "utf8")) as {
    moebel: Record<string, Moebelangabe>;
  };
  Object.assign(katalog, inhalt.moebel);
}

function moebel(name: string, x: number, y: number): Moebel {
  const angabe = katalog[name];
  if (!angabe) throw new Error(`${name} fehlt im Katalog`);
  return { name, x, y, angabe, adresse: "", schluessel: name };
}

function stoesst(m: Moebel, x: number, y: number): boolean {
  const flaechen: Rechteck[] = moebelRechtecke(m, m.angabe.maske_fein ?? [], KACHEL);
  return flaechen.some(
    (r) =>
      x - KOERPER_HALB < r.x + r.b &&
      r.x < x + KOERPER_HALB &&
      y - KOERPER_HALB < r.y + r.h &&
      r.y < y + KOERPER_HALB,
  );
}

/** Zeichentiefe des Helden neben diesem einen Möbel (Bild 20 × 38 um den Fuß). */
function tiefeDesHelden(m: Moebel, x: number, y: number): number {
  const bild = { x: x - 10, y: y - 28, breite: 20, hoehe: 38 };
  return heldtiefe(x, y, bild, tiefenmoebelAus([m], KACHEL), KACHEL).tiefe;
}

describe("Teilbereiche: Rechnen", () => {
  it("zieht ein Rechteck in bis zu vier Teilen ab", () => {
    expect(abziehen([0, 0, 10, 10], [2, 2, 8, 8])).toEqual([
      [0, 0, 10, 2],
      [0, 8, 10, 10],
      [0, 2, 2, 8],
      [8, 2, 10, 8],
    ]);
    expect(abziehen([0, 0, 10, 10], [20, 20, 30, 30])).toEqual([[0, 0, 10, 10]]);
  });
  it("lässt ein Bild ohne Teilbereiche ganz", () => {
    const teile = bildteile(moebel("pd7Laden1", 0, 0), KACHEL);
    expect(teile).toHaveLength(1);
    expect(teile[0]?.ganz).toBe(true);
  });
  it("lässt ein geformtes Bild ganz (Maßstab aus dem Karteneditor)", () => {
    const villa = moebel("pd7Villa2", 0, 0);
    const form = { drehung: 0, spiegeln: false, massstab: 1.2 };
    expect(bildteile({ ...villa, form }, KACHEL)).toHaveLength(1);
  });
});

describe("Bodenbereiche (boden_bereiche aus bauteilregeln.py)", () => {
  const angabe: Moebelangabe = {
    quelle: "probe.png",
    breite: 32,
    hoehe: 48,
    kollision: true,
    sortierlinie: 32,
    // Sperre in den Pixelreihen 0 bis 32, darunter frei (12 Reihen zu je 4 Pixeln).
    maske_fein: Array.from({ length: 12 }, (_, r) => (r < 8 ? "########" : "........")),
    boden_bereiche: [[8, 16, 24, 40]],
  };
  const probe: Moebel = { name: "probe", x: 100, y: 100, angabe, adresse: "", schluessel: "probe" };
  it("zeichnet den Helden mit dem Fuß im Bodenbereich über dem Bild", () => {
    expect(bodenbereiche(probe)).toEqual([{ x: 108, y: 116, breite: 16, hoehe: 24 }]);
    const tiefe = tiefeDesHelden(probe, 116, 120);
    expect(tiefe).toBeGreaterThan(132);
  });
  it("gilt geformt nicht", () => {
    const form = { drehung: 0, spiegeln: false, massstab: 2 };
    expect(bodenbereiche({ ...probe, form })).toEqual([]);
  });
});

describe("Teilbereiche: Villa mit Veranda (pd7Villa2)", () => {
  const villa = moebel("pd7Villa2", 160, 320);
  const teile = bildteile(villa, KACHEL);
  it("deckt das Bild genau ab: Haus mit Linie 170, Rest mit Linie 206", () => {
    const flaeche = teile.reduce((s, t) => s + t.ausschnitt.breite * t.ausschnitt.hoehe, 0);
    expect(flaeche).toBe(villa.angabe.breite * villa.angabe.hoehe);
    expect(teile[0]?.tiefe).toBe(320 + 170);
    expect(teile.slice(1).every((t) => t.tiefe === 320 + 206)).toBe(true);
  });
  it("lässt den Helden auf die Veranda und zeichnet ihn vor der Wand, hinter dem Geländer", () => {
    const x = 160 + 80;
    const y = 320 + 176;
    expect(stoesst(villa, x, y)).toBe(false);
    const tiefe = tiefeDesHelden(villa, x, y);
    expect(tiefe).toBeGreaterThan(320 + 170);
    expect(tiefe).toBeLessThan(320 + 206);
  });
  it("sperrt Geländer und Pfosten, der Eingang links ist offen", () => {
    expect(stoesst(villa, 160 + 80, 320 + 194)).toBe(true);
    expect(stoesst(villa, 160 + 8, 320 + 190)).toBe(true);
    expect(stoesst(villa, 160 + 36, 320 + 194)).toBe(false);
  });
});

describe("Teilbereiche: Musikhaus mit Veranda (pd18MusikhausNeu)", () => {
  const haus = moebel("pd18MusikhausNeu", 0, 400);
  it("lässt den Helden die Stufen hinauf vor die Tür und zeichnet ihn davor", () => {
    const x = 104;
    const y = 400 + 136;
    expect(stoesst(haus, x, y)).toBe(false);
    expect(tiefeDesHelden(haus, x, y)).toBeGreaterThan(400 + 128);
  });
  it("sperrt das Geländer neben der Tür", () => {
    expect(stoesst(haus, 60, 400 + 140)).toBe(true);
  });
});
