/** Tests für Genauigkeitsmodus und Spielstärke nach der Eichung (0.2.83, Kurven neu seit 0.2.103). */
import { describe, expect, it } from "vitest";
import { kurvenwert, POLSTER, staerkeAusGenauigkeit, staerkeUeberPartien } from "./staerkemodell";

describe("staerkemodell", () => {
  it("liest Kurven linear und hält die Ränder", () => {
    const kurve = [
      [50, 1000],
      [60, 1200],
    ] as const;
    expect(kurvenwert(kurve, 55)).toBe(1100);
    expect(kurvenwert(kurve, 40)).toBe(1000);
    expect(kurvenwert(kurve, 70)).toBe(1200);
  });

  it("schätzt eine Partie als Mitte mit Spanne ±400 und beiden Skalen", () => {
    const s = staerkeAusGenauigkeit(80);
    expect(s).toEqual({ mitte: 1550, von: 1150, bis: 1950, chesscom: 1500, lichess: 1650 });
  });

  it("steigt mit der Genauigkeit", () => {
    expect(staerkeAusGenauigkeit(60).mitte).toBeLessThan(staerkeAusGenauigkeit(90).mitte);
  });

  it("schätzt zehn Partien enger (±250), weniger Partien weiter", () => {
    const zehn = staerkeUeberPartien(Array.from({ length: 10 }, () => 75));
    expect(zehn).toEqual({ mitte: 1550, von: 1300, bis: 1800, chesscom: 1500, lichess: 1600 });
    const eine = staerkeUeberPartien([75]);
    expect((eine?.bis ?? 0) - (eine?.von ?? 0)).toBe(800);
    expect(staerkeUeberPartien([])).toBeNull();
  });

  it("drei Partien mit 70, 80 und 75 % (Beispiel in wertung.ts)", () => {
    expect(staerkeUeberPartien([70, 80, 75])).toEqual({
      mitte: 1550,
      von: 1200,
      bis: 1900,
      chesscom: 1500,
      lichess: 1600,
    });
  });

  it("nimmt nur die letzten zehn Partien", () => {
    const alt = Array.from({ length: 5 }, () => 40);
    const neu = Array.from({ length: 10 }, () => 75);
    expect(staerkeUeberPartien([...alt, ...neu])).toEqual(staerkeUeberPartien(neu));
  });

  it("Polster: Lichess voll, Mittelweg halb, nahe chess.com kaum", () => {
    expect(POLSTER).toEqual({ lichess: 1, mittelweg: 0.55, chesscom: 0.1 });
  });
});
