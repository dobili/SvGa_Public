/** Prüft die Auswahl der Eröffnungen nach Spielstärke an der echten Datei (Lichess 2026-09). */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  alsPraxiseintraege,
  auswahlNachStaerke,
  eroeffnungsbaenderAus,
  type Eroeffnungsbaender,
} from "./eroeffnungsbaender";

const roh: unknown = JSON.parse(
  readFileSync(new URL("../../public/daten/eroeffnungsbaender.json", import.meta.url), "utf8"),
);
const daten = eroeffnungsbaenderAus(roh) as Eroeffnungsbaender;
const band = (wert: number) => daten.baender.indexOf(wert);
const namen = (liste: ReturnType<typeof auswahlNachStaerke>) => liste.map((e) => e.familie.name);

describe("Eröffnungen nach Spielstärke", () => {
  it("liest die Datei", () => {
    expect(daten.baender[0]).toBe(400);
    expect(daten.familien.length).toBeGreaterThan(30);
  });

  it("ein Band: die drei häufigsten der Seite", () => {
    const weiss = namen(auswahlNachStaerke(daten, "w", band(1200), band(1200)));
    expect(weiss).toEqual(["Italian Game", "Bishop's Opening", "London System"]);
    const schwarz = namen(auswahlNachStaerke(daten, "s", band(1800), band(1800)));
    expect(schwarz[0]).toBe("Sicilian Defense");
  });

  it("jedes weitere Band bringt drei neue", () => {
    const liste = auswahlNachStaerke(daten, "w", band(1200), band(1400));
    expect(liste).toHaveLength(6);
    expect(new Set(namen(liste)).size).toBe(6);
    expect(liste.slice(3).every((e) => e.band === band(1400))).toBe(true);
  });

  it("vertauschte oder zu große Grenzen werden gerichtet", () => {
    const richtig = namen(auswahlNachStaerke(daten, "s", band(600), band(800)));
    expect(namen(auswahlNachStaerke(daten, "s", band(800), band(600)))).toEqual(richtig);
    expect(auswahlNachStaerke(daten, "w", 0, 99).length).toBeGreaterThan(0);
  });

  it("Bucheröffnungen tragen ihren Abschnitt", () => {
    const italienisch = daten.familien.find((f) => f.name === "Italian Game");
    expect(italienisch?.buch).toBe("2.3");
    expect(alsPraxiseintraege(daten).find(([n]) => n === "Italian Game")?.[1]).toBe(
      "e4 e5 Nf3 Nc6 Bc4",
    );
  });

  it("unbekanntes Format → null", () => {
    expect(eroeffnungsbaenderAus({ x: 1 })).toBeNull();
    expect(eroeffnungsbaenderAus(null)).toBeNull();
  });
});
