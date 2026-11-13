/** Tests für dialogtakt.ts: `#pause` mit und ohne Dauer (T3). */
import { describe, expect, it } from "vitest";
import { pausendauer } from "./dialogtakt";
import { tagsAus } from "./geschichte";

describe("Pause im Dialog", () => {
  it("ohne #pause sperrt nichts", () => {
    expect(pausendauer(tagsAus(["sprecher:ambrose"]))).toBe(0);
  });

  it("#pause ohne Angabe bleibt gültig: eine Sekunde", () => {
    expect(pausendauer(tagsAus(["sprecher:ambrose", "pause"]))).toBe(1000);
  });

  it("#pause:3 und Kommazahlen", () => {
    expect(pausendauer(tagsAus(["pause:3"]))).toBe(3000);
    expect(pausendauer(tagsAus(["pause:1,5"]))).toBe(1500);
    expect(pausendauer(tagsAus(["pause:0.5"]))).toBe(500);
  });

  it("Unsinn wird Standard, zu lang wird gekürzt", () => {
    expect(pausendauer(tagsAus(["pause:lang"]))).toBe(1000);
    expect(pausendauer(tagsAus(["pause:-2"]))).toBe(1000);
    expect(pausendauer(tagsAus(["pause:60"]))).toBe(10000);
  });
});
