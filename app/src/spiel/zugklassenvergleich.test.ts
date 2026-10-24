/**
 * Tests des Vergleichs der Zugklassen mit dem Üblichen (R56).
 */
import { describe, expect, it } from "vitest";
import { ueblicherAnteil, vergleicheKlasse } from "./zugklassenvergleich";

describe("zugklassenvergleich", () => {
  it("üblicher Anteil: zwischen den Stützstellen gerade verbunden, außen festgehalten", () => {
    expect(ueblicherAnteil("bester", 1400)).toBeCloseTo(33);
    expect(ueblicherAnteil("bester", 400)).toBe(28);
    expect(ueblicherAnteil("patzer", 2600)).toBe(1.5);
  });

  it("gute Klassen: mehr ist gut, weniger schwach", () => {
    expect(vergleicheKlasse("bester", 20, 33, 1400).urteil).toBe("gut");
    expect(vergleicheKlasse("bester", 11, 33, 1400).urteil).toBe("normal");
    expect(vergleicheKlasse("bester", 3, 33, 1400).urteil).toBe("schwach");
  });

  it("schwache Klassen: weniger ist gut, mehr schwach", () => {
    expect(vergleicheKlasse("patzer", 0, 33, 1400).urteil).toBe("gut");
    expect(vergleicheKlasse("ungenau", 4, 33, 1400).urteil).toBe("normal");
    expect(vergleicheKlasse("patzer", 5, 33, 1400).urteil).toBe("schwach");
  });

  it("ein brillanter Zug ragt über die Skala, der Balken endet am Rand", () => {
    const v = vergleicheKlasse("brillant", 1, 33, 1400);
    expect(v.ueberSkala).toBe(true);
    expect(v.balken).toBe(1);
    expect(v.urteil).toBe("gut");
  });

  it("ohne Züge: Anteil 0, kein Absturz", () => {
    expect(vergleicheKlasse("fehler", 0, 0, 1400).anteil).toBe(0);
  });
});
