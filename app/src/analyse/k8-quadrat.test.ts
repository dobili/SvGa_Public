/**
 * Referenztests für k8-quadrat an Kapitel 8 (Abb. 8.19, 8.35, 8.36, 8.38, 8.46, 8.47, 8.50) und den
 * Übungen 8.63, 8.64.
 */
import { describe, expect, it } from "vitest";
import { naechsterBuchzug, stellungVon } from "../schach/buchabbildungen.testhilfe";
import { quadratregel } from "./k8-quadrat";

function zeilen(nummer: string, feld?: string): readonly string[] {
  const s = stellungVon(nummer);
  return quadratregel(s, s.amZug, feld).befunde[0]?.zeilen ?? [];
}

describe("k8-quadrat", () => {
  it("Abb. 8.35 (Weiß am Zug): Quadrat am Bauern b4–f8 wie im Buch, nach 1. b5 nur b5–e8", () => {
    const e = quadratregel(stellungVon("8.35"), "white");
    expect(e.befunde[0]?.zeilen).toEqual([
      "Von b4 bis b8: 4 Züge.",
      "Das Quadrat reicht von b4 bis f8 (grau).",
      "Weiß ist am Zug: Nach dem Bauernzug schrumpft das Quadrat auf b5–e8. Der König muss dieses kleinere Quadrat mit seinem Zug betreten können.",
      "Der König g5 erreicht das Quadrat nicht: Der Bauer läuft allein zur Dame.",
    ]);
    // Dieselben grauen Seiten wie im Buch (Abb. 8.35: b4–f4, f4–f8, b8–f8).
    expect(e.markierungen).toContainEqual({ typ: "pfeil", farbe: "grau", von: "b4", nach: "f4" });
    expect(e.markierungen).toContainEqual({ typ: "pfeil", farbe: "grau", von: "f4", nach: "f8" });
    expect(e.fazit).toBe("Der Bauer b4 läuft durch: Schwarz erreicht das Quadrat nicht.");
    expect(e.markierungen).toContainEqual({ typ: "pfeil", farbe: "gold", von: "b4", nach: "b8" });
    expect(e.markierungen).toContainEqual({ typ: "feld", farbe: "rot", feld: "g5" });
  });

  it("Abb. 8.36 (Schwarz am Zug): Quadrat b4–f8, der König tritt ein, remis", () => {
    const e = quadratregel(stellungVon("8.36"), "black");
    expect(e.befunde[0]?.zeilen).toEqual([
      "Von b4 bis b8: 4 Züge.",
      "Das Quadrat reicht von b4 bis f8 (grau).",
      "Der König g5 steht im Quadrat oder betritt es: Schwarz holt den Bauern ein.",
    ]);
    expect(e.markierungen).toContainEqual({ typ: "pfeil", farbe: "grau", von: "f4", nach: "f8" });
    expect(e.markierungen).toContainEqual({ typ: "feld", farbe: "gold", feld: "g5" });
  });

  it("Übung 8.63: Doppelschritt (Quadrat a3–f8) und Zugrecht (nach 1. a4 nur a4–e8)", () => {
    expect(zeilen("8.63")).toEqual([
      "Der Bauer steht noch auf seinem Ausgangsfeld: Wegen des Doppelschritts zählt das Quadrat, als stünde er eine Reihe weiter.",
      "Von a3 bis a8: 5 Züge.",
      "Das Quadrat reicht von a3 bis f8 (grau).",
      "Weiß ist am Zug: Nach dem Bauernzug schrumpft das Quadrat auf a4–e8. Der König muss dieses kleinere Quadrat mit seinem Zug betreten können.",
      "Der König g5 erreicht das Quadrat nicht: Der Bauer läuft allein zur Dame.",
    ]);
  });

  it("Abb. 8.38 (Bauernrennen): beide Freibauern, der eigene zuerst, der angetippte zuerst", () => {
    const s = stellungVon("8.38");
    const e = quadratregel(s, "white");
    expect(e.befunde.map((b) => b.kennung)).toEqual(["bauer-a4", "bauer-h5"]);
    expect(quadratregel(s, "white", "h5").befunde[0]?.kennung).toBe("bauer-h5");
    expect(e.befunde[1]?.zeilen[2]).toBe(
      "Der König c2 steht im Quadrat oder betritt es: Weiß holt den Bauern ein.",
    );
  });

  it("Abb. 8.47: Der König d7 holt den entfernten Freibauern a5 ein (der Rest ist Regel 3)", () => {
    expect(zeilen("8.47")).toContain(
      "Der König d7 steht im Quadrat oder betritt es: Schwarz holt den Bauern ein.",
    );
  });

  it("Abb. 8.19 (C1.23): Der König e4 steht vor dem Bauern, die Regel gibt kein Urteil", () => {
    const e = quadratregel(stellungVon("8.19"), "white");
    const begleitet =
      "Hier gilt die Quadratregel nicht: Der König begleitet seinen Bauern – nimm Schlüsselfelder und Opposition.";
    expect(e.fazit).toBe(begleitet);
    expect(e.befunde[0]?.zeilen).toContain(begleitet);
    expect(e.befunde[0]?.zeilen.join(" ")).not.toMatch(/holt den Bauern ein/);
    expect(e.befunde[0]?.farbe).toBeNull();
    expect(e.markierungen).toContainEqual({ typ: "feld", farbe: "grau", feld: "e6" });
  });

  it("Abb. 8.50 (C1.21): verbundene Freibauern e5 und f6, kein Urteil „holt ein“", () => {
    const e = quadratregel(stellungVon("8.50"), "black");
    const verbunden =
      "Die Quadratregel gilt nur für einen Bauern allein; verbundene Freibauern schützen sich gegenseitig: Schlägt der König den hinteren, läuft der vordere durch.";
    expect(e.fazit).toBe(verbunden);
    expect(e.befunde.map((b) => b.kennung)).toEqual(["bauer-e5", "bauer-f6"]);
    for (const b of e.befunde) {
      expect(b.zeilen).toContain(verbunden);
      expect(b.zeilen.join(" ")).not.toMatch(/holt den Bauern ein/);
    }
  });

  it("Abb. 8.46 (C1.22): c7 hinter c6 zählt nicht, a5 wird mit dem Buchzug a6 zum Freibauern", () => {
    const s = stellungVon("8.46");
    const zug = naechsterBuchzug("8.46");
    expect(zug).toBe("a6");
    const e = quadratregel(s, "white", undefined, zug ?? undefined);
    expect(e.befunde.map((b) => b.kennung)).toEqual(["kommend-a6", "bauer-c6"]);
    expect(e.befunde[0]?.titel).toBe("Weiß: Freibauer nach a6");
    expect(e.befunde[0]?.zeilen).toEqual([
      "Mit dem nächsten Zug a6 wird der Bauer zum Freibauern; das Quadrat gilt für die Stellung danach.",
      "Von a6 bis a8: 2 Züge.",
      "Das Quadrat reicht von a6 bis c8 (grau).",
      "Der König h8 erreicht das Quadrat nicht: Der Bauer läuft allein zur Dame.",
    ]);
    expect(e.fazit).toBe("Nach a6 läuft der Bauer a6 durch: Schwarz erreicht das Quadrat nicht.");
    expect(e.markierungen).toContainEqual({ typ: "pfeil", farbe: "gold", von: "a5", nach: "a8" });
    expect(e.markierungen).toContainEqual({ typ: "feld", farbe: "rot", feld: "h8" });
    // Ohne nächsten Zug bleibt nur c6; c7 steht hinter c6 und zählt nicht.
    expect(quadratregel(s, "white").befunde.map((b) => b.kennung)).toEqual(["bauer-c6"]);
  });

  it("Übung 8.64: Vorbehalt, wenn der eigene König helfen kann", () => {
    const s = stellungVon("8.64");
    expect(quadratregel(s, "black").befunde[0]?.zeilen).toContain(
      "Vorbehalt: Der eigene König steht in der Nähe und kann helfen; die Regel gilt für den Bauern allein.",
    );
  });
});
