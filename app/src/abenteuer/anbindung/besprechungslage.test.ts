/**
 * Tests von Lage und Opfer der Besprechung (besprechungslage.ts): Lage nur mit klarem Wert,
 * Opfer mit der hergegebenen Figur.
 */
import { describe, expect, it } from "vitest";
import { lageVor, opferVon } from "./besprechungslage";
import type { Motivgrundlage } from "./besprechungsmotiv";

/** Weiß am Zug; 1. Lxh7+ gibt den Läufer für den Bauern h7 (Kxh7 oder Sxh7). */
const LAEUFEROPFER = "rnbq1rk1/ppp2ppp/5n2/3p4/3P4/3B1N2/PPP2PPP/RNBQ1RK1 w - - 0 1";

/** Grundlage mit einer Stellung, einem Zug und einem Wert (Sicht von Weiß). */
function grundlage(fen: string, san: string, wert: number): Motivgrundlage {
  return { fens: [fen], sans: [san], beste: [], varianten: [], verluste: [0], werte: [wert] };
}

describe("lageVor", () => {
  it("nennt die Lage nur bei klarem Wert und nur bei Fehlern", () => {
    const fehler = { index: 0, kategorie: "fehler" } as const;
    expect(lageVor(grundlage(LAEUFEROPFER, "Bxh7+", 2.5), fehler)?.lage).toBe("gut");
    expect(lageVor(grundlage(LAEUFEROPFER, "Bxh7+", -3), fehler)?.lage).toBe("schlecht");
    expect(lageVor(grundlage(LAEUFEROPFER, "Bxh7+", 0.2), fehler)?.lage).toBe("gleich");
    expect(lageVor(grundlage(LAEUFEROPFER, "Bxh7+", 1.2), fehler)).toBeNull();
    expect(
      lageVor(grundlage(LAEUFEROPFER, "Bxh7+", 2.5), { index: 0, kategorie: "stark" }),
    ).toBeNull();
  });

  it("dreht den Wert für Schwarz", () => {
    const schwarz = "rnbq1rk1/ppp2ppp/5n2/3p4/3P4/3B1N2/PPP2PPP/RNBQ1RK1 b - - 0 1";
    const lage = lageVor(grundlage(schwarz, "a6", 2.5), { index: 0, kategorie: "patzer" });
    expect(lage?.lage).toBe("schlecht");
    expect(["eroeffnung", "mittelspiel", "endspiel"]).toContain(lage?.phase);
  });
});

describe("opferVon", () => {
  it("nennt die hergegebene Figur eines brillanten Zuges", () => {
    const g = grundlage(LAEUFEROPFER, "Bxh7+", 0);
    expect(opferVon(g, { index: 0, kategorie: "brillant" })).toBe("bishop");
  });

  it("ohne Opfer oder bei anderen Kategorien nichts", () => {
    expect(
      opferVon(grundlage(LAEUFEROPFER, "Nc3", 0), { index: 0, kategorie: "stark" }),
    ).toBeNull();
    expect(
      opferVon(grundlage(LAEUFEROPFER, "Bxh7+", 0), { index: 0, kategorie: "fehler" }),
    ).toBeNull();
  });
});
