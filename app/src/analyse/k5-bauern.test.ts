/**
 * Referenztests für k5-bauern an Kapitel 5, Leitfrage 2 (Abb. 5.15 bis 5.22) und Skelettbilanzen.
 */
import { describe, expect, it } from "vitest";
import { stellungVon } from "../schach/buchabbildungen.testhilfe";
import { bauern } from "./k5-bauern";

function befund(nummer: string, farbe: "white" | "black") {
  const s = stellungVon(nummer);
  const e = bauern(s, farbe);
  return { e, zeilen: e.befunde.find((b) => b.kennung === farbe)?.zeilen ?? [] };
}

describe("k5-bauern", () => {
  it("Abb. 5.17: Weiß Isolani d4, drei Bauerninseln; Schwarz gesund, zwei Inseln", () => {
    const weiss = befund("5.17", "white");
    expect(weiss.zeilen).toEqual([
      "d4: Isolani – keine Nachbarn mehr",
      "3 Bauerninseln.",
      "Offene Linien: c-Linie; halboffen für Weiß: e-Linie",
    ]);
    expect(weiss.e.markierungen).toContainEqual({
      typ: "feld",
      farbe: "rot",
      feld: "d4",
      text: "I",
    });
    const schwarz = befund("5.17", "black");
    expect(schwarz.zeilen[0]).toBe("Alle Bauern bestehen den Deckungstest.");
    expect(schwarz.zeilen[1]).toBe("2 Bauerninseln.");
    // Aus Sicht von Schwarz ist der Isolani ein Ziel: gold mit Kürzel.
    expect(schwarz.e.markierungen).toContainEqual({
      typ: "feld",
      farbe: "gold",
      feld: "d4",
      text: "I",
    });
  });

  it("Abb. 5.15: Doppelbauern c7 und c6", () => {
    const schwarz = befund("5.15", "black");
    expect(schwarz.zeilen[0]).toBe("c7: Doppelbauer – die beiden decken einander nie");
    expect(schwarz.zeilen[1]).toBe("c6: Doppelbauer – die beiden decken einander nie");
  });

  it("Abb. 5.22: hängende Bauern c5 und d5, Isolani a7, drei Inseln", () => {
    const schwarz = befund("5.22", "black");
    expect(schwarz.zeilen.slice(0, 4)).toEqual([
      "a7: Isolani – keine Nachbarn mehr",
      "c5: hängendes Paar – deckt sich nicht direkt",
      "d5: hängendes Paar – deckt sich nicht direkt",
      "3 Bauerninseln.",
    ]);
  });

  it("Abb. 5.34 (nach dem Minderheitsangriff): c6 rückständig, a7 isoliert", () => {
    const schwarz = befund("5.34", "black");
    expect(schwarz.zeilen[0]).toBe("a7: Isolani – keine Nachbarn mehr");
    expect(schwarz.zeilen[1]).toMatch(/^c6: rückständig/);
  });

  it("Abb. 5.26: die Basis d4 ohne Stütze fällt durch (Kürzel B), graue c-Linie", () => {
    const weiss = befund("5.26", "white");
    expect(weiss.zeilen[0]).toBe("d4: Kettenbasis ohne Stütze – kein Bauer der Kette deckt sie");
    expect(weiss.e.markierungen).toContainEqual({
      typ: "feld",
      farbe: "rot",
      feld: "d4",
      text: "B",
    });
    expect(weiss.e.markierungen).toContainEqual({ typ: "feld", farbe: "grau", feld: "c4" });
    expect(weiss.e.fazit).toBe(
      "Schwache Bauern: Weiß 1, Schwarz 0. Weniger Bauerninseln bedeuten meist die gesündere Struktur.",
    );
  });
});
