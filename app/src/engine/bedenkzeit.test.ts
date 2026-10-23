/** Tests der Bedenkzeit der Bots: Anteil der Restzeit, Lage, Buchzug, Zeitnot. */
import { describe, expect, it } from "vitest";
import { bedenkzeitMs, type Bedenklage } from "./bedenkzeit";

const MITTE = () => 0.5;
const GRUND: Bedenklage = {
  wertung: 1200,
  restMs: 240_000,
  zugnummer: 20,
  lage: "eng",
  buchzug: false,
};

describe("Bedenkzeit der Bots", () => {
  it("mittlere Lage: einige Sekunden bei vier Minuten Rest, mehr später als in der Eröffnung", () => {
    const mitte = bedenkzeitMs(GRUND, MITTE);
    expect(mitte).toBeGreaterThan(2_000);
    expect(mitte).toBeLessThan(20_000);
    expect(bedenkzeitMs({ ...GRUND, zugnummer: 1 }, MITTE)).toBeLessThan(mitte);
  });

  it("Wiederschlag und Buchzug gehen schneller", () => {
    const mitte = bedenkzeitMs(GRUND, MITTE);
    expect(bedenkzeitMs({ ...GRUND, lage: "wiederschlag" }, MITTE)).toBeLessThan(mitte);
    expect(bedenkzeitMs({ ...GRUND, buchzug: true }, MITTE)).toBeLessThan(mitte);
  });

  it("in Zeitnot nur noch Sekunden, nie unter 0,2 Sekunden", () => {
    const knapp = bedenkzeitMs({ ...GRUND, restMs: 8_000 }, MITTE);
    expect(knapp).toBeLessThan(5_000);
    expect(knapp).toBeGreaterThanOrEqual(200);
  });
});
