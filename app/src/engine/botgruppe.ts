/**
 * In welcher Gruppe der Gegnerwahl ein vorgefertigter Bot steht (Stufe 1 bis 10).
 *
 * Rolle im Gesamtbild: Seit 0.2.117 (zehn Stufen) steht ein Bot in der Gruppe seiner gemessenen
 * Zahl: 300 Elo je Gruppe, gerundet (engine/botstaerke-daten.ts). Seine Stufen je Phase sind nur
 * die Grundstärke; die menschlichen Zusatzfehler machen ihn schwächer, darum taugt der
 * Durchschnitt der Stufen nicht mehr als Gruppe. So überschneiden sich die Gruppen nicht (Wunsch
 * des Autors, 19.10.2026). Ohne gemessene Zahl gilt der gerundete Durchschnitt der Stufen.
 * Abhängigkeiten: engine/botstaerke-daten.ts, engine/stufen.ts.
 */
import { BOT_STAERKE } from "./botstaerke-daten";
import { STUFEN_ZAHL } from "./stufen";

const ELO_JE_GRUPPE = 300;

/**
 * Die Gruppe eines Bots: seine gemessene Zahl geteilt durch 300, gerundet, zwischen 1 und 10;
 * ohne Messung der gerundete Durchschnitt seiner Stufen je Phase.
 * Beispiel: gemessen 1130 → Gruppe 4; ungemessen (3, 4, 3) → 3.
 */
export function gruppeDesBots(kennung: string, durchschnitt: number): number {
  const zahl = BOT_STAERKE[kennung];
  const roh = zahl === undefined ? durchschnitt : zahl / ELO_JE_GRUPPE;
  return Math.max(1, Math.min(STUFEN_ZAHL, Math.round(roh)));
}
