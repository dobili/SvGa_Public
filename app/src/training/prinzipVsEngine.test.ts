/** Tests zum Vergleich von Bilanz und Engine (Nebenchat, Punkt B3). */
import { describe, expect, it } from "vitest";
import { engineVorn, faktorenVorn, vergleichssatz } from "./prinzipVsEngine";

describe("Prinzipien gegen Engine", () => {
  it("die Engine sieht unter einem halben Bauern Ausgleich", () => {
    expect(engineVorn(0.3)).toBe("gleich");
    expect(engineVorn(-0.8)).toBe("black");
    expect(engineVorn(1.2)).toBe("white");
  });

  it("die Faktorenbilanz entscheidet nach der Mehrheit der Faktoren", () => {
    expect(faktorenVorn(["white", "white", "black", "gleich"])).toBe("white");
    expect(faktorenVorn(["white", "black"])).toBe("gleich");
  });

  it("nennt Einigkeit und Widerspruch mit dem Wert", () => {
    expect(vergleichssatz("white", 1.0)).toContain("genauso");
    const satz = vergleichssatz("white", -0.8);
    expect(satz).toContain("anders");
    expect(satz).toContain("−0,8");
  });

  it("nennt einen Vorteil nur der Bilanz langfristig statt uneinig", () => {
    const satz = vergleichssatz("white", 0.2);
    expect(satz).toContain("langfristig");
    expect(satz).not.toContain("anders");
  });
});
