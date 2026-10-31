/**
 * Test der Legenden-Reihen (Runde „Weniger Text“, P7): Jedes Werkzeug mit Legendensatz hat eine
 * Reihe aus Zeichen, und jede Reihe gehört zu einem Werkzeug mit Satz (der Satz steht hinter ⓘ).
 */
import { describe, expect, it } from "vitest";
import de from "../../i18n/de.json";
import { LEGENDEN } from "./legenden";

const SATZ = /^werkzeug\.(.+)\.legende$/;

describe("Legenden als Zeichenreihe", () => {
  const mitSatz = Object.keys(de)
    .map((k) => SATZ.exec(k)?.[1])
    .filter((id): id is string => id !== undefined);

  it("jedes Werkzeug mit Legendensatz hat eine Reihe", () => {
    expect(mitSatz.filter((id) => !LEGENDEN[id])).toEqual([]);
  });

  it("jede Reihe gehört zu einem Werkzeug mit Satz und ist kurz", () => {
    for (const [id, reihe] of Object.entries(LEGENDEN)) {
      expect(mitSatz).toContain(id);
      expect(reihe.length).toBeGreaterThan(0);
      expect(reihe.length).toBeLessThanOrEqual(4);
    }
  });
});
