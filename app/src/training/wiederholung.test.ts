/**
 * Tests des Wiederholungssystems (Konzept 9.1: fünf Kästen, 1/3/7/16/35 Tage).
 */
import { describe, expect, it } from "vitest";
import {
  beantworte,
  faellige,
  kartenAus,
  uebungAusKarte,
  uebungskarte,
  type Karte,
} from "./wiederholung";

const JETZT = new Date("2026-10-16T20:00:00.000Z");
const TAG = 24 * 60 * 60 * 1000;
const inTagen = (tage: number) => new Date(JETZT.getTime() + tage * TAG).toISOString();

describe("Wiederholung", () => {
  it("neue Karte richtig: Kasten 2, fällig in 3 Tagen", () => {
    const karte = beantworte(null, "richtig", JETZT);
    expect(karte.kasten).toBe(2);
    expect(karte.faellig).toBe(inTagen(3));
    expect(karte.verlauf).toEqual([{ datum: JETZT.toISOString(), ergebnis: "richtig" }]);
  });

  it("falsch: zurück in Kasten 1, fällig morgen", () => {
    const alt: Karte = { kasten: 4, faellig: inTagen(-1), verlauf: [] };
    expect(beantworte(alt, "falsch", JETZT)).toMatchObject({ kasten: 1, faellig: inTagen(1) });
  });

  it("nur mit Hilfe gelöst: bleibt im Kasten", () => {
    const alt: Karte = { kasten: 3, faellig: inTagen(-1), verlauf: [] };
    expect(beantworte(alt, "mitHilfe", JETZT)).toMatchObject({ kasten: 3, faellig: inTagen(7) });
  });

  it("Kasten 5 bleibt Kasten 5 (35 Tage)", () => {
    const alt: Karte = { kasten: 5, faellig: inTagen(0), verlauf: [] };
    expect(beantworte(alt, "richtig", JETZT)).toMatchObject({ kasten: 5, faellig: inTagen(35) });
  });

  it("fällig sind nur Karten bis jetzt, die ältesten zuerst", () => {
    const karten = {
      a: { kasten: 1, faellig: inTagen(-1), verlauf: [] },
      b: { kasten: 2, faellig: inTagen(2), verlauf: [] },
      c: { kasten: 1, faellig: inTagen(-3), verlauf: [] },
    };
    expect(faellige(karten, JETZT)).toEqual(["c", "a"]);
  });

  it("Kennungen der Übungskarten", () => {
    expect(uebungskarte("ueb:droh-ignorieren")).toBe("uebung:ueb:droh-ignorieren");
    expect(uebungAusKarte("uebung:ueb:droh-ignorieren")).toBe("ueb:droh-ignorieren");
    expect(uebungAusKarte("taktik:123")).toBeNull();
  });

  it("Rohdaten: Ungültiges fällt weg, Kasten wird begrenzt", () => {
    const roh = {
      gut: { kasten: 9, faellig: inTagen(1), verlauf: [{ datum: "x", ergebnis: "richtig" }, 3] },
      kaputt: { kasten: "1", faellig: inTagen(1) },
      ohneDatum: { kasten: 1, faellig: "morgen" },
    };
    expect(kartenAus(roh)).toEqual({
      gut: { kasten: 5, faellig: inTagen(1), verlauf: [{ datum: "x", ergebnis: "richtig" }] },
    });
    expect(kartenAus(null)).toEqual({});
  });
});
