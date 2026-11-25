/**
 * Tests der Karte „Gefahrenradar“ (anbindung/gefahrenradar.ts, Befund des Autors 25.11.2026):
 * nur angegriffene und nicht ausreichend gedeckte Figuren, keine Kennung „W1“, eine Zeile dazu.
 */
import { describe, expect, it } from "vitest";
import { gefahrenradar } from "./gefahrenradar";

describe("Gefahrenradar", () => {
  it("lässt einen ungedeckten, aber nicht angegriffenen Turm unmarkiert (Befund h1)", () => {
    // Grundstellung ohne Springer g1 und Bauer h2: Th1 ist ungedeckt, aber nichts greift ihn an.
    const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPP1/RNBQKB1R b KQkq - 0 1";
    const radar = gefahrenradar(fen, "white");
    expect(radar.markierungen).toEqual([]);
    expect(radar.text).toBe("Gerade ist keine deiner Figuren in Gefahr.");
  });

  it("markiert eine angegriffene, ungedeckte Figur rot und ohne Beschriftung", () => {
    // Schwarzer Läufer b4 greift den ungedeckten Springer c3 an (Weiß am Zug, Kapitel 1).
    const fen = "4k3/8/8/8/1b6/2N5/8/4K3 w - - 0 1";
    const radar = gefahrenradar(fen, "white");
    expect(radar.markierungen).toEqual([{ typ: "feld", farbe: "rot", feld: "c3" }]);
    expect(radar.text).toContain("Rot umrandet");
  });

  it("lässt eine angegriffene, aber ausreichend gedeckte Figur weg", () => {
    // Springer c3 vom Bauern b2 gedeckt: Lxc3 bxc3 ist ein Abtausch ohne Gewinn.
    const fen = "4k3/8/8/8/1b6/2N5/1P6/4K3 w - - 0 1";
    expect(gefahrenradar(fen, "white").markierungen).toEqual([]);
  });

  it("nennt ein drohendes Matt und markiert den König", () => {
    // Grundreihenmatt: Schwarz droht Ta1#, der König g1 steht hinter seinen eigenen Bauern.
    const fen = "r5k1/8/8/8/8/8/5PPP/6K1 w - - 0 1";
    const radar = gefahrenradar(fen, "white");
    expect(radar.markierungen).toContainEqual({ typ: "feld", farbe: "rot", feld: "g1" });
    expect(radar.text).toContain("Matt");
  });
});
