/**
 * Tests der vorgefertigten Gegner (engine/gegnerliste.ts): 78 Bots in zehn Gruppen, eindeutige Kennungen,
 * Text und Porträt zu jedem, Stil im erlaubten Bereich; dazu der Schnitt mit der
 * allgemeinen Abhakliste der Fehlerarten (Rückfrage S7) und Gruppen ohne Überschneidung.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import de from "../i18n/de.json";
import { bereichDerStufe } from "./botstaerke";
import { FEHLERARTEN } from "./fehlerart";
import {
  durchschnitt,
  GEGNER,
  gegnerDerStufe,
  gegnerSortiert,
  unterAbhakliste,
  istSpassbot,
  spassbots,
} from "./gegner";
import { STIL_MAX, STIL_MIN } from "./stil";
import type { Stufennummer } from "./stufen";

/** 78 Bots (Satz vom 24.10.2026: Gruppe 1 sechs, sonst acht), nach gemessener Zahl auf die Stufen verteilt. */
const BOTS_ZAHL = 80;
const STUFENNUMMERN: readonly Stufennummer[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

describe("vorgefertigte Gegner", () => {
  it("sind nach Durchschnitt sortiert, die stärksten mit Stufe 9 zuletzt (10 ist die volle Engine)", () => {
    const sortiert = gegnerSortiert();
    expect(sortiert).toHaveLength(GEGNER.length);
    for (let i = 1; i < sortiert.length; i += 1) {
      const vorher = sortiert[i - 1];
      const jetzt = sortiert[i];
      if (vorher && jetzt) expect(durchschnitt(vorher)).toBeLessThanOrEqual(durchschnitt(jetzt));
    }
    expect(sortiert.at(-1)?.stufenJePhase.mittelspiel).toBe(9);
  });

  it("jeder Bot in genau einer Gruppe (seit 0.2.117 nach gemessener Zahl), Kennungen eindeutig, Stil im Bereich", () => {
    const zusammen = STUFENNUMMERN.reduce((s, n) => s + gegnerDerStufe(n).length, 0);
    expect(zusammen).toBe(GEGNER.filter((g) => !g.zufallszuege).length);
    expect(new Set(GEGNER.map((g) => g.kennung)).size).toBe(GEGNER.length);
    for (const g of GEGNER) {
      expect(g.stil).toBeGreaterThanOrEqual(STIL_MIN);
      expect(g.stil).toBeLessThanOrEqual(STIL_MAX);
    }
  });

  it("jeder Gegner hat einen Satz in de.json und ein Porträt in public/gegner", () => {
    const texte: Record<string, string> = de;
    for (const g of GEGNER) {
      expect(texte[g.beschreibung], g.kennung).toBeTruthy();
      expect(existsSync(join("public", "gegner", `${g.portraet}.svg`)), g.kennung).toBe(true);
    }
  });
});

describe("Gruppen ohne Überschneidung (0.2.109)", () => {
  // Seit 0.2.144 feste Zuordnung je acht Bots nach der gemessenen Zahl (engine/botgruppe.ts).
  it("die stärkste Zahl einer Stufe liegt unter der schwächsten der nächsten", () => {
    for (const nummer of STUFENNUMMERN.slice(0, -1)) {
      const naechste = (nummer + 1) as Stufennummer;
      // Gleich hohe Zahlen an der Grenze sind keine Überschneidung (Sortierung nach Zahl).
      expect(bereichDerStufe(nummer).bis, `Stufe ${nummer}`).toBeLessThanOrEqual(
        bereichDerStufe(naechste).von,
      );
    }
  });

  it("je Stufe genau acht Bots", () => {
    for (const nummer of STUFENNUMMERN) {
      expect(
        gegnerDerStufe(nummer).filter((g) => !istSpassbot(g)),
        `Stufe ${nummer}`,
      ).toHaveLength(8);
    }
  });
});

describe("Spaß-Bots (0.2.88)", () => {
  it("vier, schwächster zuerst, mit Zufallszügen und nicht in der Gruppe der Stufe 1", () => {
    const spass = spassbots();
    expect(spass.map((g) => g.kennung)).toEqual(["kiki", "onkel-otto", "tante-hilde", "bodo"]);
    for (let i = 1; i < spass.length; i += 1) {
      expect(spass[i]?.zufallszuege ?? 0).toBeLessThan(spass[i - 1]?.zufallszuege ?? 0);
    }
    expect(gegnerDerStufe(1).some(istSpassbot)).toBe(false);
    expect(GEGNER.filter((g) => !istSpassbot(g))).toHaveLength(BOTS_ZAHL);
  });
});

describe("Abhakliste der Fehlerarten (0.2.60)", () => {
  it("lässt alles unverändert, wenn alle Arten erlaubt sind; Bots haben alle Arten (0.2.117)", () => {
    expect(unterAbhakliste(null, FEHLERARTEN)).toBeNull();
    expect(GEGNER.every((g) => g.fehlerarten === null)).toBe(true);
  });
  it("beschneidet eine Liste: ohne „Figur hängen lassen“", () => {
    const erlaubt = FEHLERARTEN.filter((art) => art !== "figurHaengen");
    expect(unterAbhakliste(["figurHaengen", "bauernraub"], erlaubt)).toEqual(["bauernraub"]);
  });
  it("ergibt für die reine Engine die Abhakliste, leer heißt keine absichtlichen Fehler", () => {
    expect(unterAbhakliste(null, ["bauernraub"])).toEqual(["bauernraub"]);
    expect(unterAbhakliste(null, [])).toEqual([]);
    expect(unterAbhakliste(["bauernraub", "tempoverlust"], ["tempoverlust", "ungenau"])).toEqual([
      "tempoverlust",
    ]);
  });
});
