/** Tests der Uhr der Bots in der Partie: Abzug der simulierten Zeit, Zeitverlust, Wartezeit. */
import { describe, expect, it } from "vitest";
import { sichtbareWartezeit, zieheBotMitUhr, zuglage } from "./botzeit";
import { leserzug, neuePartie, ziehe, type Partie, type Partiezug } from "./partie";
import { druecke } from "./uhr";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const MINUTEN_5 = 300_000;
const ZUSCHLAG = 3_000;

function enginezug(san: string): Partiezug {
  return { san, von: "engine", quelle: "engine", fehler: null, verlust: 0 };
}

/** 5 + 3, Leser Weiß hat 1. e4 gespielt und die Uhr gedrückt; die Uhr von Schwarz läuft. */
function partie(): Partie {
  const start = neuePartie(
    {
      startFen: GRUNDSTELLUNG,
      eigeneFarbe: "white",
      stufe: 3,
      uhr: { grundzeitMs: MINUTEN_5, zuschlagMs: ZUSCHLAG },
      ruecknahmeErlaubt: false,
      abbildung: null,
      eroeffnung: null,
      stufenJePhase: { eroeffnung: 3, mittelspiel: 3, endspiel: 3 },
      gegner: "engine",
      bot: null,
      hilfen: { symbole: true, werkzeuge: true },
      gewertet: true,
    },
    "p",
    "2026-10-20T08:00:00.000Z",
  );
  if (!start) throw new Error("Partie fehlt");
  const nachE4 = ziehe(start, leserzug("e4"));
  if (!nachE4?.uhr || !nachE4.einstellung.uhr) throw new Error("Uhr fehlt");
  // Schwarz läuft seit Zeitpunkt 0 (der erste Zug von Weiß drückt ohne Abzug).
  const uhr = druecke(
    { ...nachE4.uhr, laeuft: "white", seitMs: 0 },
    nachE4.einstellung.uhr,
    "white",
    0,
  );
  return { ...nachE4, uhr };
}

describe("Uhr der Bots", () => {
  it("zieht die simulierte Bedenkzeit ab statt der echten Zeit, dazu den Zuschlag", () => {
    const vorher = partie();
    const rest = vorher.uhr?.restMs.black ?? 0;
    const nachher = zieheBotMitUhr(vorher, enginezug("e5"), 7_000, 1_000);
    expect(nachher?.uhr?.restMs.black).toBe(rest - 7_000 + ZUSCHLAG);
    expect(nachher?.ende).toBeNull();
  });

  it("reicht die Zeit nicht, verliert der Bot auf Zeit, ohne zu ziehen", () => {
    const vorher = partie();
    const nachher = zieheBotMitUhr(vorher, enginezug("e5"), MINUTEN_5 + 1, 1_000);
    expect(nachher?.ende).not.toBeNull();
    expect(nachher?.zuege).toHaveLength(vorher.zuege.length);
  });

  it("Wiederschlag erkannt; sichtbare Wartezeit gedeckelt", () => {
    let p = partie();
    p = ziehe(p, enginezug("d5")) ?? p;
    p = ziehe(p, leserzug("exd5")) ?? p;
    expect(zuglage(p, "d8d5", 2)).toBe("wiederschlag");
    expect(zuglage(p, "g8f6", 1)).toBe("einzig");
    expect(sichtbareWartezeit(20_000, 120_000)).toBe(2_500);
    expect(sichtbareWartezeit(20_000, 5_000)).toBe(600);
    expect(sichtbareWartezeit(300, 120_000)).toBe(300);
  });
});
