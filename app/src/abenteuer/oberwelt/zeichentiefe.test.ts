/** Tests für zeichentiefe.ts: Figuren auf Veranden stehen vor dem Haus. */
import { describe, expect, it } from "vitest";
import type { Moebel } from "./moebel";
import { zeichentiefe } from "./zeichentiefe";

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
});
