/**
 * In welcher Gruppe der Gegnerwahl ein vorgefertigter Bot steht (Stufe 1 bis 10).
 *
 * Rolle im Gesamtbild: Ein Bot steht in der Gruppe seiner gemessenen Zahl; seine Stufen je Phase
 * sind nur die Grundstärke, die menschlichen Zusatzfehler machen ihn schwächer. Es gilt eine
 * feste Liste (engine/botgruppen-daten.ts, skripte/ordne-gruppen.mjs): die acht schwächsten Bots
 * in Stufe 1, die nächsten acht in Stufe 2 und so weiter, so überschneiden sich die Gruppen nicht
 * (Wunsch des Autors, 19.10.2026; eine Rundung der Zahl hätte nach der Nachmessung vom
 * 25./26.10.2026 überlappende Bereiche ergeben). Sie bleibt fest, auch wenn neue Messungen die
 * Zahlen leicht verschieben; der Gruppenmodus spielt mit genau diesen acht Bots.
 * Sonderfall: Ein Bot ohne Eintrag (neu, noch nicht eingeordnet) steht in der Stufe des gerundeten
 * Durchschnitts seiner Stufen je Phase.
 * Abhängigkeiten: engine/botgruppen-daten.ts, engine/stufen.ts.
 */
import { BOTGRUPPEN } from "./botgruppen-daten";
import { STUFEN_ZAHL } from "./stufen";

/**
 * Die Gruppe eines Bots: aus der festen Liste, sonst der gerundete Durchschnitt seiner Stufen.
 * Beispiel: „tom“ → 1; ungemessen (3, 4, 3) → 3.
 */
export function gruppeDesBots(kennung: string, durchschnitt: number): number {
  const fest = BOTGRUPPEN[kennung];
  const roh = fest ?? durchschnitt;
  return Math.max(1, Math.min(STUFEN_ZAHL, Math.round(roh)));
}
