/**
 * Referenztests für k9-turmbegriffe an Kapitel 9 (Abb. 9.1 bis 9.6, 9.8, 9.18, 9.23, 9.25, 9.26)
 * und den Übungen 9.46, 9.47 und 9.50.
 */
import { describe, expect, it } from "vitest";
import { stellungVon } from "../schach/buchabbildungen.testhilfe";
import { turmbegriffe } from "./k9-turmbegriffe";

function zeilen(nummer: string, kennung: string): readonly string[] {
  const s = stellungVon(nummer);
  return turmbegriffe(s, s.amZug).befunde.find((b) => b.kennung === kennung)?.zeilen ?? [];
}

describe("k9-turmbegriffe", () => {
  it("Abb. 9.1: Der Turm e1 schneidet den König g6 ab, drei Linien dazwischen (grauer Pfeil e1–e8)", () => {
    expect(zeilen("9.1", "abschneiden")).toEqual([
      "Der Turm e1 sperrt eine Linie zwischen dem König g6 und dem Bauern: 3 Linien dazwischen (grauer Pfeil).",
      "Faustregel: Ab drei Linien reicht es oft zum Gewinn.",
    ]);
    const s = stellungVon("9.1");
    expect(turmbegriffe(s, "white").markierungen[0]).toEqual({
      typ: "pfeil",
      farbe: "grau",
      von: "e1",
      nach: "e8",
    });
    expect(turmbegriffe(s, "white").fazit).toBe(
      "Weiß greift mit dem Bauern c5 an; der verteidigende König ist abgeschnitten.",
    );
  });

  it("Abb. 9.2: König g8 auf der kurzen Seite, Turm a6 auf der langen mit vier Linien Schachdistanz", () => {
    expect(zeilen("9.2", "schachdistanz")).toEqual([
      "Zwischen dem Turm a6 und dem Bauern f5: 4 Linien (nötig: 3 Linien).",
      "Das reicht für seine Schachs: Geht der König auf ihn zu, verlässt er seinen Bauern.",
    ]);
    expect(zeilen("9.2", "seiten")).toEqual([
      "Neben dem Bauern f5: rechts 2 Linien bis zum Rand (kurze Seite), links 5 (lange Seite).",
      "Der König g8 steht auf der kurzen Seite (richtig).",
      "Der Turm a6 steht auf der langen Seite (richtig).",
    ]);
    const m = turmbegriffe(stellungVon("9.2"), "white").markierungen;
    expect(m).toContainEqual({ typ: "pfeil", farbe: "grau", von: "a6", nach: "f6" });
    expect(m).toContainEqual({ typ: "feld", farbe: "gold", feld: "g8" });
    expect(m).toContainEqual({ typ: "feld", farbe: "gold", feld: "a6" });
  });

  it("Abb. 9.3 und 9.4 (C1.24, Philidor): keine Schachdistanz, keine Seiten, der Plan des Buches", () => {
    const plan =
      "Philidor: Turm auf der 3. Reihe von dir aus, nach dem Bauernzug von hinten Schach geben.";
    for (const nummer of ["9.3", "9.4"]) {
      expect(zeilen(nummer, "abschneiden")[0]).toMatch(/^Der König e8 ist nicht abgeschnitten/);
      expect(zeilen(nummer, "schachdistanz")).toEqual([
        "Der König e8 steht vor dem Bauern: Die Schachdistanz gilt hier nicht.",
        plan,
      ]);
      expect(zeilen(nummer, "seiten")).toEqual([
        "Kurze und lange Seite gelten erst, wenn Philidor nicht mehr geht: Der König e8 steht vor dem Bauern.",
      ]);
      const e = turmbegriffe(stellungVon(nummer), "white");
      expect(e.fazit).toBe(plan);
      expect(e.befunde.flatMap((b) => b.zeilen).join(" ")).not.toMatch(/Zu nah|kurzen Seite/);
    }
    // Der Turm h6 sperrt die 6. Reihe (9.3), Th1 gibt von hinten Schach (9.4): beide gold.
    expect(turmbegriffe(stellungVon("9.3"), "white").markierungen).toContainEqual({
      typ: "feld",
      farbe: "gold",
      feld: "h6",
    });
    expect(turmbegriffe(stellungVon("9.4"), "white").markierungen).toContainEqual({
      typ: "feld",
      farbe: "gold",
      feld: "h1",
    });
  });

  it("Übung 9.46 (C2.16): Der König f6 steht vor seinem Bauern, also kein Philidor", () => {
    expect(zeilen("9.46", "seiten")[0]).toMatch(/^Neben dem Bauern f5/);
    expect(turmbegriffe(stellungVon("9.46"), "black").fazit).not.toMatch(/^Philidor/);
  });

  it("Abb. 9.23, 9.25, 9.26 (C1.25): mehrere Bauern, Verweis auf das Erkennungsbild, kein Vancura", () => {
    for (const nummer of ["9.23", "9.25", "9.26"]) {
      const e = turmbegriffe(stellungVon(nummer), "white");
      expect(e.befunde.map((b) => b.kennung)).toEqual(["mehrbauern"]);
      expect(e.fazit).toBe("Sieh dir das Erkennungsbild „Turmendspiel mit mehreren Bauern“ an.");
      expect(e.befunde[0]?.zeilen.join(" ")).not.toMatch(/Randbauer|abgeschnitten/);
    }
  });

  it("Abb. 9.5 und 9.6: drei Linien reichen, zwei sind zu nah", () => {
    expect(zeilen("9.5", "schachdistanz")[1]).toMatch(/^Das reicht/);
    expect(zeilen("9.6", "schachdistanz")).toEqual([
      "Zwischen dem Turm b8 und dem Bauern e6: 2 Linien (nötig: 3 Linien).",
      "Zu nah: Der König geht auf den Turm zu, ohne seinen Bauern zu verlassen, und die Schachs hören auf.",
    ]);
  });

  it("Abb. 9.8 (Lucena): Der Turm f1 schneidet den König g7 auf der f-Linie ab", () => {
    expect(zeilen("9.8", "abschneiden")[0]).toBe(
      "Der Turm f1 sperrt eine Linie zwischen dem König g7 und dem Bauern: eine Linie dazwischen (grauer Pfeil).",
    );
  });

  it("Abb. 9.18 (Turm gegen Bauer): Der Turm d1 sperrt dem König e4 die d-Linie", () => {
    expect(zeilen("9.18", "abschneiden")[0]).toBe(
      "Der Turm d1 sperrt eine Linie zwischen dem König e4 und dem Bauern: 2 Linien dazwischen (grauer Pfeil).",
    );
    expect(zeilen("9.18", "seiten")).toEqual([
      "Kurze und lange Seite gelten für Turm und Bauer gegen Turm; hier hat nur eine Seite einen Turm.",
    ]);
  });

  it("Übung 9.47: Weg des Turms: König g7 gehört auf die kurze Seite, Turm b2 ohne Schachdistanz", () => {
    expect(zeilen("9.47", "seiten")[1]).toBe(
      "Der König g7 steht auf der langen Seite: Er gehört auf die kurze.",
    );
    expect(zeilen("9.47", "schachdistanz")[0]).toBe(
      "Zwischen dem Turm b2 und dem Bauern c7: 0 Linien (nötig: 3 Linien).",
    );
  });

  it("Übung 9.50: noch nicht abgeschnitten; Randbauer hat keine Seiten (Abb. 9.15)", () => {
    expect(zeilen("9.50", "abschneiden")[0]).toMatch(/^Der König h8 ist nicht abgeschnitten/);
    expect(zeilen("9.15", "seiten")[0]).toMatch(/^Randbauer a6: Neben ihm gibt es nur eine Seite/);
  });

  it("Abb. 9.22 verweist auf „Turm gegen Bauer“, Abb. 10.22 (kein Endspiel) nur auf die Grenze", () => {
    expect(turmbegriffe(stellungVon("9.22"), "white").fazit).toBe(
      "Sieh dir das Erkennungsbild „Turm gegen Bauer“ an.",
    );
    expect(turmbegriffe(stellungVon("10.22"), "black").fazit).toMatch(
      /^Die drei Begriffe und der Hinweis auf Vancura gelten für Turm und ein Bauer gegen Turm/,
    );
  });

  it("kein Turmendspiel (Abb. 8.19)", () => {
    expect(turmbegriffe(stellungVon("8.19"), "white").befunde[0]?.kennung).toBe("keins");
  });
});
