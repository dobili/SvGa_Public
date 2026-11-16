/** Tests für ton/vorabladen.ts: welche Musik der Nachbarkarten vorab lädt. */
import { describe, expect, it } from "vitest";
import type { Ortdaten } from "../daten/laden";
import { nachbarmusik, objektnamen } from "./vorabladen";

/** Zwei Orte: Park und Clubraum in Maple Falls, die Landstraße als Weg dazwischen. */
const ORTE = [
  {
    kennung: "mapleFalls",
    karten: [
      { kennung: "mapleFalls.park", musik: "musik/maple-falls.ogg" },
      { kennung: "mapleFalls.aussen", musik: "mapleFalls" },
      { kennung: "mapleFalls.clubraum", musik: "musik/maple-falls.club.m4a" },
    ],
    ausloeser: [
      { name: "parktor", art: "uebergang", ziel: { karte: "mapleFalls.aussen", ausloeser: "a" } },
      {
        name: "clubtuer",
        art: "uebergang",
        ziel: { karte: "mapleFalls.clubraum", ausloeser: "b" },
      },
      {
        name: "landstrasse",
        art: "uebergang",
        karte: "mapleFalls.park",
        ziel: { karte: "wegMapleCedar.landstrasse", ausloeser: "c" },
      },
      { name: "kiosk", art: "dialog" },
    ],
  },
  {
    kennung: "wegMapleCedar",
    karten: [{ kennung: "wegMapleCedar.landstrasse", musik: "musik/weg.m4a" }],
    ausloeser: [],
  },
] as unknown as readonly Ortdaten[];

describe("Musik der Nachbarkarten", () => {
  it("nimmt die Musik hinter den Übergängen dieser Karte, ohne die eigene", () => {
    const namen = new Set(["parktor", "clubtuer", "landstrasse", "kiosk"]);
    expect(nachbarmusik(ORTE, "mapleFalls.park", namen)).toEqual([
      "musik/maple-falls.club.m4a",
      "musik/weg.m4a",
    ]);
  });

  it("zählt nur Übergänge, die auf der Karte liegen, und hält die Höchstzahl ein", () => {
    expect(nachbarmusik(ORTE, "mapleFalls.park", new Set(["landstrasse"]))).toEqual([
      "musik/weg.m4a",
    ]);
    expect(nachbarmusik(ORTE, "mapleFalls.park", new Set(["clubtuer", "landstrasse"]), 1)).toEqual([
      "musik/maple-falls.club.m4a",
    ]);
    // Der Übergang zur Landstraße gilt nur im Park, nicht draußen.
    expect(nachbarmusik(ORTE, "mapleFalls.aussen", new Set(["landstrasse"]))).toEqual([]);
    expect(nachbarmusik(ORTE, "gibtEsNicht", new Set(["parktor"]))).toEqual([]);
  });

  it("liest die Objektnamen einer Tiled-Karte", () => {
    const karte = { layers: [{ objects: [{ name: "parktor" }, { name: "kiosk" }] }, {}] };
    expect([...objektnamen(karte)]).toEqual(["parktor", "kiosk"]);
  });
});
