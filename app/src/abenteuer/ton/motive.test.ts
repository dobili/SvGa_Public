/** Tests für motive.ts: erzeugte Motive statt Dateien (Klangplan, Gesamtübersicht). */
import { describe, expect, it } from "vitest";
import { motivFuer } from "./motive";

describe("erzeugte Motive", () => {
  it("kennt die kurzen Motive des Klangplans", () => {
    for (const k of ["aha", "konzern", "hale", "aufgabe", "fehler", "atme", "kerzenton"]) {
      expect(motivFuer(k), k).not.toBeNull();
    }
    expect(motivFuer("wasserfall")).toBeNull();
  });

  it("gibt im Blindschach jedem Feld einen eigenen Ton, höher mit der Reihe", () => {
    const e2 = motivFuer("blindschach.e2")?.toene[0]?.hz ?? 0;
    const e4 = motivFuer("blindschach.e4")?.toene[0]?.hz ?? 0;
    const d4 = motivFuer("blindschach.d4")?.toene[0]?.hz ?? 0;
    expect(e4).toBeGreaterThan(e2);
    expect(e4).toBeGreaterThan(d4);
    expect(motivFuer("blindschach.z9")).toBeNull();
  });

  it("legt den Blindschachton in die Tonart G (Linie a = Grundton)", () => {
    const a1 = motivFuer("blindschach.a1")?.toene[0]?.hz ?? 0;
    expect(a1).toBeCloseTo(392, 0);
  });
});
