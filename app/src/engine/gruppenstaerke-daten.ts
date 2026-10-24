/**
 * Gemessene Elo-Zahl des Gruppenmodus je Stufe (engine/gruppe.ts). Leer, bis der Messlauf
 * (engine/botstaerke.messung.ts, Paarungen „@gruppe-N“ gegen die menschlich spielenden Stufen)
 * die Gruppen gemessen hat; dann trägt er die Zahlen hier ein (nicht von Hand ändern).
 * Abhängigkeiten: engine/stufen.ts (Typ).
 */
import type { Stufennummer } from "./stufen";

export const GRUPPEN_STAERKE: Readonly<Partial<Record<Stufennummer, number>>> = {};
