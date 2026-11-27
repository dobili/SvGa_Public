/**
 * Der schwache Spieler des Durchlaufs (schwach.ts): verliert den ersten Versuch jeder Partie und
 * Runde, die Arten reihum, die Wegsperre S17 dreimal (Notausgang), und merkt sich alles in
 * schwach.json über ein Neuladen hinweg.
 */
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { Knopf } from "./lage";
import { eigeneZuege, Schwaechling, schwaechsterZug } from "./schwach";

const ordner = () => mkdtempSync(join(tmpdir(), "schwach-"));
const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const knopf = (text: string): Knopf => ({ text }) as Knopf;

describe("schwacher Spieler", () => {
  it("verliert den ersten Versuch, spielt den zweiten normal, die Arten reihum", () => {
    const s = new Schwaechling(ordner(), true);
    expect(s.partie("p1", "mapleFalls.rosa").art).toBe("schwach");
    // Die App hängt die Partie an die Kennung an; zählt trotzdem als dieselbe Begegnung.
    expect(s.partie("p2", "mapleFalls.rosa#zweite").art).toBeNull();
    expect(s.partie("p3", "mapleFalls.victor").art).toBe("aufgeben");
    expect(s.partie("p4", "riverton.slick").art).toBe("neuladen");
    expect(s.partie("p5", "riverton.ray").art).toBe("zurueckAufgeben");
    // Dieselbe Partie (nach dem Neuladen) behält ihre Entscheidung.
    expect(s.partie("p4", "riverton.slick").art).toBe("neuladen");
  });

  it("verliert die Wegsperre S17 dreimal (Notausgang)", () => {
    const s = new Schwaechling(ordner(), true);
    const arten = ["a", "b", "c", "d"].map(
      (id) => s.partie(id, `wegDesertSummit.testteam#${id}`).art,
    );
    expect(arten.slice(0, 3).every((a) => a !== null)).toBe(true);
    expect(arten[3]).toBeNull();
  });

  it.each(["portDelacroix.clubkampf", "capitalArena.runde1"])(
    "verliert %s dreimal (Notausgang Miss Odile, Nachspielregel der Vorrunde)",
    (begegnung) => {
      const s = new Schwaechling(ordner(), true);
      const arten = ["a", "b", "c", "d"].map((id) => s.partie(id, `${begegnung}#${id}`).art);
      expect(arten.slice(0, 3).every((a) => a !== null)).toBe(true);
      expect(arten[3]).toBeNull();
    },
  );

  it("ohne Schalter spielt er normal", () => {
    expect(new Schwaechling(ordner(), false).partie("p1", "mapleFalls.rosa").art).toBeNull();
  });

  it("merkt sich Runde und Neuladen in der Datei; Abbrechen beendet den Versuch", () => {
    const o = ordner();
    const s = new Schwaechling(o, true);
    expect(s.runde("mapleFalls.reiheJuno").art).toBe("falsch");
    s.rundeVorbei();
    expect(s.runde("mapleFalls.reiheSam").art).toBe("zurueckAbbrechen");
    s.neuladen(null, "abbrechen");
    const nachher = new Schwaechling(o, true);
    expect(nachher.runde("mapleFalls.reiheSam")).toEqual({
      kennung: "mapleFalls.reiheSam",
      art: "zurueckAbbrechen",
      neugeladen: true,
    });
    const karte = [knopf("Weitermachen"), knopf("Runde abbrechen")];
    expect(nachher.fortsetzung(karte)?.text).toBe("Runde abbrechen");
    expect(nachher.fortsetzung(karte)).toBeUndefined();
    expect(nachher.runde("mapleFalls.reiheSam").art).toBeNull();
  });

  it("nach dem Neuladen mit „weiter“ tippt er Weiterspielen", () => {
    const s = new Schwaechling(ordner(), true);
    s.partie("p1", "mapleFalls.rosa");
    s.neuladen("p1", "weiter");
    const karte = [knopf("Weiterspielen"), knopf("Aufgeben und hierbleiben")];
    expect(s.fortsetzung(karte)?.text).toBe("Weiterspielen");
    expect(s.partie("p1", "mapleFalls.rosa").neugeladen).toBe(true);
  });

  it("zählt eigene Züge nach Farbe und Zugrecht und nimmt den schwächsten Zug", () => {
    const p = { id: "p", kennung: "k", startFen: START, zuege: ["e4", "e5", "Nf3"] };
    expect(eigeneZuege({ ...p, eigeneFarbe: "white" })).toBe(2);
    expect(eigeneZuege({ ...p, eigeneFarbe: "black" })).toBe(1);
    const liste = [
      { uci: "e2e4", wert: 0.3 },
      { uci: "g2g4", wert: -1.2 },
    ];
    expect(schwaechsterZug(liste)).toBe("g2g4");
    expect(schwaechsterZug([])).toBeUndefined();
  });
});
