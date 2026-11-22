/** Tests für zuwendung.ts: Wohin sich eine Figur zum Helden dreht, und wann nicht (22.11.2026). */
import { describe, expect, it } from "vitest";
import { zuwendung, type Figurlage } from "./zuwendung";

/** Mama auf (232, 120), stehend, mit eigenem Bogen. */
const MAMA: Figurlage = {
  x: 232,
  y: 120,
  sitzt: false,
  liegt: false,
  gefuehrt: false,
  bild: "eigen",
};

describe("zuwendung", () => {
  it("dreht zur Seite des Helden; die größere Achse entscheidet", () => {
    expect(zuwendung(MAMA, { x: 216, y: 122 })).toBe("links");
    expect(zuwendung(MAMA, { x: 248, y: 118 })).toBe("rechts");
    expect(zuwendung(MAMA, { x: 234, y: 152 })).toBe("unten");
    expect(zuwendung(MAMA, { x: 230, y: 88 })).toBe("oben");
    expect(zuwendung(MAMA, { x: 248, y: 136 })).toBe("rechts");
  });

  it("auch der Platzhalter dreht sich; am selben Punkt bleibt alles", () => {
    expect(zuwendung({ ...MAMA, bild: "platzhalter" }, { x: 216, y: 120 })).toBe("links");
    expect(zuwendung(MAMA, { x: 232, y: 120 })).toBeNull();
  });

  it("Sitzende, Liegende, Geführte und fremde Bilder drehen sich nicht", () => {
    const held = { x: 216, y: 120 };
    expect(zuwendung({ ...MAMA, sitzt: true }, held)).toBeNull();
    expect(zuwendung({ ...MAMA, liegt: true }, held)).toBeNull();
    expect(zuwendung({ ...MAMA, gefuehrt: true }, held)).toBeNull();
    expect(zuwendung({ ...MAMA, bild: "anderes" }, held)).toBeNull();
  });
});
