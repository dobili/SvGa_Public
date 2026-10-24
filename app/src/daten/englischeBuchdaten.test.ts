/**
 * Tests der englischen Buchdaten (P6, R25): Die Stellen der App, die Texte der Buchdaten als
 * Schlüssel lesen, finden auch die englischen Namen (public/daten/en/a1/, aus pipeline/uebersetzen).
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { KURZFASSUNGEN } from "../analyse/k2-eroeffnung";
import { baueEroeffnungsindex } from "../schach/eroeffnungsindex";
import { ladeKapitel } from "../schach/buchabbildungen.testhilfe";
import { bilanzfaelleAus } from "../training/buchbilanzen";
import { buchloesung } from "../training/faktorentrainer";
import type { Kapitel } from "./generiert/kapitel";

/** Ein Kapitel der englischen Daten (kapNN.json). */
function englisch(nummer: number): Kapitel {
  const datei = `kap${String(nummer).padStart(2, "0")}.json`;
  const ordner = new URL("../../public/daten/en/a1/", import.meta.url);
  return JSON.parse(readFileSync(new URL(datei, ordner), "utf8")) as Kapitel;
}

/** Kapitel 0 bis 12. */
const KAPITELZAHL = 13;

/** Alle Eröffnungsnamen eines Index. */
function namen(kapitel: readonly Kapitel[]): Set<string> {
  const index = baueEroeffnungsindex(kapitel);
  return new Set([...index.stellungen.values()].flat().map((e) => e.name));
}

describe("englische Buchdaten", () => {
  it("jeder englische Steckbrief hat eine Kurzfassung", () => {
    const steckbriefe = englisch(2).steckbriefe;
    expect(steckbriefe.length).toBe(ladeKapitel(2).steckbriefe.length);
    for (const { name } of steckbriefe) expect(KURZFASSUNGEN[name], name).toBeDefined();
  });

  it("Faktorenbilanzen ergeben auf Englisch dieselbe Buchlösung wie auf Deutsch", () => {
    for (const nummer of [3, 11]) {
      const deutsch = bilanzfaelleAus(ladeKapitel(nummer), "faktor");
      const en = bilanzfaelleAus(englisch(nummer), "faktor");
      expect(en.length).toBe(deutsch.length);
      en.forEach((fall, i) => {
        const erwartet = buchloesung(deutsch[i]?.tabelle ?? fall.tabelle);
        expect(erwartet, fall.abbildung).not.toBeNull();
        expect(buchloesung(fall.tabelle), fall.abbildung).toEqual(erwartet);
      });
    }
  });

  it("Eröffnungsindex: gleich viele Namen, englisch, ohne Artikel und allgemeine Titel", () => {
    const deutsch = namen([ladeKapitel(2), ladeKapitel(3)]);
    const en = namen([englisch(2), englisch(3)]);
    expect(en.size).toBe(deutsch.size);
    expect(en).toContain("Ruy Lopez");
    expect(en).toContain("King's Gambit");
    for (const name of en) expect(name, name).not.toMatch(/^(The |Further lines|Basic position)/);
  });
});

describe("englische Trainerdaten (R25)", () => {
  it("jede Buchaufgabe von „Falle oder Köder“ findet ihren englischen Fallennamen", () => {
    const falle = JSON.parse(
      readFileSync(new URL("../../../inhalte/de/trainer/falle.json", import.meta.url), "utf8"),
    ) as { aufgaben: { herkunft: { quelle: string; abbildung?: string; fallencheck?: string } }[] };
    const englischeStopps = new Set(
      Array.from({ length: KAPITELZAHL }, (_, n) =>
        englisch(n).fallenchecks.map((f) => f.stopp),
      ).flat(),
    );
    const ausBuch = falle.aufgaben.filter(
      (a) => a.herkunft.quelle === "buch" && a.herkunft.fallencheck,
    );
    expect(ausBuch.length).toBeGreaterThan(0);
    for (const aufgabe of ausBuch) {
      expect(englischeStopps.has(aufgabe.herkunft.abbildung ?? "")).toBe(true);
    }
  });
});
