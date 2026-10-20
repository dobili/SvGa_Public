/** Tests des Menschenprofils: Bandwerte, Raten je Gelegenheit, blinde Flecken, Zeitnot. */
import { describe, expect, it } from "vitest";
import {
  bandwert,
  blindZusatz,
  gelegenheitsrate,
  wahlkern,
  zeitnotFaktoren,
  zeitnotstufe,
} from "./menschenprofil";

describe("Menschenprofil", () => {
  it("liest Bandtabellen linear zwischen den Bandmitten und hält die Ränder", () => {
    const tabelle = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110];
    expect(bandwert(tabelle, 500)).toBe(10);
    expect(bandwert(tabelle, 600)).toBe(15);
    expect(bandwert(tabelle, 300)).toBe(10);
    expect(bandwert(tabelle, 2600)).toBe(110);
  });

  it("schwächere Spieler nutzen Gelegenheiten zu Fehlern öfter", () => {
    const schwach = gelegenheitsrate("drohungIgnoriert", 600, "mittelspiel");
    const stark = gelegenheitsrate("drohungIgnoriert", 2200, "mittelspiel");
    expect(schwach).toBeGreaterThan(stark);
    expect(gelegenheitsrate("figurHaengen", 600, "mittelspiel")).toBeLessThan(0.1);
  });

  it("blinde Flecken und Temperatur nehmen mit der Stärke ab", () => {
    expect(blindZusatz("ruhig", 600)).toBeGreaterThan(blindZusatz("ruhig", 2400));
    // Schwache Spieler: längerer Schwanz (kleinerer Exponent) als starke
    expect(wahlkern(500).exponent).toBeLessThan(wahlkern(2300).exponent);
  });

  it("Zeitnot erst unter 60 Sekunden, Patzer stärker als Fehler", () => {
    expect(zeitnotstufe(null)).toBeNull();
    expect(zeitnotstufe(90_000)).toBeNull();
    expect(zeitnotstufe(45_000)).toBe("30");
    expect(zeitnotstufe(5_000)).toBe("0");
    const knapp = zeitnotFaktoren(2000, 5_000);
    expect(knapp.patzer).toBeGreaterThan(knapp.fehler);
    expect(zeitnotFaktoren(2000, null)).toEqual({ fehler: 1, patzer: 1 });
  });
});
