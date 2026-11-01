/**
 * Tests der Zugarten in Varianten (Stufe 3): dieselben Klassen wie in der Partieauswertung
 * (Vergleich mit zeilenurteile über die ganze Linie), Q12-3, Abzweige, Theoriezüge.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Eroeffnungsliste } from "../daten/generiert/eroeffnungsliste";
import { baueTheoriebaum, theorieJeZug, type Theoriequellen } from "../schach/theorie";
import { gambitJeZug } from "../schach/theorienamen";
import type { Variation } from "../training/variationen";
import { ausStellung, linieAlsKnoten } from "../training/variationsquellen";
import { baumstellungen, mitWerten, type Engineergebnis } from "../training/variationswerte";
import { zeilenurteile } from "./auswertung";
import { pfadSchluessel, urteileImBaum } from "./variationsurteile";

const JETZT = new Date("2026-11-01T10:00:00.000Z");
const GRUND = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const LISTE = JSON.parse(
  readFileSync(
    new URL("../../public/daten/de/eroeffnungen-lichess.json", import.meta.url),
    "utf-8",
  ),
) as Eroeffnungsliste;
const QUELLEN: Theoriequellen = { baum: baueTheoriebaum(LISTE), buch: null };

/** Eine Variante aus einer Linie ab der Grundstellung. */
function linie(sans: readonly string[]): Variation {
  const v = ausStellung("grund", GRUND, "Test", JETZT);
  if (!v) throw new Error("keine Grundstellung");
  return { ...v, id: "var-1", zuege: linieAlsKnoten(GRUND, sans, undefined).knoten };
}

/** Trägt je Stellung (Reihenfolge der Baumstellungen) Wert, besten Zug und Abstand ein. */
function mitAngaben(v: Variation, angaben: readonly Engineergebnis[]): Variation {
  const stellungen = baumstellungen(v);
  return mitWerten(
    v,
    new Map(stellungen.flatMap((s, i) => (angaben[i] ? [[s.fen, angaben[i]] as const] : []))),
  );
}

describe("Zugarten in Varianten", () => {
  it("eine Linie bekommt genau die Klassen der Partieauswertung, auch mit Theorie", () => {
    const sans = ["e4", "e5", "Nf3", "Nc6", "Bc4", "Nd4", "Nxe5", "Qg5", "Nxf7", "Qxg2"];
    const werte = [30, 30, 30, 35, 30, 40, 90, -20, 400, -200, 600];
    const beste = [
      "e2e4",
      "e7e5",
      "g1f3",
      "b8c6",
      "f1c4",
      "g8f6",
      "f3d4",
      "d8g5",
      "e5f7",
      "g5g2",
      "",
    ];
    const abstaende = [5, 5, 5, 5, 5, 5, 5, 150, 5, 5, 0];
    const v = mitAngaben(
      linie(sans),
      werte.map((w, i) => ({ w, a: abstaende[i] ?? 0, ...(beste[i] ? { b: beste[i] } : {}) })),
    );
    const fens = baumstellungen(v).map((s) => s.fen);
    const erwartet = zeilenurteile(
      fens,
      sans,
      werte.map((w) => w / 100),
      {
        beste,
        abstaende: abstaende.map((a) => a / 100),
        theorie: theorieJeZug(QUELLEN, fens, sans),
        gambits: gambitJeZug(QUELLEN, fens, sans),
      },
    ).map((u) => u.klasse);
    const urteile = urteileImBaum(v, QUELLEN);
    const ist = sans.map((_, i) => urteile.get(pfadSchluessel(sans.slice(0, i + 1)))?.klasse);
    expect(ist).toEqual(erwartet);
    expect(ist[0]).toBe("buch");
    // Theorie bis 3... Sd4 (Blackburne-Schilling-Gambit), dann ungenau und stark.
    expect(ist.slice(6, 8)).toEqual(["ungenau", "stark"]);
  });

  it("Q12-3: der beste Zug der Engine bekommt nie ein Fragezeichen", () => {
    // Die Engine sieht nach dem besten Zug 1... e5 plötzlich −4: gemessen ein Patzer.
    const v = mitAngaben(linie(["e4", "e5"]), [
      { w: 30, b: "e2e4", a: 5 },
      { w: 30, b: "e7e5", a: 5 },
      { w: 430, b: "g1f3", a: 5 },
    ]);
    const urteil = urteileImBaum(v, null).get("e4 e5");
    expect(urteil?.zeichen).toBeNull();
    expect(urteil?.verlust).toBe(0);
    expect(["bester", "stark"]).toContain(urteil?.klasse);
  });

  it("Abzweige werden je Weg beurteilt; ohne besten Zug davor gibt es kein Urteil", () => {
    const basis = linie(["e4", "e5"]);
    const e4 = basis.zuege[0];
    if (!e4) throw new Error("kein e4");
    const v = { ...basis, zuege: [{ ...e4, weiter: [...e4.weiter, { zug: "f6", weiter: [] }] }] };
    const mit = mitAngaben(v, [
      { w: 30, b: "e2e4", a: 5 },
      { w: 30, b: "e7e5", a: 5 },
      { w: 30, b: "g1f3", a: 5 },
      { w: 160, b: "d2d4", a: 5 },
    ]);
    const urteile = urteileImBaum(mit, null);
    expect(urteile.get("e4 e5")?.klasse).toBe("bester");
    expect(urteile.get("e4 f6")?.klasse).toBe("fehler");
    // Nur ein Wert aus einer fremden PGN an der Startstellung: kein Urteil über 1. e4.
    const ohne = { ...mit, start: { w: 30 } };
    expect(urteileImBaum(ohne, null).has("e4")).toBe(false);
  });

  it("verpasst: Fehler des Gegners nicht genutzt, wie in der Partie", () => {
    const v = mitAngaben(linie(["e4", "f6", "Nf3"]), [
      { w: 30, b: "e2e4", a: 5 },
      { w: 30, b: "e7e5", a: 5 },
      { w: 200, b: "d1h5", a: 5 },
      { w: 60, b: "e7e5", a: 5 },
    ]);
    expect(urteileImBaum(v, null).get("e4 f6 Nf3")?.klasse).toBe("verpasst");
  });
});
