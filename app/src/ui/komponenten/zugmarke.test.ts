/**
 * Tests für die Lage der Zugmarke am Brett (zugmarke.ts).
 */
import { describe, expect, it } from "vitest";
import { markenlage } from "./zugmarke";

describe("markenlage", () => {
  it("setzt die Marke an die rechte obere Ecke des Zielfeldes", () => {
    expect(markenlage("h8", false)).toEqual({ links: 100, oben: 0 });
    expect(markenlage("a1", false)).toEqual({ links: 12.5, oben: 87.5 });
    expect(markenlage("f3", false)).toEqual({ links: 75, oben: 62.5 });
  });

  it("spiegelt die Lage, wenn das Brett aus Sicht von Schwarz steht", () => {
    expect(markenlage("a1", true)).toEqual({ links: 100, oben: 0 });
    expect(markenlage("h8", true)).toEqual({ links: 12.5, oben: 87.5 });
  });

  it("gibt null für ein ungültiges Feld", () => {
    expect(markenlage("z9", false)).toBeNull();
  });
});
