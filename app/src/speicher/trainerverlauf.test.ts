/**
 * Tests zu speicher/trainerverlauf.ts: Rateverlauf lesen, Durchgänge anhängen, Planstand.
 */
import { describe, expect, it } from "vitest";
import { mitRatedurchgang, planstandTextAus, rateverlaufAus } from "./trainerverlauf";

const DATUM = "2026-10-18T22:00:00.000Z";

describe("Rateverlauf (Zug erraten, seit 0.2.90)", () => {
  it("liest gültige Durchgänge und verwirft Unlesbares", () => {
    const roh = {
      "Opernpartie (white)": [
        { datum: DATUM, treffer: 7, versuche: 12 },
        { datum: DATUM, treffer: "viele", versuche: 12 },
      ],
      kaputt: "nein",
    };
    expect(rateverlaufAus(roh)).toEqual({
      "Opernpartie (white)": [{ datum: DATUM, treffer: 7, versuche: 12 }],
    });
    expect(rateverlaufAus(null)).toEqual({});
    expect(rateverlaufAus([1, 2])).toEqual({});
  });

  it("hängt an und behält höchstens zehn Durchgänge, den neuesten zuletzt", () => {
    let verlauf = {};
    for (let i = 0; i < 12; i++) {
      verlauf = mitRatedurchgang(verlauf, "p", { datum: DATUM, treffer: i, versuche: 12 });
    }
    const liste = rateverlaufAus(verlauf).p ?? [];
    expect(liste).toHaveLength(10);
    expect(liste.at(-1)?.treffer).toBe(11);
  });

  it("Treffer über den Versuchen werden gekappt", () => {
    const v = rateverlaufAus({ p: [{ datum: DATUM, treffer: 9, versuche: 3 }] });
    expect(v.p?.[0]?.treffer).toBe(3);
  });
});

describe("Planstand in den Nutzerdaten", () => {
  it("übernimmt nur Text", () => {
    expect(planstandTextAus('{"letzterTag":"partietag"}')).toBe('{"letzterTag":"partietag"}');
    expect(planstandTextAus(3)).toBeNull();
  });
});
