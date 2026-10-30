/** Prüft die Auswahl der Eröffnungen nach Spielstärke an der echten Datei (Lichess 2026-09). */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  alsPraxiseintraege,
  auswahlNachStaerke,
  eroeffnungsbaenderAus,
  gambitsNachStaerke,
  variantenbaum,
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

  it("Variantenbaum: Verzweigung ab dem ersten abweichenden Zug, nach Häufigkeit", () => {
    const italienisch = daten.familien.find((f) => f.name === "Italian Game");
    if (!italienisch) throw new Error("Italian Game fehlt");
    const baum = variantenbaum(daten, italienisch);
    expect(baum[0]?.variante.name).toBe("Italian Game: Two Knights Defense");
    const kinder = baum[0]?.kinder.map((k) => k.variante.folge) ?? [];
    expect(kinder.every((f) => f.startsWith("e4 e5 Nf3 Nc6 Bc4 Nf6 "))).toBe(true);
    expect(baum[0]?.anteil).toBeGreaterThan(0);
    expect(baum[0]?.anteil).toBeLessThanOrEqual(100);
    // Jede Variante steht genau einmal im Baum
    const zaehle = (k: typeof baum): number => k.reduce((n, x) => n + 1 + zaehle(x.kinder), 0);
    expect(zaehle(baum)).toBe(italienisch.varianten.length);
  });

  it("Gambits nach Spielstärke, beide Seiten", () => {
    const liste = gambitsNachStaerke(daten, band(800), band(800));
    expect(liste.map((e) => e.familie.name)).toContain("Englund Gambit");
    expect(liste).toHaveLength(3);
  });

  it("Praxis-Einträge enthalten Varianten und Gambits", () => {
    const namen = alsPraxiseintraege(daten).map(([n]) => n);
    expect(namen).toContain("Italian Game: Evans Gambit");
    expect(namen).toContain("Englund Gambit");
  });

  it("unbekanntes Format → null", () => {
    expect(eroeffnungsbaenderAus({ x: 1 })).toBeNull();
    expect(eroeffnungsbaenderAus(null)).toBeNull();
  });
});
