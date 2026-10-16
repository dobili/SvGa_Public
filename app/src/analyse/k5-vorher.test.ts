/**
 * Referenztests für k5-vorher an Kapitel 5 (Grundgesetz der Bauern, Abb. 5.1 bis 5.4, 5.13).
 */
import { describe, expect, it } from "vitest";
import {
  naechsterBuchzug,
  stellungAus,
  stellungVon,
  verlaufBis,
} from "../schach/buchabbildungen.testhilfe";
import { vorher } from "./k5-vorher";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

describe("k5-vorher", () => {
  it("Grundstellung, 1. e4: vorn d5 und f5, hinten d3 und f3 (wie Abb. 5.1 und 5.2)", () => {
    const e = vorher(stellungAus(GRUNDSTELLUNG), "e4");
    expect(e.ueberschrift).toBe("Vorher: e4 (der nächste Zug)");
    expect(e.befunde[0]?.zeilen).toEqual(["Neu kontrolliert: d5 und f5"]);
    expect(e.befunde[1]?.zeilen).toEqual(["Diese Felder deckt er nie wieder: d3 und f3"]);
    expect(e.befunde[2]?.zeilen[0]).toBe("Felder: ja – erobert d5 und f5");
    expect(e.befunde[2]?.zeilen[3]).toBe("Figur: ja – öffnet Läufer f1 und Dame d1 den Weg");
    expect(e.fazit).toBe("e4 erfüllt 2 von 4 Gründen: Felder und Figur.");
    expect(e.markierungen).toContainEqual({ typ: "feld", farbe: "gold", feld: "d5" });
    expect(e.markierungen).toContainEqual({ typ: "feld", farbe: "rot", feld: "f3" });
    expect(e.markierungen).toContainEqual({ typ: "pfeil", farbe: "gold", von: "e2", nach: "e4" });
  });

  it("Abb. 5.3, der nächste Buchzug 3... c5: Hebel gegen die Basis d4 (Richtung)", () => {
    const e = vorher(stellungVon("5.3"), naechsterBuchzug("5.3") ?? undefined, verlaufBis("5.3"));
    expect(e.ueberschrift).toBe("Vorher: c5 (der nächste Zug)");
    expect(e.befunde[2]?.zeilen[2]).toBe("Richtung: ja – Hebel gegen d4");
    expect(e.befunde[2]?.zeilen[3]).toBe("Figur: ja – öffnet Dame d8 den Weg");
  });

  it("Abb. 5.4: ohne geplanten Bauernzug gilt der letzte Zug des Verlaufs (4. c3)", () => {
    const e = vorher(stellungVon("5.4"), "Nc6", verlaufBis("5.4"));
    expect(e.ueberschrift).toBe("Vorher: c3 (der letzte Zug)");
    expect(e.befunde[2]?.zeilen[1]).toBe("Bauernschwäche: ja – beseitigt die eigene Schwäche d4");
  });

  it("vor Abb. 5.12, h3: Luftloch für den König (Grund Figur), wie Abb. 5.13", () => {
    // Abb. 5.12 ist schon das Matt; hier steht der Turm noch auf e8, Weiß spielt h3.
    const e = vorher(stellungAus("4r1k1/8/8/8/8/8/5PPP/6K1 w - - 0 1"), "h3");
    expect(e.befunde[2]?.zeilen[3]).toBe("Figur: ja – gibt dem König ein Fluchtfeld (Luftloch)");
    expect(e.befunde[1]?.zeilen[0]).toBe("Diese Felder deckt er nie wieder: g3");
  });

  it("kein Bauernzug: Hinweis statt Rechnung", () => {
    const e = vorher(stellungVon("6.21"), "Ng5");
    expect(e.befunde[0]?.titel).toBe("Kein Bauernzug");
    expect(e.markierungen).toEqual([]);
  });
});
