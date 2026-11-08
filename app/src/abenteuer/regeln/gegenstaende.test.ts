// Gegenstände im Spielstand (docs/spiel/08, W3, E1): Quest-Wirkung „gegenstand“, kein Doppel.
import { describe, expect, it } from "vitest";
import { wendeWirkungenAn } from "./quests";
import { leererAbenteuerstand } from "./spielstand";

describe("Wirkung gegenstand", () => {
  it("legt den Gegenstand einmal in den Besitz", () => {
    const stand = leererAbenteuerstand(new Date("2026-11-08T05:00:00Z"), "Kim", null, false);
    const jetzt = new Date();
    const mit = wendeWirkungenAn(stand, [{ art: "gegenstand", gegenstand: "fahrrad" }], jetzt);
    expect(mit.gegenstaende).toEqual(["fahrrad"]);
    const nochmal = wendeWirkungenAn(mit, [{ art: "gegenstand", gegenstand: "fahrrad" }], jetzt);
    expect(nochmal.gegenstaende).toEqual(["fahrrad"]);
  });
});

describe("Wirkung gegenstandWeg", () => {
  it("gibt den Gegenstand ab (Limo für Jo); fehlt er, bleibt alles", () => {
    const stand = leererAbenteuerstand(new Date("2026-11-08T05:00:00Z"), "Kim", null, false);
    const jetzt = new Date();
    const mit = wendeWirkungenAn(stand, [{ art: "gegenstand", gegenstand: "limo" }], jetzt);
    const ohne = wendeWirkungenAn(mit, [{ art: "gegenstandWeg", gegenstand: "limo" }], jetzt);
    expect(ohne.gegenstaende).toEqual([]);
    expect(
      wendeWirkungenAn(ohne, [{ art: "gegenstandWeg", gegenstand: "limo" }], jetzt).gegenstaende,
    ).toEqual([]);
  });
});
