/**
 * Tests der Fehlersuche (Konzept 8.2) mit einer nachgestellten Engine: Kandidaten aus den
 * Werkzeugen, gezielte Bewertung, Grenzen je Stufe, Damenopfer ab Stufe 2 ausgeschlossen.
 * Stellung: Abb. 1.13 nach 2. Dh5 (Schwarz am Zug).
 */
import { describe, expect, it } from "vitest";
import type { Bewertung, Staerke } from "./engineDienst";
import { lageVon } from "./fehlerart";
import { sucheFehlerzug, typischeFehlerzuege } from "./fehlersuche";
import type { Spielbewerter } from "./spielbewerter";
import { stufe } from "./stufen";
import type { Variante } from "./uci";

const NACH_DH5 = "rnbqkbnr/pppp1ppp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2";

/**
 * Werte aus Sicht von Weiß, wie eine Engine sie etwa sähe: Sc6 ist der beste Zug; Dh4 verliert
 * die Dame, doch diese Engine unterschätzt das (nur +4, also innerhalb des Höchstverlusts der
 * Stufe 2). Züge ohne Eintrag gelten als fast so gut wie der beste.
 */
const WERTE: Readonly<Record<string, number>> = {
  b8c6: 0.3,
  d7d6: 0.5,
  g8f6: 2.0,
  d8f6: 1.1,
  d8e7: 1.0,
  f8a3: 3.3,
  e8e7: 4.5,
  d8h4: 4.0,
  d8g5: 8.0,
  g7g6: 6.5,
  a7a6: 1.4,
};
const FAST_BESTER = 0.5;
const KANDIDATEN = 8;

interface Aufruf {
  readonly varianten: number;
  readonly staerke?: Staerke;
  readonly nurZuege: readonly string[];
}

function variante(nummer: number, uci: string): Variante {
  const bauern = WERTE[uci] ?? FAST_BESTER;
  return { nummer, wert: { art: "bauern", bauern }, zuege: [uci] };
}

/** Eine nachgestellte Engine: ohne „nurZuege“ die acht besten aus der Tabelle, sonst die genannten. */
function bewerter() {
  const aufrufe: Aufruf[] = [];
  const b: Spielbewerter = {
    bewerte: (_fen, _ms, anzahl, staerke, nurZuege = []) => {
      aufrufe.push({ varianten: anzahl, staerke, nurZuege });
      const zuege =
        nurZuege.length > 0
          ? [...nurZuege]
          : Object.keys(WERTE)
              .sort((a, b2) => (WERTE[a] ?? 0) - (WERTE[b2] ?? 0))
              .slice(0, KANDIDATEN);
      const varianten = zuege.map((uci, i) => variante(i + 1, uci));
      const ergebnis: Bewertung = {
        varianten,
        tiefe: 10,
        knotenJeSekunde: 0,
        rechenzeitMs: 0,
        startzeitMs: 0,
        besterZug: varianten[0]?.zuege[0] ?? null,
      };
      return Promise.resolve(ergebnis);
    },
  };
  return { b, aufrufe };
}

/** Viele feste Zufallsquellen, damit jede Auswahl einmal drankommt. */
function zufallsquellen(anzahl: number): (() => number)[] {
  return Array.from({ length: anzahl }, (_, i) => {
    let stand = i + 1;
    return () => {
      stand = (stand * 48_271) % 2_147_483_647;
      return (stand % 1000) / 1000;
    };
  });
}

describe("Typische Fehlerzüge aus den Werkzeugen", () => {
  it("Abb. 1.13: Drohung ignoriert, Figur hängen, verfrühte Dame", () => {
    const lage = lageVon(NACH_DH5);
    const typische = lage ? typischeFehlerzuege(lage) : [];
    expect(typische).toContainEqual({ uci: "g8f6", art: "drohungIgnoriert" });
    expect(typische).toContainEqual({ uci: "f8a3", art: "figurHaengen" });
    expect(typische).toContainEqual({ uci: "d8f6", art: "verfruehteDame" });
    expect(typische.find((k) => k.uci === "b8c6")).toBeUndefined();
  });
});

describe("Fehlersuche", () => {
  it("Stufe 1: ein typischer Fehler mit Art, Verlust zwischen 0,5 und 9", async () => {
    for (const zufall of zufallsquellen(20)) {
      const { b, aufrufe } = bewerter();
      const wahl = await sucheFehlerzug(b, NACH_DH5, stufe(1), zufall);
      expect(wahl?.quelle).toBe("fehler");
      expect(wahl?.fehler).not.toBe("ungenau");
      expect(wahl?.verlust).toBeGreaterThanOrEqual(0.5);
      expect(wahl?.verlust).toBeLessThanOrEqual(9);
      expect(aufrufe[0]).toEqual({ varianten: KANDIDATEN, staerke: { art: "voll" }, nurZuege: [] });
    }
  });

  it("prüft bis zu sechs typische Züge gezielt, keine, die die Engine schon kennt", async () => {
    const { b, aufrufe } = bewerter();
    await sucheFehlerzug(b, NACH_DH5, stufe(1), () => 0.5);
    const gezielt = aufrufe[1];
    expect(gezielt?.nurZuege.length).toBeGreaterThan(0);
    expect(gezielt?.nurZuege.length).toBeLessThanOrEqual(6);
    expect(gezielt?.varianten).toBe(gezielt?.nurZuege.length);
    const bekannt = aufrufe[0] ? await b.bewerte(NACH_DH5, 0, KANDIDATEN) : null;
    const engineZuege = bekannt?.varianten.map((v) => v.zuege[0]) ?? [];
    for (const uci of gezielt?.nurZuege ?? []) expect(engineZuege).not.toContain(uci);
  });

  it("Stufe 2: nie ein Damenopfer, auch wenn die Engine den Verlust unterschätzt", async () => {
    for (const zufall of zufallsquellen(40)) {
      const wahl = await sucheFehlerzug(bewerter().b, NACH_DH5, stufe(2), zufall);
      expect(wahl?.uci).not.toBe("d8h4");
      expect(wahl?.uci).not.toBe("d8g5");
      expect(wahl?.verlust).toBeLessThanOrEqual(5);
    }
  });

  it("Stufe 3: höchstens eine Leichtfigur Verlust", async () => {
    for (const zufall of zufallsquellen(40)) {
      const wahl = await sucheFehlerzug(bewerter().b, NACH_DH5, stufe(3), zufall);
      expect(wahl).not.toBeNull();
      expect(wahl?.verlust).toBeLessThanOrEqual(3);
      expect(["g8f6", "d8f6", "d8e7", "a7a6", "d7d6", "f8a3"]).toContain(wahl?.uci);
    }
  });

  it("ohne Kandidaten in den Grenzen: null", async () => {
    const leer: Spielbewerter = {
      bewerte: () =>
        Promise.resolve({
          varianten: [],
          tiefe: 0,
          knotenJeSekunde: 0,
          rechenzeitMs: 0,
          startzeitMs: 0,
          besterZug: null,
        }),
    };
    expect(await sucheFehlerzug(leer, NACH_DH5, stufe(1), () => 0.5)).toBeNull();
    expect(await sucheFehlerzug(bewerter().b, "kein fen", stufe(1), () => 0.5)).toBeNull();
  });
});
