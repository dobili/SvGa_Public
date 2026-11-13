/** Tests für schreibtakt.ts: Schreibanimation einer Tagebuchseite. */
import { describe, expect, it } from "vitest";
import { geschriebeneZeichen, MS_JE_ZEICHEN } from "./schreibtakt";

describe("Schreibtakt", () => {
  it("schreibt Zeichen für Zeichen und hält nach Satzzeichen inne", () => {
    const text = "Ich, du.";
    expect(geschriebeneZeichen(text, 0)).toBe(0);
    expect(geschriebeneZeichen(text, MS_JE_ZEICHEN * 3)).toBe(3);
    // Nach dem Komma eine Pause: bei 5 Takten steht noch nichts Neues.
    expect(geschriebeneZeichen(text, MS_JE_ZEICHEN * 5)).toBe(4);
    expect(geschriebeneZeichen(text, 100_000)).toBe(text.length);
  });
});
