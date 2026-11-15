// Steckbriefzeilen und Lupe des Uhrmachers (docs/spiel/11, I1).
import { describe, expect, it } from "vitest";
import gegnerdatei from "../../../../inhalte/abenteuer/gegner.json";
import type { Gegnerdaten } from "../daten/laden";
import { wendeWirkungenAn } from "../regeln/quests";
import { leererAbenteuerstand } from "../regeln/spielstand";
import {
  deckwahlsteckbrief,
  freigeschalteteZeilen,
  gegnerakten,
  lupenzeilen,
  steckbriefzeile,
} from "./steckbrieftext";

const GEGNER = gegnerdatei.gegner as unknown as Gegnerdaten[];

describe("Steckbrief", () => {
  it("jede Zeile aller Gegner wird ein Satz ohne Platzhalter", () => {
    for (const g of GEGNER) {
      for (const z of g.steckbrief) {
        const text = steckbriefzeile(z);
        expect(text, `${g.kennung} ${z.wert}`).not.toMatch(/^steckbrief\.|\{/);
      }
    }
  });

  it("zeigt den freien Satz über Mrs. Okafor", () => {
    expect(steckbriefzeile({ art: "text", wert: "steckbrief.okafor.lagos" })).toContain("Lagos");
  });

  it("die Lupe nennt bei Rosa die Sprüche, die verpuffen", () => {
    const rosa = GEGNER.find((g) => g.kennung === "cedarCreek.rosa");
    if (!rosa) throw new Error("Rosa fehlt");
    expect(lupenzeilen(rosa).at(-1)).toContain("Großes Maul");
  });

  it("speichert freigeschaltete Zeilen je Gegner und zeigt sie im Tagebuch (N2621)", () => {
    const jetzt = new Date("2026-11-15T10:00:00Z");
    const stand = wendeWirkungenAn(
      leererAbenteuerstand(jetzt, "Kim", 800, true),
      [
        { art: "steckbrief", gegner: "mapleFalls.skaterJo", zeile: 0 },
        { art: "zustand", gegner: "mapleFalls.coachDelgado", analysiert: true },
      ],
      jetzt,
    );
    const jo = GEGNER.find((g) => g.kennung === "mapleFalls.skaterJo");
    const sam = GEGNER.find((g) => g.kennung === "mapleFalls.sam");
    if (!jo || !sam) throw new Error("Jo oder Sam fehlt");
    expect(freigeschalteteZeilen(stand, jo)).toEqual(["Blinder Fleck: übersieht Rückzüge"]);
    // Sam aus demselben Club bekommt Jos Zeile nicht mit.
    expect(freigeschalteteZeilen(stand, sam)).toEqual([]);
    const akten = gegnerakten(stand, GEGNER);
    expect(akten.map((a) => [a.kennung, a.zeilen.length, a.analysiert])).toEqual([
      ["mapleFalls.skaterJo", 1, false],
      ["mapleFalls.coachDelgado", 0, true],
    ]);
  });

  it("die Deckwahl zeigt freigeschaltete Zeilen auch ohne Lupe, mit Lupe ohne Doppelung", () => {
    const jetzt = new Date("2026-11-15T10:00:00Z");
    const stand = wendeWirkungenAn(
      leererAbenteuerstand(jetzt, "Kim", 800, true),
      [{ art: "steckbrief", gegner: "mapleFalls.skaterJo", zeile: 0 }],
      jetzt,
    );
    const ohne = deckwahlsteckbrief(stand, GEGNER, "mapleFalls.skaterJo", false);
    expect(ohne).toEqual({
      titel: "Was du über den Gegner weißt",
      zeilen: ["Blinder Fleck: übersieht Rückzüge"],
    });
    const mit = deckwahlsteckbrief(stand, GEGNER, "mapleFalls.skaterJo", true);
    expect(mit.titel).toBe("Was die Lupe verrät");
    expect(mit.zeilen.filter((z) => z.includes("Rückzüge"))).toHaveLength(1);
    expect(deckwahlsteckbrief(stand, GEGNER, "mapleFalls.sam", false).zeilen).toEqual([]);
  });
});
