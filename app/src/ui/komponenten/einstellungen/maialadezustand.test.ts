/** Tests der Fehlermeldung beim Laden des Maia-Pakets (Fehlertest f3, 01.11.2026). */
import { describe, expect, it } from "vitest";
import { zustandNachFehler } from "./maialadezustand";

describe("Maia laden: Zustand nach einem Fehler", () => {
  it("ohne Netz der eigene Satz statt „Failed to fetch“", () => {
    expect(zustandNachFehler(new TypeError("Failed to fetch"), false)).toEqual({ art: "ohneNetz" });
  });

  it("mit Netz die Meldung des Fehlers, auch bei einem Wert ohne Error", () => {
    expect(zustandNachFehler(new Error("Prüfsumme falsch"), true)).toEqual({
      art: "fehler",
      meldung: "Prüfsumme falsch",
    });
    expect(zustandNachFehler("kaputt", true)).toEqual({ art: "fehler", meldung: "kaputt" });
  });
});
