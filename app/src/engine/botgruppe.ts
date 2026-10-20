/**
 * In welcher Gruppe der Gegnerwahl ein vorgefertigter Bot steht (Stufe 1 bis 8).
 *
 * Rolle im Gesamtbild: Die Gruppe eines Bots ist der gerundete Durchschnitt seiner Stufen je
 * Phase (engine/gegner.ts). Nach der Elo-Leiter (engine/botstaerke-daten.ts) lagen damit acht
 * Bots in der Zahl jenseits ihrer Nachbargruppe: Stufe 3 und 4, 6 und 7, 7 und 8 überschnitten
 * sich. Wunsch des Autors (19.10.2026): Die Gruppen sollen sich möglichst nicht überschneiden,
 * ohne die Bots neu zu messen. Darum tauschen diese acht Bots die Gruppe, je zwei zwischen zwei
 * Nachbargruppen; jede Gruppe behält acht Bots. Wie sie spielen, bleibt gleich (ihre Stufen je
 * Phase ändern sich nicht).
 * Abhängigkeiten: engine/stufen.ts (Typ).
 */
import type { Stufennummer } from "./stufen";

/**
 * Bots, deren Gruppe von ihrem Durchschnitt abweicht (Kennung → Gruppe). Seit 0.2.116 neu zu
 * setzen, sobald die neuen Bots gemessen sind (bis dahin keine Abweichung).
 */
const ABWEICHENDE_GRUPPE: Readonly<Record<string, Stufennummer>> = {};

/**
 * Die Gruppe eines Bots: die festgelegte Abweichung, sonst der gerundete Durchschnitt seiner
 * Stufen je Phase. Beispiel: Nina (3, 3, 3) → 3; Jan (4, 3, 5, Durchschnitt 4) → 3.
 */
export function gruppeDesBots(kennung: string, durchschnitt: number): number {
  return ABWEICHENDE_GRUPPE[kennung] ?? Math.round(durchschnitt);
}
