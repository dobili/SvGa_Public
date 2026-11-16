/** Tests für oberwelt/sitzrichtung.ts: Blickrichtung und Rahmen sitzender Figuren (R020). */
import { describe, expect, it } from "vitest";
import { blickrichtung, SITZ_BEGINN, sitzbild, sitzrichtung } from "./sitzrichtung";

/** Rahmen eines Bogens mit zwei Reihen (LimeZu, PixelLab ohne Sitzen) und mit dreien. */
const ZWEI_REIHEN = 48;
const DREI_REIHEN = 72;

describe("sitzrichtung", () => {
  it("liest Richtung, ja und true; sonst null", () => {
    expect(sitzrichtung("links")).toBe("links");
    expect(sitzrichtung("ja")).toBe("unten");
    expect(sitzrichtung(true)).toBe("unten");
    expect(sitzrichtung("")).toBeNull();
    expect(sitzrichtung(undefined)).toBeNull();
  });
});

describe("sitzbild", () => {
  it("nimmt die Sitzreihe, wenn der Bogen eine hat, sonst das Standbild", () => {
    expect(sitzbild(DREI_REIHEN, "unten")).toBe(SITZ_BEGINN + 3);
    expect(sitzbild(DREI_REIHEN, "rechts")).toBe(SITZ_BEGINN);
    expect(sitzbild(ZWEI_REIHEN, "unten")).toBe(3);
  });
});

describe("blickrichtung", () => {
  it("liest die vier Richtungen für Stehende (R008); sonst null, dann gilt unten", () => {
    expect(blickrichtung("links")).toBe("links");
    expect(blickrichtung("oben")).toBe("oben");
    expect(blickrichtung("ja")).toBeNull();
    expect(blickrichtung(undefined)).toBeNull();
  });
});
