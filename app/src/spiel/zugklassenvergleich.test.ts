/** Tests des Zugklassenvergleichs (R56; seit 0.2.125 mit den Spannen der Spielerprofile). */
import { describe, expect, it } from "vitest";
import { ueblicheSpanne, ueblicherAnteil, vergleicheKlasse } from "./zugklassenvergleich";

describe("Zugklassenvergleich", () => {
  it("üblicher Anteil aus den Profilen: Patzer werden mit der Stärke seltener, beste Züge häufiger", () => {
    expect(ueblicherAnteil("patzer", 600, "rapid")).toBeGreaterThan(
      ueblicherAnteil("patzer", 2200, "rapid"),
    );
    expect(ueblicherAnteil("bester", 2200, "rapid")).toBeGreaterThan(
      ueblicherAnteil("bester", 600, "rapid"),
    );
    // Außerhalb der Bänder gilt das nächste; Klassisch kennt kein Band 400 und nimmt 800.
    expect(ueblicherAnteil("patzer", 100, "classical")).toBe(
      ueblicherAnteil("patzer", 1000, "classical"),
    );
    // Brillant und stark bleiben vorläufig; Theoriezug seit 0.2.135 gemessen (N949).
    expect(ueblicherAnteil("buch", 1400)).toBeCloseTo(7.55);
    expect(ueblicherAnteil("bester", 1400, "rapid")).toBeLessThan(
      ueblicheSpanne("bester", 1400, "rapid").oben,
    );
  });

  it("Zone normal: Spanne der Spieler, bei wenigen Zügen breiter", () => {
    const kurz = vergleicheKlasse("ungenau", 4, 20, 1400, "rapid");
    const lang = vergleicheKlasse("ungenau", 20, 100, 1400, "rapid");
    expect(kurz.normalBis - kurz.normalVon).toBeGreaterThan(lang.normalBis - lang.normalVon);
    expect(kurz.normalVon).toBeGreaterThanOrEqual(0);
    expect(kurz.normalBis).toBeLessThanOrEqual(1);
    expect(kurz.normalVon).toBeLessThan(0.5);
    expect(kurz.normalBis).toBeGreaterThan(0.5);
  });

  it("gute Klassen: mehr ist gut, weniger schwach", () => {
    expect(vergleicheKlasse("bester", 25, 33, 1400, "rapid").urteil).toBe("gut");
    expect(vergleicheKlasse("bester", 11, 33, 1400, "rapid").urteil).toBe("normal");
    expect(vergleicheKlasse("bester", 2, 33, 1400, "rapid").urteil).toBe("schwach");
  });

  it("schwache Klassen: weniger ist gut, mehr schwach", () => {
    // Null Patzer: in 60 Zügen noch Zufall („normal“), in 200 Zügen „gut“.
    expect(vergleicheKlasse("patzer", 0, 60, 1400, "rapid").urteil).toBe("normal");
    expect(vergleicheKlasse("patzer", 0, 200, 1400, "rapid").urteil).toBe("gut");
    expect(vergleicheKlasse("ungenau", 4, 33, 1400, "rapid").urteil).toBe("normal");
    expect(vergleicheKlasse("patzer", 8, 33, 1400, "rapid").urteil).toBe("schwach");
  });

  it("ein brillanter Zug ragt über die Skala, der Balken endet am Rand", () => {
    const v = vergleicheKlasse("brillant", 1, 33, 1400);
    expect(v.ueberSkala).toBe(true);
    expect(v.balken).toBe(1);
    expect(v.urteil).toBe("gut");
  });

  it("ohne Züge: Anteil 0, kein Absturz", () => {
    expect(vergleicheKlasse("fehler", 0, 0, 1400).anteil).toBe(0);
    expect(vergleicheKlasse("fehler", 0, 0, 1400).balken).toBe(0);
  });
});
