/**
 * Referenztests für k7-warnsignale an Kapitel 7, Schritt 1 (W6, W7, Motivtabelle) mit den
 * Abbildungen der zwölf Motive.
 */
import { describe, expect, it } from "vitest";
import { stellungVon } from "../schach/buchabbildungen.testhilfe";
import { warnsignaleSieben } from "./k7-warnsignale";

function zeilen(nummer: string, kennung: string): readonly string[] {
  const s = stellungVon(nummer);
  return warnsignaleSieben(s, s.amZug).befunde.find((b) => b.kennung === kennung)?.zeilen ?? [];
}

describe("k7-warnsignale", () => {
  it("Abb. 7.11: W6 beim Gegner, der Springer e4 trifft von f6 aus Turm h5 und König e8", () => {
    expect(zeilen("7.11", "gegner")).toContain(
      "W6 Gabelgeometrie: Springer e4 nach f6 trifft h5 und e8",
    );
    const s = stellungVon("7.11");
    expect(warnsignaleSieben(s, "white").markierungen).toContainEqual({
      typ: "feld",
      farbe: "grau",
      feld: "f6",
      text: "W6",
    });
  });

  it("Abb. 7.18: W6, der Springer d5 trifft von e7 aus Turm c8 und König g8, nicht den gedeckten Läufer c6", () => {
    expect(zeilen("7.18", "gegner")).toContain(
      "W6 Gabelgeometrie: Springer d5 nach e7 trifft c8 und g8",
    );
  });

  it("Abb. 7.18 (C2.12): ungedeckte Bauern zählen als Gabelziel, gedeckte Figuren ohne Mehrwert nicht", () => {
    // Sb4 trifft den ungedeckten Bauern a2 und die ungedeckte Dame c2: Die Gabel gewinnt Material.
    expect(zeilen("7.18", "eigen")).toContain(
      "W6 Gabelgeometrie: Springer c6 nach b4 trifft a2 und c2",
    );
    // Der Springer d5 ist gedeckt und nicht mehr wert als der Springer c6: kein Ziel auf b4.
    expect(zeilen("7.18", "eigen").join(" ")).not.toContain("trifft a2, c2");
  });

  it("Abb. 7.24: W7, der Läufer a2 hat kein sicheres Feld (gefangene Figur)", () => {
    expect(zeilen("7.24", "eigen")).toContain(
      "W7 Figur am Rand: Läufer a2 (0 sichere Felder, Einschätzung)",
    );
    expect(zeilen("7.24", "motive")).toContain("W7: gefangene Figur");
  });

  it("Abb. 7.25 (Arche Noah): W7 für den Läufer b3, nicht für die Türme in den Ecken", () => {
    const eigene = zeilen("7.25", "eigen");
    expect(eigene).toContain("W7 Figur am Rand: Läufer b3 (0 sichere Felder, Einschätzung)");
    expect(eigene.join(" ")).not.toContain("W7 Figur am Rand: Turm");
  });

  it("Abb. 7.26: Freibauer e7 auf der vorletzten Reihe und „auf Verlust“ führen zu Umwandlungstaktik und Rettung", () => {
    const motive = zeilen("7.26", "motive");
    expect(motive).toContain(
      "Freibauer e7 auf der vorletzten Reihe: Taktik rund um die Umwandlung",
    );
    expect(motive).toContain("Du stehst auf Verlust: Rettung durch Dauerschach und Patt");
  });

  it("Abb. 7.20: W4 beim Gegner (Turm d8 hält e8 und d5) mit Überlastung und Beseitigung als Motive", () => {
    expect(zeilen("7.20", "gegner")).toContain(
      "W4 Doppelte Aufgabe: Turm d8 hält e8 und d5 (Einschätzung)",
    );
    expect(zeilen("7.20", "motive")).toContain(
      "W4: Überlastung und Ablenkung, Beseitigung der Verteidigung",
    );
  });

  it("Abb. 7.7: Kennungen am Brett verbinden sich (Turm a1: W1·W2)", () => {
    const s = stellungVon("7.7");
    expect(warnsignaleSieben(s, "white").markierungen).toContainEqual({
      typ: "feld",
      farbe: "rot",
      feld: "a1",
      text: "W1·W2",
    });
  });
});
