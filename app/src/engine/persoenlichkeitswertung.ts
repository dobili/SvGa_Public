/**
 * Die Wertung für die Persönlichkeit eines vorgefertigten Bots oder Kandidaten (seit 0.2.143).
 *
 * Rolle im Gesamtbild: Eingabe von faktorenAus (engine/gegnerbau.ts) in der App
 * (ui/komponenten/botzug.ts), im Gruppenmodus (engine/gruppenwahl.ts) und in der Messung
 * (engine/messung/messspieler.testhilfe.ts), immer dieselbe, damit ein Bot spielt, wie er gemessen wurde.
 * Warum eingefroren: engine/persoenlichkeitswertung-daten.ts.
 * Abhängigkeiten: engine/botstaerke.ts (staerkeAusStufen), engine/persoenlichkeitswertung-daten.ts,
 * engine/reinestufen-daten.ts.
 */
import type { Phase } from "../schach/phase";
import { staerkeAusStufen, type Zusatzfehlerangabe } from "./botstaerke";
import { PERSOENLICHKEIT_BOTS, PERSOENLICHKEIT_STUFEN } from "./persoenlichkeitswertung-daten";
import { REINE_STUFEN_STAERKE } from "./reinestufen-daten";
import type { Stufennummer } from "./stufen";

/**
 * Die feste Wertung eines Bots: seine Zahl zum Stand der Messung, sonst (neue Bots, Kandidaten)
 * die Schätzung aus seinen Stufen mit den Stufenzahlen desselben Stands.
 * Beispiel: „tom“ → 347; „lotte“ (Stufen 1 · 1 · 1, damals Kandidatin) → 747.
 */
export function wertungDerPersoenlichkeit(g: {
  readonly kennung: string;
  readonly stufenJePhase: Readonly<Record<Phase, Stufennummer>>;
}): number {
  return (
    PERSOENLICHKEIT_BOTS[g.kennung] ?? staerkeAusStufen(g.stufenJePhase, PERSOENLICHKEIT_STUFEN)
  );
}

/**
 * Die feste Wertung eines eigenen Gegners für die Faktoren seiner Regler: wie staerkeGeschaetzt
 * (engine/botstaerke.ts), aber mit den Stufenzahlen zum Stand der Messung, damit gespeicherte
 * Gegner nach einer neuen Messung gleich spielen.
 * Beispiel: 4 · 4 · 4 mit Haken → die Zahl der Stufe 4 vom 24.10.2026 (1456).
 */
export function wertungEigenerPersoenlichkeit(e: Zusatzfehlerangabe): number {
  const rein = Array.isArray(e.fehlerarten) && e.fehlerarten.length === 0;
  return staerkeAusStufen(e.stufenJePhase, rein ? REINE_STUFEN_STAERKE : PERSOENLICHKEIT_STUFEN);
}
