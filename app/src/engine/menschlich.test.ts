/**
 * Tests der Bausteine der menschlichen Zugwahl (R4, 0.2.52): gewichtete Wahl mit Temperatur,
 * Breite mit Tagesform (Strähne und Lage seit 0.2.116 entfallen).
 */
import { describe, expect, it } from "vitest";
import { gewichteteZugwahl, tagesform, verlaufsfaktor } from "./menschlich";

describe("Gewichtete Wahl mit Temperatur", () => {
  const kandidaten = [
    { uci: "a", verlust: 0 },
    { uci: "b", verlust: 0.5 },
    { uci: "c", verlust: 3 },
  ];
  it("Zufall 0 ergibt den besten Zug, hoher Zufall einen schlechteren", () => {
    expect(gewichteteZugwahl(kandidaten, 1, () => 0)?.uci).toBe("a");
    // Gewichte 1, 0,61, 0,05 (Summe 1,66): bis 0,60 „a“, bis 0,97 „b“, darüber „c“.
    expect(gewichteteZugwahl(kandidaten, 1, () => 0.8)?.uci).toBe("b");
    expect(gewichteteZugwahl(kandidaten, 1, () => 0.99)?.uci).toBe("c");
  });
  it("kalt (Temperatur nahe 0) fast immer der beste; ohne Kandidaten null", () => {
    expect(gewichteteZugwahl(kandidaten, 0.01, () => 0.99)?.uci).toBe("a");
    expect(gewichteteZugwahl([], 1, () => 0.5)).toBeNull();
  });
});

describe("Breite der Wahl und Tagesform", () => {
  it("der Verlauf wirkt mit der Tagesform", () => {
    expect(verlaufsfaktor({ tagesform: 1.2 })).toBeCloseTo(1.2, 5);
  });
  it("Tagesform: fest je Kennung, zwischen 0,75 und 1,25, verschieden je Partie", () => {
    const a = tagesform("partie-eins");
    expect(a).toBe(tagesform("partie-eins"));
    expect(a).toBeGreaterThanOrEqual(0.75);
    expect(a).toBeLessThanOrEqual(1.25);
    expect(tagesform("partie-zwei")).not.toBe(a);
  });
});
