/**
 * Tests der Regeln der Partiebesprechung: offen erst nach der Ankündigung, Stufen nach dem
 * Fortschritt der Geschichte, Begriffe nach versuchten Runden, Stimme ohne Ambrose.
 */
import { describe, expect, it } from "vitest";
import {
  bekannteBegriffe,
  besprechungOffen,
  besprechungsstimme,
  besprechungsstufe,
} from "./besprechung";

const RUNDEN = [
  { kennung: "mapleFalls.reiheSam", themen: ["haengend"] },
  { kennung: "riverton.reiheTamsin", themen: ["doppelangriff"] },
  { kennung: "wegRivertonIronwood.tafel", themen: ["fesselung"] },
  { kennung: "desertSprings.reiheDot", themen: ["doppelschach", "abzug"] },
];

describe("Partiebesprechung: Freischaltung und Stufen", () => {
  it("ist erst nach Ambroses Ankündigung offen", () => {
    expect(besprechungOffen({})).toBe(false);
    expect(besprechungsstufe({})).toBe(0);
    expect(besprechungOffen({ besprechungAngekuendigt: true })).toBe(true);
  });

  it("wird mit der Geschichte gesprächiger", () => {
    const an = { besprechungAngekuendigt: true };
    expect(besprechungsstufe(an)).toBe(1);
    expect(besprechungsstufe({ ...an, endeAkt1Gesehen: true })).toBe(2);
    expect(besprechungsstufe({ ...an, endeAkt1Gesehen: true, endeAkt3Gesehen: true })).toBe(3);
  });
});

describe("Partiebesprechung: Begriffe", () => {
  it("kennt keinen Begriff ohne Lektion", () => {
    expect([...bekannteBegriffe({}, RUNDEN)]).toEqual([]);
  });

  it("lernt die Gabel mit der Runde von Tamsin, nicht mit der Kurzform", () => {
    expect([...bekannteBegriffe({ rivertonReiheTamsinVersucht: true }, RUNDEN)]).toEqual(["gabel"]);
    // „tafelVersucht“ gibt es an vielen Orten; es zählt nur die Langform mit Ort.
    expect([...bekannteBegriffe({ tafelVersucht: true }, RUNDEN)]).toEqual([]);
    expect([...bekannteBegriffe({ wegRivertonIronwoodTafelVersucht: true }, RUNDEN)]).toEqual([
      "fesselung",
    ]);
  });

  it("fasst Doppelschach und Abzug zusammen und kennt Theorie ab der Nadel von Silicon Bay", () => {
    expect([...bekannteBegriffe({ desertSpringsReiheDotVersucht: true }, RUNDEN)]).toEqual([
      "abzug",
    ]);
    expect(bekannteBegriffe({ nadelSiliconBay: 1 }, RUNDEN).has("theorie")).toBe(true);
    expect(bekannteBegriffe({ nadelSiliconBay: 0 }, RUNDEN).has("theorie")).toBe(false);
  });
});

describe("Partiebesprechung: wer spricht", () => {
  it("Ambrose, außer im Tiefpunkt und nach dem Abschied", () => {
    expect(besprechungsstimme({})).toBe("ambrose");
    expect(besprechungsstimme({ tiefpunktGesehen: true })).toBe("allein");
    expect(besprechungsstimme({ tiefpunktGesehen: true, versoehnungGesehen: true })).toBe(
      "ambrose",
    );
    expect(besprechungsstimme({ abschiedGesehen: true, versoehnungGesehen: true })).toBe(
      "abschied",
    );
  });
});
