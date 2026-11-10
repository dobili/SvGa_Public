import { describe, expect, it } from "vitest";
import { EINGABEPAUSE_MS, gegenrichtung, pausenschritt } from "./eingabepause";

describe("Eingabepause nach dem Kartenwechsel", () => {
  it("hält den Helden bei gehaltener Taste, bis die Zeit um ist", () => {
    let rest = EINGABEPAUSE_MS;
    let bilder = 0;
    while (rest > 0) {
      rest = pausenschritt(rest, 16, true);
      bilder++;
    }
    expect(bilder).toBe(Math.ceil(EINGABEPAUSE_MS / 16));
  });

  it("endet sofort, wenn die Taste einmal losgelassen wird", () => {
    expect(pausenschritt(EINGABEPAUSE_MS, 16, false)).toBe(0);
    // Danach gilt ein neuer Tastendruck sofort.
    expect(pausenschritt(0, 16, true)).toBe(0);
  });

  it("läuft nicht ab, solange die Taste zurück in den Durchgang zeigt", () => {
    expect(gegenrichtung("unten")).toBe("oben");
    expect(pausenschritt(EINGABEPAUSE_MS, 5000, true, true)).toBe(EINGABEPAUSE_MS);
    expect(pausenschritt(EINGABEPAUSE_MS, 16, false, true)).toBe(0);
  });
});
