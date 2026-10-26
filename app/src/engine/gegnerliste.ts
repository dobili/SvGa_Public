/**
 * Die vorgefertigten Gegner („Bots“): Typ, Prüfhelfer und die Liste aus den beiden Teildateien.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (18.10.2026, nach dem Vorbild von chess.com): je Gruppe
 * acht Gegner mit verschiedenen Stärken und Schwächen, mit Porträt (app/public/gegner/) und
 * einem Satz zur Persönlichkeit (i18n `gegner.<kennung>`). Jeder Gegner hat Stufen je Phase
 * (Streuung höchstens zwei um das Mittelspiel, Durchschnitt gerundet ist seine Stufe), erlaubte
 * Fehlerarten (nur in Stufe 1 bis 4 wirksam), blinde Flecken (engine/blindeFlecken.ts, in jeder
 * Stufe) und einen Spielstil (engine/stil.ts, −2 sehr defensiv bis +2 sehr
 * aggressiv). Die Stufen je Phase zeigt die App nicht (Überraschung); die Funktionen dazu stehen
 * in engine/gegner.ts. Gemessen mit `npm run messen:stufen -- 3@nina-3` je Gegner.
 * Abhängigkeiten: engine/gegnerbau.ts (Typ und Helfer), engine/gegnerliste0.ts (Spaß-Bots),
 * gegnerliste1.ts, gegnerliste2.ts.
 */
import type { Gegner } from "./gegnerbau";
export type { Gegner } from "./gegnerbau";
import { SPASSBOTS } from "./gegnerliste0";
import { GEGNER_GRUPPE_1_BIS_5 } from "./gegnerliste1";
import { GEGNER_GRUPPE_6_BIS_10 } from "./gegnerliste2";

/**
 * Alle vorgefertigten Gegner: der Bot-Satz vom 24.10.2026 mit den zwei Neulingen von 0.2.143 (80 Bots,
 * seit 0.2.144 fest zu je acht nach gemessener Zahl in zehn Gruppen, engine/botgruppe.ts) und am
 * Ende die vier Spaß-Bots, in der Reihenfolge der Teildateien.
 */
export const GEGNER: readonly Gegner[] = [
  ...GEGNER_GRUPPE_1_BIS_5,
  ...GEGNER_GRUPPE_6_BIS_10,
  ...SPASSBOTS,
];
