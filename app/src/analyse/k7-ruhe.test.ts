/**
 * Referenztests für k7-ruhe (ohne Engine) an Kapitel 7, Schritt 3: Prüfpunkte und Abwehrfragen.
 */
import { describe, expect, it } from "vitest";
import { stellungVon } from "../schach/buchabbildungen.testhilfe";
import { ruhe } from "./k7-ruhe";

function zeilen(nummer: string, kennung: string): readonly string[] {
  const s = stellungVon(nummer);
  return ruhe(s, s.amZug).befunde.find((b) => b.kennung === kennung)?.zeilen ?? [];
}

describe("k7-ruhe", () => {
  it("Abb. 7.27: Weiß droht Td8+ mit Matt; die Gegendrohung ist das Dauerschach De1+", () => {
    const e = ruhe(stellungVon("7.27"), "black");
    // Td8+ ist eine Mattdrohung in zwei Zügen; die App sieht im nächsten Zug nur Txf7 (+1).
    expect(e.befunde[1]?.titel).toBe("Weiß droht (Txf7, +1): die fünf Abwehrfragen");
    const abwehr = zeilen("7.27", "abwehr");
    expect(abwehr[0]).toBe("1. Schlagen: die drohende Figur auf d7 kannst du nicht schlagen");
    expect(abwehr[1]).toMatch(/^2\. Wegziehen:/);
    expect(abwehr[4]).toContain("5. Gegendrohung: du hast eigene Schachs:");
    expect(abwehr[4]).toContain("De1+");
    expect(e.markierungen).toContainEqual({ typ: "pfeil", farbe: "rot", von: "d7", nach: "f7" });
  });

  it("Abb. 7.14: ohne gegnerische Drohung nur die vier Prüfpunkte, Material ausgeglichen", () => {
    const e = ruhe(stellungVon("7.14"), "white");
    expect(e.befunde.map((b) => b.kennung)).toEqual(["punkte"]);
    expect(zeilen("7.14", "punkte")[3]).toBe(
      "4. Die Bilanz: Jetzt stehst du bei 0 Bauerneinheiten; zähle am Ende jeder Variante nach.",
    );
  });

  it("Abb. 7.7: im Schach keine Abwehrfragen zu Drohungen (erst das Schach)", () => {
    expect(ruhe(stellungVon("7.7"), "white").befunde.map((b) => b.kennung)).toEqual(["punkte"]);
  });
});
