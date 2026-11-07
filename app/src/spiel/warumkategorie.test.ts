/**
 * Tests der Warum-Kategorien (Konzept „Fehler mit Buchbezug“ 3.1 und 4.1) an Stellungen aus dem
 * Buch und kleinen Lehrstellungen: Zuordnung, Priorität, Phasengrenzen, Satz und Fundstelle.
 */
import { describe, expect, it } from "vitest";
import { t } from "../i18n/sprache";
import { BUCHBEZUG } from "./buchbezug";
import { warumKategorie, type Warumbefund, type Warumeingabe } from "./warumkategorie";

/** Abb. 1.13 nach 2. Dh5, Schwarz am Zug: Weiß droht Dxe5+. */
const NACH_DH5 = "rnbqkbnr/pppp1ppp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2";
/** Schäfermatt-Stellung nach 3. Dh5, Schwarz am Zug: Dxf7 droht matt. */
const SCHAEFERMATT = "r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 3 3";

/** Prüft eine Stellung mit Standardwerten. */
function warum(eingabe: Partial<Warumeingabe> & Pick<Warumeingabe, "vorherFen" | "uci">) {
  return warumKategorie({ widerlegung: [], verlust: 2, bester: null, ...eingabe });
}

/** Der Satz eines Befunds in der Sprache der App. */
function satz(w: Warumbefund | null): string {
  return w ? t(w.text, w.werte) : "";
}

describe("Warum-Kategorien", () => {
  it("W2: Eine Mattdrohung bleibt stehen (3... Sf6?? gegen Dxf7#)", () => {
    const w = warum({ vorherFen: SCHAEFERMATT, uci: "g8f6", widerlegung: ["h5f7"], verlust: 99 });
    expect(w?.kennung).toBe("W2");
    expect(satz(w)).toContain("Nach deinem Zug setzt Dxf7# matt.");
    expect(t(w?.quelle ?? "buchbezug.W2.quelle")).toBe("Kapitel 12, Sicherheitsblick");
  });

  it("W2 auch, wenn erst die Widerlegung matt setzt (Opernpartie, 14... De6?? Lxd7+ …)", () => {
    const vor = "1n2kb1r/p2rqppp/5n2/1B2p1B1/4P3/1Q6/PPP2PPP/2KR4 b k - 1 14";
    const w = warum({
      vorherFen: vor,
      uci: "e7e6",
      widerlegung: ["b5d7", "f6d7", "b3b8", "d7b8", "d1d8"],
    });
    expect(w?.kennung).toBe("W2");
    expect(satz(w)).toContain("Lxd7+ zum Matt");
  });

  it("W3: Abb. 1.13, 2... Sf6?? lässt Dxe5+ stehen, Üben im Schach-Röntgen-Trainer", () => {
    const w = warum({ vorherFen: NACH_DH5, uci: "g8f6", widerlegung: ["h5e5"], bester: "b8c6" });
    expect(w?.kennung).toBe("W3");
    expect(satz(w)).toBe(
      "Die Drohung Dxe5+ stand schon vor deinem Zug, und sie steht danach noch. Die Röntgen-Regel fragt: Was droht mein Gegner?",
    );
    expect(BUCHBEZUG.W3.trainer).toBe("roentgen");
  });

  it("W4: Die gezogene Figur hängt (2... La3?? bxa3) mit dem Sicherheitsblick", () => {
    const vor = "rnbqkbnr/pppp1ppp/8/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq - 1 2";
    const w = warum({ vorherFen: vor, uci: "f8a3", widerlegung: ["b2a3"], verlust: 3 });
    expect(w?.kennung).toBe("W4");
    expect(satz(w)).toContain("Danach hängt die gezogene Figur, Läufer a3.");
  });

  it("W5 vor W4: Sxd5?? schlägt, die Abtauschbilanz auf d5 kostet den Springer", () => {
    const vor = "r2q1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R2Q1RK1 w - - 0 11";
    const w = warum({ vorherFen: vor, uci: "c3d5", widerlegung: ["e6d5"] });
    expect(w?.kennung).toBe("W5");
    expect(satz(w)).toContain("Der Schlag auf d5 kostet Material.");
    expect(BUCHBEZUG.W5.trainer).toBe("zaehlen");
  });

  it("W7: Dd6?? in die Springergabel öffnet den Taktiktrainer beim Doppelangriff", () => {
    const vor = "5r1k/5ppp/q7/6N1/8/8/8/6K1 b - - 0 1";
    const w = warum({ vorherFen: vor, uci: "a6d6", widerlegung: ["g5f7", "h8g8", "f7d6"] });
    expect(w?.kennung).toBe("W7");
    expect(w?.thema).toBe("taktik:doppelangriff");
    expect(t(w?.quelle ?? "buchbezug.W7.quelle")).toBe("Kapitel 7, Doppelangriff und Gabel");
  });

  it("W8 und W9 nur ohne taktischen Grund: Abb. 1.8, 3... Df6; 3... a6?? gegen Dxf7#", () => {
    const vor = "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3";
    expect(warum({ vorherFen: vor, uci: "d8f6", verlust: 1 })?.kennung).toBe("W8");
    // 3... a6?? wäre ein Bauernzug ohne Not, lässt aber Dxf7# zu: W2 statt der Faustregel W9.
    expect(warum({ vorherFen: SCHAEFERMATT, uci: "a7a6", widerlegung: ["h5f7"] })?.kennung).toBe(
      "W2",
    );
  });

  it("W9 nicht für einen Bauernzug ins Zentrum in der Eröffnung", () => {
    const start = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    expect(warum({ vorherFen: start, uci: "e2e4", verlust: 1 })).toBeNull();
    expect(warum({ vorherFen: start, uci: "h2h4", verlust: 1 })?.kennung).toBe("W9");
  });

  it("W10 Patt weit vorn, die übrigen Endspielregeln nur im Endspiel", () => {
    const patt = warum({ vorherFen: "7k/5K2/8/6Q1/8/8/8/8 w - - 0 1", uci: "g5g6", verlust: 9 });
    expect(patt?.kennung).toBe("W10");
    expect(t(patt?.quelle ?? "buchbezug.W10.quelle")).toBe("Kapitel 8, Pattfalle");
    const passiv = warum({
      vorherFen: "8/5k2/8/8/8/8/1K3P2/8 w - - 0 1",
      uci: "b2a3",
      widerlegung: ["f7f6"],
      verlust: 1,
      bester: "b2c3",
    });
    expect(passiv?.kennung).toBe("W10");
    expect(satz(passiv)).toContain("Im Endspiel ist der König eine Figur");
  });

  it("ohne Regel und bei unlesbarer Stellung keine Kategorie", () => {
    expect(warum({ vorherFen: NACH_DH5, uci: "b8c6", verlust: 0 })).toBeNull();
    expect(warum({ vorherFen: "unsinn", uci: "e2e4" })).toBeNull();
    expect(warum({ vorherFen: NACH_DH5, uci: "e2e4" })).toBeNull();
  });
});
