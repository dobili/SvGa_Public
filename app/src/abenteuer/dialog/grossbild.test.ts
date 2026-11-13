/**
 * Prüft den Bildpfad der Großansicht (Atmosphäre T7, dialog/grossbild.ts).
 */
import { describe, expect, it } from "vitest";
import { bildpfad } from "./grossbild";

describe("bildpfad", () => {
  it("bildet den Pfad im Paket aus der Kennung", () => {
    expect(bildpfad({ bild: "zeitung1858" })).toBe("bilder/zeitung1858.webp");
    expect(bildpfad({ bild: "sternenHimmel" })).toBe("bilder/sternen-himmel.webp");
    expect(bildpfad({ sprecher: "ambrose", bild: "foto-tische" })).toBe("bilder/foto-tische.webp");
  });

  it("zeigt nichts ohne Tag, bei #bild:aus und bei unsinnigen Kennungen", () => {
    expect(bildpfad({ sprecher: "ambrose" })).toBeNull();
    expect(bildpfad({ bild: "aus" })).toBeNull();
    expect(bildpfad({ bild: "" })).toBeNull();
    expect(bildpfad({ bild: "../geheim" })).toBeNull();
  });
});
