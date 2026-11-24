/**
 * Tests für belebung.ts: Lesen aus Tiled, Tageszeit, Satzfolge und Zuordnung der Statistenbilder
 * (Auftrag Runde 7, Dokument 16, Abschnitt 3.1; Bild nach der Rolle seit 24.11.2026, die Regeln
 * selbst prüft statistenwahl.test.ts).
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

describe("Blickrichtung stehender Statisten (R008)", () => {
  it("liest blick, Sitzende und Unbekanntes bleiben ohne", () => {
    const statist = (name: string, eigenschaften: { name: string; value: string }[]) => ({
      name,
      type: "statist",
      x: 0,
      y: 0,
      properties: eigenschaften,
    });
    const karte = {
      layers: [
        {
          objects: [
            statist("verkaeuferin", [{ name: "blick", value: "links" }]),
            statist("gast", [
              { name: "sitzt", value: "oben" },
              { name: "blick", value: "links" },
            ]),
            statist("passant", [{ name: "blick", value: "quer" }]),
          ],
        },
      ],
    };
    const [verkaeuferin, gast, passant] = liesBelebung(karte);
    expect(verkaeuferin?.blick).toBe("links");
    expect(gast?.blick).toBeUndefined();
    expect(passant?.blick).toBeUndefined();
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
  const texte = new Set(["s.a", "s.a.1", "s.a.2", "s.a.ambrose", "s.b.1", "s.c", "s.c.2"]);
  const gibt = (s: string) => texte.has(s);

  it("zeigt die Sätze nacheinander und dann reihum", () => {
    const saetze = saetzeVon("s.a", gibt);
    expect(saetze).toEqual(["s.a", "s.a.1", "s.a.2"]);
    expect([0, 1, 2, 3].map((n) => satzBeim(saetze, n))).toEqual(["s.a", "s.a.1", "s.a.2", "s.a"]);
  });

  it("beginnt mit .1, wenn es den Schlüssel selbst nicht gibt", () => {
    expect(saetzeVon("s.b", gibt)).toEqual(["s.b.1"]);
    // Lücke: Die Helfer schreiben den zweiten Satz als .2 ohne .1.
    expect(saetzeVon("s.c", gibt)).toEqual(["s.c", "s.c.2"]);
  });

  it("überspringt Lücken (erster Satz, dann .2 und .3)", () => {
    const luecke = new Set(["s.c", "s.c.2", "s.c.3"]);
    expect(saetzeVon("s.c", (s) => luecke.has(s))).toEqual(["s.c", "s.c.2", "s.c.3"]);
  });

  it("liefert Ambroses Antwort, wenn es sie gibt", () => {
    expect(statistensatz("s.a", 1, gibt)).toEqual({ satz: "s.a.1", ambrose: "s.a.ambrose" });
    expect(statistensatz("s.b", 0, gibt)).toEqual({ satz: "s.b.1", ambrose: null });
    expect(statistensatz("s.x", 0, gibt)).toBeNull();
  });
});

describe("statistenbild", () => {
  it("nimmt das eigene Bild, sonst das Bild der Rolle, für denselben Namen immer gleich", () => {
    expect(statistenbild({ name: "egal", bild: "statist-07" })).toBe("figuren/statist-07.png");
    expect(statistenbild({ name: "bauarbeiter", bild: null })).toBe("figuren/statist.arbeiter.png");
    const bild = statistenbild({ name: "passanten", bild: null });
    expect(bild).toMatch(/^figuren\/[a-zA-Z.]+\.png$/);
    expect(statistenbild({ name: "passanten", bild: null })).toBe(bild);
  });

  it("liesBelebung wählt das Bild nach der Rolle und meidet dasselbe Bild daneben", () => {
    const statist = (name: string, x: number, eigenschaften: Record<string, string> = {}) => ({
      name,
      type: "statist",
      x: x * 16,
      y: 32,
      properties: Object.entries(eigenschaften).map(([n, value]) => ({ name: n, value })),
    });
    const karte = {
      layers: [
        {
          objects: [
            statist("empfangsdame", 2),
            statist("rentner", 4, { tun: "sitzt auf der Bank" }),
            statist("rentner", 6),
            statist("passanten", 30, { rolle: "historisch", tun: "gehen vorbei" }),
            statist("angler", 50, { bild: "silas" }),
            { name: "tauben", type: "tier", x: 0, y: 0 },
          ],
        },
      ],
    };
    const gelesen = liesBelebung(karte);
    expect(gelesen.map((b) => b.bild)).toEqual([
      "statist.konzern",
      "statist.rentner",
      "wanderer",
      "statist.hist",
      "silas",
      null,
    ]);
    expect(gelesen.slice(0, 5).map(statistenbild)).toEqual([
      "figuren/statist.konzern.png",
      "figuren/statist.rentner.png",
      "figuren/wanderer.png",
      "figuren/statist.hist.png",
      "figuren/silas.png",
    ]);
  });
});

describe("Zustand an der Stelle (Karteneditor 1.9)", () => {
  const objekt = (type: string, eig: Record<string, string>) => ({
    name: type === "tier" ? "kuh" : "gast",
    type,
    x: 32,
    y: 48,
    properties: Object.entries(eig).map(([name, value]) => ({ name, value })),
  });
  const lies = (type: string, eig: Record<string, string>) =>
    liesBelebung({ layers: [{ objects: [objekt(type, eig)] }] })[0];

  it("ein ruhendes Tier zeigt seinen Zustand und bleibt auf dem Feld", () => {
    const kuh = lies("tier", {
      zustand: "grasen",
      verhalten: "ausweichen",
      von: "1,1",
      bis: "9,9",
    });
    expect(kuh?.verhalten).toBe("grasen");
    expect(kuh?.von).toEqual({ x: 2, y: 3 });
    expect(kuh?.bis).toEqual({ x: 2, y: 3 });
    expect(lies("tier", { zustand: "schwimmen", von: "1,1" })?.von).toEqual({ x: 1, y: 1 });
  });

  it("ein Statist sitzt am Boden nach dem Zustand, mit Standbild", () => {
    const gast = lies("statist", { zustand: "sitzboden", blick: "links", standbild: "mit-hut" });
    expect(gast?.sitzt).toBe("links");
    expect(gast?.haltung).toBe("sitzboden");
    expect(gast?.standbild).toBe("mit-hut");
    const steht = lies("statist", { zustand: "stehen", sitzt: "oben" });
    expect(steht?.sitzt).toBeNull();
    expect(steht?.blick).toBe("oben");
  });
});
