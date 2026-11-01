/**
 * Tests für die ganze Eröffnung als Baum (Variationsbrowser, Stufe 4) an den echten Daten der App:
 * Kapitel 2 und 3 und die Eröffnungen nach Spielstärke (Lichess).
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Kapitel } from "../daten/laden";
import { begrenzt } from "../schach/baumvereinigung";
import { fortsetzungenAm, knotenzahl } from "../schach/variationsbaum";
import { eroeffnungsbaenderAus, type Eroeffnungsbaender } from "../spiel/eroeffnungsbaender";
import { steckbriefkerne } from "../ui/komponenten/varianten/eroeffnungsdaten";
import { bucheroeffnungen, buchbaum, lichessfolgen, type Bucheroeffnung } from "./eroeffnungsvariante";
import { praxisfortsetzungenAus, type Praxisfortsetzungen } from "./praxisfortsetzung";
import { buchUndPraxis, praxisbaum, praxisfolgen } from "./praxisvariante";
import { HOECHSTENS_KNOTEN, type Variationsknoten } from "./variationen";

const ORDNER = new URL("../../public/daten/", import.meta.url);
const lies = (datei: string): unknown => JSON.parse(readFileSync(new URL(datei, ORDNER), "utf8"));
const kapitel2 = lies("de/a1/kap02.json") as Kapitel;
const kapitel3 = lies("de/a1/kap03.json") as Kapitel;
const baender = eroeffnungsbaenderAus(lies("eroeffnungsbaender.json")) as Eroeffnungsbaender;
const fortsetzungen = praxisfortsetzungenAus(lies("praxisfortsetzungen.json")) as Praxisfortsetzungen;
const kerne = steckbriefkerne([kapitel2, kapitel3]);
const liste = bucheroeffnungen(kapitel2, kapitel3, (id) => kerne.get(id) ?? null, lichessfolgen(baender));
/** Band 1200 (Index 4), die Vorgabe ohne eigene Wertung. */
const BAND = { daten: fortsetzungen, band: 4 };

function eroeffnung(titel: string): Bucheroeffnung {
  const e = liste.find((x) => x.titel.startsWith(titel));
  if (!e) throw new Error(`Eröffnung fehlt: ${titel}`);
  return e;
}

/** Alle Knoten eines Baums, flach. */
function alle(zuege: readonly Variationsknoten[]): Variationsknoten[] {
  return zuege.flatMap((k) => [k, ...alle(k.weiter)]);
}

describe("Eröffnungen des Buches", () => {
  it("Kapitel 2 mit Steckbrief und die Gambits aus Kapitel 3, ohne Doppelte", () => {
    expect(liste.filter((e) => e.kapitel === 2).length).toBeGreaterThanOrEqual(13);
    expect(liste.some((e) => e.titel === "Evans-Gambit")).toBe(true);
    expect(new Set(liste.map((e) => e.id)).size).toBe(liste.length);
  });

  it("Kerne: Spanisch aus dem Steckbrief, Französisch vor dem Milner-Barry-Gambit", () => {
    expect(eroeffnung("Spanische Partie").kern).toEqual(["e4", "e5", "Nf3", "Nc6", "Bb5"]);
    expect(eroeffnung("Französische").kern).toEqual(["e4", "e6"]);
    const milner = eroeffnung("Milner-Barry");
    expect(milner.kern.length).toBeGreaterThan(2);
    expect(milner.kern.slice(0, 2)).toEqual(["e4", "e6"]);
    expect(eroeffnung("Evans").kern.at(-1)).toBe("b4");
  });

  it("jeder Kern ist eindeutig", () => {
    const texte = liste.map((e) => e.kern.join(" "));
    expect(new Set(texte).size).toBe(texte.length);
  });
});

describe("Baum des Buches (alle Zugfolgen zur Eröffnung)", () => {
  it("Italienisch bekommt Übung 8 (4. Sg5) und das Evans-Gambit (4. b4)", () => {
    const italienisch = eroeffnung("Italienische Partie");
    const baum = buchbaum(italienisch, [kapitel2, kapitel3]);
    const nachLc5 = fortsetzungenAm({ startFen: italienisch.beispiel.startFen, zuege: baum }, [
      "e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5",
    ]).map((k) => k.zug);
    expect(nachLc5).toEqual(expect.arrayContaining(["c3", "Ng5", "b4"]));
    expect(knotenzahl(baum)).toBeGreaterThan(knotenzahl(buchbaum({ ...italienisch, kern: [] }, [])));
  });

  it("Buchzüge tragen Herkunft „buch“, Zugzeichen des Buches bleiben", () => {
    const baum = buchbaum(eroeffnung("Italienische Partie"), [kapitel2, kapitel3]);
    expect(alle(baum).every((k) => k.herkunft === "buch")).toBe(true);
    expect(alle(baum).some((k) => k.zeichen === "??")).toBe(true);
  });

  it("Sizilianisch bekommt das Smith-Morra-Gambit aus Kapitel 3", () => {
    const sizilianisch = eroeffnung("Sizilianische");
    const baum = buchbaum(sizilianisch, [kapitel2, kapitel3]);
    const nachC5 = fortsetzungenAm({ startFen: sizilianisch.beispiel.startFen, zuege: baum }, ["e4", "c5"]);
    expect(nachC5.map((k) => k.zug)).toContain("d4");
  });

  it("alle Eröffnungen mit Buch und Praxis passen in eine Variante (600 Züge)", () => {
    for (const e of liste) {
      const zusammen = buchUndPraxis(
        buchbaum(e, [kapitel2, kapitel3]),
        praxisbaum(e.kern, praxisfolgen(baender), BAND),
        "P",
      );
      expect(knotenzahl(zusammen), e.titel).toBeLessThanOrEqual(HOECHSTENS_KNOTEN);
      expect(begrenzt(zusammen).gekuerzt, e.titel).toBe(false);
    }
  });
});

describe("Praxis (Lichess)", () => {
  it("Spanisch: Linien beginnen mit dem Kern, Herkunft „partie“, länger mit Fortsetzungen", () => {
    const kern = eroeffnung("Spanische Partie").kern;
    const kurz = praxisbaum(kern, praxisfolgen(baender), null);
    const lang = praxisbaum(kern, praxisfolgen(baender), BAND);
    expect(kurz[0]?.zug).toBe("e4");
    expect(alle(lang).every((k) => k.herkunft === "partie")).toBe(true);
    expect(knotenzahl(lang)).toBeGreaterThan(knotenzahl(kurz));
  });

  it("Buch und Praxis: Buchzüge vorn, Praxis hinter dem Buch mit Marke", () => {
    const e = eroeffnung("Spanische Partie");
    const zusammen = buchUndPraxis(
      buchbaum(e, [kapitel2, kapitel3]),
      praxisbaum(e.kern, praxisfolgen(baender), BAND),
      "Praxis (Lichess)",
    );
    expect(zusammen[0]?.herkunft).toBe("buch");
    const marken = alle(zusammen).filter((k) => k.kommentar === "Praxis (Lichess)");
    expect(marken.length).toBeGreaterThan(0);
    expect(marken.every((k) => k.herkunft === "partie")).toBe(true);
  });

  it("eine Eröffnung nur aus der Praxis: Wiener Partie", () => {
    const wiener = baender.familien.find((f) => f.name === "Vienna Game");
    expect(wiener?.buch).toBeNull();
    const baum = praxisbaum(["e4", "e5", "Nc3"], praxisfolgen(baender, wiener), BAND);
    expect(knotenzahl(baum)).toBeGreaterThan(3);
  });
});
