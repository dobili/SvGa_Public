// Münzen und Läden (docs/spiel/08, G1 bis G6).
import { describe, expect, it } from "vitest";
import karten from "../../../../inhalte/abenteuer/karten.json";
import type { Kartensorte } from "../schnittstelle/karten";
import { bezahle, kaufe, kaufhindernis } from "./muenzen";
import { leererAbenteuerstand } from "./spielstand";

const SORTEN = karten.karten as unknown as readonly Kartensorte[];
const JETZT = new Date("2026-11-08T11:00:00Z");
const STAND = { ...leererAbenteuerstand(JETZT, "Kim", null, false), muenzen: 50 };

describe("Läden", () => {
  it("kauft eine Verbrauchskarte, zieht den Preis ab und zählt die Karte", () => {
    const ware = { art: "karte" as const, kennung: "zweiteChance", preis: 20 };
    const nach = kaufe(STAND, ware, SORTEN, JETZT);
    expect(nach.muenzen).toBe(30);
    expect(nach.karten).toEqual([
      { kennung: "zweiteChance", anzahl: 1, erhalten: JETZT.toISOString() },
    ]);
    expect(kaufe(nach, ware, SORTEN, JETZT).karten[0]?.anzahl).toBe(2);
  });

  it("verkauft dauerhafte Karten und Gegenstände nur einmal und nichts ohne Geld", () => {
    const radar = { art: "karte" as const, kennung: "gefahrenradar", preis: 35 };
    const mit = kaufe(STAND, radar, SORTEN, JETZT);
    expect(kaufhindernis(mit, radar, SORTEN)).toBe("schonDa");
    const rad = { art: "gegenstand" as const, kennung: "fahrrad", preis: 120 };
    expect(kaufhindernis(STAND, rad, SORTEN)).toBe("zuTeuer");
    expect(kaufe(STAND, rad, SORTEN, JETZT)).toBe(STAND);
    const reich = kaufe({ ...STAND, muenzen: 200 }, rad, SORTEN, JETZT);
    expect(reich.gegenstaende).toEqual(["fahrrad"]);
    expect(kaufhindernis(reich, rad, SORTEN)).toBe("schonDa");
  });
});

describe("Bezahlen (Fahrpreis des Lastkahns)", () => {
  it("zieht den Preis ab, wenn das Geld reicht", () => {
    expect(bezahle({ ...STAND, muenzen: 12 }, 5).muenzen).toBe(7);
    expect(bezahle({ ...STAND, muenzen: 5 }, 5).muenzen).toBe(0);
  });

  it("lässt den Stand bei zu wenig Münzen oder ungültigem Preis unverändert", () => {
    const arm = { ...STAND, muenzen: 3 };
    expect(bezahle(arm, 5)).toBe(arm);
    expect(bezahle(STAND, 0)).toBe(STAND);
    expect(bezahle(STAND, -5)).toBe(STAND);
    expect(bezahle(STAND, Number.NaN)).toBe(STAND);
  });
});

describe("Münzen für Straßensiege", () => {
  it("der erste Sieg je Gegner und Tag zählt voll, weitere wenig", async () => {
    const { strassensiegMuenzen, MUENZEN: M } = await import("./muenzen");
    const sieg = (gegner: string, beendet: string) => ({
      gegner,
      ergebnis: { ausgang: "sieg", beendet },
    });
    expect(strassensiegMuenzen([], "jo", "2026-11-08T10:00:00Z")).toBe(M.strassensieg);
    const heute = [sieg("jo", "2026-11-08T09:00:00Z")];
    expect(strassensiegMuenzen(heute, "jo", "2026-11-08T10:00:00Z")).toBe(M.strassensiegWiederholt);
    expect(strassensiegMuenzen(heute, "nia", "2026-11-08T10:00:00Z")).toBe(M.strassensieg);
    expect(strassensiegMuenzen(heute, "jo", "2026-11-09T10:00:00Z")).toBe(M.strassensieg);
  });
});
