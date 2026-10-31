/**
 * Tests der Startanimation mit Orden: Was ist seit dem letzten Start neu, was ist das Stück des
 * Tages (Wunsch des Autors, 30.10.2026, Entwürfe 3 und 4)?
 */
import { describe, expect, it } from "vitest";
import {
  DAUER_MIT_NEUEM_MS,
  DAUER_STUECK_DES_TAGES_MS,
  planeStart,
  type Stueck,
} from "./startorden";

const PARTIE: Stueck = { art: "abzeichen", kennung: "erstePartie", name: "Erste Partie" };
const SIEG: Stueck = { art: "abzeichen", kennung: "ersterSieg", name: "Erster Sieg" };
const TEIL: Stueck = { art: "orden", kennung: "teil-grundlagen", name: "Teil Grundlagen" };

describe("planeStart", () => {
  it("zeigt das neue Stück und merkt alle verdienten", () => {
    const { plan, bekanntNeu } = planeStart("abzeichen:erstePartie", [PARTIE, SIEG, TEIL], 0);
    expect(plan).toEqual({ art: "neu", stueck: SIEG, weitere: 1, dauerMs: DAUER_MIT_NEUEM_MS });
    expect(bekanntNeu).toBe("abzeichen:erstePartie,abzeichen:ersterSieg,orden:teil-grundlagen");
  });

  it("zeigt ohne Neues das Stück des Tages", () => {
    const { plan } = planeStart("abzeichen:erstePartie,abzeichen:ersterSieg", [PARTIE, SIEG], 0.99);
    expect(plan).toEqual({
      art: "tag",
      stueck: SIEG,
      verdient: 2,
      dauerMs: DAUER_STUECK_DES_TAGES_MS,
    });
  });

  it("hält beim ersten Start nach dem Update nichts für neu", () => {
    const { plan, bekanntNeu } = planeStart(null, [PARTIE, SIEG], 0);
    expect(plan.art).toBe("tag");
    expect(bekanntNeu).toBe("abzeichen:erstePartie,abzeichen:ersterSieg");
  });

  it("bleibt ohne verdiente Stücke beim Springer allein", () => {
    expect(planeStart(null, [], 0.5).plan).toEqual({ art: "nichts" });
    expect(planeStart("", [], 0.5).plan).toEqual({ art: "nichts" });
  });

  it("zeigt ein Stück als neu, wenn vorher nichts verdient war", () => {
    expect(planeStart("", [PARTIE], 0).plan.art).toBe("neu");
  });
});
