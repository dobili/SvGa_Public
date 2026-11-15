/** Tests für moebelform.ts: gleiche Regeln wie pipeline/abenteuer/objektform.py (Karteneditor). */
import { describe, expect, it } from "vitest";
import { sperrkacheln, type Tiledkarte } from "./begehbar";
import { dreheMaske, formAus, geformt, hatForm, wirksameGroesse } from "./moebelform";

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
