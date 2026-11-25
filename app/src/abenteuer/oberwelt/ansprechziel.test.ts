/**
 * Tests: Wer den Helden ansprechen darf (oberwelt/ansprechziel.ts), mit den echten Quests und Orten
 * aus inhalte/abenteuer. Nur die Zielfigur des laufenden Hauptquestschritts, auf ihrer Karte;
 * zwischen den Quests das Ziel aus „Was jetzt?“; kein Ding, keine Nebenquest.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Spieldaten } from "../daten/laden";
import { leererAbenteuerstand } from "../regeln/spielstand";
import type { Abenteuerstand, Queststand } from "../schnittstelle/spielstand";
import { ansprechziele } from "./ansprechziel";

const INHALTE = new URL("../../../../inhalte/abenteuer/", import.meta.url);
const lies = <T>(pfad: string): T => JSON.parse(readFileSync(new URL(pfad, INHALTE), "utf8")) as T;

const daten = {
  quests: lies<{ quests: Spieldaten["quests"] }>("quests.json").quests,
  orte: lies<{ orte: Spieldaten["orte"] }>("orte.json").orte,
  runden: lies<{ runden: Spieldaten["runden"] }>("runden.json").runden,
  begegnungen: lies<{ begegnungen: Spieldaten["begegnungen"] }>("begegnungen.json").begegnungen,
} as unknown as Spieldaten;

function quest(kennung: string, schritt = 0, erledigt = false): Queststand {
  return { kennung, schritt, erledigt, angenommen: "2026-11-25T05:00:00Z", erledigtAm: null };
}

function stand(quests: Queststand[], variablen: Record<string, boolean> = {}): Abenteuerstand {
  const leer = leererAbenteuerstand(new Date("2026-11-25T05:00:00Z"), "Kim", 600, false);
  return { ...leer, quests, dialogvariablen: variablen };
}

describe("ansprechziele", () => {
  it("Mama im Wohnzimmer im ersten Schritt des ersten Abends, nur dort", () => {
    const s = stand([quest("mapleFalls.ersterAbend")]);
    expect(ansprechziele(s, daten, "mapleFalls.wohnzimmer", "mapleFalls")).toEqual([
      { figur: "mutter", schluessel: "mapleFalls.ersterAbend#0:mutter" },
    ]);
    expect(ansprechziele(s, daten, "mapleFalls.aussen", "mapleFalls")).toEqual([]);
  });

  it("ein Ding als Ziel (das Brett) wird übergeben; die Szene findet keine Figur dazu", () => {
    const s = stand([quest("mapleFalls.dasBrett")]);
    expect(ansprechziele(s, daten, "mapleFalls.dachboden", "mapleFalls")).toEqual([
      { figur: "brett", schluessel: "mapleFalls.dasBrett#0:brett" },
    ]);
  });

  it("zwischen den Quests: Juno an der Bushaltestelle", () => {
    const s = stand([quest("mapleFalls.ersterAbend", 3, true)], {
      ersterAbendGesehen: true,
      ersteNachtGesehen: true,
    });
    expect(ansprechziele(s, daten, "mapleFalls.aussen", "mapleFalls")).toEqual([
      { figur: "juno", schluessel: "tagebuch.wasJetzt.juno:juno" },
    ]);
  });

  it("eine Nebenquest spricht nie an", () => {
    const neben = daten.quests.find((q) => !q.haupt);
    expect(neben).toBeDefined();
    const s = stand([quest(neben?.kennung ?? "")]);
    const karten = daten.orte.flatMap((o) => o.karten.map((k) => [k.kennung, o.kennung] as const));
    for (const [karte, ort] of karten) expect(ansprechziele(s, daten, karte, ort)).toEqual([]);
  });

  it("ein Schritt mit `ansprechen: false` spricht nicht an", () => {
    const aus = {
      ...daten,
      quests: daten.quests.map((q) =>
        q.kennung === "mapleFalls.ersterAbend"
          ? {
              ...q,
              schritte: q.schritte.map((x) => ({
                ...x,
                ansprechen: false,
                ansprechenGrund: "Test",
              })),
            }
          : q,
      ),
    } as Spieldaten;
    const s = stand([quest("mapleFalls.ersterAbend")]);
    expect(ansprechziele(s, aus, "mapleFalls.wohnzimmer", "mapleFalls")).toEqual([]);
  });
});
