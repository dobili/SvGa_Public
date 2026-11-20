/** Tests der Zeit-Hinweise Ambroses (Wunsch des Autors, 19.11.2026). */
import { describe, expect, it } from "vitest";
import {
  ambroseSchweigtAmBrett,
  erwarteteZuege,
  genutztAusRestzeiten,
  zeithinweis,
  zeithinweiseFreigeschaltet,
  zeithinweisSatz,
  ZEITHINWEIS_SAETZE,
  type Zeitlage,
} from "./zeithinweis";
import { echteWahl, istWiederschlag } from "./zeithinweis-lage";

const SEKUNDE = 1000;
const MINUTE = 60 * SEKUNDE;

/** Lage nach `eigeneZuege` Zügen, zuletzt je Zug `sekunden` genutzt, alle mit echter Wahl. */
function lage(teil: Partial<Zeitlage> & { sekunden: number }): Zeitlage {
  const zeiten = Array.from({ length: 6 }, () => teil.sekunden * SEKUNDE);
  return {
    zuschlagMs: 5 * SEKUNDE,
    genutztJeZug: zeiten,
    echteWahl: zeiten.map(() => true),
    eigeneZuege: 12,
    restMs: 9 * MINUTE,
    letzterHinweisNachZug: null,
    bisherige: 0,
    ...teil,
  };
}

describe("Zeit-Hinweise", () => {
  it("erwartete Züge: bis Zug 40, mindestens 20", () => {
    expect(erwarteteZuege(12)).toBe(28);
    expect(erwarteteZuege(30)).toBe(20);
  });

  it("Bedenkzeit je Zug aus den Restzeiten, der erste Zug der Partie ohne Zuschlag", () => {
    expect(genutztAusRestzeiten([600_000, 590_000, 585_000], 5000, false)).toEqual([
      15_000, 10_000,
    ]);
    expect(genutztAusRestzeiten([600_000, 600_000, 590_000], 5000, true)).toEqual([0, 15_000]);
  });

  it("10 + 5, Zug 12, 9 Minuten übrig, 3 s je Zug → „Lass dir Zeit“; 10 s je Zug → nichts", () => {
    expect(zeithinweis(lage({ sekunden: 3 }))).toBe("zuSchnell");
    expect(zeithinweis(lage({ sekunden: 10 }))).toBeNull();
  });

  it("zu schnell nur mit echter Wahl in mindestens vier der letzten fünf Züge", () => {
    const wiederschlaege = [true, true, false, false, true, true];
    expect(zeithinweis(lage({ sekunden: 3, echteWahl: wiederschlaege }))).toBeNull();
  });

  it("zu schnell nicht, wenn ohnehin wenig Zeit je Zug da ist (3 + 2, Zug 15, 1 Minute)", () => {
    const blitz = { zuschlagMs: 2 * SEKUNDE, eigeneZuege: 15, restMs: MINUTE };
    expect(zeithinweis(lage({ sekunden: 1, ...blitz }))).toBeNull();
  });

  it("3 + 2, Zug 15, 40 s übrig, 8 s je Zug → „Du musst schneller werden“", () => {
    const eng = { zuschlagMs: 2 * SEKUNDE, eigeneZuege: 15, restMs: 40 * SEKUNDE };
    expect(zeithinweis(lage({ sekunden: 8, ...eng }))).toBe("zuLangsam");
    expect(zeithinweis(lage({ sekunden: 3, ...eng }))).toBeNull();
  });

  it("selten: erst ab Zug 10, dann mit 8 Zügen Abstand, höchstens zweimal", () => {
    expect(zeithinweis(lage({ sekunden: 3, eigeneZuege: 9 }))).toBeNull();
    expect(zeithinweis(lage({ sekunden: 3, eigeneZuege: 16, letzterHinweisNachZug: 10 }))).toBe(
      null,
    );
    expect(zeithinweis(lage({ sekunden: 3, eigeneZuege: 18, letzterHinweisNachZug: 10 }))).toBe(
      "zuSchnell",
    );
    expect(zeithinweis(lage({ sekunden: 3, bisherige: 2 }))).toBeNull();
    expect(zeithinweis(lage({ sekunden: 3, genutztJeZug: [3000, 3000] }))).toBeNull();
  });

  it("erst nach der ersten Clubnadel", () => {
    expect(zeithinweiseFreigeschaltet({})).toBe(false);
    expect(zeithinweiseFreigeschaltet({ nadelMapleFalls: 0 })).toBe(false);
    expect(zeithinweiseFreigeschaltet({ nadelMapleFalls: 1, tiefpunktGesehen: true })).toBe(true);
  });

  it("in einer Partie kein Satz zweimal", () => {
    const erster = zeithinweisSatz("partie-7", 0);
    const zweiter = zeithinweisSatz("partie-7", 1);
    expect(erster).not.toBe(zweiter);
    expect(Math.max(erster, zweiter)).toBeLessThan(ZEITHINWEIS_SAETZE);
  });
});

describe("echte Wahl", () => {
  const nachExd5 = "rnbqkbnr/ppp1pppp/8/3P4/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2";

  it("ein Wiederschlag ist keine echte Wahl, ein ruhiger Zug schon", () => {
    expect(istWiederschlag("exd5", "Qxd5")).toBe(true);
    expect(istWiederschlag("exd5", "Nf6")).toBe(false);
    expect(istWiederschlag("e4", "dxe4")).toBe(false);
    expect(echteWahl(nachExd5, "exd5", "Qxd5")).toBe(false);
    expect(echteWahl(nachExd5, "exd5", "Nf6")).toBe(true);
  });

  it("der einzige legale Zug ist keine echte Wahl", () => {
    // Schwarzer König a8, weißer König c7 und Turm b1: nur Ka7 ist legal.
    const einzig = "k7/2K5/8/8/8/8/8/1R6 b - - 0 1";
    expect(echteWahl(einzig, null, "Ka7")).toBe(false);
  });
});

describe("ambroseSchweigtAmBrett", () => {
  it("schweigt im Halbfinale, sonst nicht", () => {
    expect(ambroseSchweigtAmBrett("capitalArena.halbfinale")).toBe(true);
    expect(ambroseSchweigtAmBrett("capitalArena.halbfinale#revanche")).toBe(true);
    expect(ambroseSchweigtAmBrett("ironwood.clubkampf")).toBe(false);
    expect(ambroseSchweigtAmBrett("capitalArena.runde1")).toBe(false);
  });
});
