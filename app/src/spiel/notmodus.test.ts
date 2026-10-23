/** Tests des Notmodus der Bots: Eintritt, Vorzüge planen und wählen, Uhr (spiel/notmodus.ts). */
import { describe, expect, it } from "vitest";
import type { Bewertung } from "../engine/engineDienst";
import type { Spielbewerter } from "../engine/zugwahl";
import type { Variante } from "../engine/uci";
import { zieheMitUhr } from "./ablauf";
import {
  bleibtImNotmodus,
  brauchtNotmodus,
  NOTMODUS_REST_MS,
  notmodusZeitUm,
  planeVorzuege,
  VORZUG_MS,
  waehleVorzug,
  zieheImNotmodus,
} from "./notmodus";
import { leserzug, neuePartie, type Partie, type Partiezug } from "./partie";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const NACH_E4 = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1";
const SEKUNDE = 1000;
const ZUSCHLAG = 2 * SEKUNDE;

/** Partie 3 + 2, Leser Weiß hat 1. e4 gespielt; die Uhr des Bots (Schwarz) läuft seit 0. */
function nachE4(restBotMs: number): Partie {
  const neu = neuePartie(
    {
      startFen: GRUNDSTELLUNG,
      eigeneFarbe: "white",
      stufe: 1,
      uhr: { grundzeitMs: 180 * SEKUNDE, zuschlagMs: ZUSCHLAG },
      ruecknahmeErlaubt: false,
      abbildung: null,
      eroeffnung: null,
      stufenJePhase: { eroeffnung: 1, mittelspiel: 1, endspiel: 1 },
      gegner: "engine",
      bot: null,
      hilfen: { symbole: true, werkzeuge: true },
      gewertet: true,
    },
    "n",
    "2026-10-21T08:00:00.000Z",
  );
  const gezogen = neu && zieheMitUhr(neu, leserzug("e4"), 0);
  if (!gezogen?.uhr) throw new Error("nicht spielbar");
  const uhr = {
    ...gezogen.uhr,
    restMs: { ...gezogen.uhr.restMs, black: restBotMs },
    laeuft: "black" as const,
    seitMs: 0,
  };
  return { ...gezogen, uhr };
}

const E5: Partiezug = { san: "e5", von: "engine", quelle: "engine", fehler: null, verlust: 0 };

function variante(nummer: number, bauern: number, zuege: string[]): Variante {
  return { nummer, wert: { art: "bauern", bauern }, zuege };
}

/** Falsche Engine: liefert die Varianten, mit „nurZuege“ nur die genannten. */
function bewerter(varianten: readonly Variante[]): Spielbewerter {
  return {
    bewerte: (_fen, _ms, anzahl, _staerke, nurZuege = []) => {
      const gewaehlt = (
        nurZuege.length > 0
          ? varianten.filter((v) => nurZuege.includes(v.zuege[0] ?? ""))
          : varianten
      ).slice(0, anzahl);
      const b: Bewertung = {
        varianten: gewaehlt,
        tiefe: 8,
        knotenJeSekunde: 0,
        rechenzeitMs: 0,
        startzeitMs: 0,
        besterZug: gewaehlt[0]?.zuege[0] ?? null,
      };
      return Promise.resolve(b);
    },
  };
}

describe("Notmodus", () => {
  it("Eintritt nur, wenn die Bedenkzeit die Restzeit erreicht; Austritt über fünf Sekunden", () => {
    expect(brauchtNotmodus(3000, 2000)).toBe(true);
    expect(brauchtNotmodus(1500, 2000)).toBe(false);
    expect(brauchtNotmodus(null, 2000)).toBe(false);
    expect(bleibtImNotmodus(4900)).toBe(true);
    expect(bleibtImNotmodus(5100)).toBe(false);
  });

  it("Eintritt: statt Zeitverlust steht die Uhr danach auf einer Sekunde plus Zuschlag", () => {
    const p = zieheImNotmodus(nachE4(800), E5, 5000, true);
    expect(p?.ende).toBeNull();
    expect(p?.uhr?.restMs.black).toBe(NOTMODUS_REST_MS + ZUSCHLAG);
  });

  it("Vorzug kostet eine Zehntelsekunde, egal wie lange die App rechnet", () => {
    const p = zieheImNotmodus(nachE4(3000), E5, 7000, false);
    expect(p?.uhr?.restMs.black).toBe(3000 - VORZUG_MS + ZUSCHLAG);
  });

  it("ohne Zeit für einen Vorzug oder ohne passenden Vorzug ist die Zeit um", () => {
    const leer = zieheImNotmodus(nachE4(VORZUG_MS), E5, 500, false);
    expect(leer?.ende).toEqual({ art: "zeit", sieger: "white" });
    const um = notmodusZeitUm(nachE4(900), 500);
    expect(um.ende).toEqual({ art: "zeit", sieger: "white" });
    expect(um.uhr?.restMs.black).toBe(0);
  });

  it("plant für drei Antworten je einen eigenen Zug", async () => {
    const b = bewerter([
      variante(1, 0.3, ["e7e5"]),
      variante(2, 0.4, ["c7c5"]),
      variante(3, 0.5, ["e7e6"]),
      variante(4, 0.6, ["d7d5"]),
    ]);
    const geplant: string[] = [];
    const vorzuege = await planeVorzuege(b, NACH_E4, (fen) => {
      geplant.push(fen);
      return Promise.resolve("g1f3");
    });
    expect(vorzuege.map((v) => v.antwort)).toEqual(["e7e5", "c7c5", "e7e6"]);
    expect(geplant).toHaveLength(3);
  });

  it("spielt unter den legalen Vorzügen den besten; geht keiner, null", async () => {
    // Weiß am Zug nach 1. e4 e5: Sf3 und d4 gehen, Lc4 auch, e5 (Bauer blockiert) nicht
    const fen = "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2";
    const b = bewerter([variante(1, 0.4, ["d2d4"]), variante(2, 0.3, ["g1f3"])]);
    const vorzuege = [
      { antwort: "e7e5", zug: "g1f3" },
      { antwort: "c7c5", zug: "d2d4" },
      { antwort: "e7e6", zug: "e4e5" },
    ];
    expect(await waehleVorzug(b, fen, vorzuege)).toBe("d2d4");
    expect(await waehleVorzug(b, fen, [{ antwort: "e7e6", zug: "e4e5" }])).toBeNull();
  });
});
