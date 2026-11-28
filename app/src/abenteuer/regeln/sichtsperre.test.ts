/**
 * Tests für regeln/sichtsperre.ts: Wer im Bild stand, springt beim Neuaufbau nicht und verschwindet
 * nicht (Wunsch des Autors, 28.11.2026: Coach Delgado war nach der Partie gegen {rivale} fort).
 */
import { describe, expect, it } from "vitest";
import type { Aufstellung } from "./auftritt";
import { figurobjekte, imBild, mitSichtsperre, type Figurobjekt } from "./sichtsperre";

const CLUBRAUM = "mapleFalls.clubraum";
const K = 16;
/** Bild über dem oberen Teil des Clubraums: Kacheln 8 bis 19, Zeilen 0 bis 9. */
const SICHT = { x: 8, y: 0, breite: 12, hoehe: 10 };

const figur = (name: string, x: number, y: number, properties: Figurobjekt["properties"] = []) => ({
  name,
  type: "figur",
  x: x * K,
  y: y * K,
  properties,
});
const karteMit = (...objekte: Figurobjekt[]) => ({
  layers: [{ name: "boden" }, { name: "ausloeser", objects: objekte }],
});
const vorher = (figuren: [string, number, number][], extra: Partial<Aufstellung> = {}) => ({
  karte: CLUBRAUM,
  figuren: new Map(figuren.map(([n, x, y]) => [n, { x, y }])),
  sicht: SICHT,
  ...extra,
});
const feldVon = (karte: object, name: string) => {
  const o = figurobjekte(karte).find((f) => f.name === name);
  return o ? [(o.x ?? 0) / K, (o.y ?? 0) / K] : null;
};

describe("imBild", () => {
  it("zählt den Ausschnitt mit einem Feld Rand", () => {
    expect(imBild({ x: 15, y: 4 }, SICHT)).toBe(true);
    expect(imBild({ x: 7, y: 4 }, SICHT)).toBe(true);
    expect(imBild({ x: 6, y: 4 }, SICHT)).toBe(false);
    expect(imBild({ x: 20, y: 10 }, SICHT)).toBe(true);
    expect(imBild({ x: 21, y: 4 }, SICHT)).toBe(false);
  });
});

describe("mitSichtsperre", () => {
  it("im Bild fehlend: steht wieder auf ihrem Feld und geht hinaus, statt zu verschwinden", () => {
    // Der Tagesablauf stellt den Coach abends in den Park: Auf der neuen Karte fehlt sie.
    const neu = karteMit(figur("sam", 5, 8));
    const r = mitSichtsperre(neu, vorher([["coachDelgado", 15, 4]]), CLUBRAUM);
    expect(r.gehend).toEqual(["coachDelgado"]);
    expect(feldVon(r.karte, "coachDelgado")).toEqual([15, 4]);
  });

  it("außerhalb des Bildes fehlend: darf springen (bleibt fort)", () => {
    const neu = karteMit(figur("coachDelgado", 15, 4));
    const r = mitSichtsperre(neu, vorher([["sam", 2, 12]]), CLUBRAUM);
    expect(r.gehend).toEqual([]);
    expect(feldVon(r.karte, "sam")).toBeNull();
  });

  it("im Bild versetzt: bleibt auf dem alten Feld, mit dem gemerkten Objekt (sitzt weiter)", () => {
    const sitzend = figur("carlaClub", 17, 8, [{ name: "sitzt", value: "unten" }]);
    const neu = karteMit(figur("carlaClub", 3, 12));
    const alt = vorher([["carlaClub", 17, 8]], { objekte: new Map([["carlaClub", sitzend]]) });
    const r = mitSichtsperre(neu, alt, CLUBRAUM);
    expect(r.gehend).toEqual([]);
    expect(feldVon(r.karte, "carlaClub")).toEqual([17, 8]);
    expect(figurobjekte(r.karte)[0]?.properties).toEqual([{ name: "sitzt", value: "unten" }]);
  });

  it("nach einem #gehe auf ein anderes Feld: steht dort ohne Zustand", () => {
    const neu = karteMit(figur("junoClub", 22, 8, [{ name: "sitzt", value: "unten" }]));
    const alt = vorher([["junoClub", 16, 5]], {
      objekte: new Map([["junoClub", figur("junoClub", 22, 8)]]),
    });
    const r = mitSichtsperre(neu, alt, CLUBRAUM);
    expect(feldVon(r.karte, "junoClub")).toEqual([16, 5]);
    expect(figurobjekte(r.karte)[0]?.properties).toEqual([]);
  });

  it("außerhalb des Bildes versetzt: springt an den neuen Platz", () => {
    const neu = karteMit(figur("sam", 5, 8));
    const r = mitSichtsperre(neu, vorher([["sam", 2, 12]]), CLUBRAUM);
    expect(feldVon(r.karte, "sam")).toEqual([5, 8]);
  });

  it("andere Karte, nichts gemerkt, ohne Ausschnitt, Begleiter: keine Sperre", () => {
    const neu = karteMit(figur("sam", 5, 8));
    const alt = vorher([["coachDelgado", 15, 4]]);
    expect(mitSichtsperre(neu, alt, "mapleFalls.aussen").karte).toBe(neu);
    expect(mitSichtsperre(neu, null, CLUBRAUM).karte).toBe(neu);
    expect(mitSichtsperre(neu, { ...alt, sicht: undefined }, CLUBRAUM).gehend).toEqual([]);
    expect(mitSichtsperre(neu, alt, CLUBRAUM, new Set(["coachDelgado"])).gehend).toEqual([]);
  });
});
