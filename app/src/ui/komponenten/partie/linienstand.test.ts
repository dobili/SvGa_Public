/**
 * Tests der Zugnavigation durch Partie und Engine-Folgen im Rückblick (linienstand.ts).
 *
 * Warum: Fehlermeldung des Autors (6.11.2026): In einer Engine-Folge sprangen die Zugknöpfe in
 * der Partie weiter, das Brett sprang mehrere Züge, und zurück zur Partie ging es nicht. Geprüft
 * wird an 1. f3 e5 2. g4?? (Stelle 4): „besser“ mit drei Zügen, „strafe“ 2... Dh4# mit einem.
 */
import { describe, expect, it } from "vitest";
import {
  abzweigstelle,
  linienschritt,
  liniensperren,
  OHNE_ZWEIGE,
  richtungZurTaste,
  waehleLinie,
  zweigeSichtbar,
  type Linienstand,
  type Partiezweige,
} from "./linienstand";
import type { Zweigzug } from "../../../spiel/nebenzweig";

const ANZAHL = 4;
const LAENGEN = { besser: 3, strafe: 1 } as const;
const PARTIE: Linienstand = { stelle: 4, zweig: null };
const besser = (schritt: number): Linienstand => ({ stelle: 4, zweig: { art: "besser", schritt } });
const strafe = (schritt: number): Linienstand => ({ stelle: 4, zweig: { art: "strafe", schritt } });

describe("Zugknöpfe im Zweig", () => {
  it("gehen Schritt für Schritt durch den Zweig, nicht durch die Partie", () => {
    expect(linienschritt(besser(1), "vor", LAENGEN, ANZAHL)).toEqual(besser(2));
    expect(linienschritt(besser(3), "zurueck", LAENGEN, ANZAHL)).toEqual(besser(2));
    expect(linienschritt(besser(3), "vor", LAENGEN, ANZAHL)).toEqual(besser(3));
    expect(linienschritt(besser(1), "ende", LAENGEN, ANZAHL)).toEqual(besser(3));
  });

  it("führen vom ersten Zug des Zweigs an den Abzweig in der Partie", () => {
    // „Besser“ ersetzt 2. g4: Abzweig vor dem Zug. „Strafe“ antwortet: Abzweig danach.
    expect(linienschritt(besser(1), "zurueck", LAENGEN, ANZAHL)).toEqual({
      stelle: 3,
      zweig: null,
    });
    expect(linienschritt(strafe(1), "zurueck", LAENGEN, ANZAHL)).toEqual(PARTIE);
    expect(abzweigstelle(4, "besser")).toBe(3);
    expect(abzweigstelle(4, "strafe")).toBe(4);
  });

  it("„Zum Anfang“ verlässt den Zweig", () => {
    expect(linienschritt(strafe(1), "anfang", LAENGEN, ANZAHL)).toEqual({ stelle: 0, zweig: null });
  });

  it("ein Zweig, den es hier nicht gibt, gilt als Partie", () => {
    expect(linienschritt(besser(2), "zurueck", OHNE_ZWEIGE, ANZAHL)).toEqual({
      stelle: 3,
      zweig: null,
    });
  });
});

describe("Zugknöpfe in der Partie", () => {
  it("gehen wie bisher einen Halbzug, begrenzt auf Anfang und Ende", () => {
    expect(linienschritt(PARTIE, "zurueck", LAENGEN, ANZAHL)).toEqual({ stelle: 3, zweig: null });
    expect(linienschritt(PARTIE, "vor", LAENGEN, ANZAHL)).toEqual(PARTIE);
    expect(linienschritt({ stelle: 0, zweig: null }, "zurueck", LAENGEN, ANZAHL).stelle).toBe(0);
    expect(linienschritt({ stelle: 1, zweig: null }, "ende", LAENGEN, ANZAHL).stelle).toBe(ANZAHL);
  });
});

describe("Sperren der Zugknöpfe", () => {
  it("am Ende der Partie Vor und Ende, am letzten Zug des Zweigs ebenso", () => {
    expect(liniensperren(PARTIE, LAENGEN, ANZAHL)).toEqual({
      anfang: false,
      zurueck: false,
      vor: true,
      ende: true,
    });
    expect(liniensperren(strafe(1), LAENGEN, ANZAHL)).toEqual({
      anfang: false,
      zurueck: false,
      vor: true,
      ende: true,
    });
    expect(liniensperren(besser(1), LAENGEN, ANZAHL).vor).toBe(false);
    expect(liniensperren({ stelle: 0, zweig: null }, LAENGEN, ANZAHL).zurueck).toBe(true);
  });
});

describe("Wahl der Linie", () => {
  it("Partie, Besserer Zug, Bestrafung", () => {
    expect(waehleLinie(PARTIE, "strafe", LAENGEN)).toEqual(strafe(1));
    expect(waehleLinie(besser(2), null, LAENGEN)).toEqual(PARTIE);
    expect(waehleLinie(PARTIE, "besser", { besser: 0, strafe: 1 })).toEqual(PARTIE);
  });
});

describe("Tasten", () => {
  it("Pfeil links und rechts, sonst nichts", () => {
    expect(richtungZurTaste("ArrowLeft")).toBe("zurueck");
    expect(richtungZurTaste("ArrowRight")).toBe("vor");
    expect(richtungZurTaste("End")).toBeNull();
  });
});

describe("Zweige in der Zugliste", () => {
  const zug: Zweigzug = { text: "2... Dh4#", san: "Qh4#", vorher: "a", nachher: "b" };
  const grund: Partiezweige = {
    linien: { besser: [], strafe: [zug] },
    zweig: null,
    klasse: "patzer",
    beiZug: () => undefined,
  };

  it("nach einem Fehlerzeichen oder im Zweig, sonst nicht", () => {
    expect(zweigeSichtbar(grund)).toBe(true);
    expect(zweigeSichtbar({ ...grund, klasse: "gut" })).toBe(false);
    expect(zweigeSichtbar({ ...grund, klasse: "gut", zweig: { art: "strafe", schritt: 1 } })).toBe(
      true,
    );
    expect(zweigeSichtbar({ ...grund, linien: { besser: [], strafe: [] } })).toBe(false);
  });
});
