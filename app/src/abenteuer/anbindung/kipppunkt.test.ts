// Kipppunkt einer verlorenen Partie (Regelwerk R14) mit einem nachgebauten Bewerter.
import { describe, expect, it } from "vitest";
import { neuePartie, ziehe, type Partie, type Partieeinstellung } from "../../spiel/partie";
import { GRUNDSTELLUNG } from "./partiestart";
import { FRUEHESTER_HALBZUG, sucheKipppunkt } from "./kipppunkt";

const EINSTELLUNG: Partieeinstellung = {
  startFen: GRUNDSTELLUNG,
  eigeneFarbe: "white",
  stufe: 3,
  stufenJePhase: { eroeffnung: 3, mittelspiel: 3, endspiel: 3 },
  uhr: null,
  ruecknahmeErlaubt: false,
  abbildung: null,
  gegner: "engine",
  bot: null,
  botName: "Ambrose",
  stilname: "angreifer",
  hilfen: { symbole: false, werkzeuge: false },
  gewertet: false,
  eroeffnung: null,
  abenteuer: { kennung: "x.y#1" },
};

/**
 * Eine lange, legale Partie ohne Stellungswiederholung (Bauernzüge zwischen den pendelnden
 * Springern), die Weiß am Ende aufgibt.
 */
function verlorenePartie(halbzuege: number): Partie {
  let partie = neuePartie(EINSTELLUNG, "p", "2026-11-07T19:00:00Z");
  if (!partie) throw new Error("Grundstellung");
  const bauern = [
    "a3",
    "a6",
    "h3",
    "h6",
    "b3",
    "b6",
    "g3",
    "g6",
    "c3",
    "c6",
    "a4",
    "a5",
    "h4",
    "h5",
  ];
  const zuege: string[] = [];
  for (let i = 0; i < bauern.length; i += 2) {
    zuege.push(bauern[i] ?? "", bauern[i + 1] ?? "", "Nf3", "Nf6", "Ng1", "Ng8");
  }
  for (let i = 0; i < halbzuege; i++) {
    const san = zuege[i] ?? "Nf3";
    const weiter = ziehe(partie, {
      san,
      von: i % 2 === 0 ? "leser" : "engine",
      quelle: i % 2 === 0 ? "leser" : "engine",
      fehler: null,
      verlust: 0,
    });
    if (!weiter) throw new Error(`Zug ${i} ${san}`);
    partie = weiter;
  }
  return { ...partie, ende: { art: "aufgabe", sieger: "black" } };
}

describe("sucheKipppunkt", () => {
  it("findet rückwärts die letzte Leserstellung innerhalb ±1 Bauer nach Halbzug 20", async () => {
    const partie = verlorenePartie(40);
    // Die Suche fragt rückwärts die Leserstellungen 38, 36, 34, 32, 30, 28 ab; ab Halbzug 30
    // steht Weiß auf Verlust (−3), davor ausgeglichen (+0,2).
    let aufrufe = 0;
    const bewerter = async () => {
      aufrufe++;
      const halbzug = 38 - (aufrufe - 1) * 2;
      return halbzug >= 30 ? -3 : 0.2;
    };
    const k = await sucheKipppunkt(partie, bewerter);
    expect(k).not.toBeNull();
    expect(k?.halbzug).toBe(28);
    expect(k?.bewertung).toBeCloseTo(0.2, 2);
    expect(k?.fehler.wessen).toBe("leser");
    expect(k?.fehler.verlust).toBeCloseTo(3.2, 2);
    expect(aufrufe).toBe(6);
  });

  it("gibt null bei Sieg, kurzer Partie oder ohne ausgeglichene Stellung", async () => {
    const immerVerloren = async () => -5;
    expect(await sucheKipppunkt(verlorenePartie(40), immerVerloren)).toBeNull();
    const kurz = verlorenePartie(FRUEHESTER_HALBZUG - 2);
    expect(await sucheKipppunkt(kurz, async () => 0)).toBeNull();
    const gewonnen = {
      ...verlorenePartie(40),
      ende: { art: "matt" as const, sieger: "white" as const },
    };
    expect(await sucheKipppunkt(gewonnen, async () => 0)).toBeNull();
  });
});
