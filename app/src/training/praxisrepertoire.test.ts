/**
 * Tests der Runden des Repertoire-Trainers aus Kapitel 3 (Gambits) und aus der Praxis (Lichess,
 * echte Datei der Eröffnungen nach Spielstärke, 2026-09). Wunsch des Autors vom 1.11.2026.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ladeKapitel } from "../schach/buchabbildungen.testhilfe";
import { haeufigsteVarianten } from "../spiel/boteroeffnung";
import { eroeffnungsbaenderAus, type Eroeffnungsbaender } from "../spiel/eroeffnungsbaender";
import { gambitsAus } from "./abweichungstrainer";
import {
  praxisanzahl,
  praxislinien,
  praxisname,
  praxisrunde,
  wahlAlsText,
  wahlAusText,
} from "./praxisrepertoire";
import { anfang, istBuchzug, mitAntwort, repertoirerunde, varianten } from "./repertoiretrainer";
import { festerZufall } from "./zufall";

const roh: unknown = JSON.parse(
  readFileSync(new URL("../../public/daten/eroeffnungsbaender.json", import.meta.url), "utf8"),
);
const daten = eroeffnungsbaenderAus(roh) as Eroeffnungsbaender;
const familie = (name: string) => {
  const f = daten.familien.find((x) => x.name === name);
  if (!f) throw new Error(`${name} fehlt`);
  return f;
};

describe("Repertoire-Trainer mit den Gambits aus Kapitel 3", () => {
  const gambits = gambitsAus(ladeKapitel(3), ladeKapitel(2));

  it("die Gambits stehen mit kurzem Namen zur Wahl, das Damengambit zuletzt", () => {
    const titel = gambits.map((g) => g.titel);
    expect(titel[0]).toBe("Königsgambit");
    expect(titel).toContain("Smith-Morra-Gambit");
    expect(titel).toContain("Dänisches Gambit");
    expect(titel.at(-1)).toBe("Damengambit");
    expect(titel.some((x) => x.includes(":"))).toBe(false);
  });

  it("jedes Gambit hat Varianten aus dem Buch, die Runde folgt dem Buch", () => {
    for (const g of gambits) expect(varianten(g.beispiel).length, g.titel).toBeGreaterThan(0);
    const koenigsgambit = gambits[0];
    if (!koenigsgambit) throw new Error("Königsgambit fehlt");
    const [weiss] = repertoirerunde(koenigsgambit, "white", 6);
    if (!weiss) throw new Error("keine Variante");
    expect(weiss.linie.slice(0, 4)).toEqual(["e4", "e5", "f4", "exf4"]);
    expect(weiss.herkunft).toBeUndefined();
    expect(mitAntwort(weiss, ["e4", "e5"])).toEqual(["e4", "e5", "f4", "exf4"]);
  });

  it("Englund-Gambit als Schwarz: 1. d4 steht schon, der Leser zieht 1... e5", () => {
    const englund = gambits.find((g) => g.titel === "Englund-Gambit");
    if (!englund) throw new Error("Englund-Gambit fehlt");
    const runde = repertoirerunde(englund, "black", 6);
    expect(runde.length).toBeGreaterThan(1);
    const erste = runde[0];
    if (!erste) throw new Error("keine Variante");
    expect(anfang(erste)).toEqual(["d4"]);
    expect(istBuchzug(erste, 1, "e5")).toBe(true);
  });
});

describe("Repertoire-Trainer mit Eröffnungen aus der Praxis (Lichess)", () => {
  it("die Wahl übersteht den Gerätemerker als Text", () => {
    const werte = ["praxis:Italian Game", "praxis:Sicilian Defense: Old Sicilian"];
    expect(wahlAusText(wahlAlsText(werte))).toEqual(werte);
    expect(wahlAusText("")).toEqual([]);
    expect(wahlAusText("Unsinn")).toEqual([]);
  });

  it("Namen auf Deutsch mit deutschem Familiennamen", () => {
    expect(praxisname(daten, "Sicilian Defense: Old Sicilian", true)).toBe(
      "Sizilianische Verteidigung: Old Sicilian",
    );
    expect(praxisname(daten, "Sicilian Defense: Old Sicilian", false)).toBe(
      "Sicilian Defense: Old Sicilian",
    );
  });

  it("aus der Schnellwahl werden Linien; Anfänge anderer Linien und Unbekanntes fallen weg", () => {
    const werte = [
      "praxis:Sicilian Defense",
      ...haeufigsteVarianten(familie("Sicilian Defense"), 3),
      "praxis:Gibt es nicht",
    ];
    const linien = praxislinien(daten, werte, true);
    // „1. e4 c5“ ist Anfang der Varianten und fällt weg, die unbekannte auch.
    expect(linien.length).toBe(3);
    expect(linien.every((l) => l.linie[0] === "e4" && l.linie[1] === "c5")).toBe(true);
    expect(linien[0]?.titel).toBe("Sizilianische Verteidigung: Old Sicilian");
  });

  it("die Runde fragt die Linien Zug für Zug ab, mit Herkunft Praxis", () => {
    const linien = praxislinien(daten, haeufigsteVarianten(familie("Italian Game"), 3), true);
    const runde = praxisrunde(linien, "white", 6, festerZufall(1));
    expect(runde.length).toBe(linien.length);
    for (const a of runde) {
      expect(a.herkunft).toBe("praxis");
      expect(a.linie.slice(0, 5)).toEqual(["e4", "e5", "Nf3", "Nc6", "Bc4"]);
      expect(anfang(a)).toEqual([]);
      expect(mitAntwort(a, [])).toEqual(["e4", "e5"]);
    }
  });

  it("ohne eigenen Zug keine Aufgabe (Schwarz bei 1. c4); höchstens so viele wie je Runde", () => {
    const linien = praxislinien(daten, ["praxis:English Opening"], true);
    expect(linien.map((l) => l.linie)).toEqual([["c4"]]);
    expect(praxisanzahl(linien, "black", 6)).toBe(0);
    expect(praxisrunde(linien, "black", 6, festerZufall(1))).toEqual([]);
    expect(praxisanzahl(linien, "white", 6)).toBe(1);
    const viele = praxislinien(daten, haeufigsteVarianten(familie("Sicilian Defense"), null), true);
    expect(viele.length).toBeGreaterThan(6);
    expect(praxisrunde(viele, "black", 6, festerZufall(2)).length).toBe(6);
    expect(praxisanzahl(viele, "black", 6)).toBe(6);
  });
});
