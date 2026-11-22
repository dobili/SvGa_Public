/** Tests des feinen Figurversatzes (figurversatz.ts): Lesen, Addieren, Grenzen. */
import { describe, expect, it } from "vitest";
import { begrenzt, liesFigurversatz, VERSATZ_GRENZE } from "./figurversatz";

describe("liesFigurversatz", () => {
  it("liest die Eigenschaft der Karte und die Angabe der Szene", () => {
    expect(liesFigurversatz("3,-2")).toEqual({ dx: 3, dy: -2 });
    expect(liesFigurversatz([0, 5])).toEqual({ dx: 0, dy: 5 });
  });

  it("begrenzt auf eine halbe Kachel", () => {
    expect(liesFigurversatz("12,-20")).toEqual({ dx: VERSATZ_GRENZE, dy: -VERSATZ_GRENZE });
    expect(begrenzt(-3.6)).toBe(-4);
  });

  it("nichts bei fehlender, ungültiger oder leerer Angabe", () => {
    expect(liesFigurversatz(undefined)).toBeNull();
    expect(liesFigurversatz("a,b")).toBeNull();
    expect(liesFigurversatz("0,0")).toBeNull();
    expect(liesFigurversatz([1])).toBeNull();
  });
});
