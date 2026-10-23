/**
 * Tests der Planlage: welche Kette den Plan bestimmt (Befund aus P4 an den Werkzeugen aus P3).
 */
import { describe, expect, it } from "vitest";
import { stellungVon } from "../schach/buchabbildungen.testhilfe";
import { feldname } from "../schach/stellung";
import { planlage } from "./planlage";
import { profil } from "./stellungsprofil";

describe("planlage", () => {
  it("Abb. 11.78: Hauptkette ist die längere e4–d5–f5, nicht die zuerst gefundene c3–b4", () => {
    const lage = planlage(profil(stellungVon("11.78")), "white");
    expect(lage.kette?.kette.glieder.map(feldname)).toContain("e4");
    expect(lage.kette?.kette.glieder.map(feldname)).not.toContain("c3");
  });
});
