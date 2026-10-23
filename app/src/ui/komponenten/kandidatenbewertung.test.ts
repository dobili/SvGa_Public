/**
 * Tests der Kandidatenbewertung: Wert aus Sicht, Urteil gegenüber der Stellung jetzt, Texte.
 */
import { describe, expect, it } from "vitest";
import {
  kandidatenurteil,
  urteiltext,
  vergleichswert,
  wertAusSicht,
  wertzahl,
} from "./kandidatenbewertung";

describe("kandidatenbewertung", () => {
  it("dreht den Wert für Schwarz: +0,80 → −0,80, #3 → −#3", () => {
    expect(wertAusSicht({ art: "bauern", bauern: 0.8 }, "black")).toEqual({
      art: "bauern",
      bauern: -0.8,
    });
    expect(wertAusSicht({ art: "matt", zuege: 3 }, "black")).toEqual({ art: "matt", zuege: -3 });
    expect(wertzahl({ art: "bauern", bauern: 0.8 }, "black")).toBe("−0,80");
    expect(wertzahl({ art: "matt", zuege: 2 }, "white")).toBe("#2");
  });

  it("hält die Stellung bis 0,3 Bauern Unterschied, sonst besser oder schlechter", () => {
    const jetzt = { art: "bauern", bauern: 0.4 } as const;
    expect(kandidatenurteil(jetzt, { art: "bauern", bauern: 0.3 })).toEqual({ art: "haelt" });
    expect(kandidatenurteil(jetzt, { art: "bauern", bauern: -1.2 })).toEqual({
      art: "schlechter",
      betrag: 1.6,
    });
    expect(kandidatenurteil(jetzt, { art: "bauern", bauern: 1.0 })).toEqual({
      art: "besser",
      betrag: 0.6,
    });
    expect(urteiltext(kandidatenurteil(jetzt, { art: "bauern", bauern: -1.2 }))).toBe(
      "verschlechtert die Stellung um 1,60",
    );
    expect(urteiltext({ art: "haelt" })).toBe("hält die Stellung");
  });

  it("ein Matt geht vor: setzt matt in 2, wird matt in 3; ein verschenktes Matt ist schlechter", () => {
    const jetzt = { art: "bauern", bauern: 0 } as const;
    expect(urteiltext(kandidatenurteil(jetzt, { art: "matt", zuege: 2 }))).toBe("setzt matt in 2");
    expect(urteiltext(kandidatenurteil(jetzt, { art: "matt", zuege: -3 }))).toBe("wird matt in 3");
    expect(
      urteiltext(kandidatenurteil({ art: "matt", zuege: 1 }, { art: "bauern", bauern: 2 })),
    ).toBe("verschlechtert die Stellung um das Matt");
  });

  it("vergleicht: eigenes Matt am größten, dann die Bauern", () => {
    expect(vergleichswert({ art: "matt", zuege: 2 })).toBeGreaterThan(
      vergleichswert({ art: "bauern", bauern: 9 }),
    );
    expect(vergleichswert({ art: "matt", zuege: -2 })).toBeLessThan(
      vergleichswert({ art: "bauern", bauern: -9 }),
    );
  });
});
