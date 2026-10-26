/**
 * Gemessene Elo-Zahl des Gruppenmodus je Stufe (engine/gruppe.ts), Schnellschach, ohne Maia (mit
 * Maia: engine/botstaerke-maia-daten.ts). Neumessung nach Plan C mit Nachmessung (25./26.10.2026,
 * 36 Partien je Gruppe gegen die zwei Nm-Stufen um ihre Zahl, Streuung etwa ±50 bis ±70), übernommen
 * mit skripte/uebernehme-planc.mjs; nicht von Hand ändern. Gemessen mit den Gruppen
 * der festen Ordnung (engine/botgruppen-daten.ts, Zweige messung-gruppen-ohne-1/2, 72 Partien je
 * Gruppe; Gruppenpartien in älterer Zusammensetzung zählen nicht).
 * Abhängigkeiten: engine/stufen.ts (Typ).
 */
import type { Stufennummer } from "./stufen";

/** Gemessene Elo-Zahl des Gruppenmodus je Stufe, ohne Maia; fehlende Stufen sind nicht gemessen. */
export const GRUPPEN_STAERKE: Readonly<Partial<Record<Stufennummer, number>>> = {
  1: 411,
  2: 789,
  3: 932,
  4: 1359,
  5: 1529,
  6: 1924,
  7: 2239,
  8: 2479,
  9: 2574,
  10: 2534,
};
