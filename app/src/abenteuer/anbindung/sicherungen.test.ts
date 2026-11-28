/**
 * Tests der Sicherungen des Lesers (sicherungen.ts, abenteuersicherungenAus in
 * abenteuerplaetzeLesen.ts; Wunsch des Autors, 28.11.2026): sichern, Obergrenze, laden (auch aus
 * einem ruhenden Platz), offene Partie, Rückfrage nur bei Verlust, löschen, Lesen aus Rohdaten und
 * die Größe einer Sicherung.
 */
import { describe, expect, it } from "vitest";
import { leereDaten, wandleUm } from "../../speicher/format";
import { neuePartie, type Partie } from "../../spiel/partie";
import { leererAbenteuerstand } from "../regeln/spielstand";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import {
  aeltesteFaelltWeg,
  mitGeladenerSicherung,
  mitSicherung,
  ohneSicherung,
  ohneSicherungenDes,
  sicherbar,
  sicherungenDes,
  SICHERUNGEN_HOECHSTENS,
  ungesichertSeit,
} from "./sicherungen";
import { mitGeladenemPlatz, mitNeuemSpiel } from "./speicherplaetze";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const JETZT = new Date("2026-11-28T10:00:00.000Z");
const MS_JE_MINUTE = 60_000;
/** Obergrenze für eine Sicherung eines frischen Stands in Byte (JSON). */
const FRISCH_HOECHSTENS = 10_000;

/** Ein Stand mit Name und Beginn. */
function stand(name: string, beginn: string): Abenteuerstand {
  return leererAbenteuerstand(new Date(beginn), name, 800, false);
}

/** Eine laufende Partie einer Begegnung des Platzes. */
function partie(spielstand: string): Partie {
  const neu = neuePartie(
    {
      startFen: GRUNDSTELLUNG,
      eigeneFarbe: "white",
      stufe: 2,
      uhr: null,
      ruecknahmeErlaubt: false,
      abbildung: null,
      eroeffnung: null,
      stufenJePhase: { eroeffnung: 2, mittelspiel: 2, endspiel: 2 },
      gegner: "engine",
      bot: null,
      hilfen: { symbole: false, werkzeuge: false },
      gewertet: false,
      abenteuer: { kennung: "juno", spielstand },
    },
    "p1",
    "2026-11-28T09:30:00.000Z",
  );
  if (!neu) throw new Error("nicht spielbar");
  return neu;
}

const KIM = stand("Kim", "2026-11-20T08:00:00.000Z");
const ALEX = stand("Alex", "2026-11-22T08:00:00.000Z");
/** Kim nach einer gelösten Quest (anderer Fortschritt). */
const KIM_WEITER: Abenteuerstand = { ...KIM, muenzen: KIM.muenzen + 10 };

/** Daten mit Kim als gespieltem Platz. */
function mitKim() {
  return mitNeuemSpiel(leereDaten(JETZT), KIM);
}

describe("Sicherungen", () => {
  it("sichert den gespielten Stand: Kopie mit Zeitpunkt, der Stand wird auch der gespielte", () => {
    const gezogen = { ...KIM, position: { ...KIM.position, x: 7 } };
    const d = mitSicherung(mitKim(), gezogen, JETZT);
    expect(d.abenteuersicherungen).toEqual([
      { platz: KIM.begonnen, gesichert: JETZT.toISOString(), stand: gezogen },
    ]);
    expect(d.abenteuer).toBe(gezogen);
  });

  it("sichert nicht mitten in einer Partie oder für einen anderen Platz", () => {
    const inPartie = { ...KIM, laufendePartie: "juno" };
    expect(sicherbar(inPartie)).toBe(false);
    expect(sicherbar(KIM)).toBe(true);
    const d = mitKim();
    expect(mitSicherung(d, inPartie, JETZT)).toBe(d);
    expect(mitSicherung(d, ALEX, JETZT)).toBe(d);
  });

  it("behält höchstens zehn je Spiel, die älteste fällt weg; andere Spiele bleiben", () => {
    let d = mitSicherung(mitNeuemSpiel(mitKim(), ALEX), ALEX, JETZT);
    d = mitGeladenemPlatz(d, KIM.begonnen);
    for (let i = 0; i < SICHERUNGEN_HOECHSTENS; i += 1) {
      d = mitSicherung(d, d.abenteuer ?? KIM, new Date(JETZT.getTime() + i * MS_JE_MINUTE));
    }
    expect(sicherungenDes(d, KIM.begonnen)).toHaveLength(SICHERUNGEN_HOECHSTENS);
    expect(aeltesteFaelltWeg(d, KIM.begonnen)).toBe(true);
    const spaeter = new Date(JETZT.getTime() + SICHERUNGEN_HOECHSTENS * MS_JE_MINUTE);
    d = mitSicherung(d, d.abenteuer ?? KIM, spaeter);
    const kims = sicherungenDes(d, KIM.begonnen);
    expect(kims).toHaveLength(SICHERUNGEN_HOECHSTENS);
    expect(kims[0]?.gesichert).toBe(spaeter.toISOString());
    expect(kims.some((s) => s.gesichert === JETZT.toISOString())).toBe(false);
    expect(sicherungenDes(d, ALEX.begonnen)).toHaveLength(1);
  });

  it("rückt den Zeitpunkt vor, wenn schon eine Sicherung in derselben Millisekunde liegt", () => {
    const d = mitSicherung(mitSicherung(mitKim(), KIM, JETZT), KIM, JETZT);
    expect(sicherungenDes(d, KIM.begonnen).map((s) => s.gesichert)).toEqual([
      "2026-11-28T10:00:00.001Z",
      "2026-11-28T10:00:00.000Z",
    ]);
  });

  it("lädt eine Sicherung des gespielten Platzes; dessen offene Partie entfällt", () => {
    const gesichert = mitSicherung(mitKim(), KIM, JETZT);
    const weiter = {
      ...gesichert,
      abenteuer: { ...KIM_WEITER, laufendePartie: "juno" },
      spiel: { ...gesichert.spiel, laufend: partie(KIM.begonnen) },
    };
    const d = mitGeladenerSicherung(weiter, KIM.begonnen, JETZT.toISOString());
    expect(d.abenteuer).toEqual(KIM);
    expect(d.spiel.laufend).toBeNull();
    expect(d.abenteuersicherungen).toHaveLength(1);
  });

  it("lädt eine Sicherung eines ruhenden Platzes: der gespielte ruht", () => {
    const d0 = mitNeuemSpiel(mitSicherung(mitKim(), KIM, JETZT), ALEX);
    const d = mitGeladenerSicherung(d0, KIM.begonnen, JETZT.toISOString());
    expect(d.abenteuer?.held.name).toBe("Kim");
    expect(d.abenteuerplaetze.map((p) => p.stand.held.name)).toEqual(["Alex"]);
    expect(mitGeladenerSicherung(d0, KIM.begonnen, "2020-01-01T00:00:00.000Z")).toBe(d0);
  });

  it("fragt nur nach, wenn Fortschritt verloren ginge; Laufen und Spielzeit zählen nicht", () => {
    const d = mitSicherung(mitKim(), KIM, JETZT);
    const eigene = sicherungenDes(d, KIM.begonnen);
    const gelaufen = { ...KIM, position: { ...KIM.position, x: 3 }, spielzeitSekunden: 99 };
    expect(ungesichertSeit(gelaufen, eigene)).toBeNull();
    expect(ungesichertSeit(KIM_WEITER, eigene)).toBe(JETZT.toISOString());
  });

  it("löscht eine Sicherung oder alle eines Platzes", () => {
    const d = mitSicherung(
      mitSicherung(mitKim(), KIM, JETZT),
      KIM_WEITER,
      new Date(JETZT.getTime() + 1),
    );
    expect(ohneSicherung(d, KIM.begonnen, JETZT.toISOString()).abenteuersicherungen).toHaveLength(
      1,
    );
    expect(ohneSicherung(d, KIM.begonnen, "unbekannt")).toBe(d);
    expect(ohneSicherungenDes(d, KIM.begonnen).abenteuersicherungen).toEqual([]);
  });

  it("liest Sicherungen aus Rohdaten und lässt Unlesbares weg", () => {
    const roh = {
      ...JSON.parse(JSON.stringify(mitSicherung(mitKim(), KIM, JETZT))),
      abenteuersicherungen: [
        { platz: KIM.begonnen, gesichert: JETZT.toISOString(), stand: KIM },
        { platz: KIM.begonnen, gesichert: JETZT.toISOString(), stand: KIM },
        { platz: KIM.begonnen, stand: KIM },
        "kaputt",
      ],
    };
    const gelesen = wandleUm(roh, JETZT);
    if (!gelesen.ok) throw new Error("nicht lesbar");
    expect(gelesen.daten.abenteuersicherungen).toHaveLength(1);
    expect(gelesen.daten.abenteuersicherungen[0]?.stand.held.name).toBe("Kim");
  });

  it("eine Sicherung eines frischen Stands ist klein (Speichergröße)", () => {
    expect(
      JSON.stringify(mitSicherung(mitKim(), KIM, JETZT).abenteuersicherungen[0]).length,
    ).toBeLessThan(FRISCH_HOECHSTENS);
  });
});
