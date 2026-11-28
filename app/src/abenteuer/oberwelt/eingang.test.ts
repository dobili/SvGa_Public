/**
 * Tests des Eingangsdialogs (oberwelt/eingang.ts) mit den echten Orten aus inhalte/abenteuer:
 * Einleitung vor dem Haus, Ankunft im Wohnzimmer und die knarrende Treppe am ersten Abend laufen
 * genau einmal, alte Spielstände (Brett schon berührt) bekommen die Einleitung nicht nachgereicht.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Ortdaten } from "../daten/laden";
import { STARTPOSITION } from "../regeln/spielstand";
import { ankunftNachher, dialogBeimBetreten, eingangsdialog } from "./eingang";

const INHALTE = new URL("../../../../inhalte/abenteuer/", import.meta.url);
const orte = (
  JSON.parse(readFileSync(new URL("orte.json", INHALTE), "utf8")) as { orte: Ortdaten[] }
).orte;
const mapleFalls = orte.find((o) => o.kennung === "mapleFalls") as Ortdaten;

describe("eingangsdialog", () => {
  it("ein neues Spiel beginnt vor dem Haus mit der Einleitung", () => {
    expect(STARTPOSITION.karte).toBe("mapleFalls.aussen");
    // Der Knoten „eingang“ verzweigt in die Einleitung (maple-falls-aussen.ink).
    expect(eingangsdialog(mapleFalls, STARTPOSITION.karte, {})).toBe("maple-falls-aussen.eingang");
  });

  it("nach der ersten Nacht ruft Mrs. Calloway vor der Haustür, einmal und nur vor Juno", () => {
    // Befund des Autors (28.11.2026): Sie kam bisher, wenn man Juno ansprach.
    const morgen = { einleitungGesehen: true, brettBeruehrt: true, ersteNachtGesehen: true };
    expect(eingangsdialog(mapleFalls, "mapleFalls.aussen", morgen)).toBe(
      "maple-falls-aussen.eingang",
    );
    const getroffen = { ...morgen, callowayGetroffen: true };
    expect(eingangsdialog(mapleFalls, "mapleFalls.aussen", getroffen)).toBeNull();
    // Wer Juno schon kennt (Schultür, alte Stände), wird nicht mehr gerufen.
    const juno = { ...morgen, junoGetroffen: true };
    expect(eingangsdialog(mapleFalls, "mapleFalls.aussen", juno)).toBeNull();
    // Vor der ersten Nacht ist die Haustür zu; kein Ruf am Abend des Einzugs.
    const abend = { einleitungGesehen: true, brettBeruehrt: true };
    expect(eingangsdialog(mapleFalls, "mapleFalls.aussen", abend)).toBeNull();
  });

  it("nach der Einleitung läuft im Wohnzimmer die Ankunft, danach nichts mehr", () => {
    expect(eingangsdialog(mapleFalls, "mapleFalls.aussen", { einleitungGesehen: true })).toBeNull();
    expect(eingangsdialog(mapleFalls, "mapleFalls.wohnzimmer", { einleitungGesehen: true })).toBe(
      "maple-falls-wohnzimmer.eingang",
    );
    const danach = { einleitungGesehen: true, ankunftGesehen: true };
    expect(eingangsdialog(mapleFalls, "mapleFalls.wohnzimmer", danach)).toBeNull();
  });

  it("am Abend nach der ersten Lektion knarrt die Treppe beim Herunterkommen, einmal", () => {
    // Wunsch des Autors (19.11.2026): das Knarren beim Betreten, nicht im Gespräch mit Mama.
    const abend = { einleitungGesehen: true, ankunftGesehen: true, ersteLektionBesprochen: true };
    expect(eingangsdialog(mapleFalls, "mapleFalls.wohnzimmer", abend)).toBe(
      "maple-falls-wohnzimmer.eingang",
    );
    const gehoert = { ...abend, treppeAbendGesehen: true };
    expect(eingangsdialog(mapleFalls, "mapleFalls.wohnzimmer", gehoert)).toBeNull();
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

describe("Ankunft zu Fuß nach dem Wechsel (nachher)", () => {
  const ankunft = { dialog: "cedar-creek-aussen.ankunft_zu_fuss", nachher: true };
  it("ohne nachher: Dialog vor dem Wechsel wie bisher", () => {
    expect(ankunftNachher({ dialog: "x.y" }, {})).toBe(false);
  });
  it("mit nachher: vorgemerkt, einmal beim Betreten, dann wieder der Eingang", () => {
    expect(ankunftNachher(ankunft, {})).toBe(true);
    expect(dialogBeimBetreten(mapleFalls, "mapleFalls.aussen", { einleitungGesehen: true })).toBe(
      "cedar-creek-aussen.ankunft_zu_fuss",
    );
    expect(
      dialogBeimBetreten(mapleFalls, "mapleFalls.aussen", { einleitungGesehen: true }),
    ).toBeNull();
  });
  it("Bedingung nicht erfüllt: der Held bleibt, nichts vorgemerkt", () => {
    expect(ankunftNachher({ ...ankunft, wenn: "abeGetroffen" }, {})).toBe(false);
    expect(
      dialogBeimBetreten(mapleFalls, "mapleFalls.aussen", { einleitungGesehen: true }),
    ).toBeNull();
  });
});
