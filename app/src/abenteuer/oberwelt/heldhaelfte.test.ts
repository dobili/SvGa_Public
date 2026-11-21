/** Tests der Bildhälfte des Helden (heldhaelfte.ts). */
import { describe, expect, it } from "vitest";
import { heldhaelfte } from "./heldhaelfte";

describe("heldhaelfte", () => {
  it("oben und unten deutlich", () => {
    expect(heldhaelfte(0.2, null)).toBe("oben");
    expect(heldhaelfte(0.36, "unten")).toBe("oben");
    expect(heldhaelfte(0.8, "oben")).toBe("unten");
  });

  it("in der Mitte bleibt die alte Hälfte, ohne alte gilt unten", () => {
    expect(heldhaelfte(0.5, "oben")).toBe("oben");
    expect(heldhaelfte(0.5, "unten")).toBe("unten");
    expect(heldhaelfte(0.5, null)).toBe("unten");
  });
});
