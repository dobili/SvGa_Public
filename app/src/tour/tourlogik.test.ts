/**
 * Tests der Tourlogik: Überspringen fehlender Ziele, Ersatz in der Mitte, Lage der Karte.
 */
import { describe, expect, it } from "vitest";
import { kartenlage, naechsterSchritt, schrittart } from "./tourlogik";
import type { Tourschritt } from "./touren";

const ZUGLEISTE: Tourschritt = {
  ziel: "zugleiste",
  ersatzMitte: false,
  text: "tour.abbildung.zugleiste",
};
const BRETT: Tourschritt = { ziel: "brett", ersatzMitte: false, text: "tour.abbildung.brett" };
const KARTE: Tourschritt = {
  ziel: "werkzeugkarte",
  ersatzMitte: true,
  text: "tour.abbildung.karte",
};
const BEGRUESSUNG: Tourschritt = { ziel: null, ersatzMitte: true, text: "tour.haupt.willkommen" };

/** Nur das Brett ist auf dem Bildschirm (Abbildung ohne Zugfolge, kein Werkzeug gewählt). */
const nurBrett = (ziel: string) => ziel === "brett";

describe("schrittart", () => {
  it("zeigt einen Schritt am Ziel, wenn es da ist", () => {
    expect(schrittart(BRETT, nurBrett)).toBe("ziel");
  });

  it("überspringt einen Schritt, dessen Ziel fehlt", () => {
    expect(schrittart(ZUGLEISTE, nurBrett)).toBe("ueberspringen");
  });

  it("zeigt einen Schritt mit Ersatz in der Mitte, wenn sein Ziel fehlt", () => {
    expect(schrittart(KARTE, nurBrett)).toBe("mitte");
  });

  it("zeigt einen Schritt ohne Ziel immer in der Mitte", () => {
    expect(schrittart(BEGRUESSUNG, () => false)).toBe("mitte");
  });
});

describe("naechsterSchritt", () => {
  const schritte = [ZUGLEISTE, BRETT, ZUGLEISTE, KARTE];

  it("springt vorwärts über fehlende Ziele", () => {
    expect(naechsterSchritt(schritte, 0, 1, nurBrett)).toBe(1);
    expect(naechsterSchritt(schritte, 2, 1, nurBrett)).toBe(3);
  });

  it("springt rückwärts über fehlende Ziele", () => {
    expect(naechsterSchritt(schritte, 2, -1, nurBrett)).toBe(1);
    expect(naechsterSchritt(schritte, 0, -1, nurBrett)).toBeNull();
  });

  it("meldet das Ende, wenn nach dem letzten Schritt keiner mehr kommt", () => {
    expect(naechsterSchritt(schritte, 4, 1, nurBrett)).toBeNull();
    expect(naechsterSchritt([ZUGLEISTE], 0, 1, nurBrett)).toBeNull();
  });
});

describe("kartenlage", () => {
  const ziel = (top: number, bottom: number, left = 0, width = 400) => ({
    top,
    bottom,
    left,
    width,
  });

  it("stellt die Karte im Hochformat unten hin, wenn das Ziel oben liegt", () => {
    expect(kartenlage(ziel(80, 200), 400, 800)).toBe("unten");
  });

  it("stellt die Karte im Hochformat oben hin, wenn das Ziel unten liegt (Leiste)", () => {
    expect(kartenlage(ziel(740, 800), 400, 800)).toBe("oben");
  });

  it("stellt die Karte im Querformat neben das Ziel (Brett links → rechts)", () => {
    expect(kartenlage(ziel(20, 380, 100, 360), 850, 400)).toBe("rechts");
    expect(kartenlage(ziel(20, 80, 700, 60), 850, 400)).toBe("links");
  });

  it("stellt die Karte im Querformat über oder unter ein breites Ziel", () => {
    expect(kartenlage(ziel(330, 390, 0, 850), 850, 400)).toBe("oben");
  });

  it("stellt die Karte ohne Ziel in die Mitte", () => {
    expect(kartenlage(null, 400, 800)).toBe("mitte");
  });
});
