/**
 * Tests der vorgefertigten Gegner: Streuung, Sortierung und seit 0.2.60 der Schnitt mit der
 * allgemeinen Abhakliste der Fehlerarten (Rückfrage S7).
 */
import { describe, expect, it } from "vitest";
import { FEHLERARTEN } from "./fehlerart";
import { durchschnitt, GEGNER, gegnerSortiert, gegnerVon, unterAbhakliste } from "./gegner";

describe("vorgefertigte Gegner", () => {
  it("sind nach Durchschnitt sortiert, Großmeister Grün zuletzt", () => {
    const sortiert = gegnerSortiert();
    expect(sortiert).toHaveLength(GEGNER.length);
    for (let i = 1; i < sortiert.length; i += 1) {
      const vorher = sortiert[i - 1];
      const jetzt = sortiert[i];
      if (vorher && jetzt) expect(durchschnitt(vorher)).toBeLessThanOrEqual(durchschnitt(jetzt));
    }
    expect(sortiert.at(-1)?.stufenJePhase.mittelspiel).toBe(8);
  });
});

describe("Abhakliste der Fehlerarten (0.2.60)", () => {
  it("lässt alles unverändert, wenn alle Arten erlaubt sind", () => {
    expect(unterAbhakliste(null, FEHLERARTEN)).toBeNull();
    const max = gegnerVon("max");
    expect(max && unterAbhakliste(max.fehlerarten, FEHLERARTEN)).toEqual(max?.fehlerarten);
  });
  it("beschneidet die Liste eines Gegners: Max ohne „Figur hängen lassen“", () => {
    const max = gegnerVon("max");
    if (!max) throw new Error("Max fehlt");
    const erlaubt = FEHLERARTEN.filter((art) => art !== "figurHaengen");
    expect(max.fehlerarten).toContain("figurHaengen");
    expect(unterAbhakliste(max.fehlerarten, erlaubt)).toEqual(
      max.fehlerarten.filter((art) => art !== "figurHaengen"),
    );
  });
  it("ergibt für die reine Engine die Abhakliste, leer heißt keine absichtlichen Fehler", () => {
    expect(unterAbhakliste(null, ["bauernraub"])).toEqual(["bauernraub"]);
    expect(unterAbhakliste(null, [])).toEqual([]);
    expect(unterAbhakliste(["bauernraub", "tempoverlust"], ["tempoverlust", "ungenau"])).toEqual([
      "tempoverlust",
    ]);
  });
});
