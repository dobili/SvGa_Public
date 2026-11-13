/** Tests für fensterbankfunde.ts: Funde in der Reihenfolge des Findens (T15). */
import { describe, expect, it } from "vitest";
import type { Funddaten } from "../daten/laden";
import { fensterbankfunde } from "./fensterbankfunde";

const FUNDE = [
  { kennung: "a", ort: "mapleFalls", name: "fund.a.name", text: "fund.a.text" },
  { kennung: "b", ort: "mapleFalls", name: "fund.b.name", text: "fund.b.text" },
] as Funddaten[];

describe("Fensterbank", () => {
  it("zeigt die Funde in der Reihenfolge des Findens, ohne unbekannte", () => {
    const gefunden = [
      { kennung: "b", gefunden: "2026-11-01T10:00:00Z" },
      { kennung: "alt", gefunden: "2026-11-02T10:00:00Z" },
      { kennung: "a", gefunden: "2026-11-03T10:00:00Z" },
    ];
    expect(fensterbankfunde(gefunden, FUNDE).map((f) => f.kennung)).toEqual(["b", "a"]);
  });
});
