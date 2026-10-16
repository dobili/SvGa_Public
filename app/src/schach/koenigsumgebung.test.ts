/**
 * Tests der Königsumgebung an den Mattbildern aus Kapitel 1, 5 und 7.
 */
import { describe, expect, it } from "vitest";
import { feld, stellungVon } from "./buchabbildungen.testhilfe";
import { koenigsumgebung } from "./koenigsumgebung";
import { feldname } from "./stellung";

const namen = (liste: readonly number[]) => liste.map(feldname).sort();

function umgebung(nummer: string, farbe: "white" | "black") {
  const ergebnis = koenigsumgebung(stellungVon(nummer), farbe);
  if (!ergebnis) throw new Error(`Abb. ${nummer}: kein König`);
  return ergebnis;
}

describe("koenigsumgebung", () => {
  it("Abb. 1.35: der König g8 hat kein Fluchtfeld (f8 Turm, g7 Bauer, h7 und h8 die Dame)", () => {
    const u = umgebung("1.35", "black");
    expect(u.fluchtfelder).toEqual([]);
    expect(namen(u.eigeneBesetzt)).toEqual(["f7", "f8", "g7"]);
    expect(namen(u.angegriffen)).toContain("h8");
    expect(u.imSchach).toBe(true);
  });

  it("Abb. 5.12 und 5.13: ohne Luftloch kein Fluchtfeld, mit h3 das Fluchtfeld h2", () => {
    expect(umgebung("5.12", "white").fluchtfelder).toEqual([]);
    expect(namen(umgebung("5.13", "white").fluchtfelder)).toEqual(["h2"]);
  });

  it("Abb. 7.36: der Turm e8 beherrscht f8 und h8 durch den König hindurch", () => {
    const u = umgebung("7.36", "black");
    expect(namen(u.angegriffen)).toEqual(["f8", "h8"]);
    expect(namen(u.eigeneBesetzt)).toEqual(["f7", "g7", "h7"]);
    expect(u.fluchtfelder).toEqual([]);
  });

  it("Abb. 7.35: Erstickungsmatt, eigene Figuren auf g7, h7 und g8", () => {
    const u = umgebung("7.35", "black");
    expect(namen(u.eigeneBesetzt)).toEqual(["g7", "g8", "h7"]);
    expect(u.fluchtfelder).toEqual([]);
  });

  it("Bauernschild und Rochade: Abb. 5.12 (rochiert, Schild f2 g2 h2), Abb. 1.26 (nicht)", () => {
    const u = umgebung("5.12", "white");
    expect(u.rochiert).toBe(true);
    expect(namen(u.bauernschild)).toEqual(["f2", "g2", "h2"]);
    expect(u.schildUnberuehrt).toBe(3);
    expect(umgebung("1.26", "white").rochiert).toBe(false);
    expect(umgebung("5.13", "white").schildUnberuehrt).toBe(3);
  });

  it("Linien zum König: Abb. 7.36, die e-Linie fehlt, f bis h sind geschlossen", () => {
    const linien = umgebung("7.36", "black").linienZumKoenig;
    expect(linien.map((l) => [l.linie, l.zustand])).toEqual([
      [5, "geschlossen"],
      [6, "geschlossen"],
      [7, "geschlossen"],
    ]);
    // Abb. 5.12: Der Turm e1 steht auf der offenen e-Linie, das sieht der König g1 nicht;
    // seine Linien f bis h sind geschlossen.
    expect(
      umgebung("5.12", "white").linienZumKoenig.every((l) => l.zustand === "geschlossen"),
    ).toBe(true);
  });

  it("Abb. 3.6: Turm f8 auf der halboffenen f-Linie, aber hinter f7 und f4, also nicht frei", () => {
    const f = umgebung("3.6", "white").linienZumKoenig.find((l) => l.linie === 5);
    expect(f?.zustand).toBe("halboffen");
    expect(namen(f?.schwerfiguren ?? [])).toEqual(["f8"]);
    expect(f?.freieSchwerfiguren).toEqual([]);
  });

  it("Abb. 5.31: Weiß und Schwarz ohne Rochaderecht, Könige auf g1 und g8 gelten als rochiert", () => {
    expect(umgebung("5.31", "white").rochiert).toBe(true);
    expect(umgebung("5.31", "black").koenig).toBe(feld("g8"));
  });
});
