/**
 * Tests für den Meldungsstau (oberwelt/meldungsstau.ts): Meldungen warten im Dialog und kommen
 * danach der Reihe nach, keine geht verloren.
 * Abhängigkeiten: vitest.
 */
import { describe, expect, it } from "vitest";
import { LEERER_STAU, mitMeldung, nachDialog, ohneGezeigte, type Meldung } from "./meldungsstau";

const TESTTEAM: Meldung = { text: "Neu im Tagebuch: Das Testteam" };
const FUND: Meldung = { text: "Gefunden: Läufer aus Buchsbaum", bild: "funde/laeufer.png" };
const ERLEDIGT: Meldung = { text: "Erledigt: Das Brett auf dem Dachboden" };

describe("mitMeldung", () => {
  it("zeigt eine Meldung ohne Dialog sofort", () => {
    expect(mitMeldung(LEERER_STAU, TESTTEAM, false)).toEqual({ gezeigt: TESTTEAM, wartend: [] });
  });

  it("ersetzt ohne Dialog die gezeigte Meldung, wie bisher", () => {
    const stau = mitMeldung(mitMeldung(LEERER_STAU, FUND, false), ERLEDIGT, false);
    expect(stau).toEqual({ gezeigt: ERLEDIGT, wartend: [] });
  });

  it("lässt eine Meldung im offenen Dialog warten", () => {
    expect(mitMeldung(LEERER_STAU, TESTTEAM, true)).toEqual({ gezeigt: null, wartend: [TESTTEAM] });
  });

  it("stellt eine Meldung nach dem Dialog hinten an, solange andere warten", () => {
    const imDialog = mitMeldung(mitMeldung(LEERER_STAU, FUND, true), ERLEDIGT, true);
    const danach = mitMeldung(nachDialog(imDialog), TESTTEAM, false);
    expect(danach).toEqual({ gezeigt: FUND, wartend: [ERLEDIGT, TESTTEAM] });
  });
});

describe("nachDialog und ohneGezeigte", () => {
  it("zeigt nach dem Dialog alle Meldungen in ihrer Reihenfolge, eine je „Weiter“", () => {
    let stau = LEERER_STAU;
    for (const m of [FUND, ERLEDIGT, TESTTEAM]) stau = mitMeldung(stau, m, true);
    expect(stau.gezeigt).toBeNull();
    const gesehen: Meldung[] = [];
    stau = nachDialog(stau);
    while (stau.gezeigt) {
      gesehen.push(stau.gezeigt);
      stau = ohneGezeigte(stau, false);
    }
    expect(gesehen).toEqual([FUND, ERLEDIGT, TESTTEAM]);
    expect(stau).toEqual(LEERER_STAU);
  });

  it("behält eine Meldung von vor dem Dialog und reiht die neuen dahinter", () => {
    const vorher = mitMeldung(LEERER_STAU, FUND, false);
    const danach = nachDialog(mitMeldung(vorher, TESTTEAM, true));
    expect(danach).toEqual({ gezeigt: FUND, wartend: [TESTTEAM] });
    expect(ohneGezeigte(danach, false)).toEqual({ gezeigt: TESTTEAM, wartend: [] });
  });

  it("rückt im offenen Dialog nicht nach, wenn die gezeigte Meldung geschlossen wird", () => {
    const stau = mitMeldung(mitMeldung(LEERER_STAU, FUND, false), TESTTEAM, true);
    expect(ohneGezeigte(stau, true)).toEqual({ gezeigt: null, wartend: [TESTTEAM] });
  });

  it("lässt einen leeren Stau leer", () => {
    expect(nachDialog(LEERER_STAU)).toBe(LEERER_STAU);
    expect(ohneGezeigte(LEERER_STAU, false)).toEqual(LEERER_STAU);
  });
});
