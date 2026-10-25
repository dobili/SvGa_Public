/**
 * Gemessene Elo-Zahl des Gruppenmodus je Stufe (engine/gruppe.ts), Schnellschach, ohne Maia (mit
 * Maia: engine/botstaerke-maia-daten.ts). Neumessung nach Plan C mit Nachmessung (25./26.10.2026,
 * 36 Partien je Gruppe gegen die zwei Nm-Stufen um ihre Zahl, Streuung etwa ±50 bis ±70), übernommen
 * mit skripte/uebernehme-planc.mjs; nicht von Hand ändern. Gemessen mit den Gruppen vor der neuen
 * Ordnung der Bots (engine/botgruppen-daten.ts, 0.2.144); die Gruppen werden danach neu gemessen.
 * Abhängigkeiten: engine/stufen.ts (Typ).
 */
import type { Stufennummer } from "./stufen";

export const GRUPPEN_STAERKE: Readonly<Partial<Record<Stufennummer, number>>> = {
  1: 332,
  2: 728,
  3: 835,
  4: 1405,
  5: 1543,
  6: 1758,
  7: 2207,
  8: 2468,
  9: 2548,
  10: 2483,
};
