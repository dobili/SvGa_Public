/** Tests der Gangart (gangart.ts): Ausschlag des Joysticks → gehen oder rennen. */
import { describe, expect, it } from "vitest";
import { GEHEN_UNTER, Gangartsteuerung, RENNEN_AB, gangartZu } from "./gangart";

describe("gangartZu", () => {
  it("kleiner Ausschlag geht, großer rennt", () => {
    expect(gangartZu(0.5, "gehen")).toBe("gehen");
    expect(gangartZu(RENNEN_AB, "gehen")).toBe("rennen");
    expect(gangartZu(1, "gehen")).toBe("rennen");
  });

  it("Hysterese zwischen den Grenzen", () => {
    const mitte = (RENNEN_AB + GEHEN_UNTER) / 2;
    expect(gangartZu(mitte, "rennen")).toBe("rennen");
    expect(gangartZu(mitte, "gehen")).toBe("gehen");
    expect(gangartZu(GEHEN_UNTER - 0.01, "rennen")).toBe("gehen");
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
