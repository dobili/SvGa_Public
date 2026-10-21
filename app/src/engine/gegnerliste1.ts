/**
 * Die vorgefertigten Gegner, erste Hälfte (die schwächeren 32 Bots).
 *
 * Rolle im Gesamtbild: Teil von engine/gegnerliste.ts. Seit 0.2.116 neu gebaut (Wunsch des
 * Autors vom 20.10.2026: „mach die Bots komplett neu“, Porträts bleiben, neue Namen). Seit 0.2.117
 * (zehn Stufen) sind die Stufen je Phase die Grundstärke; dazu kommen die Zusatzfehler der
 * Menschen (engine/menschenwahl.ts), die Persönlichkeit (engine/gegnerbau.ts, CHARAKTERE)
 * verschiebt einzelne Fehlerarten und blinde Flecken, der Stil wählt unter gleich guten Zügen.
 * Die Grundstufe ist so gewählt, dass die gemessene Zahl in der Zielgruppe landet (Einstufung vom
 * 22.10.2026: Gruppe 1 → Stufe 1, 2 → 3, 3 → 4, 4 → 5, 5 → 6, 6 → 7, 7 → 8, 8 bis 10 → 10 mit
 * seltener werdenden Fehlern); die Gegnerwahl ordnet nach der gemessenen Zahl (engine/botgruppe.ts).
 * Abhängigkeiten: engine/gegnerbau.ts (Typ, Helfer, Persönlichkeiten).
 */
import { bot, type Gegner } from "./gegnerbau";

/** Bots 1 bis 8 der Liste (vor 0.2.117 Stufe 1). */
const STUFE_1: readonly Gegner[] = [
  bot("ella", "Ella", "lotta", [1, 1, 1], "solide", 0),
  bot("marie", "Marie", "paula", [1, 1, 2], "vorsichtig", -1),
  bot("tom", "Tom", "max", [1, 1, 1], "damenfan", 2),
  bot("luis", "Luis", "finn", [2, 1, 1], "materialist", 1),
  bot("oma-erna", "Oma Erna", "oma-gerda", [1, 1, 2], "endspieler", -2),
  bot("henry", "Henry", "leon", [1, 1, 1], "angreifer", 2),
  bot("lina", "Lina", "mia", [3, 3, 3], "traeumer", 0),
  bot("moritz", "Moritz", "emil", [3, 3, 3], "hektiker", 1),
];

/** Bots 9 bis 16 der Liste (vor 0.2.117 Stufe 2). */
const STUFE_2: readonly Gegner[] = [
  bot("opa-heinz", "Opa Heinz", "opa-hans", [3, 3, 4], "endspieler", -1),
  bot("onkel-bernd", "Onkel Bernd", "onkel-rudi", [3, 3, 3], "materialist", 0),
  bot("clara", "Clara", "frieda", [3, 3, 3], "solide", 0),
  bot("herr-krause", "Herr Krause", "herr-lehmann", [4, 3, 3], "theoretiker", -1),
  bot("leyla", "Leyla", "ayse", [2, 3, 2], "taktiker", 1),
  bot("jakob", "Jakob", "pit", [3, 4, 4], "hektiker", 2),
  bot("johanna", "Johanna", "sophie", [4, 4, 4], "koenigswanderer", 1),
  bot("rolf", "Rolf", "karl", [4, 4, 4], "vorsichtig", -2),
];

/** Bots 17 bis 24 der Liste (vor 0.2.117 Stufe 3). */
const STUFE_3: readonly Gegner[] = [
  bot("derya", "Derya", "selin", [4, 4, 4], "angreifer", 2),
  bot("svenja", "Svenja", "nina", [4, 4, 4], "solide", 0),
  bot("felix", "Felix", "jonas", [3, 4, 5], "endspieler", -1),
  bot("marco", "Marco", "tobias", [5, 4, 4], "theoretiker", 0),
  bot("ronja", "Ronja", "greta", [5, 5, 5], "traeumer", 1),
  bot("herr-wolff", "Herr Wolff", "herr-nowak", [5, 5, 5], "stratege", -2),
  bot("pia", "Pia", "ida", [5, 5, 4], "damenfan", 1),
  bot("yusuf", "Yusuf", "omar", [4, 5, 4], "taktiker", 1),
];

/** Bots 25 bis 32 der Liste (vor 0.2.117 Stufe 4). */
const STUFE_4: readonly Gegner[] = [
  bot("holger", "Holger", "benno", [5, 5, 5], "solide", 0),
  bot("dennis", "Dennis", "timo", [6, 5, 5], "angreifer", 2),
  bot("frau-albrecht", "Frau Albrecht", "frau-berger", [5, 5, 6], "vorsichtig", -2),
  bot("philipp", "Philipp", "lukas", [5, 6, 6], "hektiker", 1),
  bot("mara", "Mara", "zoe", [6, 6, 5], "taktiker", 1),
  bot("herr-kuehn", "Herr Kühn", "herr-schmitt", [6, 6, 6], "stratege", -1),
  bot("samira", "Samira", "amira", [5, 6, 5], "traeumer", 0),
  bot("erik", "Erik", "jan", [6, 6, 6], "materialist", 0),
];

export const GEGNER_STUFE_1_BIS_4: readonly Gegner[] = [
  ...STUFE_1,
  ...STUFE_2,
  ...STUFE_3,
  ...STUFE_4,
];
