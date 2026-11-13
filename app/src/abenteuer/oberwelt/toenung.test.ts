/** Tests für toenung.ts: Tönung aus Karte und Dialogvariable, Lichtkreis der Laterne (Runde 6). */
import { describe, expect, it } from "vitest";
import {
  aktuelleToenung,
  istToenung,
  lichtAusOrten,
  lichtkreis,
  toenungsvariable,
} from "./toenung";

const NEBELKARTE = { properties: [{ name: "toenung", value: "nebel" }] };

describe("aktuelleToenung", () => {
  it("liest die Eigenschaft der Karte", () => {
    expect(aktuelleToenung(NEBELKARTE, "delta.inseln", {})).toBe("nebel");
    expect(aktuelleToenung({}, "x", {})).toBeNull();
  });

  it("lässt den Dialog die Tönung setzen oder aufheben", () => {
    expect(aktuelleToenung(NEBELKARTE, "delta.inseln", { "toenung.delta.inseln": "nacht" })).toBe(
      "nacht",
    );
    expect(
      aktuelleToenung(NEBELKARTE, "delta.inseln", { "toenung.delta.inseln": "keine" }),
    ).toBeNull();
    // Eine Variable einer anderen Karte zählt nicht.
    expect(aktuelleToenung(NEBELKARTE, "delta.inseln", { "toenung.anders": "nacht" })).toBe(
      "nebel",
    );
  });

  it("kennt nur die festen Tönungen", () => {
    expect(istToenung("dunkel")).toBe(true);
    expect(istToenung("serverblau")).toBe(true);
    expect(istToenung("lila")).toBe(false);
    expect(
      aktuelleToenung({ properties: [{ name: "toenung", value: "lila" }] }, "x", {}),
    ).toBeNull();
    expect(toenungsvariable("steinbruch.stollen")).toBe("toenung.steinbruch.stollen");
  });
});

describe("lichtkreis", () => {
  it("reicht mit Laterne vier Felder weit, ohne kaum über den Helden hinaus", () => {
    expect(lichtkreis(true)).toBe(4);
    expect(lichtkreis(false)).toBeLessThan(2);
  });
});

describe("Licht aus orte.json (T6)", () => {
  it("geht vor der Szene, tag heißt kein Schleier", () => {
    expect(aktuelleToenung(NEBELKARTE, "k", {}, { licht: "tag" })).toBeNull();
    expect(aktuelleToenung(NEBELKARTE, "k", {}, { licht: "abend" })).toBe("abend");
    expect(aktuelleToenung(NEBELKARTE, "k", {}, {})).toBe("nebel");
  });

  it("nimmt den letzten passenden Zustand", () => {
    const angabe = {
      licht: "tag",
      licht_zustaende: { spaet: "abend", "spaet und dunkel": "nacht" },
    };
    expect(lichtAusOrten(angabe, {})).toBeNull();
    expect(lichtAusOrten(angabe, { spaet: true })).toBe("abend");
    expect(lichtAusOrten(angabe, { spaet: true, dunkel: true })).toBe("nacht");
    expect(lichtAusOrten(undefined, {})).toBeUndefined();
  });

  it("lässt den Dialog vor dem Licht entscheiden", () => {
    expect(aktuelleToenung({}, "k", { "toenung.k": "keine" }, { licht: "nacht" })).toBeNull();
    expect(aktuelleToenung({}, "k", { "toenung.k": "nebel" }, { licht: "nacht" })).toBe("nebel");
  });
});
