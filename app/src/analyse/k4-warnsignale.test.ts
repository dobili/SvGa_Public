/**
 * Referenztests für das Werkzeug k4-warnsignale (W1 bis W5) an den Fallenchecks aus Kapitel 4.
 *
 * Die Stellungen kommen aus den erzeugten Buchdaten (also aus dem LaTeX). Buchbezug: Kapitel 4,
 * „Die fünf Warnsignale“ und die Stopp-Momente der Fallen (Abb. 4.2, 4.11, 4.13, 4.21, 4.24,
 * 4.29, 4.38, 4.45, 4.51), dazu Abb. 4.8 und Übung 7.53. Die Entscheidungen des Autors C1.7, C1.8,
 * C2.9 und D.4 (docs/ENTSCHEIDUNGEN.md) sind je mit einem Test an der Buchabbildung festgehalten.
 * Abweichungen vom Buchtext stehen als Befund in docs/FORTSCHRITT.md.
 */
import { describe, expect, it } from "vitest";
import { stellungAus, stellungVon } from "../schach/buchabbildungen.testhilfe";
import { warnsignale } from "./k4-warnsignale";
import type { Markierung, Werkzeugergebnis } from "./werkzeug";

function ergebnis(nummer: string): Werkzeugergebnis {
  const stellung = stellungVon(nummer);
  return warnsignale(stellung, stellung.amZug);
}

function zeilen(auswertung: Werkzeugergebnis, kennung: string): readonly string[] {
  return auswertung.befunde.find((befund) => befund.kennung === kennung)?.zeilen ?? [];
}

function beschriftungen(markierungen: readonly Markierung[]): string[] {
  return markierungen.flatMap((m) =>
    m.typ === "feld" && m.text ? [`${m.farbe} ${m.feld} ${m.text}`] : [],
  );
}

describe("k4-warnsignale an den Fallenchecks aus Kapitel 4", () => {
  it("Abb. 4.2: W1, der Turm a8 ist ungedeckt (rot beschriftet)", () => {
    const auswertung = ergebnis("4.2");
    expect(zeilen(auswertung, "eigen")[0]).toContain("Turm a8");
    expect(beschriftungen(auswertung.markierungen)).toContain("rot a8 W1");
  });

  it("Abb. 4.2: keine Linie über einen Bauern, der seine Linie nicht verlassen kann", () => {
    const alle = [...zeilen(ergebnis("4.2"), "eigen"), ...zeilen(ergebnis("4.2"), "gegner")];
    expect(alle.some((zeile) => zeile.startsWith("W2"))).toBe(false);
  });

  it("Abb. 4.11: W5 Lxf3 (+6), W3 König e8 ohne Luft, W2 Dame f3 auf b7 und a8", () => {
    const auswertung = ergebnis("4.11");
    expect(zeilen(auswertung, "w5")).toEqual(["Lxf3 (+6)"]);
    const eigen = zeilen(auswertung, "eigen");
    expect(eigen).toContain("W3 Ohne Luft: König e8");
    expect(eigen).toContain("W2 Gefährliche Linie: Dame f3 – Bauer b7 – Turm a8 (Fesselung)");
  });

  it("Abb. 4.13: W2 Fesselung Lg5–Sf6–Dd8 und W4, der Springer f6 hält d5 und d8", () => {
    const gegner = zeilen(ergebnis("4.13"), "gegner");
    expect(gegner).toContain("W2 Gefährliche Linie: Läufer g5 – Springer f6 – Dame d8 (Fesselung)");
    expect(gegner).toContain("W4 Doppelte Aufgabe: Springer f6 hält d5 und d8 (Einschätzung)");
    expect(beschriftungen(ergebnis("4.13").markierungen)).toContain("gold f6 W4");
  });

  it("Abb. 4.21: W3, der König e1 hat keine Luft", () => {
    expect(zeilen(ergebnis("4.21"), "eigen")).toContain("W3 Ohne Luft: König e1");
  });

  it("Abb. 4.24: W5 Sxe4 (+1) und W3 König e8", () => {
    const auswertung = ergebnis("4.24");
    expect(zeilen(auswertung, "w5")).toEqual(["Sxe4 (+1)"]);
    expect(zeilen(auswertung, "eigen")).toContain("W3 Ohne Luft: König e8");
  });

  it("Abb. 4.38: W5 fxe5 (+1) mit goldenem Pfeil", () => {
    const auswertung = ergebnis("4.38");
    expect(zeilen(auswertung, "w5")).toEqual(["fxe5 (+1)"]);
    expect(auswertung.markierungen).toContainEqual({
      typ: "pfeil",
      farbe: "gold",
      von: "f4",
      nach: "e5",
    });
  });

  it("Abb. 4.45: W1, die Dame g5 ist ungedeckt", () => {
    expect(zeilen(ergebnis("4.45"), "eigen")[0]).toMatch(/^W1 Ungedeckt: Dame g5/);
  });

  it("Abb. 4.51: W1 Bauer c7 und Turm a8", () => {
    const w1 = zeilen(ergebnis("4.51"), "eigen")[0];
    expect(w1).toContain("Bauer c7");
    expect(w1).toContain("Turm a8");
  });

  it("Abb. 4.29 (C1.7): W4, der Springer f3 ist einziger Verteidiger von h2 gegen Dxh2#", () => {
    const auswertung = ergebnis("4.29");
    expect(zeilen(auswertung, "eigen")).toContain(
      "W4 Doppelte Aufgabe: Springer f3, einziger Verteidiger von h2 gegen Dxh2# (Einschätzung)",
    );
    expect(beschriftungen(auswertung.markierungen)).toContain("rot f3 W4");
  });

  it("Abb. 4.8 (C1.8): W2 Läufer b2 – Dame e5 – Bauer g7, weicht die Dame, fällt g7", () => {
    const auswertung = ergebnis("4.8");
    expect(zeilen(auswertung, "eigen")).toContain(
      "W2 Gefährliche Linie: Läufer b2 – Dame e5 – Bauer g7 (weicht die Dame, fällt g7)",
    );
    expect(auswertung.markierungen).toContainEqual({
      typ: "pfeil",
      farbe: "rot",
      von: "b2",
      nach: "g7",
    });
  });

  it("C1.8: Ist die Figur hinter der Dame gedeckt, gibt es kein W2", () => {
    // Wie Abb. 4.8, aber der Bauer g7 ist durch den Läufer f8 gedeckt (h8 statt Läufer a5).
    const gedeckt = stellungAus("r1b1kb1r/pppp1ppp/8/3Pq3/2B5/1Q6/PB3PPP/R4RK1 b kq - 1 13");
    const eigen = zeilen(warnsignale(gedeckt, "black"), "eigen");
    expect(eigen.some((zeile) => zeile.includes("Bauer g7"))).toBe(false);
  });

  it("Abb. 4.13 (D.4): W5 scheinbar, der Bauer d5 ist nur vom gefesselten Springer f6 gedeckt", () => {
    const auswertung = ergebnis("4.13");
    expect(zeilen(auswertung, "w5")).toEqual([
      "scheinbar: Bauer d5, nur von der gefesselten Figur f6 gedeckt; eine gefesselte Figur wirkt weiter (Kapitel 7)",
    ]);
    expect(beschriftungen(auswertung.markierungen)).toContain("gold d5 W5");
    expect(auswertung.fazit).toContain("W5");
  });

  it("Übung 7.53 (C2.9): W4, die Dame d8 hält c7 und e8 (Dxc7 Dxc7 Te8#)", () => {
    expect(zeilen(ergebnis("7.53"), "gegner")).toContain(
      "W4 Doppelte Aufgabe: Dame d8 hält c7 und e8 (Einschätzung)",
    );
  });

  it("Fazit nennt die Signale beider Seiten und mahnt zum Rechnen", () => {
    expect(ergebnis("4.11").fazit).toBe(
      "Bei Schwarz: W1, W2, W3. Beim Gegner: W1, W5. Rechne besonders genau.",
    );
  });

  it("Lehrbild ohne König: nur W1 und W2, keine Fehler", () => {
    const lehrbild = stellungAus("8/8/8/3N4/8/8/8/8 w - - 0 1");
    const auswertung = warnsignale(lehrbild, "white");
    expect(zeilen(auswertung, "eigen")).toEqual(["W1 Ungedeckt: Springer d5"]);
    expect(zeilen(auswertung, "w5")).toEqual(["keine"]);
  });
});
