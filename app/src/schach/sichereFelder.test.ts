/**
 * Tests der sicheren Felder (Pflichtenheft 6.6) an Kapitel 1 und 7.
 */
import { describe, expect, it } from "vitest";
import { feld, stellungAus, stellungVon } from "./buchabbildungen.testhilfe";
import { sichereFelder, zugziele } from "./sichereFelder";
import { feldname } from "./stellung";

function felderVon(nummer: string, farbe: "white" | "black", figur: string) {
  const eintrag = sichereFelder(stellungVon(nummer), farbe).find((f) => f.feld === feld(figur));
  if (!eintrag) throw new Error(`Figur ${figur} fehlt`);
  return {
    sichere: eintrag.sichere.map(feldname).sort(),
    unsichere: eintrag.unsichere.map(feldname).sort(),
  };
}

describe("sichereFelder", () => {
  it("Abb. 1.32: der Läufer g4 hat h5 und e6 sicher, h3 nicht", () => {
    const { sichere, unsichere } = felderVon("1.32", "black", "g4");
    expect(sichere).toContain("h5");
    expect(sichere).toContain("e6");
    expect(sichere).toContain("f3");
    expect(unsichere).toContain("h3");
  });

  it("Abb. 7.24: der Läufer a2 ist eingesperrt, er hat kein sicheres Feld", () => {
    const { sichere } = felderVon("7.24", "black", "a2");
    expect(sichere).toEqual([]);
  });

  it("rechnet auch für die Seite, die nicht am Zug ist (Abb. 7.24: Weiß)", () => {
    const ziele = zugziele(stellungVon("7.24"), "white");
    expect(ziele.get(feld("c1"))?.has(feld("b2"))).toBe(true);
  });

  it("Lehrbild ohne König: einfache Zugmöglichkeiten", () => {
    const stellung = stellungAus("8/8/8/8/3P4/8/8/8 w - - 0 1");
    expect(stellung.regeln).toBeNull();
    const ziele = zugziele(stellung, "white");
    expect([...(ziele.get(feld("d4")) ?? [])].map(feldname)).toEqual(["d5"]);
  });

  it("ein Bauer vom Startfeld darf zwei Schritte ziehen, aber nicht durch Figuren", () => {
    const stellung = stellungAus("8/8/8/8/8/3n4/3P4/8 w - - 0 1");
    expect([...(zugziele(stellung, "white").get(feld("d2")) ?? [])]).toEqual([]);
  });
});
