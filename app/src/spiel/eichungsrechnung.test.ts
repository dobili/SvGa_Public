/**
 * Tests der Eichrechnung: Werte der Engine aus Sicht von Weiß, Kontrollpartien, Rastersuche,
 * monotone Kurve und Streuung über zehn Partien.
 */
import { describe, expect, it } from "vitest";
import {
  besteRegler,
  istKontrolle,
  kurvenwert,
  monotoneKurve,
  streuung,
  werteAusEngine,
  zehnerFehler,
  type Eichseite,
} from "./eichungsrechnung";
import { LICHESS_REGLER, seitengenauigkeit } from "./genauigkeitsmodell";

describe("Eichrechnung", () => {
  it("rechnet die Werte der Engine in die Sicht von Weiß um", () => {
    const werte = werteAusEngine([
      { cp: 30 },
      { cp: -40 },
      { matt: 2 },
      { matt: 0 },
      { cp: null },
      { cp: 2500 },
    ]);
    expect(werte).toEqual([0.3, 0.4, 10, 10, 0, -10]);
  });

  it("legt etwa jede fünfte Partie fest als Kontrolle beiseite", () => {
    const kennungen = Array.from({ length: 2000 }, (_, i) => `partie-${i}`);
    const anteil = kennungen.filter(istKontrolle).length / kennungen.length;
    expect(anteil).toBeGreaterThan(0.15);
    expect(anteil).toBeLessThan(0.25);
    expect(istKontrolle("abc")).toBe(istKontrolle("abc"));
  });

  it("findet die Regler, mit denen die Zahlen entstanden sind", () => {
    const partien = [
      [0.2, 0.3, -1, -0.8, -2.5, -2.4, -2.6, -4, -4.2, -6, -6.5, -7, -7.5, -9, -10, -10],
      [0.1, 0.5, 0.2, 1.4, 1.1, 0.9, 0.2, 0.4, -0.6, -0.5, -1.8, -1.7, -1.9, -3, -3.1, -3],
    ];
    const ziel = { abfall: 0.08, polster: 0.5 };
    const seiten: Eichseite[] = partien.flatMap((werte) =>
      (["white", "black"] as const).map((seite) => ({
        werte,
        seite,
        genauigkeit: seitengenauigkeit(werte, seite, ziel) ?? 0,
        wertung: 1000,
      })),
    );
    const gefunden = besteRegler(
      seiten,
      [LICHESS_REGLER.abfall, 0.06, 0.08, 0.1],
      [1, 0.75, 0.5, 0.25],
    );
    expect(gefunden.regler).toEqual(ziel);
    expect(gefunden.abweichung).toBeCloseTo(0, 10);
  });

  it("bildet eine steigende Kurve und rechnet dazwischen linear", () => {
    const punkte = [
      { x: 60, y: 700 },
      { x: 62, y: 500 },
      { x: 80, y: 1200 },
      { x: 82, y: 1100 },
      { x: 95, y: 2000 },
      { x: 96, y: 2200 },
    ];
    const kurve = monotoneKurve(punkte, 3);
    expect(kurve.map(([x]) => x)).toEqual([61, 81, 95.5]);
    expect(kurve.map(([, y]) => y)).toEqual([600, 1150, 2100]);
    expect(kurvenwert(kurve, 71)).toBeCloseTo(875, 10);
    expect(kurvenwert(kurve, 40)).toBe(600);
    expect(kurvenwert(kurve, 99)).toBe(2100);
    const fallend = monotoneKurve(
      [
        { x: 1, y: 300 },
        { x: 2, y: 100 },
      ],
      2,
    );
    expect(fallend.map(([, y]) => y)).toEqual([200, 200]);
  });

  it("mittelt über zehn Partien desselben Bandes", () => {
    const paare = Array.from({ length: 40 }, (_, i) => ({
      schaetzung: 1000 + (i % 2 === 0 ? 300 : -300),
      wertung: 1000,
      band: 1000,
    }));
    const fehler = zehnerFehler(paare, 50, 10);
    expect(fehler.length).toBe(50);
    expect(streuung(fehler)).toBeLessThan(300);
  });
});
