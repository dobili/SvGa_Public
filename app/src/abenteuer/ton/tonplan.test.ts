/** Tests für tonplan.ts: Musik und Geräusche je Karte und Szene (Atmosphäre T1, T2). */
import { describe, expect, it } from "vitest";
import { tagsAus } from "../dialog/geschichte";
import {
  befehleAus,
  betritt,
  dateienFuer,
  dialogEnde,
  pegel,
  soll,
  STANDARD_ABENTEUERTON,
  STILLE_LAGE,
  wende,
  type Tonlage,
} from "./tonplan";

/** Wendet die Marken einer Zeile an. */
function zeile(lage: Tonlage, ...marken: string[]): Tonlage {
  return befehleAus(tagsAus(marken)).reduce(wende, lage);
}

describe("Tonplan", () => {
  it("liest die Marken einer Zeile", () => {
    expect(befehleAus(tagsAus(["sprecher:ambrose", "musik:aus", "klang:glocke"]))).toEqual([
      { art: "musikAus" },
      { art: "klang", kennung: "glocke" },
    ]);
    expect(befehleAus(tagsAus(["musik", "pause"]))).toEqual([]);
  });

  it("Karte, Szene und Dialogende: Archiv mit Ambroses Thema, danach wieder Cedar Creek", () => {
    let lage = betritt(STILLE_LAGE, "musik/archiv.ogg", "tropfen");
    expect(soll(lage)).toEqual({ musik: "musik/archiv.ogg", geraeusch: "tropfen" });
    lage = zeile(lage, "musik:aus");
    expect(soll(lage).musik).toBeNull();
    lage = zeile(lage, "musik:ambroseThema", "geraeusch:aus");
    expect(soll(lage)).toEqual({ musik: "ambroseThema", geraeusch: null });
    lage = dialogEnde(lage);
    expect(soll(lage)).toEqual({ musik: "musik/archiv.ogg", geraeusch: "tropfen" });
  });

  it("#musik:bleibt trägt die Musik über Dialogende und Kartenwechsel, #musik:karte beendet es", () => {
    // Je Zeile gilt eine #musik-Marke (gleichnamige Marken: die letzte), also zwei Zeilen.
    let lage = zeile(zeile(betritt(STILLE_LAGE, "steg"), "musik:abendstueck"), "musik:bleibt");
    lage = betritt(dialogEnde(lage), "bus", "motor");
    expect(soll(lage)).toEqual({ musik: "abendstueck", geraeusch: "motor" });
    lage = zeile(lage, "musik:karte");
    expect(soll(dialogEnde(lage))).toEqual({ musik: "bus", geraeusch: "motor" });
  });

  it("Karten ohne Angabe sind still", () => {
    expect(soll(betritt(STILLE_LAGE))).toEqual({ musik: null, geraeusch: null });
  });

  it("Dateien zu Kennung und Pfad, m4a zuerst", () => {
    expect(dateienFuer("musik", "ambroseThema")).toEqual([
      "musik/ambrose-thema.m4a",
      "musik/ambrose-thema.ogg",
    ]);
    expect(dateienFuer("musik", "musik/dachboden.ogg")[0]).toBe("musik/dachboden.m4a");
    expect(dateienFuer("klang", "knarren")).toEqual(["klang/knarren.m4a", "klang/knarren.ogg"]);
  });

  it("Pegel: stumm oder ohne Ton der App still", () => {
    expect(pegel(STANDARD_ABENTEUERTON, true)).toEqual({ musik: 0.6, geraeusche: 0.8 });
    expect(pegel(STANDARD_ABENTEUERTON, false)).toEqual({ musik: 0, geraeusche: 0 });
    expect(pegel({ ...STANDARD_ABENTEUERTON, stumm: true }, true)).toEqual({
      musik: 0,
      geraeusche: 0,
    });
  });
});
