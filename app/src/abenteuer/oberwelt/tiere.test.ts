/** Tests für tiere.ts: Ersatztabelle, Scharen (Auftrag Runde 7, Dokument 16, Abschnitt 5.2). */
import { describe, expect, it } from "vitest";
import { scharGroesse, tierartVon, TIERBILDER } from "./tiere";

describe("tierartVon", () => {
  it("findet eigene Bilder und nahen Ersatz", () => {
    expect(tierartVon("hund")).toBe("hund");
    expect(tierartVon("werkskatzeAussen")).toBe("katze");
    expect(tierartVon("reh")).toBe("ziege");
    expect(tierartVon("moewen")).toBe("taube");
    expect(tierartVon("bisonherde")).toBe("kuh");
    expect(tierartVon("eichhoernchen")).toBe("hase");
    expect(tierartVon("drohne")).toBe("drohne");
  });

  it("zeichnet nichts ohne passenden Ersatz", () => {
    expect(tierartVon("wind")).toBeNull();
    expect(tierartVon("saugroboter")).toBeNull();
  });

  it("nimmt die Eigenschaft bild, wenn es den Bogen gibt", () => {
    expect(tierartVon("bishop", "hund")).toBe("hund");
    expect(tierartVon("reh", "einhorn")).toBe("ziege");
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
