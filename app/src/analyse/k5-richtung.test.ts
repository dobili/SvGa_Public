/**
 * Referenztests für k5-richtung an Kapitel 5, Leitfrage 3 (Abb. 5.24 bis 5.34) und Kapitel 6.
 */
import { describe, expect, it } from "vitest";
import { stellungVon } from "../schach/buchabbildungen.testhilfe";
import { richtung } from "./k5-richtung";

function zeilen(nummer: string, farbe: "white" | "black"): readonly string[] {
  const e = richtung(stellungVon(nummer), farbe);
  return e.befunde.find((b) => b.kennung === farbe)?.zeilen ?? [];
}

describe("k5-richtung", () => {
  it("Abb. 5.26: die weiße Kette zeigt zum Königsflügel, die schwarze zum Damenflügel", () => {
    expect(zeilen("5.26", "white")[0]).toBe(
      "Kette d4–e5 zeigt zum Königsflügel, Basis d4 (ohne Stütze: das Ziel des gegnerischen Hebels)",
    );
    expect(zeilen("5.26", "white")[1]).toBe("Raum: e5 vorgerückt, nimmt dem Gegner c5, d6 und f6");
    expect(zeilen("5.26", "black")[0]).toBe(
      "Kette e6–d5 zeigt zum Damenflügel, Basis e6 (gestützt von f7)",
    );
    const e = richtung(stellungVon("5.26"), "white");
    expect(e.fazit).toBe("Weiß spielt am Königsflügel: Dorthin zeigt die Kette.");
    expect(e.markierungen).toContainEqual({ typ: "pfeil", farbe: "grau", von: "d4", nach: "e5" });
  });

  it("Abb. 5.17: Schwarz spielt gegen den Isolani, Weiß spielt mit ihm (0.2.66)", () => {
    expect(richtung(stellungVon("5.17"), "black").fazit).toBe(
      "Schwarz spielt gegen den Isolani d4: Blockiere das Feld davor (d5) und greife ihn mit Figuren an.",
    );
    expect(richtung(stellungVon("5.17"), "white").fazit).toBe(
      "Weiß hat den Isolani d4: Spiele aktiv mit den Figuren (offene Linien für die Türme, Sprungbrett für den Königsangriff), bereite den Vorstoß d4–d5 vor und tausche möglichst keine Figur.",
    );
    // Abb. 5.18: Isolani d5 in schwarzem Besitz, aber vom Springer d4 blockiert: kein Besitzer-Plan mehr.
    expect(richtung(stellungVon("5.18"), "black").fazit).not.toMatch(/hat den Isolani/);
  });

  it("Abb. 5.24: der Hebel ...c5 trifft die Basis d4 (rot)", () => {
    const e = richtung(stellungVon("5.24"), "black");
    expect(zeilen("5.24", "black")).toContain("Hebel c7–c5 gegen die Basis d4");
    expect(e.markierungen).toContainEqual({ typ: "feld", farbe: "rot", feld: "d4" });
    expect(e.markierungen).toContainEqual({ typ: "pfeil", farbe: "gold", von: "c7", nach: "c5" });
  });

  it("Abb. 5.32 (Carlsbad): Minderheit am Damenflügel (2 gegen 3), Hebel b2–b4–b5 gegen c6", () => {
    const weiss = zeilen("5.32", "white");
    expect(weiss).toContain(
      "Minderheit am Damenflügel (2 gegen 3): Ziel ist ein Minderheitsangriff",
    );
    expect(weiss).toContain("Mehrheit am Königsflügel (4 gegen 3), Kandidat e3");
    expect(weiss).toContain("Hebel b2–…–b5 gegen c6");
    expect(richtung(stellungVon("5.32"), "white").fazit).toBe(
      "Weiß spielt am Damenflügel: Dort erzeugt der Minderheitsangriff eine Schwäche in der gegnerischen Mehrheit.",
    );
    expect(zeilen("5.32", "black")).toContain("Mehrheit am Damenflügel (3 gegen 2), Kandidat c6");
  });

  // C1.9: Reihenfolge des Fazits: Kette, gesunde Mehrheit, gegnerische Schwäche, Minderheitsangriff.
  it("Abb. 5.15 und 5.30 (Berliner Endspiel): Weiß spielt mit der gesunden Mehrheit, Kandidat e5", () => {
    for (const nummer of ["5.15", "5.30"]) {
      expect(richtung(stellungVon(nummer), "white").fazit).toBe(
        "Weiß spielt am Königsflügel: Dort bildet die gesunde Mehrheit mit dem Kandidaten e5 einen Freibauern; die gegnerische Mehrheit hat keinen Kandidaten.",
      );
    }
  });

  it("Abb. 5.17 (Isolani): Schwarz blockiert und spielt gegen den Isolani d4", () => {
    expect(richtung(stellungVon("5.17"), "black").fazit).toBe(
      "Schwarz spielt gegen den Isolani d4: Blockiere das Feld davor (d5) und greife ihn mit Figuren an.",
    );
  });

  it("Abb. 5.22 und 6.10: das Ziel ist die Schwäche auf der halboffenen Linie (c5, c6), nicht der Isolani a7", () => {
    expect(richtung(stellungVon("5.22"), "white").fazit).toBe(
      "Weiß spielt gegen den hängenden Bauern c5: Blockiere das Feld davor (c4) und greife ihn mit Figuren an.",
    );
    expect(richtung(stellungVon("6.10"), "white").fazit).toBe(
      "Weiß spielt gegen den rückständigen Bauern c6: Blockiere das Feld davor (c5) und greife ihn mit Figuren an.",
    );
  });

  it("Abb. 5.21: Minderheitsangriff nur gegen die gesunde Mehrheit (Kandidat c5) und abseits des eigenen Königs", () => {
    expect(richtung(stellungVon("5.21"), "white").fazit).toBe(
      "Weiß spielt am Damenflügel: Dort erzeugt der Minderheitsangriff eine Schwäche in der gegnerischen Mehrheit.",
    );
  });

  // C1.14: vor dem eigenen König kein Minderheitsangriff, sondern Gegenspiel mit Figuren.
  it("Abb. 5.32 und 6.8 bis 6.10, Schwarz: Gegenspiel mit Figuren am Königsflügel", () => {
    for (const nummer of ["5.32", "6.8", "6.9", "6.10"]) {
      expect(richtung(stellungVon(nummer), "black").fazit).toBe(
        "Schwarz spielt am Königsflügel: Gegenspiel mit Figuren; die Bauern vor dem eigenen König bleiben stehen.",
      );
    }
    expect(zeilen("6.8", "black")).toContain(
      "Minderheit am Königsflügel (3 gegen 4): Dort steht der eigene König, also kein Minderheitsangriff, sondern Gegenspiel mit Figuren",
    );
  });

  it("Abb. 11.43, Schwarz: Ein einzelner Bauer (a6) ist kein Minderheitsangriff", () => {
    expect(zeilen("11.43", "black")).toContain("Minderheit am Damenflügel (1 gegen 2)");
    // Seit 0.2.66 gilt für den Besitzer des Isolani d5 der Plan des Buches (Petrosjan hätte
    // Figuren behalten sollen; Fischer tauschte sie ab).
    expect(richtung(stellungVon("11.43"), "black").fazit).toMatch(/^Schwarz hat den Isolani d5/);
  });

  // C1.10: Der Hebel gegen die Basis steht vorn und ist als einziger gold.
  it("Abb. 5.27 und 5.35 (Königsindisch): c4–c5 und ...f7–f5 zuerst und gold, die übrigen grau", () => {
    for (const nummer of ["5.27", "5.35"]) {
      const weiss = zeilen(nummer, "white");
      expect(weiss.filter((z) => z.startsWith("Hebel"))).toEqual([
        "Hebel c4–c5 gegen die Basis d6",
      ]);
      expect(weiss).toContain("Weitere Hebel: f2–f4 gegen e5; h2–…–h5 gegen g6");
      const schwarz = richtung(stellungVon(nummer), "black");
      const pfeile = schwarz.markierungen.filter((m) => m.typ === "pfeil" && m.farbe === "gold");
      expect(pfeile).toEqual([{ typ: "pfeil", farbe: "gold", von: "f7", nach: "f5" }]);
      expect(schwarz.markierungen).toContainEqual({
        typ: "pfeil",
        farbe: "grau",
        von: "b7",
        nach: "b5",
      });
      expect(zeilen(nummer, "black")).toContain("Weitere Hebel: b7–b5 gegen c4; c7–c6 gegen d5");
    }
  });

  it("Abb. 5.30 (Berliner Endspiel): Weiß vier gegen drei am Königsflügel, Kandidat e5", () => {
    expect(zeilen("5.30", "white")).toContain("Mehrheit am Königsflügel (4 gegen 3), Kandidat e5");
    expect(zeilen("5.30", "black")).toContain("Mehrheit am Damenflügel (4 gegen 3)");
    // C8: kein Minderheitsangriff gegen den schon vorgerückten Kandidaten e5.
    expect(zeilen("5.30", "black")).toContain("Minderheit am Königsflügel (3 gegen 4)");
    expect(richtung(stellungVon("5.30"), "black").fazit).not.toContain("Minderheitsangriff");
  });

  it("Abb. 6.20 (Königsindisch): c4–c5 gegen die Basis d6; ...f5 muss der Springer f6 Platz machen", () => {
    expect(zeilen("6.20", "white")).toContain("Hebel c4–c5 gegen die Basis d6");
    expect(zeilen("6.20", "black")).toContain(
      "Hebel f7–f5 gegen die Basis e4 (erst Platz machen: Springer f6 steht im Weg)",
    );
  });

  it("Abb. 5.28 (Spanisch): Spannung zwischen d4 und e5", () => {
    expect(zeilen("5.28", "white")).toContain(
      "Spannung: d4/e5 – wer sie auflöst, legt das Skelett fest",
    );
  });
});
