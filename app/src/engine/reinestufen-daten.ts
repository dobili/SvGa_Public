/**
 * Gemessene Elo-Zahl der rein spielenden Stufen (nur die Grundschicht, ohne menschliche
 * Zusatzfehler), Schnellschach, aus dem Messlauf vom 24.10.2026 (engine/botstaerke.messung.ts,
 * lokal buch/arbeit/botelo4/bericht.md, Abschnitt „Stufen und Bots“, Zeilen „rein“).
 *
 * Rolle im Gesamtbild: So spielt eine eigene Stufe oder ein eigener Bot, bei dem keine Fehlerart
 * angehakt ist (engine/botstaerke.ts, staerkeGeschaetzt). Die reinen Stufen 1 bis 5 sind viel
 * schwächer als ihre Namen vermuten lassen, weil der Zufall der Grundschicht anders fehlt als ein
 * Mensch (ENTSCHEIDUNGEN „Messung der Bots gegen menschlich spielende Stufen“). Streuung ±85 bis
 * ±200. Übernommen aus dem Bericht, nicht von Hand ändern.
 * Abhängigkeiten: engine/stufen.ts (Typ).
 */
import type { Stufennummer } from "./stufen";

/** Gemessene Elo-Zahl je rein spielender Stufe (kann bei Stufe 1 und 2 unter 0 liegen). */
export const REINE_STUFEN_STAERKE: Readonly<Record<Stufennummer, number>> = {
  1: -41,
  2: -31,
  3: 265,
  4: 480,
  5: 720,
  6: 1380,
  7: 1980,
  8: 2485,
  9: 2879,
  10: 3296,
};
