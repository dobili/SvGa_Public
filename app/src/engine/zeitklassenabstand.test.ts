/** Tests der Umrechnung Schnellschach → Blitz und Klassisch (engine/zeitklassenabstand.ts). */
import { describe, expect, it } from "vitest";
import { wertungInZeitklasse, zahlInZeitklasse } from "./zeitklassenabstand";

describe("Ein Mensch mit drei Wertungen", () => {
  it("Schnellschach bleibt, Blitz liegt darunter, Klassisch unten darüber", () => {
    expect(wertungInZeitklasse(1500, "rapid")).toBe(1500);
    for (const w of [800, 1200, 1600, 2000, 2400]) {
      expect(wertungInZeitklasse(w, "blitz"), `Blitz ${w}`).toBeLessThan(w);
    }
    expect(wertungInZeitklasse(1000, "classical")).toBeGreaterThan(1100);
  });
  it("wächst mit der Schnellschach-Zahl (stärker bleibt stärker)", () => {
    for (const tempo of ["blitz", "classical"] as const) {
      let vorher = -Infinity;
      for (let w = 300; w <= 3300; w += 50) {
        const jetzt = wertungInZeitklasse(w, tempo);
        expect(jetzt, `${tempo} ${w}`).toBeGreaterThan(vorher);
        vorher = jetzt;
      }
    }
  });
  it("für jede Zahl gilt Blitz < Schnellschach < Klassisch, mindestens 50 Abstand", () => {
    for (let w = 200; w <= 3400; w += 25) {
      expect(zahlInZeitklasse(w, "blitz"), `Blitz ${w}`).toBeLessThanOrEqual(w - 50);
      expect(zahlInZeitklasse(w, "classical"), `Klassisch ${w}`).toBeGreaterThanOrEqual(w + 50);
    }
    expect(zahlInZeitklasse(1500.4, "rapid")).toBe(1500.4);
  });
});
