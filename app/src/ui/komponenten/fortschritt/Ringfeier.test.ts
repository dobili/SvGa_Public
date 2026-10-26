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
});
