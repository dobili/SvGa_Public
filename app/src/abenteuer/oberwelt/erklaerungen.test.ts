/** Tests der einmaligen Erklärungen (oberwelt/erklaerungen.ts, Spieltest „einstieg“, R9). */
import { describe, expect, it } from "vitest";
import { leererAbenteuerstand } from "../regeln/spielstand";
import { faelligeErklaerung } from "./erklaerungen";

const LEER = leererAbenteuerstand(new Date("2026-11-15T05:00:00Z"), "Mia", 600, false);

describe("faelligeErklaerung", () => {
  it("schweigt am Anfang", () => {
    expect(faelligeErklaerung(LEER)).toBeNull();
  });

  it("erklärt die ersten Münzen einmal", () => {
    const mitMuenzen = { ...LEER, muenzen: 10 };
    expect(faelligeErklaerung(mitMuenzen)?.schluessel).toBe("erklaerung.muenzen");
    const erklaert = { ...mitMuenzen, dialogvariablen: { muenzenErklaert: true } };
    expect(faelligeErklaerung(erklaert)).toBeNull();
  });

  it("erklärt die Spielstärke nach der ersten gewerteten Partie mit ihrem Wert", () => {
    const gewertet = { ...LEER, wertungPartien: 1, wertung: 616 };
    expect(faelligeErklaerung(gewertet)).toEqual({
      schluessel: "erklaerung.staerke",
      werte: { wertung: 616 },
      variable: "staerkeErklaert",
    });
  });
});
