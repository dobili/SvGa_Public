// Rückweg aus Partie und Aufgabenrunde (Regelwerk R18 bis R21, R31) mit nachgebauten Spieldaten.
import { describe, expect, it } from "vitest";
import type { Spieldaten } from "../daten/laden";
import { leererAbenteuerstand } from "./spielstand";
import { standNachPartie, standNachRunde } from "./rueckweg";
import type { Partieergebnis } from "../schnittstelle/partie";

const DATEN = {
  gegner: [],
  karten: [],
  quests: [],
  begegnungen: [{ kennung: "mapleFalls.clubkampf", gegner: "mapleFalls.coachDelgado" }],
  orte: [
    {
      kennung: "mapleFalls",
      club: { chef: "mapleFalls.coachDelgado" },
    },
  ],
  runden: [
    { kennung: "mapleFalls.reiheSam", ort: "mapleFalls", reihe: true },
    { kennung: "mapleFalls.reiheJuno", ort: "mapleFalls", reihe: true },
    { kennung: "mapleFalls.todsuenden", ort: "mapleFalls", reihe: false },
  ],
} as unknown as Spieldaten;

function ergebnis(ausgang: Partieergebnis["ausgang"]): Partieergebnis {
  return {
    kennung: "mapleFalls.clubkampf#1",
    appPartieId: "p",
    ausgang,
    ende: null,
    pgn: "",
    halbzuege: 40,
    sekunden: 600,
    gespielteKarten: [],
    ruecknahmen: 0,
    momente: [],
    kipppunkt: null,
    genauigkeit: null,
    geschaetzteStaerke: null,
    beendet: "2026-11-08T05:00:00Z",
  };
}

const STAND = {
  ...leererAbenteuerstand(new Date("2026-11-08T05:00:00Z"), "Kim", 900, true),
  laufendePartie: "mapleFalls.clubkampf#1",
  partiekarten: { deck: [], gespielt: [], wiedereinstieg: false, letzterHalbzug: null },
};

describe("standNachPartie", () => {
  it("gibt beim Sieg gegen den Clubchef ohne Karten Gold, protokolliert und setzt Variablen", () => {
    const r = standNachPartie(STAND, ergebnis("sieg"), DATEN);
    expect(r.nadel).toBe("gold");
    expect(r.stand.clubs).toEqual([
      { kennung: "mapleFalls", nadel: "gold", aufgabenreihe: false, versuche: 1, steckbrief: [] },
    ]);
    expect(r.stand.laufendePartie).toBeNull();
    expect(r.stand.protokoll[0]).toMatchObject({ gegner: "mapleFalls.coachDelgado" });
    expect(r.stand.dialogvariablen).toEqual({
      ausgangMapleFallsClubkampf: "sieg",
      nadelMapleFalls: 3,
    });
  });

  it("zählt bei einer Niederlage den Versuch nicht ohne Nadel und behält die alte Nadel", () => {
    const mitGold = standNachPartie(STAND, ergebnis("sieg"), DATEN).stand;
    const r = standNachPartie(
      { ...mitGold, ...STAND, clubs: mitGold.clubs },
      ergebnis("niederlage"),
      DATEN,
    );
    expect(r.nadel).toBeNull();
    expect(r.stand.clubs[0]?.nadel).toBe("gold");
    expect(r.stand.dialogvariablen.ausgangMapleFallsClubkampf).toBe("niederlage");
  });
});

describe("standNachRunde", () => {
  const auftrag = (runde: string) => ({
    kennung: `${runde}#1`,
    runde,
    steller: "figur.sam.name",
    kapitel: 0,
    buchuebungen: [],
    themen: ["haengend"],
    anzahl: 3,
    schwierigkeit: 1,
    versuch: 1,
    zaehltFuerApp: true,
  });
  const bestanden = (kennung: string) => ({
    kennung,
    ergebnisse: ["richtig", "richtig", "richtig"] as const,
    sekunden: 90,
  });

  it("setzt die Aufgabenreihe erst, wenn alle Reihenblöcke bestanden sind", () => {
    const sam = standNachRunde(STAND, auftrag("mapleFalls.reiheSam"), bestanden("a"), DATEN);
    expect(sam.bestanden).toBe(true);
    expect(sam.reiheGeschafft).toBe(false);
    expect(sam.stand.dialogvariablen.reiheSamBestanden).toBe(true);
    const juno = standNachRunde(sam.stand, auftrag("mapleFalls.reiheJuno"), bestanden("b"), DATEN);
    expect(juno.reiheGeschafft).toBe(true);
    expect(juno.stand.clubs[0]?.aufgabenreihe).toBe(true);
    // Eine weitere Runde meldet die Reihe nicht noch einmal.
    const neben = standNachRunde(
      juno.stand,
      auftrag("mapleFalls.todsuenden"),
      bestanden("c"),
      DATEN,
    );
    expect(neben.reiheGeschafft).toBe(false);
    expect(neben.stand.laufendeAufgaben).toBeNull();
  });
});
