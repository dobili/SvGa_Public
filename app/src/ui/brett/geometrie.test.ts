/** Tests für die Geometrie des Brettes. */
import { describe, expect, it } from "vitest";
import { alleFelder, feldAnPunkt, feldEcke, pfeilform } from "./geometrie";

describe("Brettgeometrie", () => {
  it("rechnet Felder in Ecken um, auch gedreht", () => {
    expect(feldEcke("a8", false)).toEqual({ x: 0, y: 0 });
    expect(feldEcke("d4", false)).toEqual({ x: 3000, y: 4000 });
    expect(feldEcke("a8", true)).toEqual({ x: 7000, y: 7000 });
    expect(feldEcke("z9", false)).toBeNull();
  });

  it("findet das Feld unter einem Punkt, auch gedreht und neben dem Brett", () => {
    expect(feldAnPunkt({ x: 3500, y: 4500 }, false)).toBe("d4");
    expect(feldAnPunkt({ x: 3500, y: 4500 }, true)).toBe("e5");
    expect(feldAnPunkt({ x: 0, y: 0 }, false)).toBe("a8");
    expect(feldAnPunkt({ x: 7999, y: 7999 }, true)).toBe("a8");
    expect(feldAnPunkt({ x: -1, y: 100 }, false)).toBeNull();
    expect(feldAnPunkt({ x: 100, y: 8000 }, false)).toBeNull();
  });

  it("liefert 64 Felder, beginnend mit a8", () => {
    const felder = alleFelder(false);
    expect(felder).toHaveLength(64);
    expect(felder[0]).toBe("a8");
    expect(felder[63]).toBe("h1");
  });

  it("der Pfeil endet mit der Spitze genau in der Feldmitte", () => {
    const form = pfeilform("b6", "d4", false);
    expect(form?.spitze[0].x).toBeCloseTo(3500);
    expect(form?.spitze[0].y).toBeCloseTo(4500);
  });
});
