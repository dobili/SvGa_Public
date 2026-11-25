/**
 * Tests für Nebelschach: Zuglogik ohne Schach (freistellung.ts), Sicht und Ende (nebel.ts), Bot
 * (nebelbot.ts) mit einer Attrappe der Engine.
 */
import { describe, expect, it } from "vitest";
import { parseSquare } from "chessops/util";
import { alsFen, alsUci, ausFen, ausUci, freizuege, type Freizug } from "./freistellung";
import { neueNebelpartie, sicht, sichtstellung, spieleNebelzug, type Nebelpartie } from "./nebel";
import { waehle, type Botstil, type Zugbewerter } from "./botwahl";
import { nebelbotZug, neuesGedaechtnis } from "./nebelbot";

const feld = (name: string) => parseSquare(name) as number;
const zug = (uci: string) => ausUci(uci) as Freizug;
const spiele = (p: Nebelpartie, ...zuege: string[]) =>
  zuege.reduce((q, z) => spieleNebelzug(q, zug(z), z), p);
const stil: Botstil = { varianten: 3, spielraumCp: 50, zufall: () => 0 };

describe("Zuglogik ohne Schach", () => {
  it("Grundstellung: 20 Züge, FEN unverändert zurück", () => {
    const s = ausFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    expect(freizuege(s)).toHaveLength(20);
    expect(alsFen(s)).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  });

  it("der König darf ins Schach ziehen (Schachzüge zählen nicht)", () => {
    const s = ausFen("4k3/8/8/8/8/8/3r4/4K3 w - - 0 1");
    expect(freizuege(s).map(alsUci)).toContain("e1d1");
  });

  it("Rochade auch aus dem Schach, Turm geht mit", () => {
    const p = neueNebelpartie("4k3/8/8/8/8/8/4r3/4K2R w K - 0 1");
    const q = spiele(p, "e1g1");
    expect(q.stellung.brett.get(feld("f1"))?.role).toBe("rook");
    expect(q.stellung.rochaden.isEmpty()).toBe(true);
  });

  it("en passant schlägt den Bauern neben sich", () => {
    const p = spiele(neueNebelpartie(), "e2e4", "a7a6", "e4e5", "d7d5", "e5d6");
    expect(p.stellung.brett.has(feld("d5"))).toBe(false);
  });
});

describe("Nebel: Sicht und Ende", () => {
  it("Grundstellung: Weiß sieht die Reihen 1 bis 4", () => {
    const s = neueNebelpartie().stellung;
    expect(sicht(s, "white").size()).toBe(32);
    expect(sicht(s, "white").has(feld("e5"))).toBe(false);
  });

  it("ein Läufer sieht bis zur ersten Figur, nicht dahinter", () => {
    const s = ausFen("4k3/8/5p2/8/3B4/8/8/4K3 w - - 0 1");
    expect(sicht(s, "white").has(feld("f6"))).toBe(true);
    expect(sicht(s, "white").has(feld("g7"))).toBe(false);
  });

  it("wer den König schlägt, gewinnt", () => {
    const p = spiele(neueNebelpartie("4k3/8/8/8/8/8/4q3/4K3 b - - 0 1"), "e2e1");
    expect(p.ende).toEqual({ sieger: "black", grund: "koenigGeschlagen" });
  });

  it("die Sichtstellung zeigt nur Sichtbares und den König, wo er zuletzt stand", () => {
    const s = ausFen("4k3/7p/8/8/8/8/8/R3K3 w - - 0 1");
    const v = sichtstellung(s, "white", feld("e8"));
    expect(v.brett.has(feld("h7"))).toBe(false);
    expect(v.brett.get(feld("e8"))?.role).toBe("king");
  });
});

describe("Nebelbot", () => {
  it("schlägt einen erreichbaren König ohne Engine", async () => {
    const p = neueNebelpartie("4k3/8/8/8/8/8/4q3/4K3 b - - 0 1");
    const nie: Zugbewerter = () => Promise.reject(new Error("nicht fragen"));
    expect(alsUci(await nebelbotZug(p, neuesGedaechtnis("black"), nie, stil))).toBe("e2e1");
  });

  it("die Engine bekommt nur die Sichtstellung, nicht die versteckte Dame", async () => {
    let gesehen = "";
    const bewerter: Zugbewerter = (fen) => {
      gesehen = fen;
      return Promise.resolve([{ zug: "a1a2", wert: 0 }]);
    };
    const p = neueNebelpartie("3qk3/8/8/8/8/8/8/R3K3 w - - 0 1");
    await nebelbotZug(p, neuesGedaechtnis("white"), bewerter, stil);
    expect(gesehen.startsWith("4k3/")).toBe(true);
  });

  it("nimmt keinen Zug, der nach den Nebelregeln nicht geht, sondern einen Notzug", async () => {
    const bewerter: Zugbewerter = () => Promise.resolve([{ zug: "a1a8", wert: 90 }]);
    const p = neueNebelpartie("4k3/8/8/8/8/8/P7/R3K3 w - - 0 1");
    const z = await nebelbotZug(p, neuesGedaechtnis("white"), bewerter, stil);
    expect(alsUci(z)).not.toBe("a1a8");
  });

  it("wählt nur unter Zügen im Spielraum", () => {
    const liste = [
      { zug: "a", wert: 100 },
      { zug: "b", wert: 80 },
      { zug: "c", wert: -200 },
    ];
    expect(waehle(liste, { ...stil, zufall: () => 0.99 })).toBe(1);
  });
});

describe("Stil der Varianten-Bots", () => {
  it("schwächer heißt größerer Spielraum", async () => {
    const { botstilFuer } = await import("./botwahl");
    expect(botstilFuer(600).spielraumCp).toBe(250);
    expect(botstilFuer(2400).spielraumCp).toBe(15);
    expect(botstilFuer(1200).spielraumCp).toBeGreaterThan(botstilFuer(1600).spielraumCp);
  });
});
