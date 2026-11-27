/**
 * Tests der Speicherplätze des Abenteuers (speicherplaetze.ts, abenteuerplaetzeLesen.ts): anlegen,
 * laden, löschen, die laufende Partie wandert mit ihrem Platz, Übernahme des bisherigen einen
 * Stands und Lesen aus gespeicherten Rohdaten (Wunsch des Autors, 27.11.2026).
 */
import { describe, expect, it, vi } from "vitest";
import { leereDaten, wandleUm } from "../../speicher/format";
import { neuePartie, type Partie } from "../../spiel/partie";
import { leererAbenteuerstand } from "../regeln/spielstand";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { meinePartien } from "./meinePartien";
import {
  fortsetzbarerPlatz,
  mitGeladenemPlatz,
  mitGeschriebenemStand,
  mitNeuemSpiel,
  ohnePlatz,
  platzkennung,
  platzliste,
} from "./speicherplaetze";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** Ein Stand mit Name und Beginn; `zuletzt` setzt „zuletzt gespielt“. */
function stand(name: string, beginn: string, zuletzt?: string): Abenteuerstand {
  const s = leererAbenteuerstand(new Date(beginn), name, 800, false);
  return zuletzt ? { ...s, zuletztGespielt: zuletzt } : s;
}

/** Eine laufende Partie einer Begegnung, mit Platzangabe oder ohne (ältere Partien). */
function partie(id: string, kennung: string, spielstand?: string): Partie {
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
      abenteuer: { kennung, ...(spielstand ? { spielstand } : {}) },
    },
    id,
    "2026-11-27T09:30:00.000Z",
  );
  if (!neu) throw new Error("nicht spielbar");
  return neu;
}

const JETZT = new Date("2026-11-27T10:00:00.000Z");
const KIM = stand("Kim", "2026-11-20T08:00:00.000Z", "2026-11-26T20:00:00.000Z");
const ALEX = stand("Alex", "2026-11-22T08:00:00.000Z", "2026-11-25T20:00:00.000Z");

describe("Speicherplätze", () => {
  it("übernimmt den bisherigen einen Stand als ersten Platz, ohne Umwandlung", () => {
    const daten = { ...leereDaten(JETZT), abenteuer: KIM };
    expect(platzliste(daten).map((z) => [z.stand.held.name, z.aktiv])).toEqual([["Kim", true]]);
    expect(fortsetzbarerPlatz(daten)?.kennung).toBe(platzkennung(KIM));
  });

  it("legt ein neues Spiel an: der gespielte Stand ruht, die Liste hat beide", () => {
    const daten = mitNeuemSpiel({ ...leereDaten(JETZT), abenteuer: KIM }, ALEX);
    expect(daten.abenteuer?.held.name).toBe("Alex");
    expect(daten.abenteuerplaetze.map((p) => p.stand.held.name)).toEqual(["Kim"]);
    expect(platzliste(daten).map((z) => z.stand.held.name)).toEqual(["Alex", "Kim"]);
  });

  it("hält die Kennungen verschieden, auch bei gleichem Beginn", () => {
    const zwilling = stand("Sam", KIM.begonnen);
    const daten = mitNeuemSpiel({ ...leereDaten(JETZT), abenteuer: KIM }, zwilling);
    expect(daten.abenteuer && platzkennung(daten.abenteuer)).not.toBe(platzkennung(KIM));
  });

  it("lädt einen ruhenden Platz und legt den gespielten zur Ruhe", () => {
    const zwei = mitNeuemSpiel({ ...leereDaten(JETZT), abenteuer: KIM }, ALEX);
    const geladen = mitGeladenemPlatz(zwei, platzkennung(KIM));
    expect(geladen.abenteuer?.held.name).toBe("Kim");
    expect(geladen.abenteuerplaetze.map((p) => p.stand.held.name)).toEqual(["Alex"]);
    expect(mitGeladenemPlatz(geladen, "unbekannt")).toBe(geladen);
  });

  it("sortiert die ruhenden Plätze nach „zuletzt gespielt“, der gespielte steht vorn", () => {
    const sam = stand("Sam", "2026-11-23T08:00:00.000Z", "2026-11-27T08:00:00.000Z");
    const daten = {
      ...leereDaten(JETZT),
      abenteuer: ALEX,
      abenteuerplaetze: [
        { stand: KIM, laufend: null },
        { stand: sam, laufend: null },
      ],
    };
    expect(platzliste(daten).map((z) => z.stand.held.name)).toEqual(["Alex", "Sam", "Kim"]);
  });

  it("nimmt die laufende Partie mit dem Platz mit und gibt sie beim Laden zurück", () => {
    const offen = partie("p1", "mapleFalls.skaterJo", platzkennung(KIM));
    const basis = leereDaten(JETZT);
    const daten = { ...basis, abenteuer: KIM, spiel: { ...basis.spiel, laufend: offen } };
    const neu = mitNeuemSpiel(daten, ALEX);
    expect(neu.spiel.laufend).toBeNull();
    expect(neu.abenteuerplaetze[0]?.laufend?.id).toBe("p1");
    expect(mitGeladenemPlatz(neu, platzkennung(KIM)).spiel.laufend?.id).toBe("p1");
  });

  it("lässt eine freie Partie der App liegen", () => {
    const frei = { ...partie("frei", "x"), einstellung: { ...partie("frei", "x").einstellung } };
    const ohneAbenteuer: Partie = {
      ...frei,
      einstellung: { ...frei.einstellung, abenteuer: undefined },
    };
    const basis = leereDaten(JETZT);
    const daten = { ...basis, abenteuer: KIM, spiel: { ...basis.spiel, laufend: ohneAbenteuer } };
    expect(mitNeuemSpiel(daten, ALEX).spiel.laufend?.id).toBe("frei");
  });

  it("ordnet eine ältere Partie ohne Platzangabe dem Stand zu, der ihre Begegnung spielt", () => {
    const alt = partie("alt", "cedarCreek.juno");
    const mitte = { ...KIM, laufendePartie: "cedarCreek.juno" };
    const basis = leereDaten(JETZT);
    const daten = { ...basis, abenteuer: mitte, spiel: { ...basis.spiel, laufend: alt } };
    expect(mitNeuemSpiel(daten, ALEX).abenteuerplaetze[0]?.laufend?.id).toBe("alt");
  });

  it("löscht einen ruhenden Platz und den gespielten samt seiner Partie", () => {
    const offen = partie("p1", "mapleFalls.skaterJo", platzkennung(ALEX));
    const zwei = mitNeuemSpiel({ ...leereDaten(JETZT), abenteuer: KIM }, ALEX);
    const mitPartie = { ...zwei, spiel: { ...zwei.spiel, laufend: offen } };
    const ohneKim = ohnePlatz(mitPartie, platzkennung(KIM));
    expect(ohneKim.abenteuerplaetze).toEqual([]);
    expect(ohneKim.abenteuer?.held.name).toBe("Alex");
    const leer = ohnePlatz(ohneKim, platzkennung(ALEX));
    expect(leer.abenteuer).toBeNull();
    expect(leer.spiel.laufend).toBeNull();
    expect(fortsetzbarerPlatz(leer)).toBeNull();
  });

  it("bietet nach dem Löschen des gespielten den zuletzt gespielten ruhenden zum Fortsetzen an", () => {
    const zwei = mitNeuemSpiel({ ...leereDaten(JETZT), abenteuer: KIM }, ALEX);
    const ohneAlex = ohnePlatz(zwei, platzkennung(ALEX));
    expect(fortsetzbarerPlatz(ohneAlex)?.stand.held.name).toBe("Kim");
  });

  it("übersteht Speichern und Lesen (Sicherung, IndexedDB), Kaputtes fällt weg", () => {
    const offen = partie("p1", "mapleFalls.skaterJo", platzkennung(KIM));
    const daten = {
      ...leereDaten(JETZT),
      abenteuer: ALEX,
      abenteuerplaetze: [{ stand: KIM, laufend: offen }],
    };
    const roh = JSON.parse(JSON.stringify(daten)) as Record<string, unknown>;
    const mitMuell = { ...roh, abenteuerplaetze: [...(roh.abenteuerplaetze as unknown[]), 7] };
    const gelesen = wandleUm(mitMuell, JETZT);
    if (!gelesen.ok) throw new Error("nicht lesbar");
    expect(gelesen.daten.abenteuerplaetze.map((p) => p.stand.held.name)).toEqual(["Kim"]);
    expect(gelesen.daten.abenteuerplaetze[0]?.laufend?.einstellung.abenteuer?.spielstand).toBe(
      platzkennung(KIM),
    );
  });

  it("trennt im Tagebuch die Partien der Plätze", () => {
    const vonKim = {
      ...partie("k", "a", platzkennung(KIM)),
      ende: { art: "aufgabe", sieger: "black" },
    };
    const vonAlex = {
      ...partie("a", "a", platzkennung(ALEX)),
      ende: { art: "aufgabe", sieger: "black" },
    };
    const partien = [vonAlex, vonKim].map((p) => ({ partie: p }) as never);
    expect(meinePartien({ partien }, platzkennung(KIM)).map((z) => z.id)).toEqual(["k"]);
  });

  it("schreibt verspätete Stände eines anderen oder gelöschten Platzes nicht (27.11.2026)", () => {
    const warnung = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const zwei = mitNeuemSpiel({ ...leereDaten(JETZT), abenteuer: KIM }, ALEX);
    const spaeterKim = { ...KIM, muenzen: 999 };
    expect(mitGeschriebenemStand(zwei, spaeterKim)).toBe(zwei);
    const ohne = ohnePlatz(zwei, platzkennung(ALEX));
    expect(mitGeschriebenemStand(ohne, { ...ALEX, muenzen: 5 })).toBe(ohne);
    expect(mitGeschriebenemStand(zwei, { ...ALEX, muenzen: 5 }).abenteuer?.muenzen).toBe(5);
    expect(warnung).toHaveBeenCalledTimes(2);
    warnung.mockRestore();
  });
});
