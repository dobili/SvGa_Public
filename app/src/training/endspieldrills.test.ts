/**
 * Tests der Endspiel-Kurzübungen (training/endspieldrills.ts): legale Stellungen, Antworten wie
 * die Bausteine der Werkzeuge aus Kapitel 8 und 9, beide Antworten kommen vor.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { hatOpposition } from "../schach/opposition";
import { stellungAusFen } from "../schach/stellung";
import {
  bilddrills,
  drillrunde,
  fenAus,
  oppositionsdrill,
  quadratdrill,
  schluesseldrill,
} from "./endspieldrills";

/** Fester Zufall für wiederholbare Tests (lineare Kongruenz). */
function saat(start: number): () => number {
  let x = start;
  return () => {
    x = (x * 1103515245 + 12345) % 2147483648;
    return x / 2147483648;
  };
}

const ENDSPIEL = JSON.parse(
  readFileSync(new URL("../../../inhalte/de/trainer/endspiel.json", import.meta.url), "utf-8"),
) as { aufgaben: { fen: string }[] };

describe("Endspiel-Kurzübungen", () => {
  it("fenAus schreibt eine lesbare FEN", () => {
    expect(fenAus(new Map([[4, "K"], [60, "k"], [12, "P"]]), "white")).toBe(
      "4k3/8/8/8/8/8/4P3/4K3 w - - 0 1",
    );
  });

  it("Quadrat: legale Stellungen, „ja“ und „nein“ kommen vor, das Quadrat leuchtet", () => {
    const zufall = saat(7);
    const antworten = new Set<string>();
    for (let i = 0; i < 40; i++) {
      const d = quadratdrill(zufall);
      expect(d).not.toBeNull();
      if (!d) continue;
      expect(stellungAusFen(d.fen).ok).toBe(true);
      expect(d.optionen).toContain(d.richtig);
      expect(d.loesungsfelder.length).toBeGreaterThan(0);
      antworten.add(d.richtig);
    }
    expect([...antworten].sort()).toEqual(["ja", "nein"]);
  });

  it("Opposition: Antwort wie hatOpposition, alle drei Antworten kommen vor", () => {
    const zufall = saat(11);
    const antworten = new Set<string>();
    for (let i = 0; i < 80; i++) {
      const d = oppositionsdrill(zufall);
      if (!d) continue;
      const s = stellungAusFen(d.fen);
      expect(s.ok && (hatOpposition(s.wert) ?? "keiner")).toBe(d.richtig);
      antworten.add(d.richtig);
    }
    expect(antworten.size).toBe(3);
  });

  it("Schlüsselfelder: genau eine Option ist Schlüsselfeld", () => {
    const zufall = saat(3);
    for (let i = 0; i < 30; i++) {
      const d = schluesseldrill(zufall);
      expect(d).not.toBeNull();
      if (!d) continue;
      expect(d.optionen).toHaveLength(3);
      expect(d.optionen.filter((o) => d.loesungsfelder.includes(o))).toEqual([d.richtig]);
    }
  });

  it("Erkennungsbild: Buchstellungen mit erkanntem Bild, vier Antworten", () => {
    const drills = bilddrills(
      ENDSPIEL.aufgaben.map((a) => a.fen),
      saat(5),
    );
    expect(drills.length).toBeGreaterThan(10);
    for (const d of drills) {
      expect(d.optionen).toContain(d.richtig);
      expect(new Set(d.optionen).size).toBe(d.optionen.length);
    }
  });

  it("Runde: acht Aufgaben, reihum gemischt", () => {
    const runde = drillrunde(
      ENDSPIEL.aufgaben.map((a) => a.fen),
      8,
      saat(9),
    );
    expect(runde).toHaveLength(8);
    expect(new Set(runde.map((d) => d.art)).size).toBe(4);
  });
});
