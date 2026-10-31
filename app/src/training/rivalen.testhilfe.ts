/**
 * Testhilfen für Duelle und Rivalen (Gamifizierung P8): beendete Partien gegen einen Bot und eine
 * kleine, feste Quelle von Bots mit festen Zahlen.
 * Abhängigkeiten: spiel/partie.ts, engine/gegner.ts, training/rivalen.ts (Typ).
 */
import { gegnerVon, type Gegner } from "../engine/gegner";
import { neuePartie, type Partie } from "../spiel/partie";
import type { Ergebnis } from "../spiel/partienfilter";
import type { Rivalenquelle } from "./rivalen";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** Eine beendete Partie des Lesers (Weiß) gegen einen Bot mit dem Ergebnis aus seiner Sicht. */
export function partieGegen(
  bot: string | null,
  ergebnis: Ergebnis,
  gewertet = true,
  id = `p-${bot ?? "stufe"}-${ergebnis}`,
): Partie {
  const neu = neuePartie(
    {
      startFen: GRUNDSTELLUNG,
      eigeneFarbe: "white",
      stufe: 2,
      uhr: null,
      ruecknahmeErlaubt: false,
      abbildung: null,
      eroeffnung: null,
      stufenJePhase: { eroeffnung: 2, mittelspiel: 2, endspiel: 2 },
      gegner: "engine",
      bot,
      hilfen: { symbole: false, werkzeuge: false },
      gewertet,
    },
    id,
    "2026-10-31T08:00:00.000Z",
  );
  if (!neu) throw new Error("nicht spielbar");
  if (ergebnis === "remis") return { ...neu, ende: { art: "patt" } };
  return { ...neu, ende: { art: "aufgabe", sieger: ergebnis === "gewonnen" ? "white" : "black" } };
}

/** Ein vorgefertigter Bot; wirft, wenn es ihn nicht gibt. */
export function botVon(kennung: string): Gegner {
  const g = gegnerVon(kennung);
  if (!g) throw new Error(`kein Bot ${kennung}`);
  return g;
}

/** Eine feste Quelle: Bots je Stufe und ihre Zahlen (in jeder Zeitklasse gleich). */
export function testquelle(
  stufen: readonly (readonly string[])[],
  zahlen: Readonly<Record<string, number>>,
): Rivalenquelle {
  return {
    stufen: stufen.map((s) => s.map(botVon)),
    staerke: (kennung) => zahlen[kennung] ?? null,
  };
}
