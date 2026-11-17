// „Eröffnung fremd“ (R13c): die Eröffnung, die der Leser am seltensten hatte.
import { describe, expect, it } from "vitest";
import { haeufigkeit, seltensteEroeffnung } from "./fremdeEroeffnung";

const CARO = ["e4", "c6", "d4", "d5"];
const ENGLISCH = ["c4", "e5", "Nc3", "Nf6"];
const FRANZ = ["e4", "e6", "d4", "d5"];

describe("fremde Eröffnung", () => {
  it("zählt Partien mit denselben ersten Halbzügen", () => {
    expect(
      haeufigkeit(CARO, [
        ["e4", "c6", "Nf3"],
        ["e4", "e5"],
        ["e4", "c6"],
      ]),
    ).toBe(2);
  });

  it("nimmt die seltenste, bei Gleichstand per Zufall", () => {
    const partien = [
      ["e4", "c6"],
      ["e4", "c6"],
      ["c4", "e5"],
    ];
    expect(seltensteEroeffnung([CARO, ENGLISCH, FRANZ], partien, () => 0)).toBe(FRANZ);
    expect(seltensteEroeffnung([CARO, ENGLISCH], [], () => 0.99)).toBe(ENGLISCH);
    expect(seltensteEroeffnung([], [], () => 0)).toEqual([]);
  });
});
