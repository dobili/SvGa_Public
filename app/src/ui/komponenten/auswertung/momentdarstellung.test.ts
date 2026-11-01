/**
 * Tests der Karten der Zeitleiste (momentdarstellung.ts): der bessere Zug unter einem Fehler.
 * Befund der Vorprüfung (1.11.2026): Unter „9... b5??“ stand „Besser war 9... b5“, weil der beste
 * Zug der Engine der gespielte war und der Wert trotzdem fiel.
 */
import { describe, expect, it } from "vitest";
import { leserzug, neuePartie, ziehe, type Partie } from "../../../spiel/partie";
import { momentbild } from "./momentdarstellung";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** 1. e4 e5 2. Dh5 (Leser Weiß, Mensch gegen Mensch genügt für die Karte). */
function partie(): Partie {
  const start = neuePartie(
    {
      startFen: GRUNDSTELLUNG,
      eigeneFarbe: "white",
      stufe: 1,
      uhr: null,
      ruecknahmeErlaubt: true,
      abbildung: null,
      eroeffnung: null,
      stufenJePhase: { eroeffnung: 1, mittelspiel: 1, endspiel: 1 },
      gegner: "mensch",
      bot: null,
      hilfen: { symbole: true, werkzeuge: true },
      gewertet: false,
    },
    "p",
    "2026-11-01T08:00:00.000Z",
  );
  const fertig = ["e4", "e5", "Qh5"]
    .map(leserzug)
    .reduce<Partie | null>((p, z) => (p ? ziehe(p, z) : null), start);
  if (!fertig) throw new Error("Zug geht nicht");
  return fertig;
}

/** Karte des Fehlers 2. Dh5 mit dem angegebenen besten Zug der Engine. */
function besserBei(bester: string): string {
  const p = partie();
  const grund = {
    eintrag: {
      partie: p,
      werte: [0.3, 0.3, 0.3, -1.5],
      beste: ["e2e4", "e7e5", bester, ""],
      abstaende: [],
      varianten: [],
    },
    urteile: [{ index: 2, verlust: 1.8, zeichen: "?" as const, klasse: "fehler" as const }],
    theorie: null,
  };
  return momentbild(grund, { art: "fehler", index: 2, klasse: "fehler", zahl: 0 }).besser;
}

describe("Karte eines Fehlers", () => {
  it("nennt einen anderen besten Zug", () => {
    expect(besserBei("g1f3")).toBe("2. Sf3");
  });

  it("nennt den gespielten Zug nicht als besseren", () => {
    expect(besserBei("d1h5")).toBe("");
  });
});
