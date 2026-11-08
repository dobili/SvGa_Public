// Aufgabenrunden: Umfang aus dem Zeitbudget, Schwierigkeit, Bestehen (Regelwerk R30, R31).
import { describe, expect, it } from "vitest";
import type { Aufgabenauftrag } from "../schnittstelle/aufgaben";
import {
  mitRundenergebnis,
  motivanzahl,
  reiheBestanden,
  schwierigkeitAus,
  schwierigkeitDesVersuchs,
  wertung,
} from "./aufgaben";

const MAPLE_FALLS = { minuten: 12, buchuebungenDesClubs: 3, bloecke: 2 };

const AUFTRAG: Aufgabenauftrag = {
  kennung: "mapleFalls.reiheSam#1",
  runde: "mapleFalls.reiheSam",
  steller: "figur.sam.name",
  kapitel: 0,
  buchuebungen: ["ueb:droh-ignorieren"],
  themen: ["haengend"],
  anzahl: 3,
  schwierigkeit: 2,
  versuch: 1,
  zaehltFuerApp: true,
};

describe("Aufgabenrunden", () => {
  it("rechnet die Schwierigkeit aus der Wertung nach der Tabelle R30", () => {
    expect(schwierigkeitAus(null)).toBe(1);
    expect(schwierigkeitAus(699)).toBe(1);
    expect(schwierigkeitAus(700)).toBe(2);
    expect(schwierigkeitAus(1299)).toBe(3);
    expect(schwierigkeitAus(1300)).toBe(4);
    expect(schwierigkeitAus(2000)).toBe(5);
  });

  it("verteilt das Zeitbudget nach Abzug der Buchübungen auf die Blöcke", () => {
    // 12 Minuten, drei Buchübungen à 120 s → 360 s für Motive; Schwierigkeit 2: 60 s → 6, je Block 3.
    const block = { buchuebungen: ["ueb:x"], themen: ["haengend"], anzahl: null, ...MAPLE_FALLS };
    expect(motivanzahl(block, 2)).toBe(3);
    // Schwierigkeit 5: 150 s → 2 Motive, je Block 1.
    expect(motivanzahl(block, 5)).toBe(1);
    // Feste Zahl geht vor; ohne Themen gibt es keine Motive.
    expect(motivanzahl({ ...block, anzahl: 5 }, 2)).toBe(5);
    expect(motivanzahl({ ...block, themen: [] }, 2)).toBe(0);
  });

  it("macht den zweiten Versuch eine Stufe leichter, nie unter 1", () => {
    expect(schwierigkeitDesVersuchs(3, 1)).toBe(3);
    expect(schwierigkeitDesVersuchs(3, 2)).toBe(2);
    expect(schwierigkeitDesVersuchs(1, 4)).toBe(1);
  });

  it("besteht ab 70 Prozent, mit Hilfe zählt halb", () => {
    const e = (...ergebnisse: ("richtig" | "mitHilfe" | "falsch")[]) => ({
      kennung: "k",
      ergebnisse,
      sekunden: 10,
    });
    expect(
      wertung(e("richtig", "richtig", "richtig", "richtig", "richtig", "richtig", "mitHilfe")),
    ).toEqual({ punkte: 6.5, moeglich: 7, bestanden: true });
    expect(wertung(e("richtig", "falsch", "falsch")).bestanden).toBe(false);
    expect(wertung(e()).bestanden).toBe(false);
  });

  it("merkt sich bestandene Runden und zählt Versuche; die Reihe braucht alle Blöcke", () => {
    const erst = mitRundenergebnis([], AUFTRAG, {
      kennung: AUFTRAG.kennung,
      ergebnisse: ["falsch", "falsch", "richtig"],
      sekunden: 60,
    });
    expect(erst[0]).toMatchObject({ bestanden: false, versuche: 1, punkte: 1, moeglich: 3 });
    const dann = mitRundenergebnis(erst, AUFTRAG, {
      kennung: AUFTRAG.kennung,
      ergebnisse: ["richtig", "richtig", "richtig"],
      sekunden: 60,
    });
    expect(dann).toHaveLength(1);
    expect(dann[0]).toMatchObject({ bestanden: true, versuche: 2 });
    expect(reiheBestanden(dann, ["mapleFalls.reiheSam", "mapleFalls.reiheJuno"])).toBe(false);
    const juno = mitRundenergebnis(
      dann,
      { ...AUFTRAG, runde: "mapleFalls.reiheJuno" },
      {
        kennung: "x",
        ergebnisse: ["richtig"],
        sekunden: 1,
      },
    );
    expect(reiheBestanden(juno, ["mapleFalls.reiheSam", "mapleFalls.reiheJuno"])).toBe(true);
    expect(reiheBestanden(juno, [])).toBe(false);
  });
});
