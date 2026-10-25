/**
 * Tests der Theorie-Erkennung (Zugklasse „Theoriezug“, Wunsch des Autors vom 25.10.2026) und der
 * Namen im Rückblick, mit der echten Lichess-Liste und dem Index aus Kapitel 2 und 3.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Eroeffnungsliste } from "../daten/generiert/eroeffnungsliste";
import { ladeKapitel } from "./buchabbildungen.testhilfe";
import { baueEroeffnungsindex } from "./eroeffnungsindex";
import { baueTheoriebaum, theorieJeZug, theoriebaumFuer, type Theoriequellen } from "./theorie";
import { istGambit, theorienamen, THEORIENAMEN_HOECHSTENS } from "./theorienamen";
import { fenNachZuegen } from "./weiterspielen";

function liste(sprache: "de" | "en"): Eroeffnungsliste {
  const pfad = new URL(`../../public/daten/${sprache}/eroeffnungen-lichess.json`, import.meta.url);
  return JSON.parse(readFileSync(pfad, "utf-8")) as Eroeffnungsliste;
}

const LISTE_DE = liste("de");
const BUCH = baueEroeffnungsindex([ladeKapitel(2), ladeKapitel(3)]);
const QUELLEN: Theoriequellen = { baum: baueTheoriebaum(LISTE_DE), buch: BUCH };
const NUR_LICHESS: Theoriequellen = { baum: QUELLEN.baum, buch: null };
const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
/** Großzügige Grenze für langsame Prüfrechner (am Entwicklungsrechner etwa 5 ms). */
const BAUZEIT_HOECHSTENS_MS = 200;

/** Stellungen nach jedem Zug, mit der Grundstellung vorn. */
function verlauf(zuege: readonly string[]): string[] {
  return [
    GRUNDSTELLUNG,
    ...zuege.map((_, i) => fenNachZuegen(GRUNDSTELLUNG, zuege.slice(0, i + 1)) ?? ""),
  ];
}

function theorie(quellen: Theoriequellen, zuege: readonly string[]): boolean[] {
  return theorieJeZug(quellen, verlauf(zuege), zuege);
}

function namen(quellen: Theoriequellen, zuege: readonly string[]) {
  return theorienamen(quellen, verlauf(zuege), zuege);
}

describe("theorieJeZug", () => {
  it("Spanische Partie: alle fünf Züge sind Theorie", () => {
    expect(theorie(NUR_LICHESS, ["e4", "e5", "Nf3", "Nc6", "Bb5"])).toEqual([
      true,
      true,
      true,
      true,
      true,
    ]);
  });

  it("Zwischenstellungen ohne eigenen Namen zählen (Weg zu einer benannten Stellung)", () => {
    // Nach 1. e4 e5 2. Sf3 Sc6 3. Lb5 a6 4. La4 Sf6 5. 0-0 Le7 6. Te1 b5 7. Lb3 d6 8. c3 0-0
    // hat nicht jede Stellung einen eigenen Namen, liegt aber auf benannten Zugfolgen.
    const zuege = ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Ba4", "Nf6", "O-O", "Be7", "Re1", "b5"];
    expect(theorie(NUR_LICHESS, zuege).every(Boolean)).toBe(true);
  });

  it("Zugumstellung: Nimzo-Indisch über 1. c4 erkannt", () => {
    const zuege = ["c4", "e6", "Nc3", "Nf6", "d4", "Bb4"];
    expect(theorie(NUR_LICHESS, zuege).at(-1)).toBe(true);
  });

  it("die Bongcloud steht in der Liste (den Verlust prüft die Auswertung)", () => {
    expect(theorie(NUR_LICHESS, ["e4", "e5", "Ke2"])).toEqual([true, true, true]);
  });

  it("ein Zug außerhalb jeder Zugfolge ist keine Theorie", () => {
    expect(theorie(NUR_LICHESS, ["e4", "e5", "Qh5", "Nc6", "Qxf7+"]).at(-1)).toBe(false);
  });

  it("das Buch allein reicht (Kapitel 2 und 3, Zug aus der Stellung davor)", () => {
    const nurBuch: Theoriequellen = { baum: null, buch: BUCH };
    expect(theorie(nurBuch, ["e4", "e5", "Nf3", "Nc6", "Bb5"])).toEqual([
      true,
      true,
      true,
      true,
      true,
    ]);
    expect(theorie(nurBuch, ["h4"])).toEqual([false]);
  });

  it("ohne Quellen ist nichts Theorie", () => {
    expect(theorie({ baum: null, buch: null }, ["e4"])).toEqual([false]);
  });
});

describe("theoriebaumFuer", () => {
  it("baut zu derselben Liste einmal und gibt dasselbe Objekt", () => {
    const englisch = liste("en");
    expect(theoriebaumFuer(englisch)).toBe(theoriebaumFuer(englisch));
  });

  it("braucht keine Schachregeln und ist schnell gebaut (am Rechner wenige Millisekunden)", () => {
    const englisch = liste("en");
    const beginn = performance.now();
    const baum = baueTheoriebaum(englisch);
    expect(performance.now() - beginn).toBeLessThan(BAUZEIT_HOECHSTENS_MS);
    expect(baum.benannte.size).toBe(englisch.stellungen.length);
  });
});

describe("theorienamen", () => {
  it("3. Lb5: Spanische Partie (Buch zuerst), keine Gambits", () => {
    const zuege = ["e4", "e5", "Nf3", "Nc6", "Bb5"];
    const auskunft = namen(QUELLEN, zuege);
    expect(auskunft.namen[0]).toEqual({ name: "Spanische Partie", herkunft: "buch" });
    expect(auskunft.gambit).toBe(false);
    expect(auskunft.namen.length).toBe(THEORIENAMEN_HOECHSTENS);
    expect(auskunft.weitere).toBeGreaterThan(100);
  });

  it("nur Lichess: die Stellung selbst zuerst, dann die kürzesten Fortsetzungen", () => {
    const auskunft = namen(NUR_LICHESS, ["e4", "e5", "Nf3", "Nc6", "Bb5"]);
    expect(auskunft.namen[0]).toEqual({ name: "Spanische Partie", herkunft: "lichess" });
    expect(auskunft.namen[1]?.name).toMatch(/^Spanische Partie: /);
  });

  it("2. f4: Teil eines Gambits (Königsgambit)", () => {
    const auskunft = namen(QUELLEN, ["e4", "e5", "f4"]);
    expect(auskunft.gambit).toBe(true);
    expect(auskunft.namen.map((n) => n.name)).toContain("Königsgambit");
  });

  it("1. e4 ist kein Gambit, obwohl Gambits dort beginnen", () => {
    const auskunft = namen(QUELLEN, ["e4"]);
    expect(auskunft.gambit).toBe(false);
    expect(auskunft.namen).toHaveLength(THEORIENAMEN_HOECHSTENS);
  });

  it("Zwischenstellung ohne Namen: die Eröffnung, in der die Partie gerade ist", () => {
    // 1. d4 d5 2. c4 ist das Damengambit; 2... c6 3. Sf3 Sf6 4. Sc3 e6 liegt im Halbslawischen.
    const auskunft = namen(NUR_LICHESS, ["d4", "d5", "c4"]);
    expect(auskunft.namen[0]?.name).toBe("Damengambit");
    expect(auskunft.gambit).toBe(true);
  });

  it("tief in der Spanischen Partie: die Eröffnung der Partie zuerst, höchstens fünf Namen", () => {
    const zuege = ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Ba4", "Nf6", "O-O", "Be7", "Re1", "b5"];
    const auskunft = namen(NUR_LICHESS, zuege);
    expect(auskunft.namen[0]?.name).toMatch(/^Spanische Partie/);
    expect(auskunft.namen.length).toBeLessThanOrEqual(THEORIENAMEN_HOECHSTENS);
    expect(auskunft.gambit).toBe(false);
  });

  it("die Bongcloud nennt ihren Namen, ohne Fortsetzungen", () => {
    const auskunft = namen(NUR_LICHESS, ["e4", "e5", "Ke2"]);
    expect(auskunft.namen).toEqual([{ name: "Bongcloud Attack", herkunft: "lichess" }]);
    expect(auskunft.weitere).toBe(0);
  });
});

describe("istGambit", () => {
  it("deutsch und englisch, Familie oder Variante", () => {
    expect(istGambit("Königsgambit")).toBe(true);
    expect(istGambit("King's Gambit Accepted")).toBe(true);
    expect(istGambit("Sizilianische Verteidigung: Smith-Morra Gambit")).toBe(true);
    expect(istGambit("Spanische Partie")).toBe(false);
  });
});
