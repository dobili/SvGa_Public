/**
 * Die Wahl vor einer Partie und ihre Regeln (rein): Farbe, Vorlieben, Eröffnung; ob die Partie
 * gewertet wird; welcher Bot mit welchen Stufen spielt.
 *
 * Rolle im Gesamtbild: Seit „Spielen neu“ (Entwurf J3, 31.10.2026) beginnen Partien von mehreren
 * Stellen aus: der Karte „Schnell eine Partie“ und den Unterseiten Gegner aussuchen, Eigene Stufe,
 * Eigene Bots und Freie Partie. Alle teilen diese Regeln; vorher standen sie in Spielen.tsx.
 * Abhängigkeiten: engine/gegner.ts, engine/gruppe.ts, schach/stellung.ts, speicher/partien.ts.
 */
import { gegnerVon, type EigenerGegner } from "../../../engine/gegner";
import { gruppenstufe, gruppenstufen } from "../../../engine/gruppe";
import { stellungAusFen, type Farbe } from "../../../schach/stellung";
import type { Spielvorlieben } from "../../../speicher/partien";

export const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** Die Wahl vor einer Partie. */
export interface Wahl {
  readonly farbe: Farbe;
  readonly vorlieben: Spielvorlieben;
  /** Eröffnung für die Engine (nur aus der Grundstellung), sonst null. */
  readonly eroeffnung: string | null;
  /** Paket 9: Die Wahl gilt statt der festen Eröffnungen eines eigenen Bots (Haken). */
  readonly ueberschreiben: boolean;
}

/** Keine Spielhilfen: in gewerteten Partien (S9). */
export const OHNE_HILFEN = { symbole: false, werkzeuge: false } as const;

/** Zählt eine Partie mit dieser Wahl für die Wertung? Nur gegen die Engine aus der Grundstellung. */
export function wertbar(fen: string, vorlieben: Pick<Spielvorlieben, "gegner">): boolean {
  return fen === GRUNDSTELLUNG && vorlieben.gegner === "engine";
}

/**
 * Wird die Partie gewertet? Dann gibt es keine Zugrücknahme und keine Spielhilfen
 * (Wunsch des Autors zu S9, 17.10.2026: wer zurücknehmen oder Werkzeuge nutzen kann, spielt
 * stärker, als er ist).
 */
export function wirdGewertet(fen: string, v: Pick<Spielvorlieben, "gegner" | "gewertet">): boolean {
  return v.gewertet && wertbar(fen, v);
}

/** Die Seite am Zug einer Stellung; Weiß, wenn sie nicht lesbar ist. */
export function seiteAmZug(fen: string): Farbe {
  const stellung = stellungAusFen(fen);
  return stellung.ok ? stellung.wert.amZug : "white";
}

/**
 * Die Vorlieben mit einem Bot: Gegner Engine, der Bot mit seinen Stufen je Phase (Gruppe: die
 * Stufen der Gruppe); ein unbekannter Bot (eigene Stufe: null) lässt die Stufen, wie sie sind.
 * Beispiel: „tom“ → bot „tom“, Stufen von Tom, Gegner Engine.
 */
export function mitBot(
  v: Spielvorlieben,
  bot: string | null,
  eigene: readonly EigenerGegner[],
): Spielvorlieben {
  const gruppe = gruppenstufe(bot);
  const g =
    gruppe !== null
      ? { stufenJePhase: gruppenstufen(gruppe) }
      : (gegnerVon(bot) ?? eigene.find((e) => e.kennung === bot) ?? null);
  const engine = { ...v, gegner: "engine" as const, bot };
  return g
    ? { ...engine, stufenJePhase: g.stufenJePhase, stufe: g.stufenJePhase.mittelspiel }
    : engine;
}

/** Eindeutige Kennung einer Partie aus Zeit und Zufall. */
export function neueKennung(): string {
  const BASIS = 36;
  const STELLEN = 6;
  return `p-${Date.now().toString(BASIS)}-${Math.random()
    .toString(BASIS)
    .slice(2, 2 + STELLEN)}`;
}
