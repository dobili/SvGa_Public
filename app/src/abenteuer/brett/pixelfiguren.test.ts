/**
 * Tests der Pixelfiguren: die Platzhalter der Märchenfiguren (Auftrag des
 * Hauptchats, 26.11.2026: Falke, Bison, Drache als Buchstabe im Kreis, bis Bilder da sind).
 */
import { describe, expect, it } from "vitest";
import { figurenraster } from "./pixelfiguren";

describe("Pixelfiguren", () => {
  it("kennt die FEN-Zeichen der Märchenfiguren wie Fairy-Stockfish (H, E, D)", () => {
    for (const zeichen of ["H", "h", "E", "e", "D", "d"])
      expect(figurenraster(zeichen)).not.toBeNull();
    expect(figurenraster("H")).not.toEqual(figurenraster("E"));
    expect(figurenraster("E")).not.toEqual(figurenraster("D"));
    expect(figurenraster("x")).toBeNull();
  });
});
