/**
 * Referenztests für k8-schluesselfelder an Kapitel 8 (Abb. 8.21, 8.25 bis 8.31) und Übung 8.61.
 */
import { describe, expect, it } from "vitest";
import { stellungVon } from "../schach/buchabbildungen.testhilfe";
import { schluessel } from "./k8-schluesselfelder";

function zeilen(nummer: string, farbe: "white" | "black" = "white"): readonly string[] {
  return schluessel(stellungVon(nummer), farbe).befunde[0]?.zeilen ?? [];
}

describe("k8-schluesselfelder", () => {
  it("Abb. 8.25: Bauer e4 hat d6, e6, f6 (gold)", () => {
    expect(zeilen("8.25")[0]).toBe(
      "Bauer auf der 4. Reihe: die drei Felder zwei Reihen davor, d6, e6 und f6",
    );
    expect(schluessel(stellungVon("8.25"), "white").markierungen).toEqual([
      { typ: "feld", farbe: "gold", feld: "d6" },
      { typ: "feld", farbe: "gold", feld: "e6" },
      { typ: "feld", farbe: "gold", feld: "f6" },
    ]);
  });

  it("Abb. 8.26: Bauer e5 hat die sechs Felder d6 bis f7", () => {
    expect(zeilen("8.26")[0]).toBe(
      "Bauer auf der 5. Reihe: die sechs Felder eine und zwei Reihen davor, d6, e6, f6, d7, e7 und f7",
    );
  });

  it("Abb. 8.27 (Weiß am Zug): Kc4, Kd4 oder Ke4 besetzt sofort ein Schlüsselfeld", () => {
    const e = schluessel(stellungVon("8.27"), "white");
    expect(e.befunde[0]?.zeilen[1]).toBe(
      "Weiß am Zug kann ein Schlüsselfeld besetzen: Kc4, Kd4 und Ke4.",
    );
    expect(e.fazit).toBe("Weiß kann jetzt ein Schlüsselfeld besetzen: Kc4, Kd4 und Ke4.");
    expect(e.markierungen).toContainEqual({ typ: "pfeil", farbe: "gold", von: "d3", nach: "d4" });
  });

  it("Abb. 8.28 (Schwarz am Zug): aus Sicht von Schwarz sind die Felder rot, das Fazit nennt den Stand", () => {
    const e = schluessel(stellungVon("8.28"), "black");
    expect(e.befunde[0]?.kennung).toBe("gegner-d2");
    expect(e.markierungen[0]).toEqual({ typ: "feld", farbe: "rot", feld: "c4" });
    expect(e.fazit).toMatch(/^Kein Schlüsselfeld besetzt: Der König von Weiß braucht einen Zug/);
  });

  it("Abb. 8.21: Der König d6 steht auf einem Schlüsselfeld des Bauern e5", () => {
    expect(zeilen("8.21")[1]).toBe(
      "Der König d6 steht auf einem Schlüsselfeld: Weiß gewinnt unabhängig vom Zugrecht, solange der Bauer nicht sofort verloren geht.",
    );
  });

  it("Abb. 8.29 und 8.30: Sonderfall 6. Reihe, mit oder ohne Schach", () => {
    expect(zeilen("8.29")).toContain(
      "Sonderfall 6. Reihe: Der Bauer kommt ohne Schach auf die 7. Reihe, die Bauernseite gewinnt.",
    );
    expect(zeilen("8.30")).toContain(
      "Der Verteidiger am Zug stellt sich schräg vor den Bauern (d8 und f8), damit der Bauernzug mit Schach kommt.",
    );
  });

  it("Abb. 8.29 (C1.20): Das Fazit nennt den Sonderfall 6. Reihe, nicht „erst die Opposition“", () => {
    expect(schluessel(stellungVon("8.29"), "white").fazit).toBe(
      "Weiß gewinnt mit e7 (Sonderfall 6. Reihe).",
    );
    // Auch aus Sicht von Schwarz (0.2.65): Der Sonderfall gilt, nicht „die Opposition entscheidet“.
    expect(schluessel(stellungVon("8.29"), "black").fazit).toBe(
      "Weiß gewinnt mit e7 (Sonderfall 6. Reihe).",
    );
    // Schwarz am Zug (Abb. 8.30): kein Gewinnzug für Weiß, das Fazit bleibt beim Stand.
    expect(schluessel(stellungVon("8.30"), "white").fazit).not.toMatch(/Sonderfall/);
    // Nicht im Turmendspiel (Abb. 9.4) und nicht beim Randbauern (Abb. 9.41, falscher Läufer).
    expect(schluessel(stellungVon("9.4"), "white").fazit).not.toMatch(/gewinnt mit/);
    expect(schluessel(stellungVon("9.41"), "white").fazit).not.toMatch(/gewinnt mit/);
  });

  it("Abb. 8.31 und Übung 8.61: Randbauer a-Linie hat b7 und b8", () => {
    expect(zeilen("8.31")[0]).toBe(
      "Randbauer: die beiden letzten Felder der Nachbarlinie, b7 und b8",
    );
    expect(zeilen("8.61")[0]).toBe(
      "Randbauer: die beiden letzten Felder der Nachbarlinie, b7 und b8",
    );
    expect(zeilen("8.31")).toContain(
      "Randbauer-Ausnahme: Erreicht der verteidigende König die Ecke rechtzeitig, ist die Stellung zumeist remis; gewonnen, wenn der angreifende König b7/b8 (g7/g8) erreicht.",
    );
  });

  it("ohne Freibauern ein Hinweis (Abb. 8.1)", () => {
    expect(schluessel(stellungVon("8.1"), "white").befunde[0]?.kennung).toBe("keine");
  });
});
