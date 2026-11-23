/** Tests für tiere.ts: Ersatztabelle, Scharen (Auftrag Runde 7, Dokument 16, Abschnitt 5.2). */
import { describe, expect, it } from "vitest";
import {
  mitSchwimmbildern,
  scharGroesse,
  schwimmUrsprungY,
  schwimmversatz,
  standbasis,
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
    expect(tierartVon("wapiti")).toBe("hirsch");
    expect(tierartVon("moewen")).toBe("moewe");
    expect(tierartVon("specht")).toBe("specht");
    expect(tierartVon("wuestenfuchs")).toBe("fuchs");
    expect(tierartVon("praeriehunde")).toBe("praeriehund");
    expect(tierartVon("schwan")).toBe("schwan");
    expect(tierartVon("bisonherde")).toBe("bison");
    expect(tierartVon("eichhoernchen")).toBe("eichhoernchen");
    expect(tierartVon("drohne")).toBe("drohne");
    expect(tierartVon("saugroboter")).toBe("lieferroboter");
    expect(tierartVon("kehrroboter")).toBe("kehrroboter");
  });

  it("zeichnet nichts ohne passenden Ersatz", () => {
    expect(tierartVon("wind")).toBeNull();
    expect(tierartVon("einhorn")).toBeNull();
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

describe("PixelLab-Tierbögen (23.11.2026)", () => {
  const kuh = TIERBILDER["kuh"];
  const ente = TIERBILDER["ente"];
  it("zeigt das Zustandsbild zum Verhalten, sonst Reihe 0", () => {
    expect(kuh).toBeDefined();
    if (!kuh) return;
    expect(kuh.zustaende).toEqual(["sitzen", "grasen"]);
    expect(standbasis(kuh, "grasen")).toBe(48 + 4);
    expect(standbasis(kuh, "ausweichen")).toBe(0);
  });
  it("Schwimmer mit eigenen Schwimmbildern: Reihe 3, Ursprung in der Wassermitte", () => {
    expect(ente).toBeDefined();
    if (!ente) return;
    expect(mitSchwimmbildern(ente, "schwimmen")).toBe(true);
    expect(mitSchwimmbildern(ente, "fliegen")).toBe(false);
    expect(standbasis(ente, "schwimmen")).toBe(72);
    expect(schwimmUrsprungY(ente)).toBe((ente.schwimmMitte ?? 0) / ente.hoehe);
  });
  it("ohne Schwimmbilder bleibt die Wasserlinie, gemessen ab dem Fuß", () => {
    expect(tierAnsicht(40, 16, true, 30).sichtbar).toBe(Math.round(30 * WASSERLINIE));
    expect(tierAnsicht(40, 16, false, 30)).toEqual({ sichtbar: 30, ursprungY: 22 / 40 });
  });
  it("jede Art mit PixelLab-Bild hat ihren eigenen Wortstamm", () => {
    for (const art of ["eidechse", "delfin", "falke", "praeriehund", "schwan"]) {
      expect(tierartVon(art)).toBe(art);
    }
    expect(tierartVon("waschbaer")).toBeNull();
  });
});
