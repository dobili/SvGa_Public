/** Tests für moebelform.ts: gleiche Regeln wie pipeline/abenteuer/objektform.py (Karteneditor). */
import { describe, expect, it } from "vitest";
import { sperrkacheln, type Tiledkarte } from "./begehbar";
import { deckkraftAus, dreheMaske, formAus, geformt, hatForm, wirksameGroesse } from "./moebelform";

describe("formAus", () => {
  it("liest Drehung, Spiegelung und Maßstab, sonst neutral", () => {
    const form = formAus([
      { name: "drehung", value: 270 },
      { name: "spiegeln", value: true },
      { name: "massstab", value: 1.5 },
    ]);
    expect(form).toEqual({ drehung: 270, spiegeln: true, massstab: 1.5 });
    expect(hatForm(formAus(undefined))).toBe(false);
  });
});

describe("geformt", () => {
  it("tauscht Breite und Höhe bei 90 Grad", () => {
    expect(wirksameGroesse(64, 32, { drehung: 90, spiegeln: false, massstab: 1 })).toEqual([
      32, 64,
    ]);
    expect(wirksameGroesse(64, 32, { drehung: 0, spiegeln: false, massstab: 2 })).toEqual([
      128, 64,
    ]);
  });

  it("dreht und spiegelt die Maske wie der Kartenbau", () => {
    expect(dreheMaske(["#.", ".."], 2, 2, 90, false)).toEqual([".#", ".."]);
    expect(dreheMaske(["#.", ".."], 2, 2, 180, false)).toEqual(["..", ".#"]);
    expect(dreheMaske(["#.", ".."], 2, 2, 0, true)).toEqual([".#", ".."]);
    const tor = { breite: 32, hoehe: 48, maske: ["..", "#.", "#."] };
    expect(geformt(tor, { drehung: 90, spiegeln: false, massstab: 1 }).maske).toEqual([
      "##.",
      "...",
    ]);
  });

  it("lässt ungeformte Angaben unverändert", () => {
    const sofa = { breite: 64, hoehe: 32, frei_unten: 1 };
    expect(geformt(sofa, formAus([]))).toBe(sofa);
  });
});

describe("Kollision gedrehter Möbel", () => {
  it("sperrt die gedrehte Fläche ohne die oberste Reihe", () => {
    const karte: Tiledkarte = {
      width: 10,
      height: 10,
      layers: [
        {
          objects: [
            {
              name: "sofa",
              type: "moebel",
              x: 32,
              y: 32,
              properties: [{ name: "drehung", value: 90 }],
            },
          ],
        },
      ],
    };
    const gesperrt = sperrkacheln(karte, { sofa: { breite: 64, hoehe: 32, kollision: true } }, 16);
    expect([...gesperrt].sort()).toEqual(["2,3", "2,4", "2,5", "3,3", "3,4", "3,5"]);
  });
});

describe("Zuschnitt (Karteneditor 1.5, gleiche Regel wie objektzuschnitt.py)", () => {
  const ZAUN: { breite: number; hoehe: number; kollision: boolean; maske?: readonly string[] } = {
    breite: 64,
    hoehe: 32,
    kollision: true,
  };
  const TOR = { breite: 64, hoehe: 48, maske: ["....", "#..#", "#..#"] };
  const mitZuschnitt = (zuschnitt: string, weitere: { name: string; value: unknown }[] = []) =>
    formAus([{ name: "zuschnitt", value: zuschnitt }, ...weitere]);

  it("liest den Zuschnitt als Text, lauter Nullen gelten als keiner", () => {
    expect(mitZuschnitt("26,0,32,0").zuschnitt).toEqual([26, 0, 32, 0]);
    expect(hatForm(mitZuschnitt("0,0,0,0"))).toBe(false);
    expect(hatForm(mitZuschnitt("1,2"))).toBe(false);
  });

  it("macht aus dem Zaun einen Pfosten 6 × 32 mit beschnittener Maske", () => {
    const pfosten = geformt(ZAUN, mitZuschnitt("26,0,32,0"));
    expect([pfosten.breite, pfosten.hoehe]).toEqual([6, 32]);
    expect(pfosten).toMatchObject({ maske: [".", "#"] });
  });

  it("lässt ganz weggeschnittene Kacheln fallen, angeschnittene bleiben", () => {
    expect(geformt(TOR, mitZuschnitt("16,0,0,0")).maske).toEqual(["...", "..#", "..#"]);
    expect(geformt(TOR, mitZuschnitt("10,0,0,0")).maske).toEqual(["....", "#.##", "#.##"]);
    expect(geformt(TOR, mitZuschnitt("0,16,0,0")).maske).toEqual(["#..#", "#..#"]);
  });

  it("schneidet vor Drehung, Spiegeln und Maßstab", () => {
    const gedreht = geformt(TOR, mitZuschnitt("16,0,0,0", [{ name: "drehung", value: 90 }]));
    expect([gedreht.breite, gedreht.hoehe, gedreht.maske]).toEqual([48, 48, ["...", "...", "##."]]);
    const gespiegelt = geformt(TOR, mitZuschnitt("16,0,0,0", [{ name: "spiegeln", value: true }]));
    expect(gespiegelt.maske).toEqual(["...", "#..", "#.."]);
    const skaliert = geformt(ZAUN, mitZuschnitt("26,0,32,0", [{ name: "massstab", value: 2 }]));
    expect([skaliert.breite, skaliert.hoehe, skaliert.maske]).toEqual([
      12,
      64,
      [".", "#", "#", "#"],
    ]);
  });

  it("sperrt beim Pfosten nur die Kachel unter dem Pfosten", () => {
    const karte: Tiledkarte = {
      width: 6,
      height: 6,
      layers: [
        {
          objects: [
            {
              name: "zaun",
              type: "moebel",
              x: 32,
              y: 32,
              properties: [{ name: "zuschnitt", value: "26,0,32,0" }],
            },
          ],
        },
      ],
    };
    expect([...sperrkacheln(karte, { zaun: ZAUN }, 16)]).toEqual(["2,3"]);
  });
});

describe("Deckkraft (Karteneditor 1.5)", () => {
  it("liest die Stufen 25 bis 100, sonst voll deckend", () => {
    expect(deckkraftAus([{ name: "deckkraft", value: 50 }])).toBe(0.5);
    expect(deckkraftAus([{ name: "deckkraft", value: 25 }])).toBe(0.25);
    expect(deckkraftAus([{ name: "deckkraft", value: 40 }])).toBe(1);
    expect(deckkraftAus(undefined)).toBe(1);
  });
});
