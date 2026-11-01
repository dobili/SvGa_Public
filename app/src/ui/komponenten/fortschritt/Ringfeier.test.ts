/** Tests der Gratulation bei vollen Ringen (Ringfeier.tsx): welche Ringe gefeiert werden. */
import { LayoutGrid } from "lucide-react";
import { describe, expect, it } from "vitest";
import { offeneRinge } from "./fortschrittsringe";

const ring = (testid: string, erreicht: number, gesamt: number) => ({
  name: testid,
  symbol: LayoutGrid,
  anteil: { erreicht, gesamt },
  testid,
});

describe("Ringfeier", () => {
  it("nur volle Ringe mit Inhalt, die noch nicht gefeiert wurden", () => {
    const ringe = [ring("a", 3, 3), ring("b", 2, 3), ring("c", 0, 0), ring("d", 5, 5)];
    expect(offeneRinge(ringe, new Set()).map((r) => r.testid)).toEqual(["a", "d"]);
    expect(offeneRinge(ringe, new Set(["a"])).map((r) => r.testid)).toEqual(["d"]);
  });

  it("ein Orden mit Datum in „verdient“ ist gefeiert, auch ohne Merker (Sicherung, f3)", () => {
    const ringe = [ring("ich-uebungen", 3, 3), ring("ich-bots-10", 1, 1)];
    const verdient = { "orden:uebungen": "2026-10-12T10:00:00.000Z" };
    expect(offeneRinge(ringe, new Set(), verdient, new Set()).map((r) => r.testid)).toEqual([
      "ich-bots-10",
    ]);
    // Zur Probe zählt nur der Merker: Die Probe zeigt die Gratulation trotzdem.
    expect(
      offeneRinge(ringe, new Set(), verdient, new Set(["ich-uebungen"])).map((r) => r.testid),
    ).toEqual(["ich-uebungen", "ich-bots-10"]);
  });
});
