/**
 * Tests für die Ordnung der Werkzeuge: Bündel je Kapitel, „◀ frühere“ und „spätere ▶“, Reiter,
 * erster Reiter, Symbole am Brett (auch Zählen), Bündel in der Reihenfolge ihrer Einführung,
 * Zuschalten ändert die Reihenfolge der gezeigten nicht.
 */
import { describe, expect, it } from "vitest";
import { werkzeugeFuer } from "../../../analyse/register";
import {
  brettsymbole,
  buendelMit,
  ersterTeil,
  leiste,
  teileVon,
  werkzeugname,
  type Buendelkennung,
} from "./werkzeugordnung";

const AUS = { frueher: false, spaeter: false };
const LETZTES_KAPITEL = 12;

function kennungen(kapitel: number, zu = AUS, mitRegeln = true): Buendelkennung[] {
  return leiste(kapitel, zu, mitRegeln).buendel.map((b) => b.kennung);
}

describe("Bündel je Kapitel", () => {
  it.each([
    [0, []],
    [1, ["eroeffnung", "angriffsregel"]],
    [2, ["eroeffnung"]],
    [3, ["eroeffnung"]],
    [4, ["fallencheck"]],
    [5, ["skelett"]],
    [6, ["planfindung"]],
    [7, ["taktik"]],
    [8, ["endspiel"]],
    [9, ["endspiel"]],
    [10, ["endspiel"]],
    [11, ["denkroutine"]],
    [12, ["denkroutine"]],
  ])("Kapitel %i zeigt zuerst nur seine Bündel", (kapitel, erwartet) => {
    expect(kennungen(kapitel)).toEqual(erwartet);
  });

  it("Kapitel 6: „◀ frühere“ schaltet die Bündel der Kapitel 1 bis 5 zu, in Buchfolge", () => {
    expect(kennungen(6, { frueher: true, spaeter: false })).toEqual([
      "eroeffnung",
      "angriffsregel",
      "fallencheck",
      "skelett",
      "planfindung",
    ]);
    const l = leiste(6, AUS, true);
    expect(l.hatFruehere).toBe(true);
    expect(l.hatSpaetere).toBe(true);
  });

  it("„spätere ▶“ zeigt spätere Bündel als Vorschau mit dem Kapitel ihrer Einführung", () => {
    const l = leiste(1, { frueher: false, spaeter: true }, true);
    const denkroutine = l.buendel.find((b) => b.kennung === "denkroutine");
    expect(denkroutine).toMatchObject({ vorschau: true, einfuehrung: 11 });
    expect(l.buendel.find((b) => b.kennung === "eroeffnung")?.vorschau).toBe(false);
    expect(l.hatFruehere).toBe(false);
  });

  it("Kapitel 12 hat keine späteren, Lehrbilder ohne König keine Bündel", () => {
    expect(leiste(LETZTES_KAPITEL, AUS, true).hatSpaetere).toBe(false);
    expect(kennungen(5, { frueher: true, spaeter: true }, false)).toEqual([]);
  });

  it("alle Bündel stehen in der Reihenfolge ihrer Einführung im Buch", () => {
    const alle = leiste(1, { frueher: true, spaeter: true }, true).buendel;
    expect(alle.map((b) => b.kennung)).toEqual([
      "eroeffnung",
      "angriffsregel",
      "fallencheck",
      "skelett",
      "planfindung",
      "taktik",
      "endspiel",
      "denkroutine",
    ]);
    const einfuehrungen = alle.map((b) => b.einfuehrung);
    expect(einfuehrungen).toEqual([...einfuehrungen].sort((a, b) => a - b));
  });

  it.each(Array.from({ length: LETZTES_KAPITEL + 1 }, (_, k) => k))(
    "Kapitel %i: Zuschalten ändert die Reihenfolge der schon gezeigten Bündel nicht",
    (kapitel) => {
      const ohne = kennungen(kapitel);
      for (const zu of [
        { frueher: true, spaeter: false },
        { frueher: false, spaeter: true },
        { frueher: true, spaeter: true },
      ]) {
        const mit = kennungen(kapitel, zu);
        expect(mit.filter((k) => ohne.includes(k))).toEqual(ohne);
      }
    },
  );

  it("jedes Werkzeug außer Röntgen und Warnsignalen steht in einem Bündel", () => {
    const amBrett = new Set(["k1-roentgen", "k4-warnsignale", "k7-warnsignale", "k1-zaehlen"]);
    for (const w of werkzeugeFuer(LETZTES_KAPITEL)) {
      if (amBrett.has(w.id)) continue;
      expect(buendelMit(w.id).length, w.id).toBeGreaterThan(0);
    }
    expect(buendelMit("k1-angriffsregel")).toEqual(["angriffsregel", "planfindung"]);
  });
});

describe("Reiter im Bündel", () => {
  it("Eröffnung prüfen in Kapitel 2: nur bis Kapitel 2 eingeführte Teile", () => {
    expect(teileVon("eroeffnung", 2, false).map((t) => t.wahl)).toEqual([
      "k1-todsuenden",
      "k2-zielbilanz",
      "k2-eroeffnung",
    ]);
    const mitSpaeteren = teileVon("eroeffnung", 2, true);
    expect(mitSpaeteren.find((t) => t.wahl === "k3-faktorenbilanz")?.vorschau).toBe(true);
  });

  it("ein ganz später eingeführtes Bündel zeigt alle Teile als Vorschau", () => {
    const teile = teileVon("denkroutine", 1, false);
    expect(teile).toHaveLength(4);
    expect(teile.every((t) => t.vorschau)).toBe(true);
  });

  it("Planfindung enthält die Angriffsregel bei „Wo?“", () => {
    expect(teileVon("planfindung", 6, false).map((t) => t.wahl)).toEqual([
      "k6-wo",
      "k1-angriffsregel",
      "k6-gegner",
      "k6-lap",
      "k6-planbilanz",
    ]);
  });

  it.each([
    ["eroeffnung", 1, "k1-todsuenden"],
    ["eroeffnung", 2, "k2-zielbilanz"],
    ["eroeffnung", 3, "k3-faktorenbilanz"],
    ["eroeffnung", 7, "k1-todsuenden"],
    ["denkroutine", 11, "k11-phase"],
    ["denkroutine", 12, "k12-erfassen"],
    ["endspiel", 9, "k9-turmbegriffe"],
    ["endspiel", 10, "k8-regeln"],
    ["denkroutine", 1, "k12-erfassen"],
  ] as const)("Tipp auf %s in Kapitel %i öffnet %s", (kennung, kapitel, erwartet) => {
    expect(ersterTeil(kennung, kapitel)).toBe(erwartet);
  });

  it("Namen: Kapitel 7 „Erzwingende Züge“, Kapitel 12 „Kandidaten“, Kapitel 9 „Turmendspiel“", () => {
    expect(werkzeugname("k7-erzwingend")).toBe("werkzeug.k7-erzwingend.name");
    expect(werkzeugname("ziehen")).toBe("werkzeug.ziehen.name");
  });
});

describe("Symbole am Brett", () => {
  it.each([
    [0, ["zaehlen", "ziehen", "engine"]],
    [1, ["zaehlen", "ziehen", "engine", "k1-roentgen"]],
    [4, ["zaehlen", "ziehen", "engine", "k1-roentgen", "k4-warnsignale"]],
    [6, ["zaehlen", "ziehen", "engine", "k1-roentgen", "k4-warnsignale"]],
    [7, ["zaehlen", "ziehen", "engine", "k1-roentgen", "k7-warnsignale"]],
    [12, ["zaehlen", "ziehen", "engine", "k1-roentgen", "k7-warnsignale"]],
  ])("Kapitel %i", (kapitel, erwartet) => {
    expect(brettsymbole(kapitel, true).map((s) => s.wahl)).toEqual(erwartet);
  });

  it("Lehrbilder ohne König: nur Zählen", () => {
    expect(brettsymbole(5, false).map((s) => s.wahl)).toEqual(["zaehlen"]);
  });
});
