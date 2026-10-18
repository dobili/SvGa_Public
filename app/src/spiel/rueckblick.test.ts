/** Tests des Rückblicks nach der Partie (Vorschlag H): Zeichen, besserer Zug, Balken, Kurve. */
import { describe, expect, it } from "vitest";
import { balkenanteil, balkentext, kurvenpunkte, rueckblickMarken } from "./rueckblick";

const NACH_E4_E5 = "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2";

describe("Rückblick", () => {
  it("Zeichen am Zielfeld und goldener Pfeil für den besseren Zug", () => {
    const marken = rueckblickMarken(
      NACH_E4_E5,
      "Qh5",
      { index: 2, verlust: 0.6, zeichen: "?!", klasse: "ungenau" },
      "g1f3",
    );
    expect(marken).toEqual([
      { typ: "feld", farbe: "grau", feld: "h5", text: "?!" },
      { typ: "pfeil", farbe: "gold", von: "g1", nach: "f3" },
    ]);
  });

  it("der beste Zug bekommt ein grünes Häkchen und keinen Pfeil; ohne Urteil nichts", () => {
    expect(
      rueckblickMarken(
        NACH_E4_E5,
        "Nf3",
        { index: 2, verlust: 0, zeichen: null, klasse: "bester" },
        "g1f3",
      ),
    ).toEqual([{ typ: "feld", farbe: "gruen", feld: "f3", text: "✓" }]);
    expect(rueckblickMarken(NACH_E4_E5, "Nf3", undefined, "g1f3")).toEqual([]);
    const gleich = rueckblickMarken(
      NACH_E4_E5,
      "Nf3",
      { index: 2, verlust: 1.5, zeichen: "?", klasse: "fehler" },
      "g1f3",
    );
    expect(gleich).toEqual([{ typ: "feld", farbe: "rot", feld: "f3", text: "?" }]);
  });

  it("Balken: Anteil von Weiß und Zahl mit Komma", () => {
    expect(balkenanteil(0)).toBe(0.5);
    expect(balkenanteil(1)).toBeCloseTo(0.6);
    expect(balkenanteil(-8)).toBe(0);
    expect(balkentext(1.26)).toBe("+1,3");
    expect(balkentext(-0.4)).toBe("−0,4");
    expect(balkentext(0.01)).toBe("0,0");
    expect(balkentext(10)).toBe("+M");
    expect(balkentext(-10)).toBe("−M");
  });

  it("Kurve: gleichmäßige x, +5 oben, −5 unten", () => {
    expect(kurvenpunkte([0, 5, -5], 100, 50)).toEqual([
      { x: 0, y: 25 },
      { x: 50, y: 0 },
      { x: 100, y: 50 },
    ]);
  });
});
