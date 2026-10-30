/**
 * Tests der Zusatzpartien für „Zug erraten“ (training/zusatzpartien.ts) und ihrer Datei
 * public/daten/zusatzpartien.json: Format, Legalität, Mindestlänge, Pflichtfelder, keine
 * Dubletten, keine Partie aus Kapitel 11 doppelt.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ladeKapitel } from "../schach/buchabbildungen.testhilfe";
import { partienAus } from "./studientrainer";
import { inSprache, partietitel, zusatzaufgaben, zusatzpartienAus } from "./zusatzpartien";

const roh: unknown = JSON.parse(
  readFileSync(new URL("../../public/daten/zusatzpartien.json", import.meta.url), "utf8"),
);
const partien = zusatzpartienAus(roh) ?? [];
const MINDEST_HALBZUEGE = 30;
const MINDEST_ELO = 2500;
const MINDEST_KLASSIKER = 40;
const MINDEST_TURNIER = 50;
/** So viele gleiche Halbzüge von Anfang an gelten als dieselbe Partie. */
const GLEICHER_ANFANG = 30;

const anfang = (zuege: readonly string[]) => zuege.slice(0, GLEICHER_ANFANG).join(" ");

describe("Zusatzpartien: Datei", () => {
  it("hat das erwartete Format und genug Partien je Quelle", () => {
    expect(zusatzpartienAus(roh)).not.toBeNull();
    const klassiker = partien.filter((p) => p.art === "klassiker");
    const turnier = partien.filter((p) => p.art === "turnier");
    expect(klassiker.length).toBeGreaterThanOrEqual(MINDEST_KLASSIKER);
    expect(turnier.length).toBeGreaterThanOrEqual(MINDEST_TURNIER);
  });

  it("jede Partie ist legal und mindestens 30 Halbzüge lang", () => {
    for (const quelle of ["klassiker", "turnier"] as const) {
      const aufgaben = zusatzaufgaben(partien, quelle, "white", "de");
      expect(aufgaben.length).toBe(partien.filter((p) => p.art === quelle).length);
      for (const a of aufgaben) expect(a.linie.length).toBeGreaterThanOrEqual(MINDEST_HALBZUEGE);
    }
  });

  it("Kennungen, Titel und Zugfolgen sind eindeutig", () => {
    const titel = zusatzaufgaben(partien, "klassiker", "white", "de")
      .concat(zusatzaufgaben(partien, "turnier", "white", "de"))
      .map((a) => a.titel);
    expect(new Set(partien.map((p) => p.id)).size).toBe(partien.length);
    expect(new Set(titel).size).toBe(titel.length);
    expect(new Set(partien.map((p) => anfang(p.zuege.split(" ")))).size).toBe(partien.length);
  });

  it("Klassiker: Kurztext deutsch und englisch, zwei Quellen", () => {
    for (const p of partien.filter((x) => x.art === "klassiker")) {
      expect(p.text?.de, p.id).toBeTruthy();
      expect(p.text?.en, p.id).toBeTruthy();
      expect(p.ereignis.en, p.id).toBeTruthy();
      expect(p.quelle.length, p.id).toBeGreaterThanOrEqual(2);
    }
  });

  it("Turnierpartien: Lichess-Übertragung, CC BY-SA, beide ab 2500, entschieden", () => {
    for (const p of partien.filter((x) => x.art === "turnier")) {
      expect(p.lizenz).toContain("CC BY-SA 4.0");
      expect(p.quelle[0]).toMatch(/^https:\/\/lichess\.org\/broadcast\//);
      expect(Math.min(...(p.elo ?? [0, 0]))).toBeGreaterThanOrEqual(MINDEST_ELO);
      expect(["1-0", "0-1"]).toContain(p.ergebnis);
    }
  });

  it("keine Meisterpartie aus Kapitel 11 doppelt", () => {
    const buch = new Set(partienAus(ladeKapitel(11), "white").map((a) => anfang(a.linie)));
    const doppelt = partien.filter((p) => buch.has(anfang(p.zuege.split(" "))));
    expect(doppelt.map((p) => p.id)).toEqual([]);
  });
});

describe("Zusatzpartien: Rechnung", () => {
  it("unbekanntes Format ergibt null", () => {
    expect(zusatzpartienAus(null)).toBeNull();
    expect(zusatzpartienAus({ partien: [{ id: "x" }] })).toBeNull();
  });

  it("Text in der Sprache, sonst deutsch", () => {
    expect(inSprache({ de: "Unsterbliche", en: "Immortal" }, "en")).toBe("Immortal");
    expect(inSprache({ de: "Unsterbliche" }, "fr")).toBe("Unsterbliche");
    expect(inSprache(undefined, "de")).toBe("");
  });

  it("Titel aus Nachnamen, Ereignis und Jahr", () => {
    const [erste] = partien;
    if (!erste) throw new Error("keine Zusatzpartien");
    const beispiel = {
      ...erste,
      weiss: "Caruana, Fabiano",
      schwarz: "Wesley So",
      ereignis: { de: "Sinquefield Cup" },
      datum: "2026-08-20",
    };
    expect(partietitel(beispiel, "de")).toBe("Caruana – So, Sinquefield Cup 2026");
    const mitJahr = { ...beispiel, ereignis: { de: "Sinquefield Cup 2026" } };
    expect(partietitel(mitJahr, "de")).toBe("Caruana – So, Sinquefield Cup 2026");
  });

  it("als Schwarz bleibt die Partie dieselbe, nur die Seite wechselt", () => {
    const weiss = zusatzaufgaben(partien, "turnier", "white", "de")[0];
    const schwarz = zusatzaufgaben(partien, "turnier", "black", "de")[0];
    expect(schwarz?.linie).toEqual(weiss?.linie);
    expect(schwarz?.seite).toBe("black");
    expect(schwarz?.zusatz?.art).toBe("turnier");
  });
});
