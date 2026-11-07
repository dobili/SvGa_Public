// Quest-Auswertung mit den Beispieldaten von Maple Falls (inhalte/abenteuer/quests.json).
import { describe, expect, it } from "vitest";
import questdatei from "../../../../inhalte/abenteuer/quests.json";
import type { Questdaten } from "../daten/laden";
import { leererAbenteuerstand } from "./spielstand";
import { naechsterSchritt, passtEreignis, wendeWirkungenAn, werteEreignisAus } from "./quests";

const QUESTS = questdatei.quests as unknown as Questdaten[];
const JETZT = new Date("2026-11-07T20:00:00Z");
const START = leererAbenteuerstand(JETZT, "Kim", 800, true);

describe("passtEreignis", () => {
  it("vergleicht je Art die richtigen Felder", () => {
    expect(passtEreignis({ art: "dialog", knoten: "a.b" }, { art: "dialog", knoten: "a.b" })).toBe(
      true,
    );
    expect(
      passtEreignis(
        { art: "partie", begegnung: "x.y", ausgang: ["sieg"] },
        { art: "partie", begegnung: "x.y", ausgang: ["niederlage"] },
      ),
    ).toBe(false);
    expect(
      passtEreignis(
        { art: "ort", karte: "m.park" },
        { art: "ort", karte: "m.park", ausloeser: "bank" },
      ),
    ).toBe(true);
    expect(
      passtEreignis(
        { art: "ort", karte: "m.park", ausloeser: "bank" },
        { art: "ort", karte: "m.park", ausloeser: "tor" },
      ),
    ).toBe(false);
  });
});

describe("werteEreignisAus mit „Das Brett auf dem Dachboden“", () => {
  it("beginnt beim Betreten des Dachbodens und geht mit den Dialogknoten weiter", () => {
    const betreten = werteEreignisAus(
      START,
      QUESTS,
      { art: "ort", karte: "mapleFalls.dachboden" },
      JETZT,
    );
    expect(betreten.begonnen).toEqual(["mapleFalls.dasBrett"]);
    expect(betreten.stand.quests[0]).toMatchObject({ kennung: "mapleFalls.dasBrett", schritt: 0 });
    const quest = QUESTS[0];
    const erster = betreten.stand.quests[0];
    if (!quest || !erster) throw new Error("keine Quests");
    expect(naechsterSchritt(quest, erster)).toBe("quest.dasBrett.schritt1");

    const beruehrt = werteEreignisAus(
      betreten.stand,
      QUESTS,
      { art: "dialog", knoten: "maple-falls-dachboden.brett_beruehren" },
      JETZT,
    );
    expect(beruehrt.fortgeschritten).toEqual(["mapleFalls.dasBrett"]);
    expect(beruehrt.wirkungen).toEqual([]);

    const erwacht = werteEreignisAus(
      beruehrt.stand,
      QUESTS,
      { art: "dialog", knoten: "maple-falls-dachboden.ambrose_erwacht" },
      JETZT,
    );
    expect(erwacht.wirkungen.map((w) => w.art)).toEqual(["szene", "karte"]);
    const mitWirkung = wendeWirkungenAn(erwacht.stand, erwacht.wirkungen, JETZT);
    expect(mitWirkung.handlung.szene).toBe("akt1.ambroseErwacht");
    expect(mitWirkung.karten).toEqual([
      { kennung: "fingerzeig", anzahl: 1, erhalten: JETZT.toISOString() },
    ]);

    const partie = werteEreignisAus(
      mitWirkung,
      QUESTS,
      { art: "partie", begegnung: "mapleFalls.ersteLektion", ausgang: ["niederlage"] },
      JETZT,
    );
    expect(partie.erledigt).toEqual(["mapleFalls.dasBrett"]);
    expect(partie.stand.quests[0]?.erledigt).toBe(true);
    // „Sams Dame“ setzt die erledigte Hauptquest voraus und beginnt erst mit ihrem Startknoten.
    expect(partie.begonnen).toEqual([]);
    const sam = werteEreignisAus(
      partie.stand,
      QUESTS,
      { art: "dialog", knoten: "maple-falls-clubraum.sam_klagt" },
      JETZT,
    );
    expect(sam.begonnen).toEqual(["mapleFalls.samsDame"]);
  });

  it("eine Quest mit offener Voraussetzung beginnt nicht", () => {
    const sam = werteEreignisAus(
      START,
      QUESTS,
      { art: "dialog", knoten: "maple-falls-clubraum.sam_klagt" },
      JETZT,
    );
    expect(sam.begonnen).toEqual([]);
  });

  it("Wirkungen: Steckbrief, Zustand und Fragment ohne Doppelungen", () => {
    const stand = wendeWirkungenAn(
      START,
      [
        { art: "steckbrief", gegner: "mapleFalls.sam", zeile: 0 },
        { art: "steckbrief", gegner: "mapleFalls.sam", zeile: 0 },
        { art: "zustand", gegner: "mapleFalls.coachDelgado", analysiert: true },
        {
          art: "zustand",
          gegner: "mapleFalls.coachDelgado",
          faktor: 1.4,
          grund: "zustand.schlechtGeschlafen",
        },
        { art: "fragment", halbzug: 4 },
        { art: "fragment", halbzug: 2 },
        { art: "fragment", halbzug: 4 },
      ],
      JETZT,
    );
    expect(stand.clubs).toEqual([
      { kennung: "mapleFalls", nadel: null, aufgabenreihe: false, versuche: 0, steckbrief: [0] },
    ]);
    expect(stand.figuren).toEqual([
      {
        kennung: "mapleFalls.coachDelgado",
        abgelenkt: { faktor: 1.4, grund: "zustand.schlechtGeschlafen" },
        analysiert: true,
        dialogvariablen: {},
      },
    ]);
    expect(stand.fragmente.gefunden).toEqual([2, 4]);
  });
});
