/**
 * Tests der Zielsuche (oberwelt/zielsuche.ts, Spieltest „einstieg“, R1) mit den echten Daten aus
 * inhalte/abenteuer: Quests, Orte, Runden, Begegnungen und die Tiled-Karten von Maple Falls.
 * Dazu eine Prüfung über alle Quests: Jedes Feld `ziel` in quests.json nennt ein Objekt, das es auf
 * der genannten Karte (in einer ihrer Fassungen) gibt.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Spieldaten } from "../daten/laden";
import { leererAbenteuerstand } from "../regeln/spielstand";
import type { Abenteuerstand, Queststand } from "../schnittstelle/spielstand";
import { kartenbildAus, wegweiser, zielangabe, zielangaben, type Kartenbild } from "./zielsuche";

const INHALTE = new URL("../../../../inhalte/abenteuer/", import.meta.url);
const lies = <T>(pfad: string): T => JSON.parse(readFileSync(new URL(pfad, INHALTE), "utf8")) as T;

const daten = {
  quests: lies<{ quests: Spieldaten["quests"] }>("quests.json").quests,
  orte: lies<{ orte: Spieldaten["orte"] }>("orte.json").orte,
  runden: lies<{ runden: Spieldaten["runden"] }>("runden.json").runden,
  begegnungen: lies<{ begegnungen: Spieldaten["begegnungen"] }>("begegnungen.json").begegnungen,
} as unknown as Spieldaten;

/** Wie weltdaten.ts `ausloeserFuer` (das Phaser mitlädt): Eintrag der Karte vor dem des Ortes. */
function ausloeserFuer(ort: Spieldaten["orte"][number], karte: string, name: string) {
  const passende = ort.ausloeser.filter((x) => x.name === name);
  return passende.find((x) => x.karte === karte) ?? passende.find((x) => !x.karte);
}

/** Die Kartenbilder eines Ortes aus den Dateien (alle Fassungen). */
function kartenbilder(ortkennung: string): Kartenbild[] {
  const ort = daten.orte.find((o) => o.kennung === ortkennung);
  if (!ort) throw new Error(`Ort ${ortkennung} fehlt`);
  return ort.karten.map((k) => {
    const pfade = [k.datei, ...Object.values(k.zustaende ?? {})];
    return kartenbildAus(
      k.kennung,
      pfade.map((p) => lies<object>(p)),
      (name) => {
        const a = ausloeserFuer(ort, k.kennung, name);
        return a?.art === "uebergang" && a.ziel ? a.ziel.karte : null;
      },
    );
  });
}

const MAPLE = kartenbilder("mapleFalls");

function quest(kennung: string, schritt = 0): Queststand {
  return {
    kennung,
    schritt,
    erledigt: false,
    angenommen: "2026-11-15T05:00:00Z",
    erledigtAm: null,
  };
}

function stand(quests: Queststand[], variablen: Record<string, boolean> = {}): Abenteuerstand {
  const leer = leererAbenteuerstand(new Date("2026-11-15T05:00:00Z"), "Mia", 600, false);
  return { ...leer, quests, dialogvariablen: variablen };
}

describe("zielangabe", () => {
  it("nimmt das Feld ziel der Questdaten", () => {
    const brett = daten.quests.find((q) => q.kennung === "mapleFalls.dasBrett")?.schritte[0];
    expect(brett && zielangabe(brett, daten)).toEqual({
      karte: "mapleFalls.dachboden",
      objekt: "brett",
    });
  });

  it("leitet eine Aufgabenrunde auf ihren Steller ab", () => {
    const sam = daten.quests.find((q) => q.kennung === "mapleFalls.viertesBrett")?.schritte[0];
    expect(sam && zielangabe(sam, daten)).toEqual({ ort: "mapleFalls", objekt: "sam" });
  });
});

describe("wegweiser", () => {
  it("zeigt im Zimmer auf die Treppe nach unten, wenn Mama in der Küche wartet", () => {
    const angaben = zielangaben(stand([quest("mapleFalls.ersterAbend")]), daten);
    const ziel = angaben[0];
    if (!ziel) throw new Error("kein Ziel");
    const treppe = MAPLE.find((k) => k.kennung === "mapleFalls.zimmer")?.objekte.get("treppeUnten");
    expect(wegweiser("mapleFalls.zimmer", ziel, MAPLE)).toEqual(treppe);
  });

  it("zeigt im Wohnzimmer auf Mama selbst", () => {
    const ziel = { karte: "mapleFalls.wohnzimmer", objekt: "mutter" };
    const mama = MAPLE.find((k) => k.kennung === "mapleFalls.wohnzimmer")?.objekte.get("mutter");
    expect(wegweiser("mapleFalls.wohnzimmer", ziel, MAPLE)).toEqual(mama);
  });

  it("findet über zwei Karten den ersten Ausgang (Dachboden → Wohnzimmer über das Zimmer)", () => {
    const ziel = { karte: "mapleFalls.wohnzimmer", objekt: "mutter" };
    const treppe = MAPLE.find((k) => k.kennung === "mapleFalls.dachboden")?.objekte.get("treppe");
    expect(wegweiser("mapleFalls.dachboden", ziel, MAPLE)).toEqual(treppe);
  });

  it("findet Sam im Clubraum ohne Kartenangabe (Objekt im Ort gesucht)", () => {
    const ziel = { ort: "mapleFalls", objekt: "sam" };
    const schule = MAPLE.find((k) => k.kennung === "mapleFalls.aussen")?.objekte.get("schule");
    expect(wegweiser("mapleFalls.aussen", ziel, MAPLE)).toEqual(schule);
  });

  it("gibt null ohne Weg oder ohne Objekt auf der Zielkarte", () => {
    expect(wegweiser("mapleFalls.zimmer", { karte: "mapleFalls.zimmer" }, MAPLE)).toBeNull();
    expect(wegweiser("mapleFalls.zimmer", { karte: "irgendwo.nirgends" }, MAPLE)).toBeNull();
  });
});

describe("zielangaben", () => {
  it("nimmt ohne laufende Quest das Ziel aus „Was jetzt?“", () => {
    const s = stand([], { ersterAbendGesehen: true, ersteNachtGesehen: true });
    expect(zielangaben(s, daten)).toEqual([{ karte: "mapleFalls.aussen", objekt: "juno" }]);
  });

  it("stellt Hauptquests vor Nebenquests", () => {
    const s = stand([quest("mapleFalls.lilysSpringer", 1), quest("mapleFalls.ersterAbend")]);
    expect(zielangaben(s, daten)[0]).toEqual({ karte: "mapleFalls.wohnzimmer", objekt: "mutter" });
  });
});

describe("Felder ziel in quests.json", () => {
  it("nennen nur Objekte, die es auf ihrer Karte gibt", () => {
    const fehlend: string[] = [];
    const bilder = new Map<string, Kartenbild>();
    for (const ort of daten.orte)
      for (const b of kartenbilder(ort.kennung)) bilder.set(b.kennung, b);
    for (const q of daten.quests) {
      for (const s of q.schritte) {
        if (s.ziel && !bilder.get(s.ziel.karte)?.objekte.has(s.ziel.objekt)) {
          fehlend.push(`${q.kennung}: ${s.ziel.karte}/${s.ziel.objekt}`);
        }
      }
    }
    expect(fehlend).toEqual([]);
  });
});
