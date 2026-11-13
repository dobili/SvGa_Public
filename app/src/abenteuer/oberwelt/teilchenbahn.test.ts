/** Tests für teilchenbahn.ts: Staub, Nebel und Sternschnuppen (T8). */
import { describe, expect, it } from "vitest";
import {
  bewegeTeilchen,
  HOECHSTENS_TEILCHEN,
  naechsteSchnuppe,
  neuerNebel,
  neuerStaub,
  SCHNUPPE_DAUER_S,
} from "./teilchenbahn";

describe("Teilchen", () => {
  it("begrenzt den Staub für das Handy", () => {
    expect(neuerStaub(500, () => 0.5)).toHaveLength(HOECHSTENS_TEILCHEN);
  });

  it("lässt Teilchen am anderen Rand wieder herein", () => {
    const [t] = neuerNebel(() => 0.99);
    if (!t) throw new Error("kein Nebel");
    t.x = 0.999;
    bewegeTeilchen([t], 1);
    expect(t.x).toBeGreaterThanOrEqual(0);
    expect(t.x).toBeLessThan(0.1);
  });

  it("lässt Sternschnuppen selten entstehen und kurz ziehen", () => {
    expect(naechsteSchnuppe(null, 0.016, () => 0.9)).toBeNull();
    const neu = naechsteSchnuppe(null, 0.016, () => 0);
    expect(neu).not.toBeNull();
    expect(naechsteSchnuppe({ x: 0, y: 0, alter: SCHNUPPE_DAUER_S }, 0.1, () => 0)).toBeNull();
  });
});
