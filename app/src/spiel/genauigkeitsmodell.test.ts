/**
 * Tests des Genauigkeitsmodells: Mit den Lichess-Reglern genau die Genauigkeit von Lichess wie in
 * genauigkeit.ts; ein größerer Abfall und ein kleineres Polster senken die Zahl.
 */
import { describe, expect, it } from "vitest";
import { partiegenauigkeit, zuggewichte, zuggenauigkeit } from "./genauigkeit";
import {
  genauigkeitAus,
  innereGenauigkeit,
  LICHESS_REGLER,
  mittelweg,
  seitengenauigkeit,
  zuggenauigkeitMit,
  zugwerte,
  zugwerteBisEntscheidung,
} from "./genauigkeitsmodell";

/** Eine Partie aus Sicht von Weiß: ausgeglichen, Weiß patzt (−3), dann lange gewonnen für Schwarz. */
const WERTE = [0.2, 0.3, 0.1, 0.2, -3, -2.8, -3.1, -6.5, -7, -8, -9, -9.5, -10, -10, -10, -10];

describe("Genauigkeitsmodell", () => {
  it("rechnet mit den Lichess-Reglern genau wie genauigkeit.ts", () => {
    expect(zuggenauigkeitMit(7.3, LICHESS_REGLER.abfall)).toBeCloseTo(zuggenauigkeit(7.3), 10);
    const gewichte = zuggewichte(WERTE);
    for (const seite of ["white", "black"] as const) {
      const zuege = zugwerte(WERTE, seite, LICHESS_REGLER.abfall);
      const alt = partiegenauigkeit(
        zuege.map((z, i) => ({
          genauigkeit: z.genauigkeit,
          gewicht: gewichte[i * 2 + (seite === "white" ? 0 : 1)] ?? 0,
        })),
      );
      expect(seitengenauigkeit(WERTE, seite, LICHESS_REGLER)).toBeCloseTo(alt ?? -1, 10);
    }
  });

  it("strenger: größerer Abfall und kleineres Polster senken die Genauigkeit", () => {
    const lichess = seitengenauigkeit(WERTE, "white", LICHESS_REGLER) ?? 0;
    const strenger = seitengenauigkeit(WERTE, "white", { abfall: 0.08, polster: 1 }) ?? 0;
    const ohnePolster = seitengenauigkeit(WERTE, "white", { abfall: 0.04354, polster: 0.2 }) ?? 0;
    expect(strenger).toBeLessThan(lichess);
    expect(ohnePolster).toBeLessThan(lichess);
  });

  it("markiert entschiedene Stellungen und rechnet den Mittelweg", () => {
    const schwarz = zugwerte(WERTE, "black", LICHESS_REGLER.abfall);
    expect(schwarz.at(-1)?.entschieden).toBe(true);
    expect(schwarz[0]?.entschieden).toBe(false);
    expect(genauigkeitAus([], 1)).toBeNull();
    expect(mittelweg(LICHESS_REGLER, { abfall: 0.08, polster: 0.5 })).toEqual({
      abfall: (0.04354 + 0.08) / 2,
      polster: 0.75,
    });
  });

  it("zählt für die innere Genauigkeit nur die Züge bis zur Entscheidung", () => {
    // Bei −6,5 (Halbzug 7) hat Schwarz unter 10 % für Weiß und behält das: Halbzüge 0 bis 6 zählen.
    expect(zugwerteBisEntscheidung(WERTE, "white")).toHaveLength(4);
    expect(zugwerteBisEntscheidung(WERTE, "black")).toHaveLength(3);
    const alle = seitengenauigkeit(WERTE, "white", LICHESS_REGLER) ?? 0;
    const innen = innereGenauigkeit(WERTE, "white") ?? 0;
    expect(innen).toBeLessThan(alle);
  });
});
