// Abenteuerwertung A (Regelwerk R2, R3, R38).
import { describe, expect, it } from "vitest";
import { leererAbenteuerstand } from "./spielstand";
import { mitAppWertung, nachStoryPartie, zaehltFuerA } from "./wertung";

const JETZT = new Date("2026-11-08T05:00:00Z");

describe("Abenteuerwertung", () => {
  it("startet mit der App-Wertung oder 600 und folgt Änderungen der App-Wertung", () => {
    const ohne = leererAbenteuerstand(JETZT, "Kim", null, false);
    expect(ohne.wertung).toBe(600);
    const mit = leererAbenteuerstand(JETZT, "Kim", 900, true);
    expect(mit.wertung).toBe(900);
    // Die App-Wertung steigt um 40 → A steigt um 40.
    expect(mitAppWertung(mit, 940).wertung).toBe(940);
    expect(mitAppWertung(mit, 900)).toBe(mit);
    expect(mitAppWertung(mit, null)).toBe(mit);
    // Erste App-Wertung ohne gezählte Story-Partien ersetzt den Startwert.
    expect(mitAppWertung(ohne, 750).wertung).toBe(750);
    expect(mitAppWertung({ ...ohne, wertungPartien: 3 }, 750).wertung).toBe(600);
  });

  it("zählt nur ganze Partien aus der Grundstellung, die für die App zählen", () => {
    const grund = { art: "grundstellung" as const };
    expect(
      zaehltFuerA({ format: { art: "partie" }, startstellung: grund, zaehltFuerApp: true }),
    ).toBe(true);
    expect(
      zaehltFuerA({ format: { art: "partie" }, startstellung: grund, zaehltFuerApp: false }),
    ).toBe(false);
    expect(
      zaehltFuerA({
        format: { art: "partie" },
        startstellung: { art: "fen", fen: "x" },
        zaehltFuerApp: true,
      }),
    ).toBe(false);
    expect(
      zaehltFuerA({
        format: { art: "wiedereinstieg", vorherigeKennung: "a" },
        startstellung: grund,
        zaehltFuerApp: true,
      }),
    ).toBe(false);
  });

  it("rechnet den Elo-Schritt mit K 32, hält E bis zehn Partien gleich A und ignoriert Abbruch", () => {
    const stand = leererAbenteuerstand(JETZT, "Kim", 800, false);
    const sieg = nachStoryPartie(stand, 1020, "sieg", []);
    // Erwartung 1 / (1 + 10^(220/400)) = 0,218 → 800 + 32 · 0,782 = 825.
    expect(sieg.wertung).toBe(825);
    expect(sieg.eingangswertung).toBe(825);
    expect(sieg.eingangPartien).toBe(1);
    expect(sieg.wertungPartien).toBe(1);
    const fest = nachStoryPartie({ ...stand, eingangPartien: 10 }, 1020, "niederlage", []);
    expect(fest.eingangswertung).toBe(800);
    expect(fest.wertung).toBe(793);
    expect(nachStoryPartie(stand, 1020, "abgebrochen", [])).toBe(stand);
    expect(
      nachStoryPartie(stand, 1020, "sieg", [
        { kennung: "fluestern", stufe: "mittel", halbzug: 10 },
      ]),
    ).toBe(stand);
    // 110 gegen 100 verloren: Erwartung 0,51, Schritt −16 → unter 100, also die Grenze.
    expect(nachStoryPartie({ ...stand, wertung: 110 }, 100, "niederlage", []).wertung).toBe(100);
  });
});
