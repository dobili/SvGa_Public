/**
 * Tests der Ursache mit Figur und Feld (besprechungsursache.ts) an echten Stellungen: die
 * Mattdrohung im Schäfermatt und ein eingestellter Läufer.
 */
import { describe, expect, it } from "vitest";
import type { Motivgrundlage } from "./besprechungsmotiv";
import { materialVon, ursachePasst, ursacheVon } from "./besprechungsursache";

/** Schäfermatt bis 3... Sf6?? 4. Dxf7#; Schwarz ist der Held. */
const SCHAEFER: Motivgrundlage = {
  fens: [
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
    "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    "rnbqkbnr/pppp1ppp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2",
    "r1bqkbnr/pppp1ppp/2n5/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR w KQkq - 2 3",
    "r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 3 3",
    "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4",
  ],
  sans: ["e4", "e5", "Qh5", "Nc6", "Bc4", "Nf6"],
  beste: ["e2e4", "e7e5", "g1f3", "b8c6", "f1c4", "d8e7", "h5f7"],
  varianten: [[], [], [], [], [], ["d8e7", "g1f3"], ["h5f7"]],
  verluste: [0, 0, 0, 0, 0, 100],
};

/** Weiß zieht 1. Lg5?? und stellt den Läufer gegen h6 ein; Weiß ist der Held. */
const LAEUFER: Motivgrundlage = {
  fens: ["4k3/8/7p/8/8/8/8/2B1K3 w - - 0 1", "4k3/8/7p/6B1/8/8/8/4K3 b - - 1 1"],
  sans: ["Bg5"],
  beste: ["e1e2", "h6g5"],
  varianten: [["e1e2"], ["h6g5", "e1e2"]],
  verluste: [3],
};

describe("ursacheVon", () => {
  it("nennt die stehengebliebene Mattdrohung mit dem Zug", () => {
    const ursache = ursacheVon(SCHAEFER, { index: 5, kategorie: "patzer" }, "3... Sf6");
    expect(ursache).toEqual({
      gruppe: "drohungMatt",
      werte: { drohung: "Dxf7#" },
      begriff: "matt",
    });
  });

  it("nennt die hängende Figur mit Feld", () => {
    const ursache = ursacheVon(LAEUFER, { index: 0, kategorie: "patzer" }, "1. Lg5");
    expect(ursache).toEqual({
      gruppe: "haengt",
      werte: { figur: "dein Läufer", feld: "g5" },
      begriff: "haengend",
      rolle: "bishop",
    });
  });

  it("sagt nichts zu Chancen und Lob", () => {
    expect(ursacheVon(LAEUFER, { index: 0, kategorie: "brillant" }, "1. Lg5")).toBeNull();
  });
});

describe("materialVon", () => {
  it("Fehler: Matt oder die verlorene Figur", () => {
    expect(materialVon(SCHAEFER, { index: 5, kategorie: "patzer" })).toEqual({
      art: "matt",
      richtung: "verlust",
    });
    expect(materialVon(LAEUFER, { index: 0, kategorie: "fehler" })).toEqual({
      art: "figur",
      rolle: "bishop",
      richtung: "verlust",
    });
  });

  it("Fehler des Gegners: was die beste Antwort gewinnt (Satz in der Gegenwart)", () => {
    // Aus Sicht von Schwarz: nach 1. Lg5?? gewinnt hxg5 den Läufer.
    expect(materialVon(LAEUFER, { index: 0, kategorie: "gegnerfehler" })).toEqual({
      art: "figur",
      rolle: "bishop",
      richtung: "gewinn",
      antwort: true,
    });
  });
});

describe("ursachePasst", () => {
  const bauer = {
    gruppe: "drohung",
    werte: {},
    begriff: "haengend" as const,
    rolle: "pawn" as const,
  };
  it("verwirft eine Ursache, wenn der Fehler eine schwerere andere Figur kostet", () => {
    const turm = { art: "figur", rolle: "rook", richtung: "verlust" } as const;
    expect(ursachePasst(bauer, turm)).toBe(false);
    expect(ursachePasst({ ...bauer, rolle: "rook" }, turm)).toBe(true);
    expect(ursachePasst(bauer, { art: "matt", richtung: "verlust" })).toBe(true);
    expect(ursachePasst(bauer, null)).toBe(true);
  });
});
