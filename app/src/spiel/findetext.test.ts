/**
 * Tests der Sätze der Findezeile (F1 bis F10): Jeder Fall hat einen vollständigen Satz ohne
 * offene Platzhalter, auf Deutsch und Englisch, und das richtige Thema für „Üben“.
 */
import { afterAll, describe, expect, it } from "vitest";
import type { Findetreffer } from "../analyse/findekategorien";
import { ladeSprache, setzeSprache, t } from "../i18n/sprache";
import { findesatz } from "./findetext";

const FAELLE: readonly Findetreffer[] = [
  { kennung: "F1", details: { zug: "Qh7#", mattIn: 1 } },
  { kennung: "F1", details: { zug: "Rb8+", mattIn: 2, mattbild: "grundreihe" } },
  { kennung: "F1", details: { zug: "Qc7#", mattIn: 1, mattbild: "matt" } },
  { kennung: "F1", details: { zug: "Qd8+", mattIn: 3 } },
  { kennung: "F2", details: { zug: "Qf1+", motiv: "dauerschach" } },
  { kennung: "F2", details: { zug: "Qg8+", motiv: "patt" } },
  { kennung: "F3", details: { zug: "Nc7+", feld: "c7", motiv: "gabel", gewinn: 5 } },
  { kennung: "F3", details: { zug: "Ne5", feld: "e5", motiv: "kombination", gewinn: 3 } },
  { kennung: "F4", details: { zug: "Nxe4", feld: "e4", gewinn: 1 } },
  { kennung: "F4", details: { zug: "Rxg3", feld: "g3", gewinn: 9, zurueckschlagen: true } },
  { kennung: "F5", details: { zug: "Bb5+", feld: "b5", art: "schach" } },
  { kennung: "F5", details: { zug: "Nxd5", feld: "d5", art: "schlag" } },
  { kennung: "F5", details: { zug: "d5", feld: "d5", art: "drohung" } },
  { kennung: "F6", details: { zug: "Kd4", feld: "d4", idee: "opposition" } },
  { kennung: "F6", details: { zug: "Kf7", feld: "f7", idee: "schluesselfeld" } },
  { kennung: "F7", details: { zug: "b5", feld: "b5", idee: "freibauer" } },
  { kennung: "F7", details: { zug: "e2", idee: "umwandlung" } },
  { kennung: "F7", details: { zug: "Kf5", feld: "h5", idee: "quadrat" } },
  { kennung: "F8", details: { zug: "d4", buchzug: "d4" } },
  { kennung: "F8", details: { zug: "d4", buchzug: "d4", eroeffnung: "Schottische Partie" } },
  { kennung: "F9", details: { zug: "O-O", ziel: "rochade" } },
  { kennung: "F9", details: { zug: "Nf3", ziel: "entwicklung" } },
  { kennung: "F9", details: { zug: "e4", ziel: "zentrum" } },
  { kennung: "F10", details: { zug: "Be3", feld: "c1", figur: "bishop", freieFelder: 5 } },
  { kennung: "F10", details: { zug: "Nh6", feld: "g8", figur: "knight", freieFelder: 1 } },
];

/** Alle Sätze in der gerade gewählten Sprache. */
function saetze(): string[] {
  return FAELLE.map((f) => {
    const s = findesatz(f);
    return t(s.text, s.werte);
  });
}

describe("Sätze der Findezeile", () => {
  afterAll(() => setzeSprache("de"));

  it("deutsch: vollständig, Züge in deutscher Notation", () => {
    const alle = saetze();
    for (const satz of alle) expect(satz).not.toMatch(/[{}]/);
    expect(alle[0]).toBe(
      "Dh7# setzte sofort matt. Schach vor Schlag: Wer Schachs zuerst prüft, findet solche Matts.",
    );
    expect(alle[1]).toContain("Grundreihenmatt");
    // Das allgemeine „Matt“ ist kein Mattbild: kein „Ein Mattbild aus Kapitel 7: Matt.“
    expect(alle[2]).not.toContain("Mattbild");
    expect(alle.at(-1)).toContain("nur ein freies Feld");
  });

  it("englisch: vollständig", async () => {
    await ladeSprache("en");
    setzeSprache("en");
    for (const satz of saetze()) expect(satz).not.toMatch(/[{}]/);
  });

  it("Themen für „Üben“: Gabel → Doppelangriff, Schlüsselfeld, Freibauer, sonst die Tabelle", () => {
    const thema = (i: number) => {
      const fall = FAELLE[i];
      return fall ? findesatz(fall).thema : undefined;
    };
    expect(thema(6)).toBe("taktik:doppelangriff");
    expect(thema(7)).toBeNull();
    expect(thema(14)).toBe("endspiel:schluesselfelder");
    expect(thema(15)).toBe("endspiel:freibauer");
    expect(thema(0)).toBe("taktik:mattbilder");
  });
});
