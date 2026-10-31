/**
 * Tests der Eignungsprüfung (Nebenchat, 30.10.2026): die Bausteine an kleinen Stellungen, die
 * Regeln je Trainer an den Fällen des Autors und eine Vollprüfung, dass kein Trainer eine
 * Aufgabe stellt, die seine eigenen Regeln ausschließen.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ladeKapitel } from "../schach/buchabbildungen.testhilfe";
import { stellungAusFen, type Stellung } from "../schach/stellung";
import { buchstellungenAus } from "./buchstellungen";
import { denkaufgabe } from "./denkroutinetrainer";
import { ausschlussgruende, fenGeeignet, geeignet, hatEigenschaft } from "./eignung";
import { faktorenaufgabe } from "./faktorentrainer";
import { lapaufgabe, planaufgaben, rennaufgabe } from "./planbilanztrainer";
import { roentgenaufgabe } from "./roentgentrainer";
import { zielbilanzaufgabe } from "./zielbilanztrainer";
import { festerZufall } from "./zufall";

const KAPITELZAHL = 13;
const stellungen = buchstellungenAus(Array.from({ length: KAPITELZAHL }, (_, i) => ladeKapitel(i)));
/** Weiß ist matt (Fallenstellung aus dem Zähltrainer). */
const MATT = "r1b1kbnr/pppp1Npp/8/8/4q3/5n2/PPPPBP1P/RNBQKR2 w Qkq - 0 1";
/** Schwarz am Zug, Springer e7 gefesselt und angegriffen (LAP-Befund des Autors). */
const GEFESSELT = "1r2k1r1/pbppnp1p/1bn2P2/7q/Q7/B1PB1N2/P4PPP/3RR1K1 b - - 0 1";
/** Patt: Schwarz am Zug, König a8, weiße Dame b6. */
const PATT = "k7/8/1Q6/8/8/8/8/7K b - - 0 1";
/** Ein Lehrbild ohne Könige (wie Abb. 1.26-Ausschnitte). */
const LEHRBILD = "8/8/8/3p4/4P3/8/8/8 w - - 0 1";
const GLEICHE_WIEDERHOLUNG = 1;

function s(fen: string): Stellung {
  const g = stellungAusFen(fen);
  if (!g.ok) throw new Error(g.fehler);
  return g.wert;
}

describe("Eignung: Bausteine", () => {
  it("erkennt Matt, Patt, Schach und Lehrbilder", () => {
    expect(hatEigenschaft(s(MATT), "imSchach")).toBe(true);
    expect(hatEigenschaft(s(MATT), "partieZuEnde")).toBe(true);
    expect(hatEigenschaft(s(PATT), "partieZuEnde")).toBe(true);
    expect(hatEigenschaft(s(PATT), "imSchach")).toBe(false);
    expect(hatEigenschaft(s(LEHRBILD), "ohneRegeln")).toBe(true);
    expect(hatEigenschaft(s(LEHRBILD), "nurBauern")).toBe(true);
  });

  it("erkennt hängende und gefesselte eigene Figuren", () => {
    expect(hatEigenschaft(s(GEFESSELT), "eigeneGefesselt")).toBe(true);
    expect(hatEigenschaft(s(GEFESSELT), "eigeneHaengt")).toBe(true);
  });

  it("unterscheidet Bauern- und Figurengewinn", () => {
    // Weiß kann den ungedeckten Springer e5 mit dem Bauern d4 schlagen.
    const fen = "4k3/8/8/4n3/3P4/8/8/4K3 w - - 0 1";
    expect(hatEigenschaft(s(fen), "materialGewinnbar")).toBe(true);
    expect(hatEigenschaft(s(fen), "figurGewinnbar")).toBe(true);
  });
});

describe("Eignung: Regeln je Trainer", () => {
  it("Schach: in der Denkroutine erlaubt, in der Zielbilanz nicht", () => {
    // Dame a1 gibt Schach; Ke2 oder der Springer c3 deckt auf b1 oder d1 ab.
    const imSchach = s("4k3/8/8/8/8/2N5/3P1P2/q3K3 w - - 0 1");
    expect(geeignet("denkroutine", imSchach)).toBe(true);
    expect(ausschlussgruende("zielbilanz", imSchach)).toContain("imSchach");
  });

  it("Lehrbilder ohne Könige nur beim Zählen", () => {
    expect(geeignet("zaehlen", s(LEHRBILD))).toBe(true);
    expect(geeignet("roentgen", s(LEHRBILD))).toBe(false);
  });

  it("die LAP-Stellung des Autors fällt in LAP und Planfragen weg", () => {
    expect(geeignet("lap", s(GEFESSELT))).toBe(false);
    expect(geeignet("planfragen", s(GEFESSELT))).toBe(false);
    expect(fenGeeignet("gangarten", GEFESSELT)).toBe(true);
  });
});

describe("Eignung: Vollprüfung der Trainer an allen Buchstellungen", () => {
  const pruefe = (art: Parameters<typeof fenGeeignet>[0], fens: readonly string[]) =>
    fens.filter((f) => !fenGeeignet(art, f));

  it("keine Aufgabe verletzt die Regeln ihres Trainers", { timeout: 60_000 }, () => {
    const z = festerZufall(GLEICHE_WIEDERHOLUNG);
    expect(pruefe("zielbilanz", stellungen.flatMap((b) => zielbilanzaufgabe(b)?.fen ?? []))).toEqual([]);
    expect(pruefe("faktorenbilanz", stellungen.flatMap((b) => faktorenaufgabe(b)?.fen ?? []))).toEqual([]);
    expect(pruefe("lap", stellungen.flatMap((b) => lapaufgabe(b)?.fen ?? []))).toEqual([]);
    expect(pruefe("wettrennen", stellungen.flatMap((b) => rennaufgabe(b)?.fen ?? []))).toEqual([]);
    expect(pruefe("denkroutine", stellungen.flatMap((b) => denkaufgabe(b)?.fen ?? []))).toEqual([]);
    expect(pruefe("roentgen", stellungen.flatMap((b) => roentgenaufgabe(b)?.fen ?? []))).toEqual([]);
    const gerechnet = planaufgaben(stellungen, z).filter((a) => !a.warum);
    expect(pruefe("planfragen", gerechnet.map((a) => a.fen))).toEqual([]);
  });

  it("die Datentrainer (Falle, Endspiel) haben keine Matt-, Patt- oder Schachfehler", () => {
    for (const [name, art] of [
      ["falle", "falle"],
      ["endspiel", "endspiel"],
    ] as const) {
      const datei = new URL(`../../../inhalte/de/trainer/${name}.json`, import.meta.url);
      const d = JSON.parse(readFileSync(datei, "utf8")) as { aufgaben: { fen: string }[] };
      expect(pruefe(art, d.aufgaben.map((a) => a.fen))).toEqual([]);
    }
  });

  it("jeder Trainer behält genug Aufgaben", () => {
    expect(stellungen.flatMap((b) => zielbilanzaufgabe(b) ?? []).length).toBeGreaterThan(80);
    expect(stellungen.flatMap((b) => lapaufgabe(b) ?? []).length).toBeGreaterThan(12);
    expect(stellungen.flatMap((b) => denkaufgabe(b) ?? []).length).toBeGreaterThan(100);
  });
});
