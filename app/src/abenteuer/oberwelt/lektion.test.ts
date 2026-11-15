/**
 * Tests für lektion.ts: Die erste Partie gegen Ambrose spielt mit fester Stärke, eigenen Gewichten
 * und Höchstverlusten (Spieltest „einstieg“, R2); ohne Lektion bleibt das Profil unverändert.
 */
import { describe, expect, it } from "vitest";
import { FEHLERARTEN } from "../../engine/fehlerart-typen";
import begegnungen from "../../../../inhalte/abenteuer/begegnungen.json";
import type { Gegnerprofil } from "../schnittstelle/gegnerprofil";
import { profilDerLektion, type Lektion } from "./lektion";

const AMBROSE: Gegnerprofil = {
  kennung: "mapleFalls.ambrose",
  name: "figur.ambrose.name",
  rolle: "story",
  portraet: "portraets/ambrose.svg",
  staerke: { art: "aktuell", versatz: 0 },
  gewichte: { ungenau: 1.2 },
  stil: "angreifer",
  eroeffnung: { art: "frei" },
  steckbrief: [],
};

describe("Lektion einer Begegnung", () => {
  it("lässt das Profil ohne Lektion unverändert", () => {
    expect(profilDerLektion(AMBROSE, undefined)).toBe(AMBROSE);
  });

  it("setzt Stärke, Gewichte, Höchstverluste und Maia der ersten Lektion", () => {
    const b = begegnungen.begegnungen.find((x) => x.kennung === "mapleFalls.ersteLektion");
    const profil = profilDerLektion(AMBROSE, b?.lektion as Lektion | undefined);
    expect(profil.staerke).toEqual({ art: "fest", elo: 750 });
    expect(profil.gewichte).toMatchObject({ ungenau: 1.2, figurHaengen: 3, drohungIgnoriert: 0 });
    expect(profil.hoechstverlust?.figurHaengen).toBe(6);
    expect(profil.hoechstverlust?.ungenau).toBe(2);
    expect(Object.keys(profil.hoechstverlust ?? {})).toHaveLength(FEHLERARTEN.length);
    expect(profil.menschlich).toBe(false);
  });

  it("nennt ohne Höchstverluste keine", () => {
    const profil = profilDerLektion(AMBROSE, { staerke: { art: "fest", elo: 500 } });
    expect(profil.hoechstverlust).toBeUndefined();
    expect(profil.gewichte).toEqual({ ungenau: 1.2 });
  });
});
