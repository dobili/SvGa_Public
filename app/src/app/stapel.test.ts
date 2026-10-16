/** Tests für die Navigation als Stapel (Konzept 6.6). */
import { describe, expect, it } from "vitest";
import { neuerStapel, oben, schritt } from "./stapel";

describe("Navigationsstapel", () => {
  it("öffnet, ersetzt und geht zurück", () => {
    let stapel = neuerStapel("buch");
    stapel = schritt(stapel, {
      art: "navigiere",
      ansicht: { bildschirm: "abbildung", nummer: "1.26" },
    });
    stapel = schritt(stapel, {
      art: "ersetze",
      ansicht: { bildschirm: "abbildung", nummer: "1.27" },
    });
    expect(oben(stapel)).toEqual({ bildschirm: "abbildung", nummer: "1.27" });
    expect(stapel.ansichten).toHaveLength(2);
    stapel = schritt(stapel, { art: "zurueck" });
    expect(oben(stapel)).toEqual({ bildschirm: "buch" });
  });

  it("zurück auf der untersten Ansicht ändert nichts", () => {
    const stapel = neuerStapel("ich");
    expect(schritt(stapel, { art: "zurueck" })).toBe(stapel);
  });

  it("ein Bereichswechsel beginnt einen neuen Stapel", () => {
    let stapel = neuerStapel("buch");
    stapel = schritt(stapel, {
      art: "navigiere",
      ansicht: { bildschirm: "abbildung", nummer: "1.1" },
    });
    stapel = schritt(stapel, { art: "bereich", bereich: "training" });
    expect(stapel.ansichten).toEqual([{ bildschirm: "training" }]);
  });
});
