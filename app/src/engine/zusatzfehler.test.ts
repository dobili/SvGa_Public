/**
 * Tests zu hatZusatzfehler (0.2.135, Auftrag „Variante A“, Punkt 5): Ein eigener Gegner mit nur
 * einer Art ohne Gelegenheitsdaten bekommt das Wahlmodell.
 */
import { describe, expect, it } from "vitest";
import { BLINDE_FLECKEN } from "./blindeFlecken";
import { hatZusatzfehler, WIE_MENSCHEN, type Menschenwerte } from "./menschenwahl";

/** Stellschrauben eines eigenen Gegners: nur die erlaubten Arten, alle Flecken aus. */
function nurErlaubt(erlaubt: Menschenwerte["erlaubt"]): Menschenwerte {
  const flecken = Object.fromEntries(BLINDE_FLECKEN.map((f) => [f, 0]));
  return { ...WIE_MENSCHEN, gewichte: flecken, erlaubt };
}

describe("hatZusatzfehler", () => {
  it("zählt Arten ohne Gelegenheitsdaten mit (Schlag verpasst, Bauernzug ohne Not, Patt)", () => {
    expect(hatZusatzfehler(nurErlaubt(["schlagVerpasst"]))).toBe(true);
    expect(hatZusatzfehler(nurErlaubt(["bauernzugOhneNot"]))).toBe(true);
    expect(hatZusatzfehler(nurErlaubt(["pattGesetzt"]))).toBe(true);
  });

  it("zählt „ungenau“ nicht und bleibt ohne Arten und Flecken falsch", () => {
    expect(hatZusatzfehler(nurErlaubt(["ungenau"]))).toBe(false);
    expect(hatZusatzfehler(nurErlaubt([]))).toBe(false);
  });

  it("bleibt bei Häufigkeit 0 falsch und wie Menschen wahr", () => {
    expect(hatZusatzfehler({ ...WIE_MENSCHEN, haeufigkeit: 0 })).toBe(false);
    expect(hatZusatzfehler(WIE_MENSCHEN)).toBe(true);
  });
});
