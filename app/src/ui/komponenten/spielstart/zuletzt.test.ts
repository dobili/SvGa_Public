/**
 * Tests für „Zuletzt gespielt“ (Spielen neu, J3): nur beendete Partien gegen einen Bot, den es
 * noch gibt, höchstens drei, mit Zeitart für die Revanche; Kalendertage für „heute“, „gestern“.
 */
import { describe, expect, it } from "vitest";
import type { EigenerGegner } from "../../../engine/gegner";
import { gibAuf, neuePartie, type Partie } from "../../../spiel/partie";
import type { Partieeintrag } from "../../../speicher/partien";
import { tageZurueck, zuletztGespielt, ZULETZT_HOECHSTENS } from "./zuletzt";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const MINUTE_MS = 60_000;
const BLITZ = { grundzeitMs: 3 * MINUTE_MS, zuschlagMs: 0 };

/** Eine Partie gegen einen Bot (oder die eigene Stufe), beendet oder laufend. */
function partie(
  id: string,
  bot: string | null,
  beendet = true,
  gegner: "engine" | "mensch" = "engine",
): Partie {
  const neu = neuePartie(
    {
      startFen: GRUNDSTELLUNG,
      eigeneFarbe: "white",
      stufe: 2,
      uhr: BLITZ,
      ruecknahmeErlaubt: false,
      abbildung: null,
      eroeffnung: null,
      stufenJePhase: { eroeffnung: 2, mittelspiel: 2, endspiel: 2 },
      gegner,
      bot,
      hilfen: { symbole: false, werkzeuge: false },
      gewertet: false,
    },
    id,
    "2026-10-30T08:00:00.000Z",
  );
  if (!neu) throw new Error("nicht spielbar");
  return beendet ? gibAuf(neu) : neu;
}

/** Als Eintrag der Partienliste (ohne Auswertung). */
function eintrag(p: Partie): Partieeintrag {
  return { partie: p, werte: [], beste: [], abstaende: [], varianten: [] };
}

describe("zuletztGespielt", () => {
  it("nimmt nur beendete Partien gegen vorhandene Bots, mit Zeitart", () => {
    const eigener = { kennung: "eigen-rambo" } as EigenerGegner;
    const liste = [
      partie("a", "tom"),
      partie("b", null),
      partie("c", "eigen-geloescht"),
      partie("d", "eigen-rambo"),
      partie("e", null, true, "mensch"),
    ].map(eintrag);
    const zeilen = zuletztGespielt(liste, [eigener]);
    expect(zeilen.map((z) => z.bot)).toEqual(["tom", "eigen-rambo"]);
    expect(zeilen[0]?.tempo).toBe("blitz");
  });

  it("zeigt höchstens drei", () => {
    const liste = ["a", "b", "c", "d", "e"].map((id) => eintrag(partie(id, "tom")));
    expect(zuletztGespielt(liste, [])).toHaveLength(ZULETZT_HOECHSTENS);
  });
});

describe("tageZurueck", () => {
  it("zählt Kalendertage, nicht 24-Stunden-Spannen", () => {
    const jetzt = new Date(2026, 9, 31, 8, 0);
    expect(tageZurueck(new Date(2026, 9, 31, 7, 0).toISOString(), jetzt)).toBe(0);
    expect(tageZurueck(new Date(2026, 9, 30, 23, 0).toISOString(), jetzt)).toBe(1);
    expect(tageZurueck(new Date(2026, 9, 28, 12, 0).toISOString(), jetzt)).toBe(3);
  });
});
