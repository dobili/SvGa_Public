/**
 * Referenztests für k7-erzwingend an Kapitel 7, Schritt 2 (Abb. 7.11, 7.14, 7.44) und im Schach.
 */
import { describe, expect, it } from "vitest";
import { stellungVon } from "../schach/buchabbildungen.testhilfe";
import { erzwingend, erzwingendeKandidaten, kandidatenMarkierungen } from "./k7-erzwingend";

function zeilen(nummer: string, kennung: string): readonly string[] {
  const s = stellungVon(nummer);
  return erzwingend(s, s.amZug).befunde.find((b) => b.kennung === kennung)?.zeilen ?? [];
}

describe("k7-erzwingend", () => {
  it("Abb. 7.11: zwei Kandidaten mit Doppelschach stehen unter den Schachs", () => {
    const schachs = zeilen("7.11", "schach");
    expect(schachs).toContain("7. Sd6+");
    expect(schachs).toContain("8. Sf6+");
    expect(zeilen("7.11", "schlag")).toEqual(["9. Dxh5 (5)"]);
  });

  it("Abb. 7.14: Schachs zuerst (Te8+, Th8+), dann der Schlag Sxf7 mit Bilanz", () => {
    expect(zeilen("7.14", "schach")).toEqual(["1. Te8+", "2. Th8+"]);
    expect(zeilen("7.14", "schlag")).toEqual(["3. Sxf7 (-2)"]);
    const e = erzwingend(stellungVon("7.14"), "white");
    expect(e.markierungen).toContainEqual({ typ: "feld", farbe: "gold", feld: "h8", text: "2+" });
    expect(e.fazit).toBe(
      "Weiß hat 8 Kandidaten: 2 Schachs, 1 Schläge, 5 Drohungen. Rechne sie in dieser Reihenfolge, jeden bis zur Ruhe.",
    );
  });

  it("Abb. 7.14 (B1): die Kandidaten für die Engine in Rechenreihenfolge", () => {
    const liste = erzwingendeKandidaten(stellungVon("7.14"), "white");
    expect(liste.slice(0, 3).map((k) => k.zug.uci)).toEqual(["e1e8", "h1h8", "g5f7"]);
    expect(liste).toHaveLength(8);
    expect(erzwingendeKandidaten(stellungVon("7.7"), "white")).toEqual([]);
  });

  it("Abb. 7.14 (B1): nach der Engine „2+!“ gold, verworfene Kandidaten grau", () => {
    const liste = erzwingendeKandidaten(stellungVon("7.14"), "white");
    const einstufung = new Map([
      [1, "verworfen"],
      [2, "bester"],
      [3, "verworfen"],
    ] as const);
    const m = kandidatenMarkierungen(liste, einstufung);
    expect(m).toContainEqual({ typ: "feld", farbe: "gold", feld: "h8", text: "2+!" });
    expect(m).toContainEqual({ typ: "feld", farbe: "grau", feld: "e8", text: "1+" });
    expect(m).toContainEqual({ typ: "pfeil", farbe: "grau", von: "g5", nach: "f7" });
    expect(m).toContainEqual({ typ: "pfeil", farbe: "gold", von: "h1", nach: "h8" });
  });

  it("Abb. 7.44 (Übung): die rettenden Schachs Tg1+ und Te7+ sind die ersten Kandidaten", () => {
    expect(zeilen("7.44", "schach")).toEqual(["1. Tg1+", "2. Te7+"]);
  });

  it("Abb. 7.7: im Schach gelten zuerst die Abwehrfragen", () => {
    const e = erzwingend(stellungVon("7.7"), "white");
    expect(e.befunde[0]?.titel).toBe("Weiß steht im Schach: die Abwehrfragen");
    expect(e.markierungen).toEqual([]);
  });

  it("Lehrbild ohne Regeln (Abb. 5.1): keine Kandidaten, nur die Abwehrfragen", () => {
    expect(erzwingend(stellungVon("5.1"), "white").befunde[0]?.kennung).toBe("abwehr");
  });
});
