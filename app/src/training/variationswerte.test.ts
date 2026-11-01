/**
 * Tests der Engine-Werte im Variantenbaum (Stufe 3): offene Stellungen, Eintragen, nur geänderte
 * Züge neu, Endstellungen, Werte aus einer fremden PGN ohne besten Zug.
 */
import { describe, expect, it } from "vitest";
import { fenAm } from "../schach/variationsbaum";
import type { Variation, Variationsknoten } from "./variationen";
import { ausPartie, ausStellung, linieAlsKnoten } from "./variationsquellen";

import {
  baumstellungen,
  bewertungsstand,
  ergebnisseAusPartie,
  hatWerte,
  istBewertet,
  mitWerten,
  offeneStellungen,
  type Engineergebnis,
} from "./variationswerte";

const JETZT = new Date("2026-11-01T10:00:00.000Z");
const GRUND = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** Grundstellung mit 1. e4 e5 und dem Abzweig 1... c5. */
function petroffArtig(): Variation {
  const v = ausStellung("grund", GRUND, "Test", JETZT);
  if (!v) throw new Error("keine Grundstellung");
  const haupt = linieAlsKnoten(GRUND, ["e4", "e5"], undefined).knoten;
  const e4 = haupt[0];
  if (!e4) throw new Error("kein e4");
  const c5: Variationsknoten = { zug: "c5", weiter: [] };
  return { ...v, id: "var-1", zuege: [{ ...e4, weiter: [...e4.weiter, c5] }] };
}

/** Ein Ergebnis je Stellung mit fortlaufendem Wert. */
function alleErgebnisse(v: Variation): Map<string, Engineergebnis> {
  return new Map(baumstellungen(v).map((s, i) => [s.fen, { w: i * 10, b: "g1f3", a: 5 }]));
}

describe("Werte im Variantenbaum", () => {
  it("kennt alle Stellungen in Lesereihenfolge und alle als offen", () => {
    const v = petroffArtig();
    expect(baumstellungen(v).map((s) => s.pfad.join(" "))).toEqual(["", "e4", "e4 e5", "e4 c5"]);
    expect(offeneStellungen(v)).toHaveLength(4);
    expect(bewertungsstand(v)).toEqual({ bewertet: 0, gesamt: 4 });
    expect(hatWerte(v)).toBe(false);
  });

  it("trägt Ergebnisse ein; danach ist nichts mehr offen und nichts ändert sich mehr", () => {
    const v = petroffArtig();
    const ergebnisse = alleErgebnisse(v);
    const mit = mitWerten(v, ergebnisse);
    expect(offeneStellungen(mit)).toEqual([]);
    expect(mit.start).toMatchObject({ w: 0, b: "g1f3", a: 5 });
    expect(mit.zuege[0]?.weiter[1]).toMatchObject({ zug: "c5", w: 30 });
    // Gleiches Objekt, wenn nichts zu tun ist (dann wird nicht gespeichert).
    expect(mitWerten(mit, ergebnisse)).toBe(mit);
    expect(hatWerte(mit)).toBe(true);
  });

  it("nach einer Änderung ist nur der neue Zug offen", () => {
    const mit = mitWerten(petroffArtig(), alleErgebnisse(petroffArtig()));
    const e4 = mit.zuege[0];
    if (!e4) throw new Error("kein e4");
    const neu = { ...mit, zuege: [{ ...e4, weiter: [...e4.weiter, { zug: "e6", weiter: [] }] }] };
    const offen = offeneStellungen(neu);
    expect(offen).toEqual([fenAm(neu, ["e4", "e6"])]);
  });

  it("ein Wert ohne besten Zug (fremde PGN) zählt als offen und wird überschrieben", () => {
    const v = { ...petroffArtig(), start: { w: 99 } };
    expect(istBewertet(v.start, GRUND)).toBe(false);
    const mit = mitWerten(v, alleErgebnisse(v));
    expect(mit.start).toMatchObject({ w: 0, b: "g1f3" });
  });

  it("eine Mattstellung braucht keinen besten Zug", () => {
    const matt = "rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3";
    expect(istBewertet({ w: -1000 }, matt)).toBe(true);
    expect(istBewertet({ w: -1000 }, GRUND)).toBe(false);
  });

  it("gleiche Stellungen auf zwei Wegen zählen einmal", () => {
    const v = ausStellung("grund", GRUND, "Test", JETZT);
    if (!v) throw new Error("keine Grundstellung");
    const a = linieAlsKnoten(GRUND, ["Nf3", "Nf6", "Nc3"], undefined).knoten;
    const b = linieAlsKnoten(GRUND, ["Nc3", "Nf6", "Nf3"], undefined).knoten;
    const baum = { ...v, zuege: [...a, ...b] };
    expect(baumstellungen(baum)).toHaveLength(7);
    // Startstellung, 2 × 1. Zug, 2 × 2. Zug, 1 gemeinsame Stellung nach dem 3. Zug.
    expect(offeneStellungen(baum)).toHaveLength(6);
  });
});

describe("Werte aus einer ausgewerteten Partie (1.11.2026)", () => {
  it("übernimmt die gespeicherten Werte, sodass die Analyse nichts mehr rechnen muss", () => {
    const partie = { id: "p", startFen: GRUND, zuege: ["e4", "e5"] };
    const v = ausPartie(partie, 0, "Partie", new Date(2026, 10, 1));
    if (!v) throw new Error("Variante");
    const fens = baumstellungen(v).map((s) => s.fen);
    expect(offeneStellungen(v)).toHaveLength(3);
    const werte = ergebnisseAusPartie(fens, [0.3, 0.25, 0.2], ["e2e4", "e7e5", "g1f3"], [0.1, 0, 0]);
    const mit = mitWerten(v, werte);
    expect(offeneStellungen(mit)).toEqual([]);
    expect(mit.start).toMatchObject({ w: 30, b: "e2e4", a: 10 });
  });

  it("übernimmt nichts, wenn die Partie nicht (vollständig) ausgewertet ist", () => {
    expect(ergebnisseAusPartie(["a", "b"], [], [], []).size).toBe(0);
    expect(ergebnisseAusPartie(["a", "b"], [0.1], ["e2e4"], []).size).toBe(0);
  });
});
