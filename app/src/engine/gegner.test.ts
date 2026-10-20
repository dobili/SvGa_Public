/**
 * Tests der vorgefertigten Gegner (engine/gegnerliste.ts): acht je Stufe, eindeutige Kennungen,
 * Text und Porträt zu jedem, Stil im erlaubten Bereich; dazu seit 0.2.60 der Schnitt mit der
 * allgemeinen Abhakliste der Fehlerarten (Rückfrage S7) und seit 0.2.109 Gruppen ohne
 * Überschneidung.
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

const JE_STUFE = 8;
const STUFENNUMMERN: readonly Stufennummer[] = [1, 2, 3, 4, 5, 6, 7, 8];

describe("vorgefertigte Gegner", () => {
  it("sind nach Durchschnitt sortiert, Großmeister Grün zuletzt", () => {
    const sortiert = gegnerSortiert();
    expect(sortiert).toHaveLength(GEGNER.length);
    for (let i = 1; i < sortiert.length; i += 1) {
      const vorher = sortiert[i - 1];
      const jetzt = sortiert[i];
      if (vorher && jetzt) expect(durchschnitt(vorher)).toBeLessThanOrEqual(durchschnitt(jetzt));
    }
    expect(sortiert.at(-1)?.stufenJePhase.mittelspiel).toBe(8);
  });

  it("acht je Stufe (0.2.65), Kennungen eindeutig, Stil im Bereich", () => {
    for (const nummer of STUFENNUMMERN) expect(gegnerDerStufe(nummer)).toHaveLength(JE_STUFE);
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
  it("die stärkste Zahl einer Stufe liegt unter der schwächsten der nächsten", () => {
    for (const nummer of STUFENNUMMERN.slice(0, -1)) {
      const naechste = (nummer + 1) as Stufennummer;
      expect(bereichDerStufe(nummer).bis, `Stufe ${nummer}`).toBeLessThan(
        bereichDerStufe(naechste).von,
      );
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
    expect(GEGNER.filter((g) => !istSpassbot(g))).toHaveLength(STUFENNUMMERN.length * JE_STUFE);
  });
});

describe("Abhakliste der Fehlerarten (0.2.60)", () => {
  it("lässt alles unverändert, wenn alle Arten erlaubt sind; Bots haben alle Arten (0.2.116)", () => {
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
