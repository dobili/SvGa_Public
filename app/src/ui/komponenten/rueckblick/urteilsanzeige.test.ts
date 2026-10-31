/**
 * Tests der Veränderung als Pfeil mit Zahl (Weniger Text P13, Notiz des Autors 31.10.2026).
 */
import { describe, expect, it } from "vitest";
import { aenderungstext, NUR_MARKE } from "./urteilsanzeige";

describe("aenderungstext", () => {
  it("Weiß verbessert sich: Pfeil nach oben", () => {
    expect(aenderungstext(1.5, 1.6, true)).toEqual({ pfeil: "auf", text: "▲ 0,1" });
  });
  it("Schwarz zieht, die Bewertung steigt für Weiß: für Schwarz ein Verlust", () => {
    expect(aenderungstext(0.2, 3.4, false)).toEqual({ pfeil: "ab", text: "▼ 3,2" });
  });
  it("fast unverändert: ± 0,0", () => {
    expect(aenderungstext(0.31, 0.33, true)).toEqual({ pfeil: "gleich", text: "± 0,0" });
  });
  it("mit Matt: M statt Zahl", () => {
    expect(aenderungstext(0.5, 12, true).text).toBe("▲ M");
  });
  it("beste Züge zeigen nur die Marke, Fehler behalten ihren Satz", () => {
    expect(NUR_MARKE.has("bester")).toBe(true);
    expect(NUR_MARKE.has("patzer")).toBe(false);
  });
});
