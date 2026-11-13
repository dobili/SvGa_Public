/** Tests für buehne.ts: Licht und Figuren aus den Tags einer Dialogzeile (T6, T9). */
import { describe, expect, it } from "vitest";
import { buehnenanweisung } from "./buehne";

describe("buehnenanweisung", () => {
  it("liest Licht für die Szene", () => {
    expect(buehnenanweisung({ licht: "abend" })).toEqual({ licht: "abend" });
    expect(buehnenanweisung({ licht: "tag" })).toEqual({ licht: null });
    expect(buehnenanweisung({ licht: "disco" })).toEqual({});
  });

  it("liest das Blenden einer Figur", () => {
    expect(buehnenanweisung({ figur: "ambrose:halb" })).toEqual({
      figur: { name: "ambrose", deckkraft: 0.5 },
    });
    expect(buehnenanweisung({ figur: "mira:aus", licht: "nacht" })).toEqual({
      licht: "nacht",
      figur: { name: "mira", deckkraft: 0 },
    });
    expect(buehnenanweisung({ figur: "mira" })).toEqual({});
    expect(buehnenanweisung({ figur: "mira:weg" })).toEqual({});
  });

  it("lässt Zeilen ohne Anweisung unverändert", () => {
    expect(buehnenanweisung({ sprecher: "ambrose" })).toEqual({});
  });
});
