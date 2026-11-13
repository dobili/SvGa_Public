/** Tests für schutzengel.ts: Karte K4, Ambrose hält einen groben Fehler auf. */
import { describe, expect, it } from "vitest";
import type { Partiekarten } from "../schnittstelle/spielstand";
import { schutzengelGesperrt, schutzengelWacht, schutzgrund, SCHUTZENGEL } from "./schutzengel";

const bauern = (b: number) => ({ art: "bauern" as const, bauern: b });
const matt = (z: number) => ({ art: "matt" as const, zuege: z });

function karten(halbzug: number, ausgeloest = false): Partiekarten {
  return {
    deck: [SCHUTZENGEL],
    gespielt: [
      { kennung: SCHUTZENGEL, stufe: "mittel", halbzug, ...(ausgeloest ? { ausgeloest } : {}) },
    ],
    wiedereinstieg: false,
    letzterHalbzug: halbzug,
  };
}

describe("Schutzengel", () => {
  it("erkennt grobe Fehler aus Sicht des Helden", () => {
    expect(schutzgrund(bauern(0.3), bauern(-2.5), true)).toBe("haengt");
    expect(schutzgrund(bauern(0.3), bauern(-0.5), true)).toBeNull();
    // Schwarz: Weiß gewinnt nach dem Zug drei Bauern.
    expect(schutzgrund(bauern(-0.2), bauern(2.8), false)).toBe("haengt");
    expect(schutzgrund(bauern(0), matt(-2), true)).toBe("koenig");
    expect(schutzgrund(matt(2), bauern(5), true)).toBe("matt");
    expect(schutzgrund(matt(2), matt(1), true)).toBeNull();
  });

  it("wacht fünf eigene Züge lang und nach dem Aufhalten nicht mehr", () => {
    const vier = [true, false, true, false, true, false, true, false];
    expect(schutzengelWacht(karten(0), vier)).toBe(true);
    expect(schutzengelWacht(karten(0), [...vier, true, false])).toBe(false);
    expect(schutzengelWacht(karten(0, true), [])).toBe(false);
    expect(schutzengelWacht(null, [])).toBe(false);
  });

  it("ist ohne Ambrose gesperrt", () => {
    expect(schutzengelGesperrt({ tiefpunktGesehen: true }, "x.y")).toBe(true);
    expect(schutzengelGesperrt({ tiefpunktGesehen: true, versoehnungGesehen: true }, "x.y")).toBe(
      false,
    );
    expect(schutzengelGesperrt({}, "capitalArena.finale#abc")).toBe(true);
  });
});
