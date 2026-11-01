/**
 * Tests der Verlängerung der Varianten aus der Praxis (Wunsch des Autors zu N2538, 1.11.2026):
 * echte Dateien public/daten/praxisfortsetzungen.json und eroeffnungsbaender.json (Lichess 2026-09).
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { haeufigsteVarianten } from "../spiel/boteroeffnung";
import { eroeffnungsbaenderAus, type Eroeffnungsbaender } from "../spiel/eroeffnungsbaender";
import { GRUNDSTELLUNG } from "../spiel/stellungsbau";
import {
  bandindexFuer,
  folgezuege,
  praxisfortsetzungenAus,
  WERTUNG_OHNE_PARTIEN,
  type Praxisfortsetzungen,
} from "./praxisfortsetzung";
import { praxisanzahl, praxislinien, praxisrunde } from "./praxisrepertoire";
import { kanonischeLinie } from "./uebungsaufgabe";
import { festerZufall } from "./zufall";

const lies = (datei: string): unknown =>
  JSON.parse(readFileSync(new URL(`../../public/daten/${datei}`, import.meta.url), "utf8"));
const baender = eroeffnungsbaenderAus(lies("eroeffnungsbaender.json")) as Eroeffnungsbaender;
const fortsetzungen = praxisfortsetzungenAus(lies("praxisfortsetzungen.json")) as Praxisfortsetzungen;
const BAND_1200 = bandindexFuer(fortsetzungen, WERTUNG_OHNE_PARTIEN);
/** Höchstens so viele Halbzüge über den Namen hinaus, und die Zählung endet nach 20. */
const HOECHSTENS = 10;
const ZAEHLTIEFE = 20;
const OLD_SICILIAN = "praxis:Sicilian Defense: Old Sicilian";

describe("Fortsetzungen aus der Praxis: die Datei", () => {
  it("hat dieselben Bänder wie die Eröffnungen nach Spielstärke", () => {
    expect(fortsetzungen.baender).toEqual(baender.baender);
    expect(Object.keys(fortsetzungen.fortsetzungen).length).toBeGreaterThan(300);
  });

  it("jede Fortsetzung ist regelgerecht, 2 bis 10 Halbzüge lang und endet vor Halbzug 21", () => {
    for (const [folge, je] of Object.entries(fortsetzungen.fortsetzungen)) {
      expect(je.length).toBe(fortsetzungen.baender.length);
      je.forEach((_, band) => {
        const dazu = folgezuege(fortsetzungen, folge, band);
        if (dazu.length === 0) return;
        const name = folge.split(" ");
        expect(dazu.length, folge).toBeGreaterThanOrEqual(2);
        expect(dazu.length, folge).toBeLessThanOrEqual(HOECHSTENS);
        expect(name.length + dazu.length, folge).toBeLessThanOrEqual(ZAEHLTIEFE);
        expect(kanonischeLinie(GRUNDSTELLUNG, [...name, ...dazu]), `${folge} ${band}`).not.toBeNull();
      });
    }
  });

  it("Band nach Wertung; unbekanntes Format ergibt null", () => {
    expect(bandindexFuer(fortsetzungen, 1250)).toBe(4);
    expect(bandindexFuer(fortsetzungen, 350)).toBe(0);
    expect(bandindexFuer(fortsetzungen, 3100)).toBe(fortsetzungen.baender.length - 1);
    expect(praxisfortsetzungenAus(null)).toBeNull();
    expect(praxisfortsetzungenAus({ baender: [400] })).toBeNull();
    expect(folgezuege(fortsetzungen, "gibt es nicht", BAND_1200)).toEqual([]);
  });
});

describe("Verlängerte Varianten im Repertoire-Trainer", () => {
  const verlaengerung = { daten: fortsetzungen, band: BAND_1200 };

  it("Old Sicilian geht im Band 1200 nach 2... Sc6 mit den häufigsten Zügen weiter", () => {
    const [kurz] = praxislinien(baender, [OLD_SICILIAN], true);
    const [lang] = praxislinien(baender, [OLD_SICILIAN], true, verlaengerung);
    expect(kurz?.linie).toEqual(["e4", "c5", "Nf3", "Nc6"]);
    expect(kurz?.angehaengt).toBe(0);
    expect(lang?.linie.slice(0, 4)).toEqual(["e4", "c5", "Nf3", "Nc6"]);
    expect(lang?.angehaengt).toBeGreaterThanOrEqual(8);
    expect(lang?.linie.length).toBe(4 + (lang?.angehaengt ?? 0));
    expect(lang?.linie[4]).toBe("Bc4");
  });

  it("anderes Band, andere Fortsetzung: um 2000 folgt das offene Sizilianisch mit 3. d4", () => {
    const band = bandindexFuer(fortsetzungen, 2000);
    const [lang] = praxislinien(baender, [OLD_SICILIAN], true, { daten: fortsetzungen, band });
    expect(lang?.linie.slice(4, 7)).toEqual(["d4", "cxd4", "Nxd4"]);
  });

  it("zu dünne Daten: keine Verlängerung, die Linie endet am Namen", () => {
    const leer: Praxisfortsetzungen = { baender: fortsetzungen.baender, fortsetzungen: {} };
    const [linie] = praxislinien(baender, [OLD_SICILIAN], true, { daten: leer, band: 0 });
    expect(linie?.linie).toEqual(["e4", "c5", "Nf3", "Nc6"]);
    expect(linie?.angehaengt).toBe(0);
  });

  it("eine regelwidrige Fortsetzung fällt weg, die Linie bleibt bis zum Namen", () => {
    const kaputt: Praxisfortsetzungen = {
      baender: [400],
      fortsetzungen: { "e4 c5 Nf3 Nc6": ["Ke3 Kd7"] },
    };
    const [linie] = praxislinien(baender, [OLD_SICILIAN], true, { daten: kaputt, band: 0 });
    expect(linie?.linie).toEqual(["e4", "c5", "Nf3", "Nc6"]);
  });

  it("Schwarz bei 1. c4 hat mit Verlängerung eigene Züge", () => {
    const linien = praxislinien(baender, ["praxis:English Opening"], true, verlaengerung);
    expect(linien[0]?.angehaengt).toBeGreaterThan(0);
    expect(praxisanzahl(linien, "black", 6)).toBe(1);
  });

  it("nach der Verlängerung zählt der Anfang: was in eine längere Linie führt, fällt weg", () => {
    const kunst: Praxisfortsetzungen = {
      baender: [400],
      fortsetzungen: { "e4 c5": ["Nf3 Nc6 d4"] },
    };
    const werte = ["praxis:Sicilian Defense", OLD_SICILIAN];
    const linien = praxislinien(baender, werte, true, { daten: kunst, band: 0 });
    // „1. e4 c5“ verlängert ist e4 c5 Nf3 Nc6 d4; Old Sicilian (e4 c5 Nf3 Nc6) ist ihr Anfang.
    expect(linien.map((l) => l.linie.join(" "))).toEqual(["e4 c5 Nf3 Nc6 d4"]);
  });

  it("alle Varianten der Sizilianischen Verteidigung: Runde mit verlängerten Linien", () => {
    const sizilianisch = baender.familien.find((f) => f.name === "Sicilian Defense");
    if (!sizilianisch) throw new Error("Sizilianische Verteidigung fehlt");
    const werte = haeufigsteVarianten(sizilianisch, null);
    const linien = praxislinien(baender, werte, true, verlaengerung);
    expect(linien.some((l) => l.angehaengt > 0)).toBe(true);
    const runde = praxisrunde(linien, "black", 6, festerZufall(3));
    expect(runde.length).toBe(6);
    for (const a of runde) expect(a.linie.length).toBeLessThanOrEqual(ZAEHLTIEFE);
  });
});
