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
  zufallDesTages,
} from "./startorden";

const PARTIE: Stueck = { art: "abzeichen", kennung: "erstePartie", name: "Erste Partie" };
const SIEG: Stueck = { art: "abzeichen", kennung: "ersterSieg", name: "Erster Sieg" };
const TEIL: Stueck = { art: "orden", kennung: "teil-grundlagen", name: "Teil Grundlagen" };

describe("planeStart", () => {
  it("vergisst kein bekanntes Stück, wenn ein Ring später lädt (Prüfung 31.10.2026)", () => {
    // Erster Start dieser Sitzung: Der Orden Teil Grundlagen ist bekannt, aber noch nicht geladen.
    const { plan, bekanntNeu } = planeStart("orden:teil-grundlagen", [PARTIE], 0);
    expect(plan.art).toBe("neu");
    expect(bekanntNeu).toBe("orden:teil-grundlagen,abzeichen:erstePartie");
    // Nächster Start mit allem geladen: nichts ist neu, der Orden fliegt nicht noch einmal.
    expect(planeStart(bekanntNeu, [PARTIE, TEIL], 0).plan.art).toBe("tag");
  });

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

describe("zufallDesTages", () => {
  it("bleibt einen Tag lang gleich und wechselt am nächsten", () => {
    const morgens = zufallDesTages(new Date(2026, 9, 31, 7));
    expect(zufallDesTages(new Date(2026, 9, 31, 23))).toBe(morgens);
    expect(zufallDesTages(new Date(2026, 10, 1, 7))).not.toBe(morgens);
    expect(morgens).toBeGreaterThanOrEqual(0);
    expect(morgens).toBeLessThan(1);
  });
});
