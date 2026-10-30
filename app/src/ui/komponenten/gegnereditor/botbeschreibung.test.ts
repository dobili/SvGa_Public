/** Tests der Beschreibung eigener Bots aus Textbausteinen (Wunsch des Autors, 26.10.2026). */
import { describe, expect, it } from "vitest";
import type { EigenerGegner } from "../../../engine/gegner";
import { botbeschreibung } from "./botbeschreibung";

const GRUND: EigenerGegner = {
  kennung: "eigen-1",
  name: "Tante Erna",
  stufenJePhase: { eroeffnung: 3, mittelspiel: 3, endspiel: 2 },
  fehlerarten: [],
  stil: 0,
  blindeFlecken: [],
  stilname: "angreifer",
};

describe("Beschreibung eigener Bots", () => {
  it("Stärke und Stil, ohne Fehler „macht kaum typische Fehler“", () => {
    expect(botbeschreibung(GRUND)).toBe(
      "Ein Gegner für Einsteiger. Spielt im Stil Angreifer. Macht kaum typische Fehler.",
    );
  });

  it("die stärksten Fehler und Flecken, höchstens drei, mit „und“", () => {
    const g: EigenerGegner = {
      ...GRUND,
      stufenJePhase: { eroeffnung: 7, mittelspiel: 7, endspiel: 7 },
      fehlerarten: ["figurHaengen", "drohungIgnoriert", "tempoverlust", "bauernraub"],
      blindeFlecken: ["rueckzug"],
      reglerstufen: { figurHaengen: 3, drohungIgnoriert: 1, tempoverlust: 0, rueckzug: 2 },
    };
    expect(botbeschreibung(g)).toBe(
      "Ein Gegner für Fortgeschrittene. Spielt im Stil Angreifer. Typisch: lässt Figuren hängen " +
        "und übersieht Drohungen. Übersieht gern Rückzüge.",
    );
  });

  it("nennt feste Eröffnungen, ab drei mit „und n weitere“ (Paket 9)", () => {
    const zwei = { ...GRUND, eroeffnungen: ["praxis:Italian Game", "Londoner System"] };
    expect(botbeschreibung(zwei)).toContain("Eröffnet gern: Italian Game oder Londoner System.");
    const namen = (wert: string) => (wert === "praxis:Italian Game" ? "Italienische Partie" : wert);
    expect(botbeschreibung(zwei, namen)).toContain("Italienische Partie oder Londoner System");
    const vier = { ...GRUND, eroeffnungen: ["A", "B", "C", "D"] };
    expect(botbeschreibung(vier)).toContain("Eröffnet gern: A, B (und 2 weitere).");
    expect(botbeschreibung(GRUND)).not.toContain("Eröffnet");
  });
});
