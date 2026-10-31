/**
 * Tests des Monatsrückblicks (Gamifizierung P12): Monatsgrenzen, Kalender, leere Monate, Startkarte
 * in den ersten sieben Tagen, Monate im Profil, Inhalte (Zahlen, Wertung, Stücke, Rekorde, Themen)
 * und die Texte in beiden Sprachen.
 */
import { describe, expect, it } from "vitest";
import de from "../i18n/de.json";
import en from "../i18n/en.json";
import { OHNE_PHASEN, type Wertungspunkt } from "../spiel/wertung";
import type { Themenstand } from "../speicher/gamifizierung";
import {
  folgemonat,
  kalenderwochen,
  monatAusSchluessel,
  monatVon,
  rueckblickkarteSichtbar,
  rueckblickMonate,
  vormonat,
  type Monat,
} from "./rueckblick";
import {
  rekordeImMonat,
  RUECKBLICKZAHLEN,
  themenImMonat,
  verdientImMonat,
  wertungImMonat,
  zahlenImMonat,
} from "./rueckblickinhalt";

function monat(schluessel: string): Monat {
  const m = monatAusSchluessel(schluessel);
  if (!m) throw new Error(`kein Monat: ${schluessel}`);
  return m;
}

const OKTOBER = monat("2026-10");

describe("Monate", () => {
  it("kennt Grenzen, Schaltjahr und Jahreswechsel", () => {
    expect(OKTOBER).toMatchObject({ von: "2026-10-01", bis: "2026-10-31", nummer: 10 });
    expect(monat("2028-02").bis).toBe("2028-02-29");
    expect(vormonat(monat("2026-01")).schluessel).toBe("2025-12");
    expect(folgemonat(monat("2026-12")).schluessel).toBe("2027-01");
    expect(monatVon(new Date(2026, 9, 31, 23, 59)).schluessel).toBe("2026-10");
  });

  it("lehnt falsche Schlüssel ab", () => {
    expect(monatAusSchluessel("2026-13")).toBeNull();
    expect(monatAusSchluessel("2026-1")).toBeNull();
    expect(monatAusSchluessel(null)).toBeNull();
  });

  it("baut den Kalender in Wochen ab Montag", () => {
    const wochen = kalenderwochen(OKTOBER);
    expect(wochen).toHaveLength(5);
    expect(wochen[0]).toEqual([null, null, null, "2026-10-01", "2026-10-02", "2026-10-03", "2026-10-04"]);
    expect(wochen[4]?.slice(-1)).toEqual([null]);
    expect(wochen.flat().filter(Boolean)).toHaveLength(31);
  });
});

describe("Startkarte und Profil", () => {
  const protokoll = { "2026-10-12": { abbildung: 2 }, "2026-09-03": { partie: 1 } };

  it("erscheint vom 1. bis 7. des Folgemonats, bis der Rückblick geöffnet ist", () => {
    expect(rueckblickkarteSichtbar(protokoll, new Date(2026, 10, 1, 8), null)).toBe(true);
    expect(rueckblickkarteSichtbar(protokoll, new Date(2026, 10, 7, 22), "2026-09")).toBe(true);
    expect(rueckblickkarteSichtbar(protokoll, new Date(2026, 10, 8, 8), null)).toBe(false);
    expect(rueckblickkarteSichtbar(protokoll, new Date(2026, 10, 3), "2026-10")).toBe(false);
    expect(rueckblickkarteSichtbar(protokoll, new Date(2026, 9, 31), null)).toBe(false);
  });

  it("zeigt für einen leeren Monat keine Karte", () => {
    expect(rueckblickkarteSichtbar({ "2026-10-12": { sieg: 1 } }, new Date(2026, 10, 2), null)).toBe(
      false,
    );
    expect(rueckblickkarteSichtbar({}, new Date(2026, 10, 2), null)).toBe(false);
  });

  it("listet abgeschlossene Monate mit Lerntagen, den jüngsten zuerst", () => {
    const mitHeute = { ...protokoll, "2026-11-02": { uebung: 1 } };
    const liste = rueckblickMonate(mitHeute, new Date(2026, 10, 3));
    expect(liste.map((m) => m.schluessel)).toEqual(["2026-10", "2026-09"]);
    expect(rueckblickMonate({}, new Date(2026, 10, 3))).toEqual([]);
  });
});

describe("Inhalte", () => {
  it("zählt die Zahlen des Monats ohne Nullen und ohne Nachbarmonate", () => {
    const protokoll = {
      "2026-09-30": { abbildung: 5 },
      "2026-10-01": { abbildung: 2, partie: 1 },
      "2026-10-31": { abbildung: 1, sieg: 1 },
      "2026-11-01": { partie: 4 },
    };
    expect(zahlenImMonat(protokoll, OKTOBER)).toEqual([
      { kennung: "abbildung", anzahl: 3 },
      { kennung: "partie", anzahl: 1 },
      { kennung: "sieg", anzahl: 1 },
    ]);
    expect(zahlenImMonat({}, OKTOBER)).toEqual([]);
  });

  it("nimmt die Wertung vor dem Monat und den letzten Punkt im Monat", () => {
    const punkt = (zeit: string, wertung: number): Wertungspunkt => ({
      partieId: zeit,
      zeit,
      gegner: 1200,
      ergebnis: 1,
      wertung,
      phasen: OHNE_PHASEN,
    });
    const punkte = [
      punkt("2026-10-20T10:00:00", 1225),
      punkt("2026-09-15T10:00:00", 1180),
      punkt("2026-10-02T10:00:00", 1205),
      punkt("2026-11-02T10:00:00", 1300),
    ];
    expect(wertungImMonat(punkte, OKTOBER)).toEqual([{ tempo: "rapid", anfang: 1180, ende: 1225 }]);
    expect(wertungImMonat(punkte.slice(0, 1), OKTOBER)).toEqual([
      { tempo: "rapid", anfang: null, ende: 1225 },
    ]);
    expect(wertungImMonat(punkte, monat("2026-08"))).toEqual([]);
    const blitz = { ...punkt("2026-10-05T10:00:00", 900), tempo: "blitz" as const };
    expect(wertungImMonat([...punkte, blitz], OKTOBER).map((w) => w.tempo)).toEqual([
      "blitz",
      "rapid",
    ]);
  });

  it("findet verdiente Stücke und Rekorde des Monats", () => {
    const verdient = {
      "abzeichen:ersterSieg": "2026-10-12T09:00:00",
      "abzeichen:warum": "2026-09-12T09:00:00",
      "orden:engine": "2026-10-03T09:00:00",
      "woche:2026-10-05": "2026-10-07T09:00:00",
    };
    expect(verdientImMonat(verdient, "abzeichen", OKTOBER).map((v) => v.kennung)).toEqual([
      "ersterSieg",
    ]);
    expect(verdientImMonat(verdient, "orden", OKTOBER).map((v) => v.kennung)).toEqual(["engine"]);
    const rekorde = {
      trainerTag: { wert: 16, datum: "2026-10-30T09:00:00" },
      wertung: { wert: 1300, datum: "2026-11-02T09:00:00" },
    };
    expect(rekordeImMonat(rekorde, ["wertung", "trainerTag", "fehlt"], OKTOBER)).toEqual([
      { kennung: "trainerTag", wert: 16, datum: "2026-10-30T09:00:00" },
    ]);
  });

  it("nennt das stärkste Thema und ein anderes unter 70 % zum Üben", () => {
    const stand = (letzte: string, tage: string[]): Themenstand => ({
      richtig: [...letzte].filter((z) => z === "r").length,
      falsch: [...letzte].filter((z) => z === "f").length,
      letzte,
      tage,
      zuletzt: "2026-10-20T10:00:00",
    });
    const themen = {
      "taktik:gabel": stand("rrrrrrrrrf", ["2026-10-20"]),
      "taktik:fesselung": stand("rrfrfrfrf", ["2026-10-21"]),
      "endspiel:opposition": stand("ffffffffff", ["2026-09-21"]),
    };
    const ergebnis = themenImMonat(themen, OKTOBER);
    expect(ergebnis.stark?.thema).toBe("taktik:gabel");
    expect(ergebnis.ueben?.thema).toBe("taktik:fesselung");
    const nurEins = themenImMonat({ "taktik:gabel": themen["taktik:gabel"] }, OKTOBER);
    expect(nurEins).toMatchObject({ ueben: null });
    expect(themenImMonat({}, OKTOBER)).toEqual({ stark: null, ueben: null });
  });
});

describe("Texte", () => {
  it("haben in beiden Sprachen dieselben Schlüssel", () => {
    const schluessel = (o: object) => Object.keys(o).filter((k) => k.startsWith("rueckblick."));
    expect(schluessel(en).sort()).toEqual(schluessel(de).sort());
    for (const { kennung } of RUECKBLICKZAHLEN)
      expect(Object.keys(de)).toContain(`rueckblick.zahl.${kennung}`);
    for (let n = 1; n <= 12; n += 1) expect(Object.keys(de)).toContain(`rueckblick.monat.${n}`);
  });
});
