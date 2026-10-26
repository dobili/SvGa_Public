/** Tests der Stil-Mischung eigener Bots (engine/stile.ts): Tippen, Gegenüber, Summe. */
import { describe, expect, it } from "vitest";
import { stilmixAus } from "../speicher/gegner";
import { hauptstil, mischverschiebung, mitStil, mixAusStil, stilverschiebung } from "./stile";

describe("Stil-Mischung (0.2.128)", () => {
  it("ein Tipp setzt den Stil, das Gegenüber ersetzt ihn, derselbe Punkt nimmt ihn weg", () => {
    let mix = mitStil({}, "angreifer", 75);
    expect(mix).toEqual({ angreifer: 75 });
    mix = mitStil(mix, "taktiker", 50);
    expect(mix).toEqual({ angreifer: 75, taktiker: 50 });
    mix = mitStil(mix, "positionsspieler", 125);
    expect(mix).toEqual({ taktiker: 50, positionsspieler: 125 });
    expect(mitStil(mix, "taktiker", 50)).toEqual({ positionsspieler: 125 });
  });
  it("die Verschiebung ist die Summe der Stile mal Prozent", () => {
    const v = mischverschiebung({ angreifer: 100, taktiker: 50 });
    expect(v.schach).toBeCloseTo(stilverschiebung("angreifer").schach ?? 0);
    expect(v.schlag).toBeCloseTo((stilverschiebung("taktiker").schlag ?? 0) / 2);
    const stark = mischverschiebung({ draufgaenger: 125 });
    expect(stark.bauernsturm).toBeCloseTo(
      (stilverschiebung("draufgaenger").bauernsturm ?? 0) * 1.25,
    );
    expect(mischverschiebung({})).toEqual({});
  });
  it("ältere Daten und Rohdaten", () => {
    expect(mixAusStil("vereinfacher")).toEqual({ vereinfacher: 100 });
    expect(mixAusStil("universell")).toEqual({});
    expect(hauptstil({ taktiker: 50 })).toBe("taktiker");
    expect(hauptstil({})).toBe("universell");
    expect(stilmixAus({ angreifer: 75, positionsspieler: 100, taktiker: 60, foo: 50 })).toEqual({
      angreifer: 75,
    });
  });
});
