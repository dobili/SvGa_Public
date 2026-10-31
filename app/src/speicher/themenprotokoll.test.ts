/**
 * Tests des Antwortprotokolls je Thema (Gamifizierung G1) und seiner Auswertung.
 */
import { describe, expect, it } from "vitest";
import { schwaechstesThema, staerkstesThema, themenquote } from "../training/themenstand";
import { leereDaten } from "./format";
import { LETZTE_ANTWORTEN, TAGE_JE_THEMA } from "./gamifizierung";
import { notiereThemenantwort, themaTaktik } from "./themenprotokoll";

const TAG = (n: number) => new Date(2026, 9, n, 12);

describe("Antwortprotokoll je Thema", () => {
  it("zählt richtig und falsch, merkt Tage nur mit richtiger Antwort und ohne Doppel", () => {
    let d = notiereThemenantwort(leereDaten(TAG(1)), themaTaktik("gabel"), true, TAG(1));
    d = notiereThemenantwort(d, "taktik:gabel", true, TAG(1));
    d = notiereThemenantwort(d, "taktik:gabel", false, TAG(2));
    expect(d.themen["taktik:gabel"]).toMatchObject({
      richtig: 2,
      falsch: 1,
      letzte: "rrf",
      tage: ["2026-10-01"],
    });
  });

  it("schneidet auf die letzten 20 Antworten und 12 Tage", () => {
    let d = leereDaten(TAG(1));
    for (let i = 1; i <= 25; i++) d = notiereThemenantwort(d, "falle", i % 5 !== 0, TAG(i));
    const stand = d.themen.falle;
    expect(stand?.letzte).toHaveLength(LETZTE_ANTWORTEN);
    expect(stand?.tage).toHaveLength(TAGE_JE_THEMA);
    expect(stand?.richtig).toBe(20);
  });

  it("stärkstes und schwächstes Thema erst ab acht Antworten", () => {
    let d = leereDaten(TAG(1));
    for (let i = 0; i < 9; i++) d = notiereThemenantwort(d, "taktik:fesselung", i < 5, TAG(1));
    for (let i = 0; i < 10; i++) d = notiereThemenantwort(d, "taktik:gabel", i < 9, TAG(1));
    for (let i = 0; i < 3; i++) d = notiereThemenantwort(d, "taktik:spiess", false, TAG(1));
    expect(schwaechstesThema(d.themen)?.thema).toBe("taktik:fesselung");
    expect(staerkstesThema(d.themen)?.thema).toBe("taktik:gabel");
    expect(themenquote({ richtig: 3, falsch: 1, letzte: "rrfr", tage: [], zuletzt: "" })).toBe(
      0.75,
    );
    expect(schwaechstesThema({})).toBeNull();
  });
});
