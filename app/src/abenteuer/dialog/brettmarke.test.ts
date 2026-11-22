/**
 * Tests für brettmarke.ts: Marke `#brett` lesen und das Bild eines Beispiels bilden, mit den echten
 * Daten aus inhalte/abenteuer/brettbeispiele.json.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { BrettbeispieleDesSchachAbenteuers } from "../../daten/generiert/abenteuer-brettbeispiele";
import { brettbild, brettmarke } from "./brettmarke";

const DATEN = JSON.parse(
  readFileSync(
    new URL("../../../../inhalte/abenteuer/brettbeispiele.json", import.meta.url),
    "utf8",
  ),
) as BrettbeispieleDesSchachAbenteuers;

function beispiel(kennung: string) {
  const b = DATEN.beispiele.find((x) => x.kennung === kennung);
  if (!b) throw new Error(`Beispiel ${kennung} fehlt`);
  return b;
}

describe("Brettmarke", () => {
  it("liest Kennung und Bild, aus und Unsinn sind keine Marke", () => {
    expect(brettmarke({ brett: "springergabel" })).toEqual({ kennung: "springergabel", bild: 0 });
    expect(brettmarke({ brett: "mamaspiess.2" })).toEqual({ kennung: "mamaspiess", bild: 2 });
    expect(brettmarke({ brett: "aus" })).toBeNull();
    expect(brettmarke({ brett: "x y" })).toBeNull();
    expect(brettmarke({})).toBeNull();
  });
});

describe("Brettbild", () => {
  it("Bauerngabel nach d5: Stellung, letzter Zug und die zwei Angriffspfeile", () => {
    const bild = brettbild(beispiel("bauerngabel"), 1);
    expect(bild?.fen.split(" ")[0]).toBe("4k3/8/2n1b3/3P4/8/8/8/4K3");
    expect(bild?.letzterZug).toEqual({ von: "d4", nach: "d5" });
    expect(bild?.markierungen.filter((m) => m.typ === "pfeil")).toHaveLength(2);
  });

  it("Anastasia nach drei Zügen ohne Fehler, Ausgangsbild ohne letzten Zug", () => {
    expect(brettbild(beispiel("anastasia"), 0)?.letzterZug).toBeNull();
    expect(brettbild(beispiel("anastasia"), 1)?.letzterZug).toEqual({ von: "d3", nach: "h3" });
    expect(brettbild(beispiel("anastasia"), 5)).toBeNull();
  });

  it("jedes Bild jedes Beispiels lässt sich zeichnen", () => {
    for (const b of DATEN.beispiele) {
      b.bilder.forEach((_, i) => {
        const bild = brettbild(b, i);
        expect(bild, `${b.kennung}.${i}`).not.toBeNull();
        expect(bild?.fen, `${b.kennung}.${i}`).not.toBe("");
      });
    }
  });
});
