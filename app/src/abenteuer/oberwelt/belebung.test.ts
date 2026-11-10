/**
 * Tests für belebung.ts: Lesen aus Tiled, Tageszeit, Satzfolge und Zuordnung der Statistenbilder
 * (Auftrag Runde 7, Dokument 16, Abschnitt 3.1).
 */
import { describe, expect, it } from "vitest";
import {
  liesBelebung,
  passtZurStunde,
  saetzeVon,
  satzBeim,
  statistenbild,
  statistensatz,
} from "./belebung";

const KARTE = {
  layers: [
    {
      objects: [
        {
          name: "taubenmann",
          type: "statist",
          x: 160,
          y: 96,
          properties: [
            { name: "von", value: "10,6" },
            { name: "bis", value: "14,6" },
            { name: "wann", value: "morgen" },
            { name: "sagt", value: "statist.riverton.taubenmann" },
          ],
        },
        {
          name: "tauben",
          type: "tier",
          x: 32,
          y: 32,
          properties: [{ name: "verhalten", value: "wirbeln" }],
        },
        { name: "brett", type: "ausloeser", x: 0, y: 0 },
      ],
    },
  ],
};

describe("liesBelebung", () => {
  it("liest Statisten und Tiere, nicht die Auslöser", () => {
    const [statist, tier, ...rest] = liesBelebung(KARTE);
    expect(rest).toEqual([]);
    expect(statist).toMatchObject({
      typ: "statist",
      feld: { x: 10, y: 6 },
      von: { x: 10, y: 6 },
      bis: { x: 14, y: 6 },
      wann: "morgen",
      sagt: "statist.riverton.taubenmann",
    });
    // Ohne von/bis gilt das eigene Feld, unbekanntes Verhalten wird „sitzen“.
    expect(tier).toMatchObject({
      typ: "tier",
      von: { x: 2, y: 2 },
      verhalten: "sitzen",
      wann: "immer",
    });
  });
});

describe("passtZurStunde", () => {
  it("prüft die Tageszeiten, auch über Mitternacht", () => {
    expect(passtZurStunde("morgen", 9)).toBe(true);
    expect(passtZurStunde("morgen", 14)).toBe(false);
    expect(passtZurStunde("tag", 21)).toBe(true);
    expect(passtZurStunde("nacht", 2)).toBe(true);
    expect(passtZurStunde("nacht", 12)).toBe(false);
    expect(passtZurStunde("immer", 3)).toBe(true);
  });
});

describe("Satzfolge", () => {
  const texte = new Set(["s.a", "s.a.1", "s.a.2", "s.a.ambrose", "s.b.1"]);
  const gibt = (s: string) => texte.has(s);

  it("zeigt die Sätze nacheinander und dann reihum", () => {
    const saetze = saetzeVon("s.a", gibt);
    expect(saetze).toEqual(["s.a", "s.a.1", "s.a.2"]);
    expect([0, 1, 2, 3].map((n) => satzBeim(saetze, n))).toEqual(["s.a", "s.a.1", "s.a.2", "s.a"]);
  });

  it("beginnt mit .1, wenn es den Schlüssel selbst nicht gibt", () => {
    expect(saetzeVon("s.b", gibt)).toEqual(["s.b.1"]);
  });

  it("liefert Ambroses Antwort, wenn es sie gibt", () => {
    expect(statistensatz("s.a", 1, gibt)).toEqual({ satz: "s.a.1", ambrose: "s.a.ambrose" });
    expect(statistensatz("s.b", 0, gibt)).toEqual({ satz: "s.b.1", ambrose: null });
    expect(statistensatz("s.x", 0, gibt)).toBeNull();
  });
});

describe("statistenbild", () => {
  it("nimmt das eigene Bild oder wählt fest aus dem Vorrat", () => {
    expect(statistenbild({ name: "egal", bild: "statist-07" })).toBe("figuren/statist-07.png");
    const bild = statistenbild({ name: "passanten", bild: null });
    expect(bild).toMatch(/^figuren\/statist-(0[1-9]|[1-3]\d|40)\.png$/);
    expect(statistenbild({ name: "passanten", bild: null })).toBe(bild);
  });

  it("verteilt verschiedene Namen über den Vorrat", () => {
    const namen = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"].map((n) => `statist${n}`);
    expect(new Set(namen.map((name) => statistenbild({ name, bild: null }))).size).toBeGreaterThan(
      5,
    );
  });
});
