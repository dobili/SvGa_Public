/**
 * Referenztests für das Werkzeug k1-roentgen (Schach-Röntgen-Regel) an Buchabbildungen.
 *
 * Die Stellungen kommen aus den erzeugten Buchdaten (also aus dem LaTeX). Buchbezug: Kapitel 1,
 * Abb. 1.23 („Warum ‚Schach‘ vor ‚Schlag‘ steht“), Abb. 1.30 und 1.34 (Drohungen), Abb. 1.24
 * (Schwarz im Schach); Kapitel 7, Abb. 7.8 (1. g5 droht gxf6).
 */
import { describe, expect, it } from "vitest";
import { stellungAus, stellungVon } from "../schach/buchabbildungen.testhilfe";
import { roentgen } from "./k1-roentgen";
import type { Markierung, Werkzeugergebnis } from "./werkzeug";

function ergebnis(nummer: string): Werkzeugergebnis {
  const stellung = stellungVon(nummer);
  const auswertung = roentgen(stellung, stellung.amZug);
  if (!auswertung) throw new Error(`Abb. ${nummer}: kein Ergebnis`);
  return auswertung;
}

function zeilen(auswertung: Werkzeugergebnis, kennung: string): readonly string[] {
  return auswertung.befunde.find((befund) => befund.kennung === kennung)?.zeilen ?? [];
}

function pfeile(markierungen: readonly Markierung[]): string[] {
  return markierungen.flatMap((m) => (m.typ === "pfeil" ? [`${m.farbe} ${m.von}-${m.nach}`] : []));
}

describe("k1-roentgen an den Buchabbildungen", () => {
  it("Abb. 1.23: Sf6+ ist ein Schach (goldener Pfeil), Sxc5 nur ein Abtausch (grauer Pfeil)", () => {
    const auswertung = ergebnis("1.23");
    expect(zeilen(auswertung, "schachs")).toContain("Sf6+");
    expect(zeilen(auswertung, "schlaege")).toEqual(["Sxc5: nur Abtausch"]);
    const liste = pfeile(auswertung.markierungen);
    expect(liste).toContain("gold e4-f6");
    expect(liste).toContain("grau e4-c5");
    expect(liste).not.toContain("gold e4-c5");
    expect(auswertung.fazit).toContain("Zuerst die Schachs prüfen");
  });

  it("Abb. 1.30: Schwarz droht Sxd4 (gewinnt den Bauern), roter Pfeil c6–d4", () => {
    const auswertung = ergebnis("1.30");
    expect(zeilen(auswertung, "drohungen-gegner")).toEqual(["Sxd4 gewinnt den Bauern"]);
    expect(pfeile(auswertung.markierungen)).toContain("rot c6-d4");
    expect(auswertung.fazit).toContain("Schwarz droht: Sxd4");
  });

  it("Abb. 1.34: Weiß setzt mit Dxh7# matt; Schwarz droht Sxd3", () => {
    const auswertung = ergebnis("1.34");
    expect(zeilen(auswertung, "schachs")).toEqual(["Dxh7#"]);
    expect(auswertung.fazit).toBe("Weiß setzt mit Dxh7# matt.");
    expect(zeilen(auswertung, "drohungen-gegner")).toEqual(["Sxd3 schlägt die Dame mit Gewinn"]);
    expect(pfeile(auswertung.markierungen)).toContain("rot b4-d3");
  });

  it("Abb. 7.8: 1. g5 baut eine Drohung auf (gxf6)", () => {
    const drohende = zeilen(ergebnis("7.8"), "drohungen");
    expect(drohende.some((zeile) => zeile.startsWith("g5 droht gxf6"))).toBe(true);
  });

  it("ordnet drohende Züge nach der stärksten Drohung", () => {
    const drohende = zeilen(ergebnis("1.23"), "drohungen");
    expect(drohende[0]).toMatch(/^c4 droht cxd5 schlägt die Dame mit Gewinn/);
  });

  it("Abb. 1.24: Schwarz steht im Schach, die Fragen nach dem Gegner entfallen", () => {
    const auswertung = ergebnis("1.24");
    expect(zeilen(auswertung, "drohungen-gegner")[0]).toMatch(/^entfällt/);
    expect(zeilen(auswertung, "schachs-gegner")[0]).toMatch(/^entfällt/);
  });

  it("zählt Schläge, die Material verlieren, nur mit ihrer Anzahl", () => {
    const schwarz = zeilen(ergebnis("1.23"), "schlaege-gegner");
    expect(schwarz.at(-1)).toMatch(/^dazu \d+ Schläge, die Material verlieren$/);
  });

  it("Frage 4 ist eine automatische Einschätzung (N) mit Verweis auf die Engine", () => {
    const optimierung = ergebnis("1.23").befunde.find((b) => b.kennung === "optimierung");
    expect(optimierung?.art).toBe("N");
  });

  it("Lehrbild ohne König: kein Ergebnis", () => {
    const lehrbild = stellungAus("8/8/8/3N4/8/8/8/8 w - - 0 1");
    expect(roentgen(lehrbild, "white")).toBeNull();
  });
});
