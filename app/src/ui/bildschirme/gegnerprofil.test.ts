/** Tests des Gegnerprofils einer neuen Partie für eigene Gegner mit Teil-E-Einstellungen (0.2.126). */
import { describe, expect, it } from "vitest";
import { FEHLERARTEN } from "../../engine/fehlerart";
import type { EigenerGegner } from "../../engine/gegner";
import { gegnerprofil } from "./gegnerprofil";

const BASIS: EigenerGegner = {
  kennung: "eigen-1",
  name: "Netti",
  stufenJePhase: { eroeffnung: 4, mittelspiel: 4, endspiel: 4 },
  fehlerarten: FEHLERARTEN.filter((a) => a !== "bauernraub"),
  stil: 0,
  blindeFlecken: [],
};
const VORLIEBEN = { erlaubteFehlerarten: FEHLERARTEN, blindeFlecken: [] };

/** Das Profil mit den Feldern, die hier geprüft werden (alle Varianten des Rückgabetyps). */
function profil(g: EigenerGegner): {
  readonly gewichte?: Readonly<Partial<Record<string, number>>>;
  readonly stilname?: string;
} {
  const p = gegnerprofil("eigen-1", [g], VORLIEBEN);
  return {
    ...("gewichte" in p && p.gewichte ? { gewichte: p.gewichte } : {}),
    ...("stilname" in p && p.stilname ? { stilname: p.stilname } : {}),
  };
}

describe("Gegnerprofil eigener Gegner (Teil E)", () => {
  it("gibt den Stil weiter und rechnet die Stufen nur für angehakte Arten in Gewichte um", () => {
    const g: EigenerGegner = {
      ...BASIS,
      stilname: "angreifer",
      reglerstufen: { verfruehteDame: 2, bauernraub: 3 },
    };
    const p = profil(g);
    expect(p.stilname).toBe("angreifer");
    expect(p.gewichte?.verfruehteDame).toBeGreaterThan(1);
    expect(p.gewichte?.figurHaengen).toBeCloseTo(1);
    expect(p.gewichte).not.toHaveProperty("bauernraub");
  });
  it("ältere Gegner behalten ihre freien Gewichte", () => {
    const g: EigenerGegner = { ...BASIS, gewichte: { verfruehteDame: 2.5 } };
    const p = profil(g);
    expect(p.gewichte).toEqual({ verfruehteDame: 2.5 });
    expect(p).not.toHaveProperty("stilname");
  });
});
