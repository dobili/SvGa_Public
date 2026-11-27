/**
 * Tests der Texte zu einem Speicherplatz (platztext.ts): Akt, Ort, Spielzeit, Nadeln.
 */
import { describe, expect, it } from "vitest";
import { leererAbenteuerstand } from "../regeln/spielstand";
import { akttext, nadeltext, orttext, platzzeile, spielzeittext } from "./platztext";

const STAND = leererAbenteuerstand(new Date("2026-11-27T09:00:00.000Z"), "Kim", 800, false);

describe("Texte zum Speicherplatz", () => {
  it("nennt Akt, Ort und Spielzeit in einer Zeile", () => {
    const mitte = {
      ...STAND,
      handlung: { ...STAND.handlung, akt: 2 },
      position: { ...STAND.position, karte: "riverton.aussen" },
      spielzeitSekunden: 11_100,
    };
    expect(platzzeile(mitte)).toBe("Akt 2 · Riverton · 3 Std. 5 Min.");
  });

  it("zeigt nach dem Finale keinen Akt und kurze Spielzeiten in Minuten", () => {
    expect(akttext(5)).toBe("Nach dem Finale");
    expect(spielzeittext(300)).toBe("5 Min.");
    expect(spielzeittext(20)).toBe("0 Min.");
  });

  it("zeigt einen Ort ohne Namen mit seiner Kennung", () => {
    const fremd = { ...STAND, position: { ...STAND.position, karte: "nirgendwo.aussen" } };
    expect(orttext(fremd)).toBe("nirgendwo");
    expect(orttext(STAND)).toBe("Maple Falls");
  });

  it("zählt die Clubnadeln mit Einzahl und null", () => {
    expect(nadeltext(STAND)).toBe("Noch keine Clubnadel");
    const club = { kennung: "mapleFalls", nadel: "bronze", aufgabenreihe: false, versuche: 1 };
    expect(nadeltext({ ...STAND, clubs: [club] } as typeof STAND)).toBe("1 Clubnadel");
  });
});
