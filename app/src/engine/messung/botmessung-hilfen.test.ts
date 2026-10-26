/** Tests der Datei der Zahlen je Zeitklasse (engine/messung/botmessung-hilfen.ts, seit 0.2.131 Prüfdatei). */
import { describe, expect, it } from "vitest";
import { zeitklassendatei } from "./botmessung-hilfen";

describe("Datei der Zahlen je Zeitklasse", () => {
  it("nimmt Bots unter ihrer Kennung und lässt Ungemessenes weg", () => {
    const werte = new Map([
      ["stufe1m", 612.4],
      ["stufe10", 2990],
      ["tom", 526],
      ["alt-tom", 700],
      ["luis", -231],
    ]);
    const text = zeitklassendatei(werte, "blitz");
    expect(text).toContain("  1: 612,");
    expect(text).toContain("  10: 2990,");
    expect(text).not.toContain("  2: ");
    expect(text).toContain('  "tom": 526,');
    expect(text).not.toContain("alt-tom");
    expect(text).toContain('  "luis": -231,');
    expect(text).not.toContain("NaN");
  });
});
