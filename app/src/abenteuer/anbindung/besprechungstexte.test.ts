/**
 * Tests der Sätze der Partiebesprechung: Stufe 1 knapp ohne Begriffe, ab Stufe 2 mit dem besseren
 * Zug und nur bekannten Begriffen, ab Stufe 3 mit der Folge; ohne Ambrose als Notiz; keine
 * Wiederholung in einer Besprechung; zu jeder Gruppe gibt es Texte in de.json.
 */
import { describe, expect, it } from "vitest";
import de from "../../../../inhalte/abenteuer/texte/de.json";
import type { Begriff, Besprechungsstimme, Besprechungsstufe } from "../regeln/besprechung";
import type { Momentkategorie } from "../regeln/besprechungsmomente";
import {
  auftaktsatz,
  momentsaetze,
  schlusssatz,
  type Besprechungskontext,
  type Momentangaben,
} from "./besprechungstexte";
import { varianten } from "./tischtexte";

function kontext(
  stufe: Besprechungsstufe,
  begriffe: readonly Begriff[] = [],
  stimme: Besprechungsstimme = "ambrose",
): Besprechungskontext {
  return { stimme, stufe, begriffe: new Set(begriffe), partiekennung: "probe-1" };
}

function angabe(kategorie: Momentkategorie, index = 8): Momentangaben {
  return {
    moment: { index, kategorie },
    zug: "5. Lc4",
    besser: "d4",
    motiv: { begriff: "gabel", richtung: "gegen" },
    folge: "Sd4 Kf1",
    eroeffnung: null,
    ursache: null,
    material: null,
    lage: null,
    opfer: null,
  };
}

/** Alle Texte einer Gruppe (ohne Platzhalter zu ersetzen). */
const texteDer = (gruppe: string) =>
  varianten(gruppe).map((k) => (de as Record<string, string>)[k] ?? "");

describe("Sätze der Besprechung je Stufe", () => {
  it("Stufe 1: nur der knappe Satz, kein besserer Zug, kein Begriff, keine Folge", () => {
    const [satz] = momentsaetze(kontext(1, ["gabel"]), [angabe("fehler")]);
    expect(texteDer("besprechung.ambrose.1.fehler")).toContain(satz);
    expect(satz).not.toContain("d4");
    expect(satz).not.toContain("Gabel");
  });

  it("Stufe 2: der bessere Zug, der Begriff nur, wenn der Held ihn kennt", () => {
    const [ohne] = momentsaetze(kontext(2), [angabe("fehler")]);
    expect(ohne).toContain("d4");
    expect(ohne).not.toContain("Gabel");
    const [mit] = momentsaetze(kontext(2, ["gabel"]), [angabe("fehler")]);
    expect(mit).toContain("Gabel");
    expect(mit).not.toContain("Sd4 Kf1");
  });

  it("Stufe 3: dazu die Folge", () => {
    const [satz] = momentsaetze(kontext(3, ["gabel"]), [angabe("patzer")]);
    expect(satz).toContain("Sd4 Kf1");
  });

  it("ohne besseren Zug sagt Stufe 2 den knappen Satz", () => {
    const ohneBesser = { ...angabe("fehler"), besser: null };
    const [satz] = momentsaetze(kontext(2), [ohneBesser]);
    expect(texteDer("besprechung.ambrose.1.fehler")).toContain(satz);
  });

  it("wiederholt sich in einer Besprechung nicht", () => {
    const vier = [0, 2, 4, 6].map((i) => angabe("fehler", i));
    const saetze = momentsaetze(kontext(1), vier);
    expect(new Set(saetze).size).toBe(saetze.length);
  });
});

describe("Besprechung ohne Ambrose", () => {
  it("spricht als Notiz, mit eigenem Auftakt im Tiefpunkt und nach dem Abschied", () => {
    const allein = kontext(2, [], "allein");
    const [satz] = momentsaetze(allein, [angabe("fehler")]);
    expect(satz).not.toMatch(/Lehrling/);
    expect(texteDer("besprechung.allein.auftakt")).toContain(auftaktsatz(allein));
    expect(texteDer("besprechung.abschied.auftakt")).toContain(
      auftaktsatz(kontext(2, [], "abschied")),
    );
  });

  it("schließt mit dem Ausgang, bei einer ruhigen Partie mit einem Satz davor", () => {
    const satz = schlusssatz(kontext(1), "sieg", true);
    expect(texteDer("besprechung.ambrose.ruhig").some((r) => satz.startsWith(r))).toBe(true);
  });
});

describe("Vollständige Texte", () => {
  const KATEGORIEN: readonly Momentkategorie[] = [
    "brillant",
    "stark",
    "fehler",
    "patzer",
    "verpasst",
    "ungenau",
    "theorie",
    "bekannt",
    "gegnerfehler",
  ];
  const BEGRIFFE: readonly Begriff[] = [
    "haengend",
    "matt",
    "gabel",
    "fesselung",
    "spiess",
    "eroeffnung",
    "struktur",
    "abzug",
    "hinlenkung",
    "umwandlung",
    "endspiel",
    "theorie",
  ];
  it("jede Kategorie und jeder Begriff hat Texte in jeder Stimme und Stufe", () => {
    const fehlend: string[] = [];
    const pruefe = (g: string) => varianten(g).length === 0 && fehlend.push(g);
    for (const k of KATEGORIEN) {
      for (const g of ["ambrose.1", "ambrose.2", "allein"]) pruefe(`besprechung.${g}.${k}`);
    }
    for (const b of BEGRIFFE) {
      for (const s of ["ambrose", "allein"]) {
        pruefe(`besprechung.${s}.begriff.${b}.gegen`);
        pruefe(`besprechung.${s}.begriff.${b}.fuer`);
      }
    }
    for (const a of ["sieg", "remis", "niederlage", "abgebrochen"]) {
      pruefe(`besprechung.ambrose.schluss.${a}`);
      pruefe(`besprechung.allein.schluss.${a}`);
    }
    expect(fehlend).toEqual([]);
  });

  it("Ambrose spricht nie in Zahlen der Engine (Story-Bibel 5.3, Regel 5)", () => {
    const zahlen = Object.entries(de as Record<string, string>)
      .filter(([k]) => k.startsWith("besprechung."))
      .filter(([, t]) => /\d|Prozent|Engine/.test(t));
    expect(zahlen).toEqual([]);
  });
});

describe("Ursache und Material (Abschnitt 11, Punkte 1 und 2)", () => {
  const gabel = {
    gruppe: "gabel",
    werte: { gegnerfigur: "der gegnerische Springer", feld: "e5" },
    begriff: "gabel" as const,
  };
  const mitUrsache = (kategorie: Momentkategorie): Momentangaben => ({
    ...angabe(kategorie),
    ursache: gabel,
    material: { art: "figur", rolle: "rook", richtung: "verlust" },
  });

  it("nennt ab Stufe 2 Figur und Feld, mit dem Fachwort nur, wenn der Held es kennt", () => {
    const [ohne] = momentsaetze(kontext(2), [mitUrsache("fehler")]);
    expect(ohne).toContain("der gegnerische Springer");
    expect(ohne).toContain("e5");
    expect(ohne).not.toContain("Gabel");
    const [mit] = momentsaetze(kontext(2, ["gabel"]), [mitUrsache("fehler")]);
    expect(mit).toContain("Gabel");
    expect(mit).toContain("e5");
  });

  it("nennt das verlorene Material als Figur, schon auf Stufe 1, nie in Bauern", () => {
    const [satz] = momentsaetze(kontext(1), [mitUrsache("patzer")]);
    expect(satz).toContain("den Turm");
    expect(satz).not.toContain("e5");
    expect(satz).not.toMatch(/Bauern?einheit|\d+[,.]\d/);
  });

  it("nennt eine Chance erst ab Stufe 2, das Matt ohne Figur", () => {
    const chance: Momentangaben = {
      ...angabe("verpasst"),
      material: { art: "matt", richtung: "gewinn" },
    };
    const [eins] = momentsaetze(kontext(1), [chance]);
    expect(eins).not.toMatch(/Matt/);
    const zwei = momentsaetze(kontext(2), [chance])[0] ?? "";
    expect(texteDer("besprechung.ambrose.material.mattGewinn").some((t) => zwei.includes(t))).toBe(
      true,
    );
  });
});

describe("Lage und Opfer (Abschnitt 11, Punkte 3 und 4)", () => {
  const mitLage: Momentangaben = {
    ...angabe("fehler"),
    motiv: null,
    lage: { lage: "gut", phase: "endspiel" },
  };

  it("nennt die Lage mit der Phase ab Stufe 2, höchstens an jedem zweiten Moment", () => {
    expect(momentsaetze(kontext(1), [mitLage])[0]).not.toContain("im Endspiel");
    const saetze = momentsaetze(kontext(2), [mitLage, mitLage, mitLage]);
    expect(saetze.map((s) => s.includes("im Endspiel"))).toEqual([true, false, true]);
  });

  it("nennt beim brillanten Zug die geopferte Figur, auf jeder Stufe", () => {
    const opfer: Momentangaben = { ...angabe("brillant"), motiv: null, opfer: "rook" };
    expect(momentsaetze(kontext(1), [opfer])[0]).toContain("den Turm");
  });
});

describe("Rückbezüge und Anekdote (Abschnitt 11, Punkte 5 und 6)", () => {
  const haengt = {
    gruppe: "haengt",
    werte: { figur: "dein Läufer", feld: "g5" },
    begriff: "haengend" as const,
  };
  const fehler: Momentangaben = { ...angabe("fehler"), motiv: null, ursache: haengt };
  const mitBezug = (stufe: Besprechungsstufe, stimme: Besprechungsstimme = "ambrose") => ({
    ...kontext(stufe, [], stimme),
    lehrer: new Map([["haengend", "Sam"]] as const),
    frueher: new Map([["haengt", { gegner: "Skater Jo", gleicherGegner: false }]]),
  });

  it("nennt die frühere Partie vor dem Lehrer, höchstens zweimal, erst ab Stufe 2", () => {
    expect(momentsaetze(mitBezug(1), [fehler])[0]).not.toContain("Skater Jo");
    const saetze = momentsaetze(mitBezug(2), [fehler, fehler, fehler]);
    expect(saetze.map((s) => s.includes("Skater Jo"))).toEqual([true, true, false]);
    const ohneFrueher = { ...mitBezug(2), frueher: new Map() };
    expect(momentsaetze(ohneFrueher, [fehler])[0]).toContain("Sam");
  });

  it("erzählt höchstens eine Anekdote, nur Ambrose, nur zu bekannten Begriffen", () => {
    const ohne = { ...kontext(2, ["haengend"]), lehrer: new Map(), frueher: new Map() };
    const anekdoten = texteDer("besprechung.ambrose.anekdote.haengend");
    const saetze = momentsaetze(ohne, [fehler, fehler, fehler]);
    const mit = saetze.filter((s) => anekdoten.some((t) => s.includes(t)));
    expect(mit).toHaveLength(1);
    const allein = momentsaetze({ ...ohne, stimme: "allein" }, [fehler]);
    expect(anekdoten.some((t) => allein[0]?.includes(t))).toBe(false);
    const unbekannt = momentsaetze({ ...ohne, begriffe: new Set() }, [fehler]);
    expect(anekdoten.some((t) => unbekannt[0]?.includes(t))).toBe(false);
  });
});
