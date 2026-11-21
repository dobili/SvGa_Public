/** Tests für oberwelt/sitzrichtung.ts: Blickrichtung und Rahmen sitzender Figuren (R020). */
import { describe, expect, it } from "vitest";
import {
  blickrichtung,
  BODEN_BEGINN,
  kopfseiteDesBetts,
  LIEGE_BEGINN,
  liegebild,
  SITZ_BEGINN,
  sitzbild,
  sitzrichtung,
} from "./sitzrichtung";

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

describe("Zustände aus PixelLab: Boden und Liegen (21.11.2026)", () => {
  const FUENF_REIHEN = 120;
  const VIER_REIHEN = 96;

  it("nimmt am Boden die Bodenreihe, sonst die Sitzreihe oder das Standbild", () => {
    expect(sitzbild(FUENF_REIHEN, "links", true)).toBe(BODEN_BEGINN + 2);
    expect(sitzbild(FUENF_REIHEN, "links")).toBe(SITZ_BEGINN + 2);
    expect(sitzbild(DREI_REIHEN, "links", true)).toBe(SITZ_BEGINN + 2);
    expect(sitzbild(ZWEI_REIHEN, "links", true)).toBe(2);
  });

  it("liefert das Liegebild nach der Kopfseite, ohne Liegereihe null", () => {
    expect(liegebild(FUENF_REIHEN, "rechts")).toBe(LIEGE_BEGINN);
    expect(liegebild(FUENF_REIHEN, "links")).toBe(LIEGE_BEGINN + 1);
    expect(liegebild(VIER_REIHEN, "rechts")).toBeNull();
  });

  it("liest die Kopfseite aus dem Namen des Betts, gespiegelt vertauscht", () => {
    expect(kopfseiteDesBetts("rv5BettKopfRechts")).toBe("rechts");
    expect(kopfseiteDesBetts("es15BettKopfWest")).toBe("links");
    expect(kopfseiteDesBetts("rv5BettKopfRechts", true)).toBe("links");
    expect(kopfseiteDesBetts("rv5Bett")).toBeNull();
  });
});
