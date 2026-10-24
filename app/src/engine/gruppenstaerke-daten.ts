/**
 * Gemessene Elo-Zahl des Gruppenmodus je Stufe (engine/gruppe.ts), Schnellschach. Gemessen am
 * 24.10.2026 (0.2.126) mit je 16 Partien gegen die zwei nächsten menschlich spielenden Stufen
 * (Gruppen 8 bis 10 dazu gegen die reinen Stufen 8, 9 und 10), ausgewertet in derselben Leiter wie
 * die Bots (engine/botstaerke.messung.ts, lokal buch/arbeit/botelo4, Bericht
 * bericht-mit-gruppen.md). Streuung ±90 bis ±140. Übernommen aus dem Bericht, nicht von Hand ändern.
 * Abhängigkeiten: engine/stufen.ts (Typ).
 */
import type { Stufennummer } from "./stufen";

export const GRUPPEN_STAERKE: Readonly<Partial<Record<Stufennummer, number>>> = {
  1: 346,
  2: 830,
  3: 1148,
  4: 1635,
  5: 1870,
  6: 2306,
  7: 2527,
  8: 2733,
  9: 2796,
  10: 2773,
};
