/** Tests der Elo-Leiter: Abstände aus Ergebnissen, gedachtes Remis, Verkettung, Verankerung. */
import { describe, expect, it } from "vitest";
import { erwartet, leiter, verankere, type Begegnung } from "./eloleiter";

/** Elo-Abstand zu einem Punkteanteil. */
function abstand(anteil: number): number {
  return 400 * Math.log10(anteil / (1 - anteil));
}

describe("Elo-Leiter", () => {
  it("Erwartung: gleich stark 0,5, 400 Punkte mehr etwa 0,91", () => {
    expect(erwartet(1500, 1500)).toBeCloseTo(0.5, 6);
    expect(erwartet(1900, 1500)).toBeCloseTo(0.909, 3);
  });

  it("5 : 5 ergibt gleiche Zahlen, 7,5 : 2,5 mit gedachtem Remis 8 : 3", () => {
    const gleich = leiter([{ a: "x", b: "y", punkteA: 5, partien: 10 }]);
    expect((gleich.get("x") ?? 0) - (gleich.get("y") ?? 0)).toBeCloseTo(0, 3);
    const klar = leiter([{ a: "x", b: "y", punkteA: 7.5, partien: 10 }]);
    expect((klar.get("x") ?? 0) - (klar.get("y") ?? 0)).toBeCloseTo(abstand(8 / 11), 0);
  });

  it("10 : 0 bleibt endlich (etwa 520) und eine Kette addiert sich", () => {
    const voll = leiter([{ a: "2", b: "1", punkteA: 10, partien: 10 }]);
    const d = (voll.get("2") ?? 0) - (voll.get("1") ?? 0);
    expect(d).toBeGreaterThan(450);
    expect(d).toBeLessThan(600);
    const kette: Begegnung[] = [
      { a: "b", b: "a", punkteA: 7, partien: 10 },
      { a: "c", b: "b", punkteA: 7, partien: 10 },
    ];
    const w = leiter(kette);
    const ab = (w.get("b") ?? 0) - (w.get("a") ?? 0);
    const bc = (w.get("c") ?? 0) - (w.get("b") ?? 0);
    expect(ab).toBeCloseTo(bc, 0);
    expect((w.get("c") ?? 0) - (w.get("a") ?? 0)).toBeCloseTo(2 * ab, 0);
  });

  it("ein Bot zwischen zwei Stufen liegt zwischen ihnen", () => {
    const w = leiter([
      { a: "2", b: "1", punkteA: 10, partien: 10 },
      { a: "1@leon", b: "1", punkteA: 4, partien: 6 },
      { a: "1@leon", b: "2", punkteA: 1, partien: 6 },
    ]);
    expect(w.get("1@leon") ?? 0).toBeGreaterThan(w.get("1") ?? 0);
    expect(w.get("1@leon") ?? 0).toBeLessThan(w.get("2") ?? 0);
  });

  it("Verankerung: gemeinsame Verschiebung, Abweichung je Anker", () => {
    const w = new Map([
      ["3", -100],
      ["4", 100],
    ]);
    const v = verankere(w, [
      { spieler: "3", wert: 1000 },
      { spieler: "4", wert: 1300 },
    ]);
    expect(v.verschiebung).toBe(1150);
    expect(v.werte.get("3")).toBe(1050);
    expect(v.abweichungen).toEqual([
      { spieler: "3", abweichung: 50 },
      { spieler: "4", abweichung: -50 },
    ]);
    expect(() => verankere(w, [{ spieler: "9", wert: 1 }])).toThrow();
  });
});
