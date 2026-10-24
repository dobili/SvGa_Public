/** Tests der Schriftgröße (0.2.125): Schritte, Grenzen, Merker, Variable am Wurzelelement. */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  GROESSTE,
  gueltig,
  KLEINSTE,
  liesSchriftgroesse,
  NORMAL,
  setzeSchriftgroesse,
  wendeSchriftgroesseAn,
} from "./schriftgroesse";

/** Ersatz für den Gerätespeicher und das Wurzelelement (die Tests laufen ohne Browser). */
function ersatzbrowser() {
  const speicher = new Map<string, string>();
  const stil = new Map<string, string>();
  vi.stubGlobal("window", {
    localStorage: {
      getItem: (k: string) => speicher.get(k) ?? null,
      setItem: (k: string, v: string) => speicher.set(k, v),
    },
  });
  vi.stubGlobal("document", {
    documentElement: {
      style: {
        setProperty: (k: string, v: string) => stil.set(k, v),
        removeProperty: (k: string) => stil.delete(k),
        getPropertyValue: (k: string) => stil.get(k) ?? "",
      },
    },
  });
  return { speicher, stil };
}

describe("Schriftgröße", () => {
  let browser: ReturnType<typeof ersatzbrowser>;
  beforeEach(() => {
    browser = ersatzbrowser();
  });
  afterEach(() => vi.unstubAllGlobals());

  it("rundet auf 10-%-Schritte zwischen 80 und 150", () => {
    expect(gueltig(123)).toBe(120);
    expect(gueltig(170)).toBe(GROESSTE);
    expect(gueltig(10)).toBe(KLEINSTE);
    expect(gueltig(NORMAL)).toBe(NORMAL);
  });

  it("ohne Wahl 100 %, keine Variable; nach der Wahl Merker und Variable", () => {
    expect(liesSchriftgroesse()).toBe(NORMAL);
    wendeSchriftgroesseAn();
    expect(browser.stil.has("--schriftfaktor")).toBe(false);
    expect(setzeSchriftgroesse(120)).toBe(120);
    expect(liesSchriftgroesse()).toBe(120);
    expect(browser.speicher.get("svga.schriftgroesse")).toBe("120");
    expect(browser.stil.get("--schriftfaktor")).toBe("1.2");
    setzeSchriftgroesse(NORMAL);
    expect(browser.stil.has("--schriftfaktor")).toBe(false);
  });

  it("unbrauchbare Merker zählen als 100 %", () => {
    browser.speicher.set("svga.schriftgroesse", "groß");
    expect(liesSchriftgroesse()).toBe(NORMAL);
  });
});
