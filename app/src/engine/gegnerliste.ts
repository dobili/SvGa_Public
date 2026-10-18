/**
 * Die vorgefertigten Gegner („Bots“): Typ, Prüfhelfer und die Liste aus den beiden Teildateien.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (18.10.2026, nach dem Vorbild von chess.com): je Stufe
 * acht Gegner mit verschiedenen Stärken und Schwächen, mit Porträt (app/public/gegner/) und
 * einem Satz zur Persönlichkeit (i18n `gegner.<kennung>`). Jeder Gegner hat Stufen je Phase
 * (Streuung höchstens zwei um das Mittelspiel, Durchschnitt gerundet ist seine Stufe), erlaubte
 * Fehlerarten (nur in Stufe 1 bis 4 wirksam), blinde Flecken (engine/blindeFlecken.ts, in jeder
 * Stufe) und seit 0.2.65 einen Spielstil (engine/stil.ts, −2 sehr defensiv bis +2 sehr
 * aggressiv). Die Stufen je Phase zeigt die App nicht (Überraschung); die Funktionen dazu stehen
 * in engine/gegner.ts. Gemessen mit `npm run messen:stufen -- 3@nina-3` je Gegner.
 * Abhängigkeiten: engine/gegnerbau.ts (Typ und Helfer), engine/gegnerliste0.ts (Spaß-Bots),
 * gegnerliste1.ts, gegnerliste2.ts.
 */
import type { Gegner } from "./gegnerbau";
export type { Gegner } from "./gegnerbau";
import { SPASSBOTS } from "./gegnerliste0";
import { GEGNER_STUFE_1_BIS_4 } from "./gegnerliste1";
import { GEGNER_STUFE_5_BIS_8 } from "./gegnerliste2";

/**
 * Alle vorgefertigten Gegner: 64 (acht je Stufe) und am Ende die vier Spaß-Bots (0.2.87), in der
 * Reihenfolge der Teildateien.
 */
export const GEGNER: readonly Gegner[] = [
  ...GEGNER_STUFE_1_BIS_4,
  ...GEGNER_STUFE_5_BIS_8,
  ...SPASSBOTS,
];
