/** Tests der Zählrechnung der Münzanzeige (oberwelt/muenzzaehler.ts). */
import { describe, expect, it } from "vitest";
import { zwischenwert } from "./muenzzaehler";

describe("zwischenwert", () => {
  it("beginnt bei der alten und endet bei der neuen Zahl", () => {
    expect(zwischenwert(50, 70, 0)).toBe(50);
    expect(zwischenwert(50, 70, 1)).toBe(70);
  });

  it("zählt beim Bekommen hoch und erreicht das Ziel erst am Ende", () => {
    const mitte = zwischenwert(50, 70, 0.5);
    expect(mitte).toBeGreaterThan(50);
    expect(mitte).toBeLessThan(70);
    expect(zwischenwert(50, 70, 0.99)).toBeLessThan(70);
  });

  it("zählt beim Ausgeben herunter", () => {
    const mitte = zwischenwert(50, 30, 0.5);
    expect(mitte).toBeLessThan(50);
    expect(mitte).toBeGreaterThan(30);
    expect(zwischenwert(50, 30, 1)).toBe(30);
  });

  it("begrenzt den Anteil", () => {
    expect(zwischenwert(10, 20, -1)).toBe(10);
    expect(zwischenwert(10, 20, 2)).toBe(20);
  });
});
