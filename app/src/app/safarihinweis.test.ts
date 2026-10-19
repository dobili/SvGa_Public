/** Tests für den Hinweis auf die Sieben-Tage-Regel von Safari (19.10.2026). */
import { describe, expect, it } from "vitest";
import { safariHinweisNoetig } from "./safarihinweis";

describe("Sieben-Tage-Hinweis", () => {
  it("nur in Safari im Browser, bis der Leser ihn schließt", () => {
    expect(safariHinweisNoetig("iphone", false, null)).toBe(true);
    expect(safariHinweisNoetig("mac-safari", false, null)).toBe(true);
    expect(safariHinweisNoetig("iphone", true, null)).toBe(false);
    expect(safariHinweisNoetig("iphone", false, "aus")).toBe(false);
  });

  it("nicht auf Android oder in Chrome", () => {
    expect(safariHinweisNoetig("android", false, null)).toBe(false);
    expect(safariHinweisNoetig("chromium", false, null)).toBe(false);
  });
});
