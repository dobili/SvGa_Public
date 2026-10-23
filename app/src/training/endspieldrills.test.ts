/**
 * Tests der Endspiel-Kurzübungen (training/endspieldrills.ts, endspielzugdrills.ts): legale
 * Stellungen, Antworten wie die Bausteine der Werkzeuge aus Kapitel 8 und 9, beide Antworten
 * kommen vor, die Zug-Übungen haben genau einen richtigen Zug.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { hatOpposition, oppositionszuege } from "../schach/opposition";
import { quadrat } from "../schach/quadrat";
import { feldAusName, stellungAusFen } from "../schach/stellung";
import { fenNachZuegen } from "../schach/weiterspielen";
import {
  bilddrills,
  DRILLARTEN,
  drillrunde,
  fenAus,
  oppositionsdrill,
  quadratdrill,
  schluesseldrill,
  type Drill,
  type Drillart,
} from "./endspieldrills";
import { bildplandrills, oppositionszugdrill, quadratzugdrill } from "./endspielzugdrills";

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
const FENS = ENDSPIEL.aufgaben.map((a) => a.fen);
const VIELE = 40;
const ANTWORTEN = 3;

/** Das Feld des weißen Bauern in einer FEN mit genau einem Bauern. */
function bauernfeld(fen: string): number {
  const s = stellungAusFen(fen);
  if (!s.ok) throw new Error(fen);
  const [bauer] = s.wert.brett.pieces("white", "pawn");
  if (bauer === undefined) throw new Error(`kein Bauer in ${fen}`);
  return bauer;
}

describe("Endspiel-Kurzübungen", () => {
  it("fenAus schreibt eine lesbare FEN", () => {
    expect(
      fenAus(
        new Map([
          [4, "K"],
          [60, "k"],
          [12, "P"],
        ]),
        "white",
      ),
    ).toBe("4k3/8/8/8/8/8/4P3/4K3 w - - 0 1");
  });

  it("Quadrat: legale Stellungen, „ja“ und „nein“ kommen vor, die Lösung sind Pfeile wie im Buch", () => {
    const zufall = saat(7);
    const antworten = new Set<string>();
    for (let i = 0; i < VIELE; i++) {
      const d = quadratdrill(zufall);
      expect(d).not.toBeNull();
      if (!d) continue;
      expect(stellungAusFen(d.fen).ok).toBe(true);
      expect(d.optionen).toContain(d.richtig);
      const pfeile = d.loesung.filter((m) => m.typ === "pfeil");
      expect(pfeile.some((m) => m.farbe === "gold"), "goldener Bauernweg").toBe(true);
      // Höchstens das Feld des Königs ist farbig (Urteil des Werkzeugs), kein goldenes Quadrat.
      expect(d.loesung.filter((m) => m.typ === "feld").length).toBeLessThanOrEqual(1);
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
      expect(d.optionen).toHaveLength(ANTWORTEN);
      const felder = d.loesung.flatMap((m) => (m.typ === "feld" ? [m.feld] : []));
      expect(d.optionen.filter((o) => felder.includes(o))).toEqual([d.richtig]);
    }
  });

  it("Erkennungsbild: Buchstellungen mit erkanntem Bild, vier Antworten, auch als Plan", () => {
    for (const drills of [bilddrills(FENS, saat(5)), bildplandrills(FENS, saat(6))]) {
      expect(drills.length).toBeGreaterThan(10);
      for (const d of drills) {
        expect(d.optionen).toContain(d.richtig);
        expect(new Set(d.optionen).size).toBe(d.optionen.length);
      }
    }
    expect(bildplandrills(FENS, saat(6))[0]?.art).toBe("bildplan");
  });

  it("Quadrat als Zug (R47): nur der richtige Zug tritt ins Quadrat, Schwarz am Zug", () => {
    const zufall = saat(13);
    for (let i = 0; i < 20; i++) {
      const d = quadratzugdrill(zufall);
      expect(d).not.toBeNull();
      if (!d) continue;
      expect(d.fen.split(" ")[1]).toBe("b");
      expect(d.optionen).toHaveLength(ANTWORTEN);
      const bauer = bauernfeld(d.fen);
      for (const option of d.optionen) {
        const danach = fenNachZuegen(d.fen, [option]);
        const s = danach ? stellungAusFen(danach) : null;
        expect(s?.ok, `${d.fen} ${option}`).toBe(true);
        if (!s?.ok) continue;
        expect(quadrat(s.wert, bauer).haeltAuf, `${d.fen} ${option}`).toBe(option === d.richtig);
      }
      expect(d.loesung.some((m) => m.typ === "pfeil" && m.farbe === "gold")).toBe(true);
    }
  });

  it("Opposition als Zug (R47): genau eine Option nimmt die Opposition", () => {
    const zufall = saat(17);
    for (let i = 0; i < 20; i++) {
      const d = oppositionszugdrill(zufall);
      expect(d).not.toBeNull();
      if (!d) continue;
      const s = stellungAusFen(d.fen);
      expect(s.ok).toBe(true);
      if (!s.ok) continue;
      const richtige = new Set(oppositionszuege(s.wert).map((z) => z.san));
      expect(d.optionen.filter((o) => richtige.has(o))).toEqual([d.richtig]);
      expect(feldAusName(d.richtig.slice(1))).not.toBeNull();
    }
  });

  it("Runde: acht Aufgaben, alle sieben Arten reihum", () => {
    const zufall = saat(9);
    const bilder = bilddrills(FENS, zufall);
    const plaene = bildplandrills(FENS, zufall);
    const erzeuge = (art: Drillart): Drill | null =>
      art === "quadrat"
        ? quadratdrill(zufall)
        : art === "opposition"
          ? oppositionsdrill(zufall)
          : art === "schluesselfelder"
            ? schluesseldrill(zufall)
            : art === "bild"
              ? (bilder.shift() ?? null)
              : art === "quadratzug"
                ? quadratzugdrill(zufall)
                : art === "oppositionszug"
                  ? oppositionszugdrill(zufall)
                  : (plaene.shift() ?? null);
    const runde = drillrunde(erzeuge, 8);
    expect(runde).toHaveLength(8);
    expect(runde.map((d) => d.art).slice(0, DRILLARTEN.length)).toEqual([...DRILLARTEN]);
  });
});
