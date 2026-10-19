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
 * Bots, deren Gruppe von ihrem Durchschnitt abweicht (Kennung → Gruppe), mit ihrer Zahl seit
 * 0.2.103: Jan (1657) und Lukas (1788) von 4 nach 3, Omar (1809) und Selin (1863) von 3 nach 4;
 * Trainer Koch (2417) von 7 nach 6, Lena (2458) von 6 nach 7; GM Petrova (2764) von 8 nach 7,
 * Doktor Berg (2802) von 7 nach 8.
 */
const ABWEICHENDE_GRUPPE: Readonly<Record<string, Stufennummer>> = {
  jan: 3,
  lukas: 3,
  omar: 4,
  selin: 4,
  "trainer-koch": 6,
  lena: 7,
  "gm-petrova": 7,
  "doktor-berg": 8,
};

/**
 * Die Gruppe eines Bots: die festgelegte Abweichung, sonst der gerundete Durchschnitt seiner
 * Stufen je Phase. Beispiel: Nina (3, 3, 3) → 3; Jan (4, 3, 5, Durchschnitt 4) → 3.
 */
export function gruppeDesBots(kennung: string, durchschnitt: number): number {
  return ABWEICHENDE_GRUPPE[kennung] ?? Math.round(durchschnitt);
}
