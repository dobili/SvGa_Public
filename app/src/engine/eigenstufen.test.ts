/**
 * Tests der Regler eigener Gegner auf den menschlichen Quantilen (engine/eigenstufen.ts).
 */
import { describe, expect, it } from "vitest";
import {
  gewichteAusStufen,
  menschlichkeit,
  naechsteStufe,
  reglerstufeAus,
  staerkerichtung,
} from "./eigenstufen";
import { faktorFuerStufe } from "./spielerbereiche";

const WERTUNG = 1300;

describe("Reglerstufen eigener Gegner (Teil E, 0.2.126)", () => {
  it("liest nur ganze Stufen von −4 bis 4", () => {
    expect(reglerstufeAus(2)).toBe(2);
    expect(reglerstufeAus(-4)).toBe(-4);
    expect(reglerstufeAus(5)).toBeUndefined();
    expect(reglerstufeAus(1.5)).toBeUndefined();
    expect(reglerstufeAus("2")).toBeUndefined();
  });

  it("Gewichte folgen den Quantilen der Spieler, Stufe 0 ist der Median", () => {
    const g = gewichteAusStufen({ verfruehteDame: 2, bauernraub: 0 }, WERTUNG);
    expect(g.verfruehteDame).toBeCloseTo(faktorFuerStufe("arten", "verfruehteDame", 2, WERTUNG));
    expect(g.verfruehteDame).toBeGreaterThan(1);
    expect(g.bauernraub).toBeCloseTo(1);
    expect(g.figurHaengen).toBeUndefined();
  });

  it("übersetzt alte Gewichte in die nächste Stufe", () => {
    expect(naechsteStufe("bauernraub", 1, WERTUNG)).toBe(0);
    expect(naechsteStufe("bauernraub", 0, WERTUNG)).toBe(-4);
    const zwei = faktorFuerStufe("arten", "bauernraub", 2, WERTUNG);
    expect(naechsteStufe("bauernraub", zwei, WERTUNG)).toBe(2);
  });

  it("Menschlichkeit: Produkt der Anteile, über ±2 unmenschlich", () => {
    expect(menschlichkeit({}).urteil).toBe("keineNeigung");
    expect(menschlichkeit({ bauernraub: 0 }).urteil).toBe("menschlich");
    const ungewoehnlich = menschlichkeit({ verfruehteDame: 2, bauernraub: 2, figurHaengen: -1 });
    expect(ungewoehnlich.anteil).toBeCloseTo(0.005);
    expect(ungewoehnlich.urteil).toBe("ungewoehnlich");
    expect(
      menschlichkeit({ verfruehteDame: 2, bauernraub: 2, figurHaengen: 2, schlagreflex: 2 }).urteil,
    ).toBe("kaumMenschlich");
    const aussen = menschlichkeit({ verfruehteDame: 3 });
    expect(aussen.urteil).toBe("unmenschlich");
    expect(aussen.unmenschlich).toBe(1);
  });

  it("Richtung der Stärke: mehr Fehler als Menschen → schwächer", () => {
    expect(staerkerichtung({}, WERTUNG)).toBe("gleich");
    const viele = Object.fromEntries(
      ["figurHaengen", "bauernraub", "verfruehteDame", "schlagreflex", "tempoverlust"].map((a) => [
        a,
        4,
      ]),
    );
    expect(staerkerichtung(viele, WERTUNG)).toBe("schwaecher");
  });
});
