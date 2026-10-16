/** Tests für den Lernstand der Abhakliste (Gesamt-Checkliste, Lernziele je Kapitel). */
import { describe, expect, it } from "vitest";
import { abgehakt, umschalten } from "./lernstand";

describe("Lernstand", () => {
  it("hakt einen Punkt ab und nimmt den Haken wieder zurück", () => {
    const einmal = umschalten({}, 1, 2);
    expect(einmal).toEqual({ 1: [2] });
    expect(umschalten(einmal, 1, 2)).toEqual({ 1: [] });
  });

  it("hält die Punkte sortiert und lässt andere Kapitel unberührt", () => {
    const stand = umschalten(umschalten({ 8: [0] }, 1, 4), 1, 0);
    expect(stand).toEqual({ 1: [0, 4], 8: [0] });
  });

  it("zählt nur Punkte, die es im Kapitel gibt", () => {
    expect(abgehakt({ 4: [0, 2, 7] }, 4, 3)).toBe(2);
    expect(abgehakt({}, 4, 3)).toBe(0);
  });
});
