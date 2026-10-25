/** Tests der Umrechnung Schnellschach → Blitz und Klassisch (engine/zeitklassenabstand.ts, 0.2.131). */
import { describe, expect, it } from "vitest";
import { LICHESS_UNTERGRENZE, wertungInZeitklasse, zahlInZeitklasse } from "./zeitklassenabstand";

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
  it("angezeigte Zahlen: nicht unter 400, außer Schnellschach liegt selbst darunter", () => {
    expect(zahlInZeitklasse(450, "blitz")).toBe(LICHESS_UNTERGRENZE);
    expect(zahlInZeitklasse(347, "blitz")).toBe(347);
    expect(zahlInZeitklasse(1500.4, "rapid")).toBe(1500.4);
  });
});
