/** Tests zu oberwelt/figurzustand.ts: Lesen, Rahmen der weiteren Standbilder, Haltung. */
import { describe, expect, it } from "vitest";
import {
  haltungAus,
  liesMenschenzustand,
  liesStandbild,
  liesTierzustand,
  standbildrahmen,
} from "./figurzustand";

describe("figurzustand", () => {
  it("liest nur bekannte Zustände und gültige Kennungen", () => {
    expect(liesMenschenzustand("sitzboden")).toBe("sitzboden");
    expect(liesMenschenzustand("grasen")).toBeNull();
    expect(liesTierzustand("grasen")).toBe("grasen");
    expect(liesStandbild("ohne-teleskop")).toBe("ohne-teleskop");
    expect(liesStandbild("Mit Hut")).toBeNull();
  });

  it("findet den Rahmen eines weiteren Standbilds", () => {
    const index = { beginn: 144, kennungen: ["a", "b"] };
    expect(standbildrahmen(index, "b", "unten")).toBe(151);
    expect(standbildrahmen(index, "a", "rechts")).toBe(144);
    expect(standbildrahmen(index, "c", "unten")).toBeNull();
    expect(standbildrahmen(undefined, "a", "unten")).toBeNull();
  });

  it("leitet die Haltung aus dem Zustand ab, sonst nach der Regel", () => {
    expect(haltungAus("sitzboden", null, "links")).toEqual({
      sitzt: "links",
      amBoden: true,
      liegt: false,
    });
    expect(haltungAus("stehen", "unten", null).sitzt).toBeNull();
    expect(haltungAus("sitzstuhl", null, null)).toEqual({
      sitzt: "unten",
      amBoden: false,
      liegt: false,
    });
    expect(haltungAus("liegt", "oben", null).liegt).toBe(true);
    expect(haltungAus(null, "oben", null)).toEqual({ sitzt: "oben", amBoden: null, liegt: false });
  });
});
