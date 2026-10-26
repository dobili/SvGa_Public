/** Tests für den Hinweis auf die Datensicherung nach vier Stunden App-Zeit. */
import { describe, expect, it } from "vitest";
import { hinweisFaellig, zaehle, type Appzeit } from "./sicherungshinweis";

const STUNDE = 3_600_000;

describe("Hinweis nach vier Stunden App-Zeit", () => {
  it("zählt nur App-Zeit und meldet sich ab vier Stunden", () => {
    let stand: Appzeit = { seitSicherung: null, ms: 0 };
    stand = zaehle(stand, null, 3 * STUNDE);
    expect(hinweisFaellig(stand, null, true, false)).toBe(false);
    stand = zaehle(stand, null, STUNDE);
    expect(hinweisFaellig(stand, null, true, false)).toBe(true);
  });

  it("eine Sicherung setzt die Zählung zurück", () => {
    const vorher = { seitSicherung: null, ms: 5 * STUNDE };
    expect(hinweisFaellig(vorher, "2026-10-15T20:00:00Z", true, false)).toBe(false);
    const danach = zaehle(vorher, "2026-10-15T20:00:00Z", STUNDE);
    expect(danach.ms).toBe(STUNDE);
  });

  it("ohne eigene Daten oder mit „Nicht mehr nachfragen“ kein Hinweis", () => {
    const stand = { seitSicherung: null, ms: 9 * STUNDE };
    expect(hinweisFaellig(stand, null, false, false)).toBe(false);
    expect(hinweisFaellig(stand, null, true, true)).toBe(false);
  });
});
