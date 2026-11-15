/**
 * Tests für loesungspfeile.ts: Die Lösung einer Gabel als Pfeile, eigene Züge grün, Antworten grau
 * (Schach-Abenteuer, R4).
 */
import { describe, expect, it } from "vitest";
import { loesungspfeile } from "./loesungspfeile";

/** Springer d4, König e3, Dame h4 (frei erfunden): Sf5+ gabelt König und Dame. */
const GABEL = "8/8/8/8/3N3q/4k3/8/6K1 w - - 0 1";
const LINIE = ["Nf5+", "Ke4", "Nxh4"];

describe("loesungspfeile", () => {
  it("zeigt alle Züge der Lösung, eigene grün, die Antwort grau", () => {
    expect(loesungspfeile(GABEL, LINIE, 0)).toEqual([
      { typ: "pfeil", farbe: "gruen", von: "d4", nach: "f5" },
      { typ: "pfeil", farbe: "grau", von: "e3", nach: "e4" },
      { typ: "pfeil", farbe: "gruen", von: "f5", nach: "h4" },
    ]);
  });

  it("beginnt nach den schon gespielten Zügen", () => {
    expect(loesungspfeile(GABEL, LINIE, 2)).toEqual([
      { typ: "pfeil", farbe: "gruen", von: "f5", nach: "h4" },
    ]);
  });
});
