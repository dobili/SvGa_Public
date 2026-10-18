/**
 * Tests des 30-Minuten-Plans: Wechsel der Tage und Bereiche, Schritte, Uhr, gemerkter Stand.
 * Buchbezug: Kapitel 12, „Der 30-Minuten-Trainingsplan“.
 */
import { describe, expect, it } from "vitest";
import {
  abbrechen,
  aktuellerSchritt,
  LEERER_PLANSTAND,
  mitBereich,
  naechsterBereich,
  naechsterTag,
  PLAN,
  planstandAus,
  restMs,
  starte,
  weiter,
} from "./dreissigminuten";

const MINUTE = 60_000;
const STUNDE = 60 * MINUTE;

describe("30-Minuten-Plan", () => {
  it("hat zwei Tage mit je 30 Minuten (Tabelle in Kapitel 12)", () => {
    for (const schritte of Object.values(PLAN)) {
      expect(schritte.reduce((s, x) => s + x.minuten, 0)).toBe(30);
    }
    expect(PLAN.partietag.map((s) => s.art)).toEqual(["taktik", "partie", "kurzanalyse"]);
    expect(PLAN.studientag.map((s) => s.art)).toEqual(["taktik", "thema", "analyse"]);
  });

  it("wechselt Tage und Bereiche ab", () => {
    expect(naechsterTag(null)).toBe("partietag");
    expect(naechsterTag("partietag")).toBe("studientag");
    expect(naechsterTag("studientag")).toBe("partietag");
    expect(naechsterBereich(null)).toBe("taktik");
    expect(naechsterBereich("endspiel")).toBe("strategie");
    expect(naechsterBereich("eroeffnung")).toBe("taktik");
  });

  it("führt durch die Schritte und merkt Tag und Bereich am Ende", () => {
    let stand = starte({ ...LEERER_PLANSTAND, letzterBereich: "taktik" }, "studientag", 0);
    expect(stand.einheit?.bereich).toBe("endspiel");
    stand = mitBereich(stand, "eroeffnung");
    const eins = weiter(stand, 5 * MINUTE);
    expect(eins.fertig).toBe(false);
    expect(eins.stand.einheit && aktuellerSchritt(eins.stand.einheit).art).toBe("thema");
    const zwei = weiter(eins.stand, 20 * MINUTE);
    const drei = weiter(zwei.stand, 30 * MINUTE);
    expect(drei.fertig).toBe(true);
    expect(drei.stand).toEqual({ einheit: null, letzterTag: "studientag", letzterBereich: "eroeffnung" });
  });

  it("zählt die Restzeit des Schritts, auch über die Zeit hinaus", () => {
    const stand = weiter(starte(LEERER_PLANSTAND, "partietag", 0), 5 * MINUTE).stand;
    const e = stand.einheit;
    expect(e && restMs(e, 6 * MINUTE)).toBe(19 * MINUTE);
    expect(e && restMs(e, 26 * MINUTE)).toBe(-MINUTE);
  });

  it("Abbrechen schaltet den Wechsel nicht weiter", () => {
    const stand = abbrechen(starte(LEERER_PLANSTAND, "partietag", 0));
    expect(stand).toEqual(LEERER_PLANSTAND);
  });

  it("liest den gemerkten Stand, verwirft Unlesbares und verfallene Einheiten", () => {
    const stand = starte({ ...LEERER_PLANSTAND, letzterTag: "studientag" }, "partietag", 0);
    const text = JSON.stringify(stand);
    expect(planstandAus(text, MINUTE)).toEqual(stand);
    expect(planstandAus(text, 4 * STUNDE)).toEqual({ ...stand, einheit: null });
    expect(planstandAus("{kaputt", 0)).toEqual(LEERER_PLANSTAND);
    expect(planstandAus(null, 0)).toEqual(LEERER_PLANSTAND);
    expect(planstandAus(JSON.stringify({ einheit: { tag: "partietag", schritt: 7 } }), 0)).toEqual(
      LEERER_PLANSTAND,
    );
  });
});
