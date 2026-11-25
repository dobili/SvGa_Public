/**
 * Tests der Pixelfiguren: die Märchenfiguren (Auftrag des Hauptchats, 26.11.2026: Falke, Bison,
 * Drache, gezeichnet nach den Gemini-Figuren des Autors).
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
