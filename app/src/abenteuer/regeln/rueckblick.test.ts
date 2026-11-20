/** Tests von „Was bisher geschah“ (regeln/rueckblick.ts, 20.11.2026): was bei welchem Stand erscheint. */
import { describe, expect, it } from "vitest";
import questdatei from "../../../../inhalte/abenteuer/quests.json";
import texte from "../../../../inhalte/abenteuer/texte/de.json";
import type { Abenteuerstand, Queststand } from "../schnittstelle/spielstand";
import { AKTQUESTS, questsatz, rueckblick } from "./rueckblick";
import { leererAbenteuerstand } from "./spielstand";

const JETZT = new Date("2026-11-20T18:00:00Z");

/** Erledigte Quest; die Minute legt die Reihenfolge der Erledigung fest. */
function fertig(kennung: string, minute: number): Queststand {
  const am = new Date(JETZT.getTime() + minute * 60000).toISOString();
  return { kennung, schritt: 1, erledigt: true, angenommen: am, erledigtAm: am };
}

function stand(quests: Queststand[]): Abenteuerstand {
  return { ...leererAbenteuerstand(JETZT, "Kim", 600, false), quests };
}

/** Alle Quests der ersten n Akte erledigt. */
function akteFertig(n: number): Queststand[] {
  return AKTQUESTS.slice(0, n)
    .flat()
    .map((k, i) => fertig(k, i));
}

describe("rueckblick", () => {
  it("ist leer, solange keine Hauptquest erledigt ist", () => {
    expect(rueckblick(stand([]))).toEqual([]);
  });

  it("zeigt im laufenden Akt die Sätze der erledigten Hauptquests in ihrer Reihenfolge", () => {
    const s = stand([fertig("mapleFalls.dasBrett", 2), fertig("mapleFalls.einzug", 1)]);
    expect(rueckblick(s)).toEqual([
      {
        akt: 1,
        abgeschlossen: false,
        saetze: [questsatz("mapleFalls.einzug"), questsatz("mapleFalls.dasBrett")],
      },
    ]);
  });

  it("fasst einen abgeschlossenen Akt zusammen und beginnt den nächsten erst mit seiner ersten Quest", () => {
    expect(rueckblick(stand(akteFertig(1)))).toEqual([
      { akt: 1, abgeschlossen: true, saetze: ["rueckblick.akt1"] },
    ]);
    const mitRiverton = stand([...akteFertig(1), fertig("riverton.parkclub", 99)]);
    expect(rueckblick(mitRiverton)[1]).toEqual({
      akt: 2,
      abgeschlossen: false,
      saetze: [questsatz("riverton.parkclub")],
    });
  });

  it("verrät nichts aus späteren Akten, auch wenn dort schon eine Quest erledigt wäre", () => {
    const s = stand([fertig("mapleFalls.einzug", 1), fertig("siliconBay.akademie", 2)]);
    expect(rueckblick(s).map((e) => e.akt)).toEqual([1]);
  });

  it("zeigt nach dem Finale alle vier Zusammenfassungen", () => {
    expect(rueckblick(stand(akteFertig(4))).map((e) => e.saetze[0])).toEqual([
      "rueckblick.akt1",
      "rueckblick.akt2",
      "rueckblick.akt3",
      "rueckblick.akt4",
    ]);
  });

  it("kennt jede Quest aus den Questdaten als Hauptquest und hat zu jeder einen Text", () => {
    const tabelle = texte as Record<string, string>;
    for (const kennung of AKTQUESTS.flat()) {
      const daten = questdatei.quests.find((q) => q.kennung === kennung);
      expect(daten?.haupt, kennung).toBe(true);
      expect(tabelle[questsatz(kennung)], kennung).toBeTruthy();
    }
    for (const akt of [1, 2, 3, 4]) expect(tabelle[`rueckblick.akt${akt}`]).toBeTruthy();
  });

  it("deckt alle Hauptquests außer dem Epilog ab", () => {
    const haupt = questdatei.quests.filter((q) => q.haupt).map((q) => q.kennung);
    const ohne = haupt.filter((k) => !AKTQUESTS.flat().includes(k));
    expect(ohne).toEqual(["mapleFalls.epilog"]);
  });
});
