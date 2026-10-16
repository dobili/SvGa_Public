/**
 * Referenztests für k6-wo an Kapitel 6, Planfrage 1 (Abb. 6.2 bis 6.10) und Kapitel 11.
 */
import { describe, expect, it } from "vitest";
import { stellungVon } from "../schach/buchabbildungen.testhilfe";
import { wo } from "./k6-wo";

function zeilen(nummer: string, farbe: "white" | "black", kennung: string): readonly string[] {
  return wo(stellungVon(nummer), farbe).befunde.find((b) => b.kennung === kennung)?.zeilen ?? [];
}

describe("k6-wo", () => {
  it("Abb. 6.2 (Königsindisch, geschlossen): Weiß Damenflügel, Schwarz Königsflügel", () => {
    expect(zeilen("6.2", "white", "lage")[0]).toBe("Zentrum: geschlossen (verkeilt: d5/d6, e4/e5)");
    expect(wo(stellungVon("6.2"), "white").fazit).toBe(
      "Weiß spielt: Am Damenflügel: Die Kette e4–d5 zeigt dorthin (Hebel c4–c5 gegen die Basis d6).",
    );
    expect(wo(stellungVon("6.2"), "black").fazit).toContain("Am Königsflügel: Die Kette d6–e5");
    expect(wo(stellungVon("6.2"), "white").markierungen).toContainEqual({
      typ: "pfeil",
      farbe: "gold",
      von: "c4",
      nach: "c5",
    });
  });

  it("Abb. 6.3 (Isolani, offen): mit Figuren in der Mitte, Hebel d4–d5 drei gegen drei", () => {
    expect(zeilen("6.3", "white", "offen")[0]).toContain(
      "Dein Hebel d4–d5: auf d5 3 Angreifer gegen 3 Verteidiger",
    );
    expect(wo(stellungVon("6.3"), "white").fazit).toContain("Im Zentrum, mit Figuren");
  });

  it("Abb. 6.5 (Drachen): der Gegenschlag ...d5 zählt zwei gegen zwei", () => {
    expect(zeilen("6.5", "black", "offen")[0]).toContain(
      "Dein Hebel d6–d5: auf d5 2 Angreifer gegen 2 Verteidiger",
    );
  });

  it("Abb. 6.6 (entgegengesetzte Rochaden): Weiß zwei Züge bis h5, Schwarz drei bis a3", () => {
    expect(zeilen("6.6", "white", "verschiedeneFluegel")).toEqual([
      "Du: h2–h5 in 2 Zügen gegen g6",
      "Gegner: a7–a3 in 3 Zügen gegen b2",
    ]);
    const e = wo(stellungVon("6.6"), "white");
    expect(e.markierungen).toContainEqual({ typ: "pfeil", farbe: "gold", von: "h2", nach: "h5" });
    expect(e.markierungen).toContainEqual({ typ: "pfeil", farbe: "rot", von: "a7", nach: "a3" });
    expect(e.fazit).toBe(
      "Weiß spielt: Am Königsflügel, gegen den König: Sturm h2–h5 in 2 Zügen gegen g6.",
    );
    // „Der Turm steht schon auf der halboffenen c-Linie, auf der auch der weiße König steht.“
    expect(zeilen("6.6", "black", "verschiedeneFluegel")[2]).toBe(
      "Deine Linien zu seinem König: c-Linie",
    );
  });

  it("Abb. 6.7 (griechisches Geschenk): alle drei Bedingungen erfüllt, Ziel h7", () => {
    expect(zeilen("6.7", "white", "gleicherFluegel")).toEqual([
      "1. Zentrum geschlossen oder fest in deiner Hand: ja",
      "2. Mehr Angreifer als Verteidiger am König: ja (3 gegen 1)",
      "3. Ziel im Bauernschild: ja – h7 deckt nur der König, d3 greift es an",
    ]);
    expect(wo(stellungVon("6.7"), "white").markierungen).toContainEqual({
      typ: "feld",
      farbe: "grau",
      feld: "h7",
    });
  });

  it("Abb. 6.10 (Carlsbad nach dem Minderheitsangriff): gegen den fixierten Bauern c6", () => {
    expect(zeilen("6.10", "white", "schwaeche")).toEqual([
      "Spiele gegen c6: dein Bauer d4 bewacht das Feld davor, der Bauer kann nicht weglaufen",
    ]);
    expect(wo(stellungVon("6.10"), "white").fazit).toBe(
      "Weiß spielt: Am Damenflügel, gegen die fixierte Schwäche c6.",
    );
  });

  it("Abb. 6.8 (Carlsbad): noch keine Schwäche, also der Minderheitsangriff am Damenflügel", () => {
    expect(zeilen("6.8", "white", "schwaeche")[0]).toContain("Minderheitsangriff am Damenflügel");
  });

  // C1.14: Vor dem eigenen König kein Minderheitsangriff, sondern Gegenspiel mit Figuren.
  it("Abb. 6.8 und 6.9, Schwarz: Gegenspiel mit Figuren am Königsflügel", () => {
    for (const nummer of ["6.8", "6.9"]) {
      expect(zeilen(nummer, "black", "schwaeche")).toEqual([
        "Keine fixierte Schwäche; deine Minderheit steht am Königsflügel vor dem eigenen König: kein Minderheitsangriff, sondern Gegenspiel mit Figuren.",
      ]);
      expect(wo(stellungVon(nummer), "black").fazit).toBe(
        "Schwarz spielt: Am Königsflügel: Gegenspiel mit Figuren; die Bauern vor dem eigenen König bleiben stehen.",
      );
    }
  });

  // C1.13: Gegenschlag nur um ein Feld oder als schon bestehende Spannung (Abb. 6.4: d5 greift e4 an).
  it("Abb. 6.4 (Königsgambit): Der Gegenschlag ist schon da, d5 greift e4 an", () => {
    expect(zeilen("6.4", "black", "offen")[0]).toContain(
      "Der Gegenschlag ist schon da: d5 greift e4 an (1 Angreifer gegen 0 Verteidiger auf e4)",
    );
    expect(wo(stellungVon("6.4"), "black").markierungen).toContainEqual({
      typ: "pfeil",
      farbe: "gold",
      von: "d5",
      nach: "e4",
    });
    // Früher: „Gegenschlag e4–e6“ und „d5–d3“, Märsche über zwei Züge.
    expect(zeilen("6.4", "white", "offen")[0]).not.toContain("e4–e6");
    expect(zeilen("6.4", "black", "offen")[0]).not.toContain("d5–d3");
  });

  // C1.16: Steht die Seite am Zug im Schach, gibt es keine Planfrage.
  it("Abb. 6.32: Schwarz steht im Schach, auch aus weißer Sicht nur der Hinweis", () => {
    for (const farbe of ["white", "black"] as const) {
      expect(wo(stellungVon("6.32"), farbe).fazit).toBe(
        "Schwarz steht im Schach: Erst das Schach beantworten; Planfragen gelten in ruhigen Stellungen.",
      );
    }
  });

  it("Abb. 11.34 (Karpow–Kortschnoi): Weiß stürmt mit h4–h5 in einem Zug gegen den Haken g6", () => {
    expect(zeilen("11.34", "white", "verschiedeneFluegel")[0]).toBe("Du: h4–h5 in 1 Zug gegen g6");
  });
});
