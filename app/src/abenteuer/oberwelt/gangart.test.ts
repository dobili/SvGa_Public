/** Tests der Gangart (gangart.ts): Abstand des Fingers → gehen oder rennen. */
import { describe, expect, it } from "vitest";
import { GEHEN_UNTER, Gangartsteuerung, RENNEN_AB, TASTENABSTAND_PX, gangartZu } from "./gangart";

const T = TASTENABSTAND_PX;

describe("gangartZu", () => {
  it("auf den Tasten gehen, weit draußen rennen", () => {
    expect(gangartZu(T, 0, "gehen")).toBe("gehen");
    expect(gangartZu(0, T * RENNEN_AB, "gehen")).toBe("rennen");
    expect(gangartZu(-T * 2, 0, "gehen")).toBe("rennen");
  });

  it("Hysterese zwischen den Grenzen", () => {
    const mitte = (T * (RENNEN_AB + GEHEN_UNTER)) / 2;
    expect(gangartZu(mitte, 0, "rennen")).toBe("rennen");
    expect(gangartZu(mitte, 0, "gehen")).toBe("gehen");
    expect(gangartZu(T * GEHEN_UNTER - 1, 0, "rennen")).toBe("gehen");
  });
});

describe("Gangartsteuerung", () => {
  it("rennt nur, wo es erlaubt ist", () => {
    const draussen = new Gangartsteuerung(true);
    draussen.setzeKreuz(true);
    expect(draussen.faktor()).toBeGreaterThan(1);
    const innen = new Gangartsteuerung(false);
    innen.setzeKreuz(true);
    expect(innen.faktor()).toBe(1);
  });
});
