/** Tests des Praxisbuchs (engine/praxisbuch.ts): Zellenwahl, Verteilung, Buchende, Linien. */
import { describe, expect, it } from "vitest";
import {
  buchtiefeVon,
  linienzug,
  praxisbuchAus,
  praxisverteilung,
  praxiszug,
  zellenFuer,
  type Praxisbuch,
} from "./praxisbuch";

/** Zwei Zeitklassen, drei Bänder: Zelle = Klasse · 3 + Band. */
const BUCH: Praxisbuch = {
  zeitklassen: ["blitz", "rapid"],
  baender: [400, 600, 800],
  knoten: {
    "": { "4": [100, "e4", 60, "d4", 30], "1": [10, "e4", 10] },
    e4: { "4": [50, "c5", 50] },
  },
  eroeffnungen: [["Sicilian Defense", "e4 c5", 99]],
};
const folge = (...werte: number[]) => {
  let i = 0;
  return () => werte[i++ % werte.length] ?? 0;
};

describe("Praxisbuch (0.2.127)", () => {
  it("Zellen: eigene, dann Schnellschach, dann Nachbarbänder", () => {
    expect(zellenFuer(BUCH, "blitz", 650)).toEqual([1, 4, 0, 2]);
    expect(zellenFuer(BUCH, "rapid", 300)).toEqual([3, 4]);
  });
  it("Verteilung mit Rest: 90 von 100 aufgenommen, 10 % seltene Züge", () => {
    const v = praxisverteilung(BUCH, [], [4]);
    expect(v?.zuege.map((z) => z.san)).toEqual(["e4", "d4"]);
    expect(v?.rest).toBeCloseTo(0.1);
    expect(praxisverteilung(BUCH, ["a3"], [4])).toBeNull();
  });
  it("Zug nach Häufigkeit; Rest und Buchtiefe beenden das Buch", () => {
    const lage = { tempo: "rapid" as const, wertung: 650, tiefe: 16 };
    expect(praxiszug(BUCH, [], lage, folge(0.5, 0.1))).toBe("e4");
    expect(praxiszug(BUCH, [], lage, folge(0.5, 0.9))).toBe("d4");
    expect(praxiszug(BUCH, [], lage, folge(0.05))).toBeNull();
    expect(praxiszug(BUCH, ["e4"], { ...lage, tiefe: 1 }, folge(0.5))).toBeNull();
    expect(praxiszug(BUCH, ["e4"], lage, folge(0.5, 0.5))).toBe("c5");
  });
  it("Linie hat Vorrang, solange die Partie ihr folgt", () => {
    expect(linienzug(["e4", "c5", "Nf3"], ["e4", "c5"])).toBe("Nf3");
    expect(linienzug(["e4", "c5", "Nf3"], ["e4", "e5"])).toBeNull();
    expect(linienzug(["e4"], ["e4"])).toBeNull();
  });
  it("Buchtiefe nach Persönlichkeit; Rohdaten werden geprüft", () => {
    expect(buchtiefeVon("theoretiker")).toBeGreaterThan(buchtiefeVon("solide"));
    expect(buchtiefeVon("hektiker")).toBeLessThan(buchtiefeVon(undefined));
    expect(praxisbuchAus(BUCH)).toBe(BUCH);
    expect(praxisbuchAus({ knoten: {} })).toBeNull();
  });
});
