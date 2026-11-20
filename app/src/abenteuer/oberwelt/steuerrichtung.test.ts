/** Tests der Richtung des Steuerkreuzes beim Wischen (steuerrichtung.ts, 20.11.2026). */
import { describe, expect, it } from "vitest";
import { richtungZu, TOTER_KERN_PX } from "./steuerrichtung";

describe("richtungZu", () => {
  it("nimmt die nächste Taste, auch in der Lücke zwischen zwei Pfeilen", () => {
    expect(richtungZu(30, 0, null)).toBe("rechts");
    expect(richtungZu(0, -30, null)).toBe("oben");
    expect(richtungZu(-25, 20, null)).toBe("links");
  });

  it("hält im toten Kern die alte Richtung, ohne alte keine", () => {
    expect(richtungZu(TOTER_KERN_PX - 1, 0, "oben")).toBe("oben");
    expect(richtungZu(1, 1, null)).toBeNull();
  });

  it("flackert auf der Diagonale nicht (Hysterese), wechselt bei klarer Lage", () => {
    expect(richtungZu(20, 22, "rechts")).toBe("rechts");
    expect(richtungZu(22, 20, "unten")).toBe("unten");
    expect(richtungZu(10, 30, "rechts")).toBe("unten");
  });

  it("wechselt die Seite auf derselben Achse sofort", () => {
    expect(richtungZu(-30, 0, "rechts")).toBe("links");
    expect(richtungZu(0, 30, "oben")).toBe("unten");
  });
});
