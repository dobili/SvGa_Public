/**
 * Die vorgefertigten Gegner, erste Hälfte (die schwächeren 32 Bots).
 *
 * Rolle im Gesamtbild: Teil von engine/gegnerliste.ts. Seit 0.2.117 neu gebaut (Wunsch des
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
  bot("ella", "Ella", "lotta", [1, 1, 1], "solide", 0, "universell"),
  bot("marie", "Marie", "paula", [1, 1, 2], "vorsichtig", -1, "verteidiger"),
  bot("tom", "Tom", "max", [1, 1, 1], "damenfan", 2, "draufgaenger"),
  bot("luis", "Luis", "finn", [2, 1, 1], "materialist", 1, "taktiker"),
  bot("oma-erna", "Oma Erna", "oma-gerda", [1, 1, 2], "endspieler", -2, "vereinfacher"),
  bot("henry", "Henry", "leon", [1, 1, 1], "angreifer", 2, "angreifer"),
  bot("lina", "Lina", "mia", [3, 3, 3], "traeumer", 0, "draufgaenger"),
  bot("moritz", "Moritz", "emil", [3, 3, 3], "hektiker", 1, "taktiker"),
];

/** Bots 9 bis 16 der Liste (vor 0.2.117 Stufe 2). */
const STUFE_2: readonly Gegner[] = [
  bot("opa-heinz", "Opa Heinz", "opa-hans", [2, 2, 3], "endspieler", -1, "vereinfacher"),
  bot("onkel-bernd", "Onkel Bernd", "onkel-rudi", [2, 2, 2], "materialist", 0, "taktiker"),
  bot("clara", "Clara", "frieda", [2, 2, 2], "solide", 0, "universell"),
  bot(
    "herr-krause",
    "Herr Krause",
    "herr-lehmann",
    [4, 3, 3],
    "theoretiker",
    -1,
    "positionsspieler",
  ),
  bot("leyla", "Leyla", "ayse", [2, 3, 2], "taktiker", 1, "taktiker"),
  bot("jakob", "Jakob", "pit", [3, 4, 4], "hektiker", 2, "taktiker"),
  bot("johanna", "Johanna", "sophie", [4, 4, 4], "koenigswanderer", 1, "draufgaenger"),
  bot("rolf", "Rolf", "karl", [4, 4, 4], "vorsichtig", -2, "verteidiger"),
];

/** Bots 17 bis 24 der Liste (vor 0.2.117 Stufe 3). */
const STUFE_3: readonly Gegner[] = [
  bot("derya", "Derya", "selin", [4, 4, 4], "angreifer", 2, "angreifer"),
  bot("svenja", "Svenja", "nina", [4, 4, 4], "solide", 0, "universell"),
  bot("felix", "Felix", "jonas", [3, 4, 5], "endspieler", -1, "vereinfacher"),
  bot("marco", "Marco", "tobias", [5, 4, 4], "theoretiker", 0, "positionsspieler"),
  bot("ronja", "Ronja", "greta", [5, 5, 5], "traeumer", 1, "draufgaenger"),
  bot("herr-wolff", "Herr Wolff", "herr-nowak", [5, 5, 5], "stratege", -2, "positionsspieler"),
  bot("pia", "Pia", "ida", [5, 5, 4], "damenfan", 1, "draufgaenger"),
  bot("yusuf", "Yusuf", "omar", [4, 5, 4], "taktiker", 1, "taktiker"),
];

/** Bots 25 bis 32 der Liste (vor 0.2.117 Stufe 4). */
const STUFE_4: readonly Gegner[] = [
  bot("holger", "Holger", "benno", [5, 5, 5], "solide", 0, "universell"),
  bot("dennis", "Dennis", "timo", [6, 5, 5], "angreifer", 2, "angreifer"),
  bot("frau-albrecht", "Frau Albrecht", "frau-berger", [5, 5, 6], "vorsichtig", -2, "verteidiger"),
  bot("philipp", "Philipp", "lukas", [5, 6, 6], "hektiker", 1, "taktiker"),
  bot("mara", "Mara", "zoe", [6, 6, 5], "taktiker", 1, "taktiker"),
  bot("herr-kuehn", "Herr Kühn", "herr-schmitt", [6, 6, 6], "stratege", -1, "positionsspieler"),
  bot("samira", "Samira", "amira", [5, 6, 5], "traeumer", 0, "draufgaenger"),
  bot("erik", "Erik", "jan", [6, 6, 6], "materialist", 0, "taktiker"),
];

export const GEGNER_STUFE_1_BIS_4: readonly Gegner[] = [
  ...STUFE_1,
  ...STUFE_2,
  ...STUFE_3,
  ...STUFE_4,
];
