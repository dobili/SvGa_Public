/** Tests der acht Laufrichtungen (achtrichtung.ts, 26.11.2026). */
import { describe, expect, it } from "vitest";
import { ausTasten, blickZu, geschwindigkeit } from "./achtrichtung";

const AUS = { oben: false, unten: false, links: false, rechts: false };

describe("achtrichtung", () => {
  it("schräg so schnell wie gerade", () => {
    const v = geschwindigkeit("rechtsOben", 56);
    expect(Math.hypot(v.x, v.y)).toBeCloseTo(56);
    expect(v.y).toBeLessThan(0);
    expect(geschwindigkeit("links", 56)).toEqual({ x: -56, y: 0 });
  });

  it("zwei Tasten ergeben eine Schräge, Gegensätze heben sich auf", () => {
    expect(ausTasten({ ...AUS, rechts: true, oben: true })).toBe("rechtsOben");
    expect(ausTasten({ ...AUS, links: true, rechts: true })).toBeNull();
    expect(ausTasten({ ...AUS, links: true, rechts: true, unten: true })).toBe("unten");
  });

  it("Blick bei einer Schräge: bisheriger, wenn er dazugehört, sonst waagrecht", () => {
    expect(blickZu("rechtsOben", "oben")).toBe("oben");
    expect(blickZu("rechtsOben", "unten")).toBe("rechts");
    expect(blickZu("unten", "links")).toBe("unten");
  });
});
