/**
 * Tests der Strahlen und Linienmotive an den Motiven 2 bis 4 aus Kapitel 7.
 */
import { describe, expect, it } from "vitest";
import { Angriffskarte } from "./angriffskarte";
import { feld, stellungAus, stellungVon } from "./buchabbildungen.testhilfe";
import { fesselungen, linienmotive, type Linienmotiv } from "./linienmotive";
import { feldname } from "./stellung";
import { strahl, strahlen } from "./strahlen";

function motiveVon(nummer: string, farbe?: "white" | "black"): Linienmotiv[] {
  const { brett } = stellungVon(nummer);
  return linienmotive(brett, new Angriffskarte(brett), farbe);
}

/** Kurzform eines Motivs: „fesselung b5>c6>e8“. */
function kurz(motiv: Linienmotiv): string {
  const von = feldname(motiv.strahl.von);
  const vorn = feldname(motiv.vorn.feld);
  const hinten =
    motiv.art === "batterie"
      ? motiv.ziel
        ? feldname(motiv.ziel.feld)
        : "-"
      : feldname(motiv.hinten.feld);
  return `${motiv.art} ${von}>${vorn}>${hinten}`;
}

describe("strahlen", () => {
  it("Abb. 7.33: Turm d1 nach oben: erste Turm d2, dazwischen d3 und d4, zweite Bauer d5", () => {
    const { brett } = stellungVon("7.33");
    const s = strahl(brett, feld("d1"), { role: "rook", color: "white" }, { linie: 0, reihe: 1 });
    expect(s.frei).toEqual([]);
    expect(s.erste?.feld).toBe(feld("d2"));
    expect(s.dazwischen.map(feldname)).toEqual(["d3", "d4"]);
    expect(s.zweite?.feld).toBe(feld("d5"));
  });

  it("zählt je Figur die richtigen Richtungen (Turm 4, Läufer 4, Dame 8)", () => {
    const { brett } = stellungVon("7.9");
    const weisse = strahlen(brett, "white");
    // Weiß: Turm d1, Läufer d3, Dame e3 → 4 + 4 + 8.
    expect(weisse).toHaveLength(16);
  });
});

describe("linienmotive", () => {
  it("Abb. 7.4: absolute Fesselung des Springers c6 durch den Läufer b5", () => {
    const motive = fesselungen(motiveVon("7.4", "white"));
    expect(motive.map(kurz)).toEqual(["fesselung b5>c6>e8"]);
    expect(motive[0]?.absolut).toBe(true);
  });

  it("Abb. 7.5: relative Fesselung des Springers f6 (dahinter die Dame d8)", () => {
    const motive = fesselungen(motiveVon("7.5", "white"));
    expect(motive.map(kurz)).toEqual(["fesselung g5>f6>d8"]);
    expect(motive[0]?.absolut).toBe(false);
    expect(fesselungen(motiveVon("7.5"), true)).toEqual([]);
  });

  it("Abb. 7.7: Spieß mit Schach, der ungedeckte Turm a1 hinter dem König", () => {
    const motive = motiveVon("7.7", "black").filter((m) => m.art === "spiess");
    expect(motive.map(kurz)).toEqual(["spiess h1>e1>a1"]);
    const spiess = motive[0];
    expect(spiess?.art === "spiess" && spiess.mitSchach).toBe(true);
    expect(spiess?.art === "spiess" && spiess.hintenUngedeckt).toBe(true);
  });

  it("Abb. 7.8: Batterie aus Läufer c2 und Dame d3 mit dem Ziel h7", () => {
    const motive = motiveVon("7.8", "white").filter((m) => m.art === "batterie");
    expect(motive.map(kurz)).toContain("batterie c2>d3>h7");
  });

  it("Abb. 7.9: Abzug: der Turm d1 zielt durch den Läufer d3 auf die Dame d7", () => {
    const motive = motiveVon("7.9", "white").filter((m) => m.art === "abzug");
    expect(motive.map(kurz)).toEqual(["abzug d1>d3>d7"]);
    expect(motive[0]?.art === "abzug" && motive[0].mitSchach).toBe(false);
  });

  it("Abzugsschach: eigene Figur zwischen Turm und gegnerischem König", () => {
    const { brett } = stellungAus("4k3/8/8/8/8/8/4N3/4R1K1 w - - 0 1");
    const motive = linienmotive(brett, new Angriffskarte(brett), "white");
    expect(motive.map(kurz)).toEqual(["abzug e1>e2>e8"]);
    expect(motive[0]?.art === "abzug" && motive[0].mitSchach).toBe(true);
  });

  it("gleich wertvolle Figuren hintereinander sind kein Motiv", () => {
    const { brett } = stellungAus("4k3/8/8/8/8/8/8/r2R1RK1 w - - 0 1");
    // Schwarzer Turm a1, davor die weißen Türme d1 und f1 (Turm vor Turm).
    const motive = linienmotive(brett, new Angriffskarte(brett), "black");
    expect(motive.filter((m) => m.art !== "batterie")).toEqual([]);
  });
});
