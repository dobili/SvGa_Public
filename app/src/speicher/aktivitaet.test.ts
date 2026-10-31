/**
 * Tests des Tagesprotokolls (Gamifizierung G2): Zählen, Grenze 400 Tage, Lerntage, Summen und
 * Wochenbeginn am Montag.
 */
import { describe, expect, it } from "vitest";
import { lerntage, summeIn, wochenbeginn, wochentage, zaehleAktivitaet } from "./aktivitaet";
import { leereDaten } from "./format";
import { markiereGesehen, notiereDurchgang, notiereUebung } from "./fortschritt";
import { PROTOKOLL_TAGE } from "./gamifizierung";

const JETZT = new Date(2026, 9, 31, 10);

describe("Tagesprotokoll", () => {
  it("zählt je Tag und Art", () => {
    let d = zaehleAktivitaet(leereDaten(JETZT), "abbildung", 1, JETZT);
    d = zaehleAktivitaet(d, "abbildung", 2, JETZT);
    d = zaehleAktivitaet(d, "partie", 1, new Date(2026, 10, 1, 9));
    expect(d.aktivitaet).toEqual({ "2026-10-31": { abbildung: 3 }, "2026-11-01": { partie: 1 } });
    expect(zaehleAktivitaet(d, "partie", 0, JETZT)).toBe(d);
  });

  it("hält höchstens 400 Tage, die ältesten fallen weg", () => {
    let d = leereDaten(JETZT);
    for (let i = 0; i <= PROTOKOLL_TAGE; i++)
      d = zaehleAktivitaet(d, "karte", 1, new Date(2025, 0, 1 + i));
    const tage = Object.keys(d.aktivitaet).sort();
    expect(tage).toHaveLength(PROTOKOLL_TAGE);
    expect(tage[0]).toBe("2025-01-02");
  });

  it("Lerntage zählen Inhalt, nicht bloße Summen; Grenzen eingeschlossen", () => {
    const p = {
      "2026-10-26": { abbildung: 1 },
      "2026-10-28": { uebungGeloest: 1 },
      "2026-11-01": { partie: 2 },
      "2026-11-02": { trainerAntwort: 5 },
    };
    expect(lerntage(p, "2026-10-26", "2026-11-01")).toEqual(["2026-10-26", "2026-11-01"]);
    expect(summeIn(p, "partie", "2026-10-26", "2026-11-01")).toBe(2);
  });

  it("die Woche beginnt am Montag", () => {
    expect(wochenbeginn(JETZT).getDate()).toBe(26);
    expect(wochenbeginn(new Date(2026, 9, 26, 23)).getDate()).toBe(26);
    expect(wochenbeginn(new Date(2026, 10, 1, 8)).getDate()).toBe(26);
    expect(wochentage(JETZT)).toEqual([
      "2026-10-26",
      "2026-10-27",
      "2026-10-28",
      "2026-10-29",
      "2026-10-30",
      "2026-10-31",
      "2026-11-01",
    ]);
  });

  it("die vorhandenen Notier-Funktionen schreiben ins Protokoll", () => {
    let d = markiereGesehen(leereDaten(JETZT), "1.26", JETZT);
    d = markiereGesehen(d, "1.26", JETZT);
    d = notiereUebung(d, { id: "ueb:a", kapitel: 1, richtig: true }, JETZT);
    d = notiereDurchgang(d, "zaehlen", { aufgaben: 10, richtig: 7 }, JETZT);
    expect(d.aktivitaet["2026-10-31"]).toEqual({
      abbildung: 1,
      uebung: 1,
      uebungGeloest: 1,
      trainerRunde: 1,
      trainerAntwort: 10,
      trainerRichtig: 7,
    });
  });
});

describe("Rekorde aus Merkern (G5)", () => {
  it("übernimmt größere Bestwerte, sonst bleibt alles gleich", async () => {
    const { mitMerkerRekorden } = await import("./rekordmerker");
    const d = mitMerkerRekorden(
      leereDaten(JETZT),
      "11",
      '{"letzterTag":null,"serie":2,"beste":5}',
      JETZT,
    );
    expect(d.rekorde.taktikZeit?.wert).toBe(11);
    expect(d.rekorde.tagesserie?.wert).toBe(5);
    expect(mitMerkerRekorden(d, "9", null, JETZT)).toBe(d);
  });
});
