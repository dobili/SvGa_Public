/**
 * Referenztests für das Werkzeug k1-angriffsregel an den Buchabbildungen zur goldenen
 * Angriffsregel (Kapitel 1, Abb. 1.36 und 1.37: „Ein Angreifer ist zu wenig, drei reichen“).
 */
import { describe, expect, it } from "vitest";
import { stellungAus, stellungVon } from "../schach/buchabbildungen.testhilfe";
import { angriffsregel } from "./k1-angriffsregel";
import type { Werkzeugergebnis } from "./werkzeug";

function ergebnis(nummer: string): Werkzeugergebnis {
  const stellung = stellungVon(nummer);
  const auswertung = angriffsregel(stellung, stellung.amZug);
  if (!auswertung) throw new Error(`Abb. ${nummer}: kein Ergebnis`);
  return auswertung;
}

function zeilen(auswertung: Werkzeugergebnis, kennung: string): readonly string[] {
  return auswertung.befunde.find((befund) => befund.kennung === kennung)?.zeilen ?? [];
}

describe("k1-angriffsregel an den Buchabbildungen", () => {
  it("Abb. 1.36: zu wenig Angreifer (das Buch zählt nur Sf3; die App sieht auch Le2 durch f3 auf h5)", () => {
    const auswertung = ergebnis("1.36");
    expect(zeilen(auswertung, "eigen")[0]).toBe("Angreifer (2): Sf3 und Le2");
    expect(auswertung.fazit).toMatch(/^Nur 2 Angreifer: zu wenig/);
  });

  it("Abb. 1.37: Ld3, Sf3 und Dd1 (hinter dem Springer) gegen den Turm f8, Übermacht", () => {
    const auswertung = ergebnis("1.37");
    expect(zeilen(auswertung, "eigen")[0]).toBe("Angreifer (3): Sf3, Ld3 und Dd1");
    expect(zeilen(auswertung, "eigen")[1]).toBe("Verteidiger im Sektor (1): Tf8");
    expect(auswertung.fazit).toBe(
      "3 Angreifer gegen 1 Verteidiger: Die Übermacht steht, der Angriff kann beginnen.",
    );
    expect(auswertung.markierungen).toContainEqual({ typ: "feld", farbe: "gold", feld: "d1" });
    expect(auswertung.markierungen).toContainEqual({ typ: "feld", farbe: "rot", feld: "f8" });
    expect(auswertung.markierungen).toContainEqual({ typ: "feld", farbe: "grau", feld: "h5" });
    expect(auswertung.markierungen).toContainEqual({ typ: "feld", farbe: "grau", feld: "e8" });
    expect(auswertung.markierungen).not.toContainEqual({ typ: "feld", farbe: "grau", feld: "h7" });
    expect(auswertung.befunde[0]?.titel).toBe("Angriff von Weiß (Sektor e5–h8)");
  });

  it("Abb. 1.12: Der gefesselte Springer e4 zählt nicht mit", () => {
    const gegner = ergebnis("1.12");
    const alle = [...zeilen(gegner, "eigen"), ...zeilen(gegner, "gegner")];
    expect(alle.some((zeile) => zeile === "Se4 zählt nicht: gefesselt")).toBe(true);
  });

  it("Lehrbild ohne König: kein Ergebnis", () => {
    expect(angriffsregel(stellungAus("8/8/8/3N4/8/8/8/8 w - - 0 1"), "white")).toBeNull();
  });
});
