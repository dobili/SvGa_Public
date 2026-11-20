/** Tests für zeichentiefe.ts: Figuren auf Veranden stehen vor dem Haus. */
import { describe, expect, it } from "vitest";
import type { Moebel } from "./moebel";
import { moebeltiefe, zeichentiefe } from "./zeichentiefe";

const KACHEL = 16;

function moebel(maske: readonly string[] | undefined, hoehe: number): Moebel {
  return {
    name: "probe",
    x: 0,
    y: 100,
    angabe: { breite: 48, hoehe, kollision: true, ...(maske ? { maske } : {}) },
    adresse: "",
    schluessel: "probe",
  } as Moebel;
}

describe("zeichentiefe", () => {
  it("nimmt ohne Maske die Mitte der untersten Reihe", () => {
    expect(zeichentiefe(moebel(undefined, 48), KACHEL)).toBe(100 + 48 - 8);
  });
  it("legt die Unterkante bei einer Veranda unter die letzte ganz gesperrte Reihe", () => {
    const maske = ["...", "###", "#.#", "..."];
    expect(zeichentiefe(moebel(maske, 64), KACHEL)).toBe(100 + 2 * KACHEL - 8);
  });
  it("lässt Bäume ohne ganz gesperrte Reihe unverändert", () => {
    expect(zeichentiefe(moebel([".#.", ".#."], 32), KACHEL)).toBe(100 + 32 - 8);
  });
  it("legt freie Reihen unter der letzten Sperre vor das Bild (Seiteneingang mit Stufen)", () => {
    const maske = ["....", "###.", "###.", "....", "...."];
    expect(zeichentiefe(moebel(maske, 80), KACHEL)).toBe(100 + 3 * KACHEL - 8);
  });
  it("gilt auch mit Maßstab: Villa des Helden (1,1) liegt nicht über ihm vor der Haustür", () => {
    // Wie mf4VillaWhitlock in maple-falls-aussen: 229 px hoch, Reihe 9 die letzte ganz gesperrte.
    const maske = [
      ".........",
      ...Array<string>(9).fill("#########"),
      "##.######",
      "##.######",
      "#...#####",
      "#...#####",
      ".........",
    ];
    const villa = { ...moebel(maske, 229), form: { drehung: 0, spiegeln: false, massstab: 1.1 } };
    const tiefe = zeichentiefe(villa, KACHEL);
    expect(tiefe).toBe(100 + 10 * KACHEL - 8);
    // Der Held auf dem Ankunftsfeld unter der Tür (Maskenreihe 12) steht davor.
    expect(100 + 12 * KACHEL + 8).toBeGreaterThan(tiefe);
  });
  it("bleibt ohne jede Sperre in der Maske bei der Bildunterkante", () => {
    expect(zeichentiefe(moebel(["..", ".."], 32), KACHEL)).toBe(100 + 32 - 8);
  });
});

describe("moebeltiefe", () => {
  const veranda = ["...", "###", "#.#", "..."];
  it("senkt die Vorgabe des Kartenbauers (Bildunterkante) nach der Maske", () => {
    const m = { ...moebel(veranda, 64), tiefe: 100 + 64 - 8 };
    expect(moebeltiefe(m, KACHEL)).toBe(100 + 2 * KACHEL - 8);
  });
  it("behält eine eigene Tiefe aus der Karte (Ebene, Wand, Tisch)", () => {
    expect(moebeltiefe({ ...moebel(veranda, 64), tiefe: 0 }, KACHEL)).toBe(0);
    expect(moebeltiefe({ ...moebel(veranda, 64), tiefe: 157 }, KACHEL)).toBe(157);
  });
  it("rechnet ohne Tiefe in der Karte wie zeichentiefe", () => {
    expect(moebeltiefe(moebel(veranda, 64), KACHEL)).toBe(100 + 2 * KACHEL - 8);
  });
});
