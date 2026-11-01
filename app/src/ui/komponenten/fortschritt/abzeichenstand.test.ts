/**
 * Tests der Meldung neuer Abzeichen (abzeichenstand.ts): Nach dem Einspielen einer Datensicherung
 * auf einem neuen Gerät fehlen die Merker; das Datum in „verdient“ hält die Feier trotzdem fest
 * (Fehlertest f3, 01.11.2026).
 */
import { describe, expect, it } from "vitest";
import { istNeu } from "./abzeichenstand";

const LEER = { gefeiert: new Set<string>(), probe: new Set<string>() };

describe("Abzeichen: braucht es eine Meldung?", () => {
  it("neu verdient, ohne Merker und ohne Datum → Meldung", () => {
    expect(istNeu("erstePartie", LEER, {})).toBe(true);
  });

  it("Merker kennt es oder das Datum der ersten Feier steht in den Daten → keine Meldung", () => {
    expect(istNeu("erstePartie", { ...LEER, gefeiert: new Set(["erstePartie"]) }, {})).toBe(false);
    expect(istNeu("erstePartie", LEER, { "abzeichen:erstePartie": "2026-10-12T10:00:00Z" })).toBe(
      false,
    );
    // Ein anderes Datum (etwa ein Orden) zählt nicht für dieses Abzeichen.
    expect(istNeu("erstePartie", LEER, { "orden:uebungen": "2026-10-12T10:00:00Z" })).toBe(true);
  });

  it("zur Probe des Autors kommt die Meldung, auch wenn es das Datum schon gibt", () => {
    const probe = { ...LEER, probe: new Set(["erstePartie"]) };
    expect(istNeu("erstePartie", probe, { "abzeichen:erstePartie": "2026-10-12T10:00:00Z" })).toBe(
      true,
    );
  });
});
