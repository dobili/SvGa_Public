/**
 * Referenztests für k8-elementarmatt an Kapitel 8 (Abb. 8.4 bis 8.17) und den Übungen 8.55 bis 8.57.
 */
import { describe, expect, it } from "vitest";
import { stellungVon } from "../schach/buchabbildungen.testhilfe";
import { elementarmattWerkzeug } from "./k8-elementarmatt";

function zeilen(nummer: string, kennung: string): readonly string[] {
  return (
    elementarmattWerkzeug(stellungVon(nummer)).befunde.find((b) => b.kennung === kennung)?.zeilen ??
    []
  );
}

describe("k8-elementarmatt", () => {
  it("Abb. 8.4: Die Dame c6 sperrt die 6. Reihe und die c-Linie, der König rückt nach", () => {
    expect(zeilen("8.4", "lage")[0]).toBe(
      "Der Kasten: Dem König e7 bleiben 8 Feld(er) (grau): e7, f7, g7, h7, d8, f8, g8 und h8.",
    );
    // Der König d4 ist noch nicht nahe genug: kein Sperrzug der Dame (Pattgefahr, Abb. 8.7).
    expect(zeilen("8.4", "zuege")).toEqual([
      "Kein Matt, kein Sperr- und kein Treibezug: Der König rückt nach.",
    ]);
  });

  it("Abb. 8.5: 3. Dc7+ treibt den König an den Rand", () => {
    expect(zeilen("8.5", "zuege")).toContain(
      "Treibezüge (Schach, der Kasten wird kleiner): Db7+, Dc7+ und Dd7+.",
    );
  });

  it("Abb. 8.6: 5. Dg7# setzt matt (gold), Df7?? wäre Patt (rot)", () => {
    const e = elementarmattWerkzeug(stellungVon("8.6"));
    expect(e.befunde[1]?.zeilen).toEqual(["Matt: Dg7# (gold).", "Vorsicht, Patt: Df7 (rot)."]);
    expect(e.fazit).toBe("Matt mit Dg7#.");
    expect(e.markierungen).toContainEqual({ typ: "pfeil", farbe: "gold", von: "c7", nach: "g7" });
    expect(e.markierungen).toContainEqual({ typ: "pfeil", farbe: "rot", von: "c7", nach: "f7" });
  });

  it("Abb. 8.7 Patt und Abb. 8.8 Matt", () => {
    expect(elementarmattWerkzeug(stellungVon("8.7")).fazit).toBe(
      "Patt: Der König steht nicht im Schach und hat keinen Zug.",
    );
    expect(elementarmattWerkzeug(stellungVon("8.8")).fazit).toBe("Matt.");
  });

  it("Abb. 8.9: Der Turm a6 sperrt die 6. Reihe, der König bleibt auf der 7. und 8. Reihe", () => {
    expect(zeilen("8.9", "lage")[0]).toBe(
      "Der Kasten: Dem König d7 bleiben 14 Feld(er) (grau): b7, c7, d7, e7, f7, g7, h7, b8, c8, d8, e8, f8, g8 und h8.",
    );
  });

  it("Abb. 8.11: Abwartezüge Th7, Tg7, Tf7 auf der 7. Reihe, außer Reichweite", () => {
    expect(zeilen("8.11", "zuege")[0]).toBe(
      "Abwartezüge (der Kasten bleibt, die Figur außer Reichweite): Ta7, Tf7, Tg7 und Th7.",
    );
  });

  it("Abb. 8.12: Tb7?? wäre Patt, der König folgt (3. Kb6)", () => {
    expect(zeilen("8.12", "zuege")[0]).toBe("Vorsicht, Patt: Tb7 (rot).");
  });

  it("Abb. 8.13: 1. Ta4 sperrt die 4. Reihe (Sperrzug, zuerst genannt)", () => {
    expect(zeilen("8.13", "zuege")[0]).toBe(
      "Sperrzüge (still, der Kasten wird kleiner): Ta4, Ta3 und Ta2 (graue Pfeile).",
    );
  });

  it("Abb. 8.16 und 8.17: Zwei Läufer, 1. Ld6 nimmt f8, 3. Ld5+ treibt nach h8", () => {
    expect(zeilen("8.16", "zuege")).toContain(
      "Sperrzüge (still, der Kasten wird kleiner): Ld6, Lg6 und Lf5 (graue Pfeile).",
    );
    expect(zeilen("8.17", "zuege")[0]).toBe("Treibezüge (Schach, der Kasten wird kleiner): Ld5+.");
  });

  it("Übungen 8.55 bis 8.57: Pattfallen Db6??, Dg6?? und Kb6??", () => {
    expect(zeilen("8.55", "zuege")[0]).toBe("Vorsicht, Patt: Db6 (rot).");
    expect(zeilen("8.56", "zuege")[0]).toBe("Vorsicht, Patt: Dg6 (rot).");
    expect(zeilen("8.57", "zuege")[0]).toBe("Vorsicht, Patt: Kb6 und Kc7 (rot).");
  });

  it("kein Elementarmatt (Abb. 8.19)", () => {
    expect(elementarmattWerkzeug(stellungVon("8.19")).befunde[0]?.kennung).toBe("keins");
  });
});
