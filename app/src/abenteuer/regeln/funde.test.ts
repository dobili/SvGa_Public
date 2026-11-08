// Funde (docs/spiel/08, E1): einmal in den Spielstand, kein Doppel.
import { describe, expect, it } from "vitest";
import { mitFund } from "./funde";
import { leererAbenteuerstand } from "./spielstand";

describe("mitFund", () => {
  it("legt einen Fund einmal ab", () => {
    const jetzt = new Date("2026-11-08T11:00:00Z");
    const stand = leererAbenteuerstand(jetzt, "Kim", null, false);
    const mit = mitFund(stand, "formular1857", jetzt);
    expect(mit.funde).toEqual([{ kennung: "formular1857", gefunden: "2026-11-08T11:00:00.000Z" }]);
    expect(mitFund(mit, "formular1857", jetzt)).toBe(mit);
  });
});
