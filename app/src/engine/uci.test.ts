/** Tests für das Lesen der Engine-Ausgaben und die Bewertung in Worten (Konzept 8.1). */
import { describe, expect, it } from "vitest";
import { leseBesterZug, leseInfozeile } from "./uci";
import { wertAlsZahl, wertInWorten } from "./wertInWorten";

describe("leseInfozeile", () => {
  it("liest Tiefe, Variante und Wert", () => {
    const info = leseInfozeile(
      "info depth 12 seldepth 18 multipv 2 score cp 34 nodes 1000 nps 250000 time 4 pv e2e4 e7e5",
      true,
    );
    expect(info).toEqual({
      tiefe: 12,
      knotenJeSekunde: 250000,
      variante: { nummer: 2, wert: { art: "bauern", bauern: 0.34 }, zuege: ["e2e4", "e7e5"] },
    });
  });

  it("dreht den Wert, wenn Schwarz am Zug ist", () => {
    const info = leseInfozeile("info depth 5 score cp -25 pv c5d4", false);
    expect(info?.variante.wert).toEqual({ art: "bauern", bauern: 0.25 });
  });

  it("liest Matt aus Sicht von Weiß", () => {
    expect(leseInfozeile("info depth 5 score mate 2 pv d1h5", false)?.variante.wert).toEqual({
      art: "matt",
      zuege: -2,
    });
  });

  it("übergeht Zwischenstände und Zeilen ohne Variante", () => {
    expect(leseInfozeile("info depth 5 score cp 10 lowerbound pv e2e4", true)).toBeNull();
    expect(leseInfozeile("info string NNUE evaluation", true)).toBeNull();
  });
});

describe("leseBesterZug", () => {
  it("liest den Zug, (none) und andere Zeilen", () => {
    expect(leseBesterZug("bestmove e2e4 ponder e7e5")).toBe("e2e4");
    expect(leseBesterZug("bestmove (none)")).toBeNull();
    expect(leseBesterZug("readyok")).toBeUndefined();
  });
});

describe("wertInWorten", () => {
  it.each([
    [0.25, "ausgeglichen", "+0,25"],
    [0.5, "Weiß steht leicht besser", "+0,50"],
    [-1.4, "Schwarz steht deutlich besser", "−1,40"],
    [3.1, "Weiß steht auf Gewinn", "+3,10"],
  ])("%d Bauern", (bauern, worte, zahl) => {
    expect(wertInWorten({ art: "bauern", bauern })).toBe(worte);
    expect(wertAlsZahl({ art: "bauern", bauern })).toBe(zahl);
  });

  it("Matt", () => {
    expect(wertInWorten({ art: "matt", zuege: -3 })).toBe("Matt in 3 für Schwarz");
    expect(wertAlsZahl({ art: "matt", zuege: 2 })).toBe("#2");
  });
});
