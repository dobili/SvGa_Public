/** Tests des Figurenmaßstabs (weltmassstab.ts, figurzeichenmassstab): innen 4/3 nur für PixelLab. */
import { describe, expect, it } from "vitest";
import { figurzeichenmassstab, GROSS_MASSSTAB, INNEN_FIGURFAKTOR } from "./weltmassstab";

describe("figurzeichenmassstab", () => {
  it("zeichnet PixelLab-Figuren außen mit 2/3", () => {
    expect(figurzeichenmassstab(32, 1)).toBeCloseTo(GROSS_MASSSTAB);
  });

  it("zeichnet PixelLab-Figuren innen 4/3-mal so groß: 8/9, ein Figurenpixel 2⅔ Bildschirmpixel", () => {
    expect(INNEN_FIGURFAKTOR).toBeCloseTo(4 / 3);
    expect(figurzeichenmassstab(32, INNEN_FIGURFAKTOR)).toBeCloseTo(8 / 9);
  });

  it("lässt alte LimeZu-Figuren (16 breit) auch innen bei 1", () => {
    expect(figurzeichenmassstab(16, INNEN_FIGURFAKTOR)).toBe(1);
  });
});
