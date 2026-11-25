/**
 * Tests der Materialbilanz der Besprechung (besprechungsmaterial.ts): Figur statt Bauerneinheiten,
 * nur bei ruhigem Ende der Folge, Matt geht vor.
 */
import { describe, expect, it } from "vitest";
import { materialfolge } from "./besprechungsmaterial";

/** Schäfermatt-Stellung vor 3... Sf6 (Schwarz am Zug). */
const VOR_SF6 = "r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 3 3";
/** Weiß am Zug; Lg5?? stellt den Läufer gegen h6 ein. */
const LAEUFER = "4k3/8/7p/8/8/8/8/2B1K3 w - - 0 1";
/** Weiß am Zug; Txa8 Lxa8 gibt den Turm für den Springer: eine Qualität, kein ganzer Turm. */
const QUALITAET = "n3k3/1b6/8/8/8/8/8/R3K3 w - - 0 1";

describe("materialfolge", () => {
  it("meldet das Matt nach dem Patzer als Verlust", () => {
    expect(materialfolge(VOR_SF6, ["g8f6", "h5f7"], "black", "verlust")).toEqual({
      art: "matt",
      richtung: "verlust",
    });
    expect(materialfolge(VOR_SF6, ["g8f6", "h5f7"], "black", "gewinn")).toBeNull();
  });

  it("nennt die verlorene Figur nur, wenn die Folge ruhig endet", () => {
    const folge = ["c1g5", "h6g5", "e1e2"];
    expect(materialfolge(LAEUFER, folge, "white", "verlust")).toEqual({
      art: "figur",
      rolle: "bishop",
      richtung: "verlust",
    });
    // Endet die Folge mit dem Schlag, fehlt vielleicht das Zurückschlagen: dann kein Satz.
    expect(materialfolge(LAEUFER, folge.slice(0, 2), "white", "verlust")).toBeNull();
    expect(materialfolge(LAEUFER, folge, "black", "gewinn")).toEqual({
      art: "figur",
      rolle: "bishop",
      richtung: "gewinn",
    });
  });

  it("gibt keinen Satz, wenn die Folge mitten im Abtausch endet", () => {
    // Txa8 Lxa8: Die Folge endet mit dem Schlag; was am Ende fehlt, ist offen.
    expect(materialfolge(QUALITAET, ["a1a8", "b7a8"], "white", "verlust")).toBeNull();
  });

  it("gibt bei einer Qualität keinen Satz", () => {
    expect(materialfolge(QUALITAET, ["a1a8", "b7a8", "e1e2"], "white", "verlust")).toBeNull();
  });
});
