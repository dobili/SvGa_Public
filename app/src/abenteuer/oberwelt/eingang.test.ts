/**
 * Tests des Eingangsdialogs (oberwelt/eingang.ts) mit den echten Orten aus inhalte/abenteuer:
 * Einleitung vor dem Haus und Ankunft im Wohnzimmer laufen genau einmal, alte Spielstände (Brett
 * schon berührt) bekommen sie nicht nachgereicht.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Ortdaten } from "../daten/laden";
import { STARTPOSITION } from "../regeln/spielstand";
import { eingangsdialog } from "./eingang";

const INHALTE = new URL("../../../../inhalte/abenteuer/", import.meta.url);
const orte = (
  JSON.parse(readFileSync(new URL("orte.json", INHALTE), "utf8")) as { orte: Ortdaten[] }
).orte;
const mapleFalls = orte.find((o) => o.kennung === "mapleFalls") as Ortdaten;

describe("eingangsdialog", () => {
  it("ein neues Spiel beginnt vor dem Haus mit der Einleitung", () => {
    expect(STARTPOSITION.karte).toBe("mapleFalls.aussen");
    expect(eingangsdialog(mapleFalls, STARTPOSITION.karte, {})).toBe(
      "maple-falls-aussen.einleitung",
    );
  });

  it("nach der Einleitung läuft im Wohnzimmer die Ankunft, danach nichts mehr", () => {
    expect(eingangsdialog(mapleFalls, "mapleFalls.aussen", { einleitungGesehen: true })).toBeNull();
    expect(eingangsdialog(mapleFalls, "mapleFalls.wohnzimmer", { einleitungGesehen: true })).toBe(
      "maple-falls-wohnzimmer.ankunft",
    );
    const danach = { einleitungGesehen: true, ankunftGesehen: true };
    expect(eingangsdialog(mapleFalls, "mapleFalls.wohnzimmer", danach)).toBeNull();
  });

  it("alte Spielstände (Brett schon berührt) bekommen keine Einleitung", () => {
    expect(eingangsdialog(mapleFalls, "mapleFalls.aussen", { brettBeruehrt: true })).toBeNull();
    expect(eingangsdialog(mapleFalls, "mapleFalls.wohnzimmer", { brettBeruehrt: true })).toBeNull();
  });

  it("Karten ohne Eingang und unbekannte Karten liefern nichts", () => {
    expect(eingangsdialog(mapleFalls, "mapleFalls.dachboden", {})).toBeNull();
    expect(eingangsdialog(mapleFalls, "gibtEsNicht", {})).toBeNull();
  });
});
