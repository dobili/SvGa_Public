// Begleiter auf Wegen (Wunsch des Autors, 25.11.2026): Namen aus der Dialogvariable und die Spur.
import { describe, expect, it } from "vitest";
import { begleiterAus, begleiterGeaendert, schrittrichtung, Spur } from "./gefolge";

describe("Begleiter", () => {
  it("liest die Namen aus der Dialogvariable", () => {
    expect(begleiterAus({ begleiter: "juno" })).toEqual(["juno"]);
    expect(begleiterAus({ begleiter: "juno, mutter,juno" })).toEqual(["juno", "mutter"]);
    expect(begleiterAus({ begleiter: "" })).toEqual([]);
    expect(begleiterAus({})).toEqual([]);
    expect(begleiterAus({ begleiter: 3 })).toEqual([]);
  });

  it("erkennt eine Änderung", () => {
    expect(begleiterGeaendert([], { begleiter: "juno" })).toBe(true);
    expect(begleiterGeaendert(["juno"], { begleiter: " juno" })).toBe(false);
    expect(begleiterGeaendert(["juno"], { begleiter: "" })).toBe(true);
  });
});

describe("Spur", () => {
  it("der Begleiter geht den Weg des Helden ein Feld dahinter, auch um die Ecke", () => {
    const spur = new Spur({ x: 5, y: 5 }, [{ x: 4, y: 5 }]);
    expect(spur.ziel(1)).toEqual({ x: 4, y: 5 });
    spur.merke({ x: 6, y: 5 }, 2);
    expect(spur.ziel(1)).toEqual({ x: 5, y: 5 });
    spur.merke({ x: 6, y: 4 }, 2);
    expect(spur.ziel(1)).toEqual({ x: 6, y: 5 });
    expect(spur.ziel(2)).toEqual({ x: 5, y: 5 });
  });

  it("ein Schritt zurück schneidet die Spur ab, der Begleiter bleibt hinter dem Helden", () => {
    const spur = new Spur({ x: 5, y: 5 });
    spur.merke({ x: 6, y: 5 }, 3);
    spur.merke({ x: 7, y: 5 }, 3);
    spur.merke({ x: 6, y: 5 }, 3);
    expect(spur.ziel(1)).toEqual({ x: 5, y: 5 });
  });

  it("bleibt auf demselben Feld unverändert und hat nie mehr Felder als nötig", () => {
    const spur = new Spur({ x: 1, y: 1 });
    spur.merke({ x: 1, y: 1 }, 1);
    expect(spur.ziel(1)).toEqual({ x: 1, y: 1 });
    spur.merke({ x: 2, y: 1 }, 1);
    spur.merke({ x: 3, y: 1 }, 1);
    expect(spur.ziel(5)).toEqual({ x: 2, y: 1 });
  });

  it("nennt die Richtung eines Schritts", () => {
    expect(schrittrichtung({ x: 5, y: 5 }, { x: 6, y: 5 })).toBe("rechts");
    expect(schrittrichtung({ x: 5, y: 5 }, { x: 5, y: 4 })).toBe("oben");
    expect(schrittrichtung({ x: 5, y: 5 }, { x: 5, y: 5 })).toBeNull();
  });
});
