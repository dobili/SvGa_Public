/** Tests der Regler auf menschlichen Quantilen (0.2.124). */
import { describe, expect, it } from "vitest";
import { faktorenAus, CHARAKTERE } from "./gegnerbau";
import { faktorFuerStufe } from "./spielerbereiche";
import { stilverschiebung } from "./stile";

describe("Spielerbereiche", () => {
  it("Stufe 0 ist der Median, 2 das 95-%-Quantil, −2 das 5-%-Quantil, ±4 darüber hinaus", () => {
    expect(faktorFuerStufe("arten", "verfruehteDame", 0, 1300)).toBe(1);
    const oben = faktorFuerStufe("arten", "verfruehteDame", 2, 1300);
    const unten = faktorFuerStufe("arten", "verfruehteDame", -2, 1300);
    expect(oben).toBeGreaterThan(2);
    expect(unten).toBeLessThan(0.3);
    expect(faktorFuerStufe("arten", "verfruehteDame", 1, 1300)).toBeGreaterThan(1);
    expect(faktorFuerStufe("arten", "verfruehteDame", 1, 1300)).toBeLessThan(oben);
    expect(faktorFuerStufe("arten", "verfruehteDame", 4, 1300)).toBeGreaterThan(oben);
    expect(faktorFuerStufe("arten", "verfruehteDame", -4, 1300)).toBeLessThan(unten);
    // Zwischen den Bandmitten geometrisch; außerhalb festgehalten.
    expect(faktorFuerStufe("arten", "ungenau", 2, 100)).toBe(
      faktorFuerStufe("arten", "ungenau", 2, 600),
    );
    expect(faktorFuerStufe("arten", "unbekannt", 2, 1300)).toBe(1);
    // Flecken: Stufe 2 heißt blinder als der Median.
    expect(faktorFuerStufe("flecken", "springer", 2, 1300)).toBeGreaterThan(1.2);
  });

  it("Persönlichkeit → Faktoren je Wertung; Stile verschieben die Stilmerkmale", () => {
    const f = faktorenAus(CHARAKTERE.damenfan, 1300);
    expect(f.verfruehteDame ?? 0).toBeGreaterThan(2);
    expect(f.springer ?? 0).toBeGreaterThan(1);
    expect(faktorenAus(CHARAKTERE.solide, 1300)).toEqual({});
    expect(stilverschiebung("angreifer").schach).toBeGreaterThan(0);
    expect(stilverschiebung("verteidiger").schlag).toBeLessThan(0);
    expect(stilverschiebung("universell")).toEqual({});
  });
});
