/**
 * Tests des Übungsplans (Gamifizierung P11): Kalenderdatei nach RFC 5545 (CRLF, Zeilen höchstens
 * 75 Bytes, floating Ortszeit, RRULE, VALARM, maskierte Texte), erster Termin, heutiger Übungstag.
 */
import { describe, expect, it } from "vitest";
import { leereDaten } from "../speicher/format";
import {
  ersterTermin,
  falte,
  heuteGeplant,
  kalenderdatei,
  maskiere,
  mitUebungsplan,
  plantag,
  ZEILE_BYTES,
} from "./uebungsplan";

/** Samstag, 31.10.2026, 10 Uhr Ortszeit. */
const JETZT = new Date(2026, 9, 31, 10);
const PLAN = { tage: [0, 2, 4], uhrzeit: "18:00", satz: "nach dem Abendessen, am Schreibtisch" };
const TEXTE = {
  titel: "Schach üben",
  beschreibung: "Zeit für ein paar Minuten Schach mit der App zum Buch.",
  erinnerung: "Schach üben",
};

describe("Übungsplan", () => {
  it("kennt den Wochentag mit Montag = 0 und den heutigen Übungstag", () => {
    expect(plantag(JETZT)).toBe(5);
    expect(plantag(new Date(2026, 10, 1))).toBe(6);
    expect(heuteGeplant(PLAN, new Date(2026, 10, 2, 8))).toBe(true);
    expect(heuteGeplant(PLAN, JETZT)).toBe(false);
    expect(heuteGeplant(null, JETZT)).toBe(false);
  });

  it("setzt den ersten Termin auf den nächsten geplanten Tag", () => {
    expect(ersterTermin(PLAN, JETZT)).toEqual(new Date(2026, 10, 2, 18, 0));
    expect(ersterTermin({ ...PLAN, tage: [5] }, JETZT)).toEqual(new Date(2026, 9, 31, 18, 0));
  });

  it("schreibt eine Kalenderdatei nach RFC 5545", () => {
    const ics = kalenderdatei(PLAN, TEXTE, JETZT);
    expect(ics.startsWith("BEGIN:VCALENDAR\r\nVERSION:2.0\r\n")).toBe(true);
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
    // Jeder Zeilenumbruch ist CRLF, keine Zeile länger als 75 Bytes.
    expect(ics.replace(/\r\n/g, "")).not.toMatch(/[\r\n]/);
    for (const zeile of ics.split("\r\n"))
      expect(new TextEncoder().encode(zeile).length).toBeLessThanOrEqual(ZEILE_BYTES);
    const entfaltet = ics.replace(/\r\n /g, "");
    expect(entfaltet).toContain("\r\nDTSTART:20261102T180000\r\n");
    expect(entfaltet).toContain("\r\nDTEND:20261102T182000\r\n");
    expect(entfaltet).toContain("\r\nRRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR\r\n");
    expect(entfaltet).toContain("\r\nSUMMARY:Schach üben\r\n");
    expect(entfaltet).toContain("nach dem Abendessen\\, am Schreibtisch\\n");
    expect(entfaltet).toMatch(/\r\nBEGIN:VALARM\r\nACTION:DISPLAY\r\n.*\r\nTRIGGER:PT0M\r\n/);
    expect(entfaltet).toMatch(/\r\nDTSTAMP:\d{8}T\d{6}Z\r\n/);
    expect(entfaltet).not.toMatch(/TZID|DTSTART:[^\r]*Z/);
  });

  it("endet kurz vor Mitternacht am nächsten Tag", () => {
    const ics = kalenderdatei({ ...PLAN, tage: [6], uhrzeit: "23:50" }, TEXTE, JETZT);
    expect(ics).toContain("DTSTART:20261101T235000");
    expect(ics).toContain("DTEND:20261102T001000");
  });

  it("faltet nach Bytes, ohne ein Zeichen zu zerschneiden", () => {
    const lang = "DESCRIPTION:" + "ü".repeat(60);
    const gefaltet = falte(lang);
    for (const zeile of gefaltet.split("\r\n"))
      expect(new TextEncoder().encode(zeile).length).toBeLessThanOrEqual(ZEILE_BYTES);
    expect(gefaltet.replace(/\r\n /g, "")).toBe(lang);
    expect(maskiere("a;b\\c\nd")).toBe("a\\;b\\\\c\\nd");
  });

  it("speichert nur gültige Pläne, sortiert und ohne Doppel", () => {
    const d = leereDaten(JETZT);
    expect(mitUebungsplan(d, { tage: [4, 0, 4], uhrzeit: "07:30", satz: " vor der Schule " }).uebungsplan)
      .toEqual({ tage: [0, 4], uhrzeit: "07:30", satz: "vor der Schule" });
    expect(mitUebungsplan(d, { tage: [], uhrzeit: "07:30", satz: "" })).toBe(d);
    expect(mitUebungsplan(d, { tage: [1], uhrzeit: "25:00", satz: "" })).toBe(d);
    expect(mitUebungsplan(mitUebungsplan(d, PLAN), null).uebungsplan).toBeNull();
  });
});
