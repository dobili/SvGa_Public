/**
 * Die vorgefertigten Gegner der Stufen 1 bis 4 (Menschen um 600 bis 1500), je acht.
 *
 * Rolle im Gesamtbild: Teil von engine/gegnerliste.ts. Seit 0.2.116 neu gebaut (Wunsch des
 * Autors vom 20.10.2026: „mach die Bots komplett neu“, Porträts bleiben, neue Namen). Jeder Bot
 * spielt wie Menschen seiner Stufen je Phase (engine/menschenwahl.ts); die Persönlichkeit
 * (engine/gegnerbau.ts, CHARAKTERE) verschiebt einzelne Fehlerarten und blinde Flecken, der Stil
 * wählt unter gleich guten Zügen. Reihenfolge innerhalb der Stufe beliebig; die Gegnerwahl
 * ordnet nach Stärke.
 * Abhängigkeiten: engine/gegnerbau.ts (Typ, Helfer, Persönlichkeiten).
 */
import { bot, type Gegner } from "./gegnerbau";

/** Stufe 1, Einsteiger (Menschen um 600). */
const STUFE_1: readonly Gegner[] = [
  bot("ella", "Ella", "lotta", [1, 1, 1], "solide", 0),
  bot("marie", "Marie", "paula", [1, 1, 2], "vorsichtig", -1),
  bot("tom", "Tom", "max", [1, 1, 1], "damenfan", 2),
  bot("luis", "Luis", "finn", [2, 1, 1], "materialist", 1),
  bot("oma-erna", "Oma Erna", "oma-gerda", [1, 1, 2], "endspieler", -2),
  bot("henry", "Henry", "leon", [1, 2, 1], "angreifer", 2),
  bot("lina", "Lina", "mia", [1, 1, 1], "traeumer", 0),
  bot("moritz", "Moritz", "emil", [1, 1, 1], "hektiker", 1),
];

/** Stufe 2 (Menschen um 900). */
const STUFE_2: readonly Gegner[] = [
  bot("opa-heinz", "Opa Heinz", "opa-hans", [2, 2, 3], "endspieler", -1),
  bot("onkel-bernd", "Onkel Bernd", "onkel-rudi", [2, 2, 2], "materialist", 0),
  bot("clara", "Clara", "frieda", [2, 2, 2], "solide", 0),
  bot("herr-krause", "Herr Krause", "herr-lehmann", [3, 2, 2], "theoretiker", -1),
  bot("leyla", "Leyla", "ayse", [2, 3, 2], "taktiker", 1),
  bot("jakob", "Jakob", "pit", [1, 2, 2], "hektiker", 2),
  bot("johanna", "Johanna", "sophie", [2, 2, 2], "koenigswanderer", 1),
  bot("rolf", "Rolf", "karl", [2, 2, 2], "vorsichtig", -2),
];

/** Stufe 3 (Menschen um 1200). */
const STUFE_3: readonly Gegner[] = [
  bot("derya", "Derya", "selin", [3, 3, 3], "angreifer", 2),
  bot("svenja", "Svenja", "nina", [3, 3, 3], "solide", 0),
  bot("felix", "Felix", "jonas", [2, 3, 4], "endspieler", -1),
  bot("marco", "Marco", "tobias", [4, 3, 3], "theoretiker", 0),
  bot("ronja", "Ronja", "greta", [3, 3, 3], "traeumer", 1),
  bot("herr-wolff", "Herr Wolff", "herr-nowak", [3, 3, 3], "stratege", -2),
  bot("pia", "Pia", "ida", [3, 3, 2], "damenfan", 1),
  bot("yusuf", "Yusuf", "omar", [3, 4, 3], "taktiker", 1),
];

/** Stufe 4 (Menschen um 1500). */
const STUFE_4: readonly Gegner[] = [
  bot("holger", "Holger", "benno", [4, 4, 4], "solide", 0),
  bot("dennis", "Dennis", "timo", [5, 4, 4], "angreifer", 2),
  bot("frau-albrecht", "Frau Albrecht", "frau-berger", [4, 4, 5], "vorsichtig", -2),
  bot("philipp", "Philipp", "lukas", [3, 4, 4], "hektiker", 1),
  bot("mara", "Mara", "zoe", [4, 4, 3], "taktiker", 1),
  bot("herr-kuehn", "Herr Kühn", "herr-schmitt", [4, 4, 4], "stratege", -1),
  bot("samira", "Samira", "amira", [4, 5, 4], "traeumer", 0),
  bot("erik", "Erik", "jan", [4, 4, 4], "materialist", 0),
];

export const GEGNER_STUFE_1_BIS_4: readonly Gegner[] = [
  ...STUFE_1,
  ...STUFE_2,
  ...STUFE_3,
  ...STUFE_4,
];
