/** Tests für tiere.ts: Ersatztabelle, Scharen (Auftrag Runde 7, Dokument 16, Abschnitt 5.2). */
import { describe, expect, it } from "vitest";
import {
  scharGroesse,
  schwimmversatz,
  tierAnsicht,
  tierartVon,
  TIERBILDER,
  WASSERLINIE,
} from "./tiere";

describe("tierartVon", () => {
  it("findet eigene Bilder und nahen Ersatz", () => {
    expect(tierartVon("hund")).toBe("hund");
    expect(tierartVon("werkskatzeAussen")).toBe("katze");
    expect(tierartVon("reh")).toBe("reh");
    expect(tierartVon("hirsch")).toBe("hirsch");
    expect(tierartVon("ziegen")).toBe("ziege");
    expect(tierartVon("moewen")).toBe("moewe");
    expect(tierartVon("specht")).toBe("kraehe");
    expect(tierartVon("wuestenfuchs")).toBe("hund");
    expect(tierartVon("praeriehunde")).toBe("hase");
    expect(tierartVon("schwan")).toBe("gans");
    expect(tierartVon("bisonherde")).toBe("bison");
    expect(tierartVon("eichhoernchen")).toBe("hase");
    expect(tierartVon("drohne")).toBe("drohne");
  });

  it("zeichnet nichts ohne passenden Ersatz", () => {
    expect(tierartVon("wind")).toBeNull();
    expect(tierartVon("saugroboter")).toBeNull();
  });

  it("nimmt die Eigenschaft bild, wenn es den Bogen gibt", () => {
    expect(tierartVon("bishop", "hund")).toBe("hund");
    expect(tierartVon("reh", "einhorn")).toBe("reh");
  });

  it("kennt für jede Ersatzart die Rahmengröße", () => {
    for (const name of ["reh", "moewen", "pferd", "kojote", "pelikan", "roadrunner"]) {
      expect(TIERBILDER[tierartVon(name) ?? ""]).toBeDefined();
    }
  });
});

describe("scharGroesse", () => {
  it("zeichnet eine Schar als drei bis fünf Tiere, fest nach dem Namen", () => {
    for (const name of ["tauben", "moewen", "ziegen", "bisonherde", "kuehe"]) {
      const n = scharGroesse(name);
      expect(n).toBeGreaterThanOrEqual(3);
      expect(n).toBeLessThanOrEqual(5);
      expect(scharGroesse(name)).toBe(n);
    }
    expect(scharGroesse("hund")).toBe(1);
    expect(scharGroesse("ziege")).toBe(1);
  });
});

describe("tierAnsicht", () => {
  it("zeigt Landtiere ganz, den Fuß eine halbe Kachel unter dem Ursprung", () => {
    expect(tierAnsicht(32, 16, false)).toEqual({ sichtbar: 32, ursprungY: 24 / 32 });
  });

  it("schneidet Schwimmer an der Wasserlinie ab und lässt sie um den Rest sinken", () => {
    const { sichtbar, ursprungY } = tierAnsicht(32, 16, true);
    expect(sichtbar).toBe(Math.round(32 * WASSERLINIE));
    // Der sichtbare Unterrand liegt um den abgeschnittenen Teil tiefer als beim Landtier.
    const unterrandLand = 32 - 32 * (24 / 32);
    const unterrandSchwimmer = sichtbar - 32 * ursprungY;
    expect(unterrandSchwimmer).toBe(unterrandLand);
    expect(32 * ursprungY).toBeLessThan(24);
  });
});

describe("schwimmversatz", () => {
  it("reiht Schwimmer entlang des Wegs auf, nicht seitlich ans Ufer", () => {
    expect(schwimmversatz({ x: 22, y: 30 }, { x: 22, y: 44 }, 2, 2)).toEqual({ x: 0, y: 4 });
    expect(schwimmversatz({ x: 5, y: 41 }, { x: 15, y: 41 }, 1, 2)).toEqual({ x: 2, y: 0 });
  });
});
