/**
 * Tests für regeln/begleiter.ts: Ambrose erscheint neben dem Helden, wenn er spricht (Wunsch des
 * Autors, 24.11.2026): Feld seitlich oder schräg hinter dem Helden, nie auf Wand oder Figur; wann
 * er erscheint; welche Zeilen geflüstert sind; Gedanken des Helden.
 */
import { describe, expect, it } from "vitest";
import {
  begleiterblick,
  begleiterErscheint,
  begleiterfeld,
  begleiterfelder,
  gefluestert,
  istGedanke,
  istGegenueber,
  nebenDemHelden,
  type Begleiterlage,
} from "./begleiter";

const HELD = { x: 5, y: 5 };
const GEISTER: ReadonlySet<string> = new Set(["ambrose"]);
const ueberall = () => true;

describe("Feld neben dem Helden", () => {
  it("seitlich zuerst, dann schräg hinten, zuletzt dahinter; nie vor dem Helden", () => {
    expect(begleiterfelder(HELD, "oben")).toEqual([
      { x: 6, y: 5 },
      { x: 4, y: 5 },
      { x: 6, y: 6 },
      { x: 4, y: 6 },
      { x: 5, y: 6 },
    ]);
    const vorn = { oben: [5, 4], unten: [5, 6], links: [4, 5], rechts: [6, 5] } as const;
    for (const blick of ["oben", "unten", "links", "rechts"] as const) {
      const [vx, vy] = vorn[blick];
      const felder = begleiterfelder(HELD, blick);
      expect(felder.some((f) => f.x === vx && f.y === vy)).toBe(false);
      expect(felder.every((f) => nebenDemHelden(f, HELD))).toBe(true);
    }
  });

  it("waagrechter Blick: schräg hinten oben zuerst, unter dem Helden zuletzt", () => {
    expect(begleiterfelder(HELD, "rechts")).toEqual([
      { x: 4, y: 4 },
      { x: 5, y: 4 },
      { x: 4, y: 5 },
      { x: 4, y: 6 },
      { x: 5, y: 6 },
    ]);
    expect(begleiterfeld(HELD, "links", ueberall)).toEqual({ x: 6, y: 4 });
    expect(begleiterfeld(HELD, "unten", ueberall)).toEqual({ x: 4, y: 5 });
  });

  it("weicht Wänden und Figuren aus", () => {
    const wandRechts = (x: number) => x <= 5;
    expect(begleiterfeld(HELD, "oben", wandRechts)).toEqual({ x: 4, y: 5 });
    const nurDahinter = (x: number, y: number) => x === 5 && y === 6;
    expect(begleiterfeld(HELD, "oben", nurDahinter)).toEqual({ x: 5, y: 6 });
  });

  it("ohne freies Feld erscheint er nicht", () => {
    expect(begleiterfeld(HELD, "oben", () => false)).toBeNull();
  });

  it("Blick: wie der Held; schaut der Held nach oben, wendet er sich ihm zu", () => {
    expect(begleiterblick({ x: 4, y: 5 }, HELD, "unten")).toBe("unten");
    expect(begleiterblick({ x: 5, y: 6 }, HELD, "rechts")).toBe("rechts");
    expect(begleiterblick({ x: 6, y: 5 }, HELD, "oben")).toBe("links");
    expect(begleiterblick({ x: 4, y: 6 }, HELD, "oben")).toBe("rechts");
    expect(begleiterblick({ x: 5, y: 6 }, HELD, "oben")).toBe("oben");
  });

  it("neben dem Helden: Nachbarfeld, nicht dasselbe und nicht weiter weg", () => {
    expect(nebenDemHelden({ x: 6, y: 6 }, HELD)).toBe(true);
    expect(nebenDemHelden(HELD, HELD)).toBe(false);
    expect(nebenDemHelden({ x: 7, y: 5 }, HELD)).toBe(false);
  });
});

describe("Einblenden und Ausbleiben", () => {
  const lage: Begleiterlage = {
    sprecher: "ambrose",
    geister: GEISTER,
    erinnerung: false,
    nichtDa: false,
    aufKarte: false,
  };

  it("erscheint, wenn der Geist spricht und nicht auf der Karte steht", () => {
    expect(begleiterErscheint(lage)).toBe(true);
  });

  it("nicht bei anderen Sprechern oder ohne Sprecher", () => {
    expect(begleiterErscheint({ ...lage, sprecher: "juno" })).toBe(false);
    expect(begleiterErscheint({ ...lage, sprecher: undefined })).toBe(false);
  });

  it("nicht, wenn er schon auf der Karte steht, nicht da ist oder in einer Erinnerung", () => {
    expect(begleiterErscheint({ ...lage, aufKarte: true })).toBe(false);
    expect(begleiterErscheint({ ...lage, nichtDa: true })).toBe(false);
    expect(begleiterErscheint({ ...lage, erinnerung: true })).toBe(false);
  });
});

describe("nur der Held hört ihn", () => {
  it("Gegenüber ist jede Figur außer Geist, Erzähler und Held", () => {
    expect(istGegenueber("juno", GEISTER)).toBe(true);
    expect(istGegenueber("ambrose", GEISTER)).toBe(false);
    expect(istGegenueber("erzaehler", GEISTER)).toBe(false);
    expect(istGegenueber(undefined, GEISTER)).toBe(false);
  });

  it("geflüstert: Geist nach einer anderen Figur oder mit #fluestern, nicht in Erinnerungen", () => {
    const zeile = { sprecher: "ambrose" };
    expect(gefluestert(zeile, GEISTER, true, false)).toBe(true);
    expect(gefluestert(zeile, GEISTER, false, false)).toBe(false);
    expect(gefluestert({ ...zeile, fluestern: "ja" }, GEISTER, false, false)).toBe(true);
    expect(gefluestert(zeile, GEISTER, true, true)).toBe(false);
    expect(gefluestert({ sprecher: "juno" }, GEISTER, true, false)).toBe(false);
    expect(gefluestert(undefined, GEISTER, true, false)).toBe(false);
  });

  it("Gedanke: Zeile mit #gedanke", () => {
    expect(istGedanke({ gedanke: "ja" })).toBe(true);
    expect(istGedanke({ sprecher: "ambrose" })).toBe(false);
    expect(istGedanke(undefined)).toBe(false);
  });
});
