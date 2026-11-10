/** Tests für ausloeserebene.ts: Auslöser aus der Tiled-Ebene lesen und den Treffer finden. */
import { describe, expect, it } from "vitest";
import { liesAusloeser, triffAusloeser } from "./ausloeserebene";

const KACHEL = 16;

describe("Auslöser der Karte", () => {
  it("liest Auslöser und Figuren, lässt Belebung, Möbel und Namenlose weg", () => {
    const objekte = [
      { name: "brett", x: 48, y: 32 },
      { name: "jo", type: "figur", x: 16, y: 16 },
      { name: "taube", type: "tier", x: 0, y: 0 },
      { name: "bank", type: "moebel", x: 0, y: 0 },
      { name: "passant", type: "statist", x: 0, y: 0 },
      { name: "", x: 0, y: 0 },
    ];
    expect(liesAusloeser(objekte, KACHEL)).toEqual([
      { name: "brett", typ: "ausloeser", x: 3, y: 2 },
      { name: "jo", typ: "figur", x: 1, y: 1 },
    ]);
  });

  it("trifft zuerst die eigene Kachel, sonst die davor", () => {
    const brett = { name: "brett", typ: "ausloeser" as const, x: 3, y: 2 };
    const tuer = { name: "tuer", typ: "ausloeser" as const, x: 3, y: 3 };
    expect(triffAusloeser([brett], { x: 3, y: 3, richtung: "oben" })).toEqual({
      treffer: brett,
      darauf: null,
    });
    expect(triffAusloeser([brett, tuer], { x: 3, y: 3, richtung: "oben" })).toEqual({
      treffer: tuer,
      darauf: tuer,
    });
    expect(triffAusloeser([brett], { x: 3, y: 3, richtung: "unten" }).treffer).toBeNull();
  });
});
