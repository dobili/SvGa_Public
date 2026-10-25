/**
 * Kandidaten für die Gruppe Neuling (Wunsch des Autors, 25.10.2026: auf acht Bots auffüllen). Der
 * Gruppe fehlen die zwei Universellen (je Gruppe jeder Stil einmal und ein zweiter Universeller).
 * Die Neumessung von Plan C hat vier gemessen (ohne Maia: Emma 295 ±147, Opa Kurt 329 ±126, Frau
 * Schulz 212 ±138, Lotte 295 ±136). Frau Schulz und Lotte liegen auch mit der Streuung sicher unter
 * 450 und stehen seit 0.2.143 in engine/gegnerliste1.ts; Emma und Opa Kurt bleiben Kandidaten (Namen,
 * Porträts und Sätze sind da, ein Tausch kostet eine Zeile).
 * Abhängigkeiten: engine/gegnerbau.ts.
 */
import { bot, type Gegner } from "./gegnerbau";

export const BOTKANDIDATEN_NEULING: readonly Gegner[] = [
  bot("emma", "Emma", "emma", [1, 1, 1], "solide", 0, "universell", 2.5),
  bot("opa-kurt", "Opa Kurt", "opa-kurt", [1, 1, 1], "traeumer", 0, "universell", 2.5),
];
