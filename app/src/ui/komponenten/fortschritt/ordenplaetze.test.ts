/** Tests der Ordenplätze in der Startanimation: fest, außerhalb der Mitte, ohne Überdeckung. */
import { describe, expect, it } from "vitest";
import { ABSTAND, FREI_X, FREI_Y, ordenplaetze } from "./ordenplaetze";

const MITTE = 50;
const ORDEN = 18;

describe("Ordenplätze", () => {
  it("sind bei jedem Aufruf gleich", () => {
    expect(ordenplaetze(ORDEN)).toEqual(ordenplaetze(ORDEN));
  });

  it("liegen in der Fläche, außerhalb der Mitte und mit Abstand", () => {
    const plaetze = ordenplaetze(ORDEN);
    expect(plaetze).toHaveLength(ORDEN);
    for (const p of plaetze) {
      expect(p.x).toBeGreaterThan(0);
      expect(p.x).toBeLessThan(100);
      expect(((p.x - MITTE) / FREI_X) ** 2 + ((p.y - MITTE) / FREI_Y) ** 2).toBeGreaterThanOrEqual(
        1,
      );
    }
    plaetze.forEach((p, i) =>
      plaetze.slice(i + 1).forEach((q) => {
        expect(Math.hypot(p.x - q.x, p.y - q.y)).toBeGreaterThanOrEqual(ABSTAND);
      }),
    );
  });

  it("schafft auch viele Orden (Abstand wird kleiner statt endlos zu suchen)", () => {
    expect(ordenplaetze(60)).toHaveLength(60);
  });
});
