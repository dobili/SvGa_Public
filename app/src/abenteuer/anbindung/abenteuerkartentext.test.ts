/**
 * Tests des Satzes auf der Karte „Schach-Abenteuer“ (abenteuerkartentext.ts).
 */
import { describe, expect, it } from "vitest";
import { weiterText } from "./abenteuerkartentext";

describe("weiterText", () => {
  it("spricht den Helden mit seinem Namen an", () => {
    expect(weiterText("Kim")).toBe("Dein Abenteuer wartet, Kim.");
  });

  it("lässt die Anrede weg, wenn der Held keinen eigenen Namen hat", () => {
    expect(weiterText("Du")).toBe("Dein Abenteuer wartet.");
    expect(weiterText("  ")).toBe("Dein Abenteuer wartet.");
  });
});
