/** Prüft, dass die erzeugte Übungsliste zu den Kapiteldateien der App passt. */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { UEBUNGEN_JE_KAPITEL } from "./uebungsliste-daten";

const ORDNER = new URL("../../public/daten/de/a1/", import.meta.url);
const lies = (datei: string): unknown => JSON.parse(readFileSync(new URL(datei, ORDNER), "utf8"));

describe("Übungsliste", () => {
  it("nennt je Kapitel genau die Übungen der Kapiteldatei (sonst: node skripte/erzeuge-uebungsliste.mjs)", () => {
    const index = lies("index.json") as { kapitel: { kapitel: number; datei: string }[] };
    for (const eintrag of index.kapitel) {
      const kapitel = lies(eintrag.datei) as { uebungen: { id: string }[] };
      expect(UEBUNGEN_JE_KAPITEL[eintrag.kapitel]).toEqual(kapitel.uebungen.map((u) => u.id));
    }
  });
});
