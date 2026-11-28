/**
 * Tests der Kontur (Auftrag des Autors, 28.11.2026): Kollision und Zeichentiefe nach dem Bild, mit den
 * echten Katalogeinträgen aus inhalte/abenteuer/moebel/ (pipeline/abenteuer/konturkollision.py).
 * - Stuhl: hinter der Lehne darf der Held entlanglaufen (das Bild deckt ihn), hinter der Sitzfläche
 *   nicht (gesperrt).
 * - Laterne: nur der Sockel sperrt; dahinter liegt der Held unter dem Mast, davor über dem Sockel.
 * - Treppe zum Betrachter: die Mitte ist begehbar, das Bild liegt unter dem Helden (Bodenebene),
 *   die Holme sperren.
 * Der Held ist ein Körper von 12 × 12 Pixeln um seinen Fußpunkt (figurbilder.ts, heldtiefe.ts).
 */
import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { moebelRechtecke, type Rechteck } from "./feinsperren";
import { heldtiefe, tiefenmoebel } from "./heldtiefe";
import type { Moebel, Moebelangabe } from "./moebel";
import { BODENTIEFE, moebeltiefe, sortierlinie, zeichentiefe } from "./zeichentiefe";

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

/** Ein Möbel des Katalogs an (x, y), ungeformt. */
function moebel(name: string, x: number, y: number): Moebel {
  const angabe = katalog[name];
  if (!angabe) throw new Error(`${name} fehlt im Katalog`);
  return { name, x, y, angabe, adresse: "", schluessel: name };
}

/** Stößt der Held mit dem Fußpunkt (x, y) an eine der Flächen? */
function stoesst(flaechen: readonly Rechteck[], x: number, y: number): boolean {
  return flaechen.some(
    (r) =>
      x - KOERPER_HALB < r.x + r.b &&
      r.x < x + KOERPER_HALB &&
      y - KOERPER_HALB < r.y + r.h &&
      r.y < y + KOERPER_HALB,
  );
}

function flaechen(m: Moebel): Rechteck[] {
  return moebelRechtecke(m, m.angabe.maske_fein ?? [], KACHEL);
}

/** Zeichentiefe des Helden neben diesem einen Möbel (heldtiefe.ts, Bild 20 × 38 um den Fuß). */
function tiefeDesHelden(m: Moebel, x: number, y: number): number {
  const fest = tiefenmoebel([{ ...m, tiefe: moebeltiefe(m, KACHEL) }], KACHEL);
  const bild = { x: x - 10, y: y - 28, breite: 20, hoehe: 38 };
  return heldtiefe(x, y, bild, fest, KACHEL).tiefe;
}

describe("Kontur: Stuhl (mf3StuhlDunkelLinks, Lehne rechts oben, Sitz darunter)", () => {
  const stuhl = moebel("mf3StuhlDunkelLinks", 100, 100);
  /** Standfläche des Sitzes im Bild: Pixelreihen 12 bis 24 (Sitzkante 8 plus hinterer Rand). */
  const SITZ_OBEN = 12;
  const SITZ_UNTEN = 24;
  it("lässt den Helden hinter der Lehne stehen und zeichnet ihn darunter", () => {
    // Fuß eine halbe Körperhöhe über der Standfläche: Der Körper berührt die Lehne, nicht den Sitz.
    const y = 100 + SITZ_OBEN - KOERPER_HALB;
    expect(stoesst(flaechen(stuhl), 112, y)).toBe(false);
    expect(tiefeDesHelden(stuhl, 112, y)).toBeLessThan(zeichentiefe(stuhl, KACHEL));
  });
  it("sperrt die ganze Sitzfläche: dahinter steht der Held nicht", () => {
    for (let y = 100 + SITZ_OBEN - KOERPER_HALB + 1; y < 100 + SITZ_UNTEN + KOERPER_HALB; y++) {
      expect(stoesst(flaechen(stuhl), 106, y)).toBe(true);
    }
  });
  it("zeichnet den Helden vor dem Stuhl, wenn er davor steht", () => {
    const y = 100 + SITZ_UNTEN + KOERPER_HALB;
    expect(stoesst(flaechen(stuhl), 108, y)).toBe(false);
    expect(tiefeDesHelden(stuhl, 108, y)).toBeGreaterThan(zeichentiefe(stuhl, KACHEL));
  });
});

describe("Kontur: Laterne (mf4Laterne, Sockel in den Bildreihen 55 bis 63)", () => {
  const laterne = moebel("mf4Laterne", 200, 400);
  it("sperrt nur den Sockel: neben dem Mast und am Kopf kommt der Held vorbei", () => {
    expect(stoesst(flaechen(laterne), 208, 400 + 40)).toBe(false);
    expect(stoesst(flaechen(laterne), 208, 400 + 20)).toBe(false);
    expect(stoesst(flaechen(laterne), 208, 400 + 60)).toBe(true);
  });
  it("zeichnet den Helden hinter dem Mast darunter und vor dem Sockel darüber", () => {
    // Hinter dem Mast (Fuß über dem Sockel, eine halbe Kachel daneben): der Mast deckt ihn.
    expect(tiefeDesHelden(laterne, 216, 400 + 44)).toBeLessThan(zeichentiefe(laterne, KACHEL));
    // Vor dem Sockel: über dem ganzen Bild.
    expect(tiefeDesHelden(laterne, 208, 400 + 64 + KOERPER_HALB)).toBeGreaterThan(
      zeichentiefe(laterne, KACHEL),
    );
  });
});

describe("Kontur: Treppe zum Betrachter (Bodenebene)", () => {
  const treppe = moebel("treppeZumBetrachter", 16, 116);
  it("liegt unter dem Helden, auch wenn er auf ihr steht", () => {
    expect(zeichentiefe(treppe, KACHEL)).toBe(BODENTIEFE);
    expect(tiefeDesHelden(treppe, 40, 136)).toBe(136);
  });
  it("lässt die Mitte begehbar und sperrt die Holme", () => {
    expect(stoesst(flaechen(treppe), 40, 150)).toBe(false);
    expect(stoesst(flaechen(treppe), 16 + 2, 150)).toBe(true);
  });
});

describe("Sortierlinie des Katalogs", () => {
  const probe: Moebel = {
    name: "probe",
    x: 0,
    y: 400,
    angabe: { quelle: "probe.png", breite: 16, hoehe: 64, kollision: true, sortierlinie: 64 },
    adresse: "",
    schluessel: "probe",
  };
  it("geht der Regel der Maske vor und folgt Zuschnitt und Maßstab", () => {
    expect(zeichentiefe(probe, KACHEL)).toBe(464);
    const form = { drehung: 0, spiegeln: false, massstab: 0.75 };
    expect(sortierlinie({ ...probe, form })).toBe(448);
    const beschnitten = { ...form, massstab: 1, zuschnitt: [0, 8, 0, 0] as const };
    expect(sortierlinie({ ...probe, form: beschnitten })).toBe(456);
  });
  it("gilt gedreht nicht", () => {
    expect(sortierlinie({ ...probe, form: { drehung: 90, spiegeln: false, massstab: 1 } })).toBe(
      undefined,
    );
  });
});
