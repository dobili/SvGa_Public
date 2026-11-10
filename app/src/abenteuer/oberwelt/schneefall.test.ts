/** Tests für schneefall.ts: Flocken entstehen im Bildausschnitt, fallen und beginnen oben neu. */
import { describe, expect, it } from "vitest";
import { bewegeFlocken, FLOCKEN, neueFlocken, pendelX } from "./schneefall";

/** Ein fester Zufall für gleiche Ergebnisse bei jedem Lauf. */
function gesaet(start: number): () => number {
  let x = start;
  return () => {
    x = (x * 9301 + 49297) % 233280;
    return x / 233280;
  };
}

describe("Schneefall", () => {
  it("legt die Flocken in den Bildausschnitt", () => {
    const flocken = neueFlocken(FLOCKEN, gesaet(1));
    expect(flocken).toHaveLength(FLOCKEN);
    for (const f of flocken) {
      expect(f.x).toBeGreaterThanOrEqual(0);
      expect(f.x).toBeLessThan(1);
      expect(f.fall).toBeGreaterThan(0);
      expect([1, 2]).toContain(f.groesse);
    }
  });

  it("Flocken fallen und beginnen unten hinaus oben neu, an derselben Stelle in x", () => {
    const [f] = neueFlocken(1, gesaet(2));
    if (!f) throw new Error("keine Flocke");
    f.y = 0.99;
    const x = f.x;
    bewegeFlocken([f], 0.2 / f.fall);
    expect(f.y).toBeCloseTo(0.19, 5);
    expect(f.x).toBe(x);
  });

  it("Pendeln bleibt im Bildausschnitt", () => {
    const flocke = { x: 0.001, y: 0, fall: 0.05, phase: -Math.PI / 2, weite: 0.01, groesse: 1 };
    const x = pendelX(flocke, 0);
    expect(x).toBeGreaterThanOrEqual(0);
    expect(x).toBeLessThan(1);
    expect(x).toBeCloseTo(0.991, 5);
  });
});
