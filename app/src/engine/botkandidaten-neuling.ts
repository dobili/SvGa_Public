/**
 * Kandidaten für die Gruppe Neuling (Wunsch des Autors, 25.10.2026: auf acht Bots auffüllen). Der
 * Gruppe fehlen die zwei Universellen (je Gruppe jeder Stil einmal und ein zweiter Universeller).
 * Die Neumessung von Plan C misst die vier mit; die zwei, die sicher in Gruppe 1 landen (Zahl unter
 * 450), kommen nach engine/gegnerliste1.ts. Namen, Porträts (public/gegner/) und Sätze (de.json,
 * „gegner.<kennung>“) sind schon da, damit der Umzug nur eine Zeile kostet.
 * Abhängigkeiten: engine/gegnerbau.ts.
 */
import { bot, type Gegner } from "./gegnerbau";

export const BOTKANDIDATEN_NEULING: readonly Gegner[] = [
  bot("emma", "Emma", "emma", [1, 1, 1], "solide", 0, "universell", 2.5),
  bot("opa-kurt", "Opa Kurt", "opa-kurt", [1, 1, 1], "traeumer", 0, "universell", 2.5),
  bot("frau-schulz", "Frau Schulz", "frau-schulz", [1, 1, 1], "hektiker", 0, "universell", 2.5),
  bot("lotte", "Lotte", "lotte", [1, 1, 1], "materialist", 0, "universell", 2.5),
];
