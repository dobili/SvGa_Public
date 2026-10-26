/** Tests des einmaligen Maia-Hinweises beim ersten Bot (MaiaHinweis.tsx, 26.10.2026). */
import { describe, expect, it } from "vitest";
import { sollMaiaHinweisKommen } from "./maiahinweis";

describe("Maia-Hinweis beim ersten Bot", () => {
  it("kommt einmal, solange Maia nicht spielt", () => {
    expect(sollMaiaHinweisKommen(null, false)).toBe(true);
    expect(sollMaiaHinweisKommen("gezeigt", false)).toBe(false);
  });
  it("kommt nicht, wenn Maia schon an ist", () => {
    expect(sollMaiaHinweisKommen(null, true)).toBe(false);
  });
});
