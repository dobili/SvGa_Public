/** Prüft den Eröffnungsbaum der Steckbriefe an den echten Buchdaten der App (deutsch und englisch). */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Kapitel } from "../../../daten/laden";
import {
  baueBaum,
  fenNach,
  kennzeichnendeTiefe,
  kennzugfolge,
  liesBuchzuege,
  zugbeschriftung,
  type Baumknoten,
} from "./eroeffnungsbaum";
import { schlussstellung } from "./steckbriefbild";

function ladeKapitel(sprache: string): readonly Kapitel[] {
  const ordner = new URL(`../../../../public/daten/${sprache}/a1/`, import.meta.url);
  const lies = (datei: string): unknown => JSON.parse(readFileSync(new URL(datei, ordner), "utf8"));
  const index = lies("index.json") as { kapitel: { datei: string }[] };
  return index.kapitel.map((k) => lies(k.datei) as Kapitel);
}

function kennzugfolgen(sprache: string): Map<string, string> {
  const kapitel = ladeKapitel(sprache);
  const ergebnis = new Map<string, string>();
  for (const s of kapitel.flatMap((k) => k.steckbriefe)) {
    ergebnis.set(s.name, (kennzugfolge(s, schlussstellung(kapitel, s)) ?? ["–"]).join(" "));
  }
  return ergebnis;
}

describe("Buchzüge lesen", () => {
  it("Zugnummern für Weiß und Schwarz, Züge ohne Nummer", () => {
    expect(liesBuchzuege("1. e4 e5 2. Sf3")).toEqual([
      { halbzug: 1, san: "e4" },
      { halbzug: 2, san: "e5" },
      { halbzug: 3, san: "Sf3" },
    ]);
    expect(liesBuchzuege("3... Sf6")).toEqual([{ halbzug: 6, san: "Sf6" }]);
    expect(liesBuchzuege("...g6")).toEqual([{ halbzug: null, san: "g6" }]);
  });

  it("passt der erste Zug nicht zur Hauptvariante, gibt es keine Tiefe", () => {
    expect(kennzeichnendeTiefe(["1... c5"], ["e4", "e5"])).toBeNull();
    expect(kennzeichnendeTiefe(["1... Sf6", "...g6", "1. d4"], ["d4", "Nf6", "c4", "g6"])).toBe(4);
  });
});

describe("Kennzugfolgen der 13 Steckbriefe", () => {
  it("deutsch: wie im Entwurf H2", () => {
    const zuege = kennzugfolgen("de");
    expect(zuege.size).toBe(13);
    expect(zuege.get("Spanische Partie")).toBe("e4 e5 Nf3 Nc6 Bb5");
    expect(zuege.get("Sizilianische Verteidigung")).toBe("e4 c5");
    expect(zuege.get("London-System")).toBe("d4 d5 Bf4");
    expect(zuege.get("Königsindische Verteidigung")).toBe("d4 Nf6 c4 g6");
    expect(zuege.get("Zweispringerspiel und Läuferspiel")).toBe("e4 e5 Nf3 Nc6 Bc4 Nf6");
    expect(zuege.get("Nimzo-Indische Verteidigung")).toBe("d4 Nf6 c4 e6 Nc3 Bb4");
    for (const [name, folge] of zuege) expect(folge, name).not.toBe("–");
  });

  it("englisch: dieselben Zugfolgen", () => {
    const deutsch = [...kennzugfolgen("de").values()];
    expect([...kennzugfolgen("en").values()]).toEqual(deutsch);
  });
});

describe("Baum", () => {
  const kapitel = ladeKapitel("de");
  const steckbriefe = kapitel.flatMap((k) => k.steckbriefe);
  const baum = baueBaum(
    steckbriefe.map((s) => ({
      zuege: kennzugfolge(s, schlussstellung(kapitel, s)) ?? [],
      wert: s.name,
    })),
  );
  const finde = (
    knoten: readonly Baumknoten<string>[],
    name: string,
  ): Baumknoten<string> | null => {
    for (const k of knoten) {
      if (k.eintraege.includes(name)) return k;
      const tiefer = finde(k.kinder, name);
      if (tiefer) return tiefer;
    }
    return null;
  };

  it("zwei Wurzeln 1. e4 und 1. d4, verdichtete Äste wie im Entwurf", () => {
    expect(baum.map((k) => zugbeschriftung(k, "de"))).toEqual(["1. e4", "1. d4"]);
    expect(baum[0]?.kinder.map((k) => zugbeschriftung(k, "de"))).toEqual([
      "1… e5 2. Sf3",
      "1… c5",
      "1… e6",
      "1… c6",
    ]);
    const nimzo = finde(baum, "Nimzo-Indische Verteidigung");
    expect(nimzo && zugbeschriftung(nimzo, "de")).toBe("3… Lb4");
    expect(nimzo && zugbeschriftung(nimzo, "en")).toBe("3… Bb4");
  });

  it("Zweispringerspiel hängt unter der Italienischen Partie", () => {
    const italienisch = finde(baum, "Italienische Partie");
    expect(italienisch?.kinder[0]?.eintraege).toEqual(["Zweispringerspiel und Läuferspiel"]);
  });

  it("jeder Steckbrief steht genau einmal im Baum", () => {
    const alle = (k: readonly Baumknoten<string>[]): string[] =>
      k.flatMap((x) => [...x.eintraege, ...alle(x.kinder)]);
    expect(alle(baum).sort()).toEqual(steckbriefe.map((s) => s.name).sort());
  });

  it("Stellung nach den Zügen", () => {
    expect(fenNach(["e4", "c5"])).toBe(
      "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    );
  });
});
