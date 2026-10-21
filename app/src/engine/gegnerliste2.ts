/**
 * Die vorgefertigten Gegner, zweite Hälfte (die stärkeren 32 Bots).
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

/** Bots 33 bis 40 der Liste (vor 0.2.117 Stufe 5). */
const STUFE_5: readonly Gegner[] = [
  bot("guenter", "Günter", "kurt", [6, 6, 7], "endspieler", -1),
  bot("frau-romero", "Frau Romero", "frau-ortega", [6, 6, 6], "solide", 0),
  bot("lars", "Lars", "nils", [7, 7, 7], "angreifer", 2),
  bot("katrin", "Katrin", "hanna", [8, 7, 6], "theoretiker", 0),
  bot("herr-vogel", "Herr Vogel", "herr-weber", [7, 7, 7], "stratege", -2),
  bot("nele", "Nele", "lea", [6, 7, 6], "taktiker", 1),
  bot("simon", "Simon", "paul", [6, 7, 7], "hektiker", 1),
  bot("frau-demir", "Frau Demir", "frau-kaya", [7, 7, 7], "vorsichtig", -1),
];

/** Bots 41 bis 48 der Liste (vor 0.2.117 Stufe 6). */
const STUFE_6: readonly Gegner[] = [
  bot("jana", "Jana", "lena", [7, 7, 7], "solide", 0),
  bot("igor", "Igor", "viktor", [9, 8, 8], "theoretiker", -1),
  bot("miriam", "Miriam", "sara", [8, 8, 8], "traeumer", 1),
  bot("herr-hartmann", "Herr Hartmann", "herr-fischer", [7, 8, 9], "endspieler", -2),
  bot("defne", "Defne", "elif", [7, 8, 7], "taktiker", 2),
  bot("luca", "Luca", "matteo", [8, 8, 7], "angreifer", 2),
  bot("frau-sommer", "Frau Sommer", "frau-lind", [8, 8, 8], "stratege", -1),
  bot("david", "David", "ben", [8, 8, 8], "materialist", 0),
];

/** Bots 49 bis 56 der Liste (vor 0.2.117 Stufe 7). */
const STUFE_7: readonly Gegner[] = [
  bot("doktor-falk", "Doktor Falk", "doktor-berg", [10, 10, 10], "stratege", -1, 0.3),
  bot("trainer-maier", "Trainer Maier", "trainer-koch", [10, 10, 10], "solide", 0, 0.5),
  bot("amaya", "Amaya", "yara", [10, 10, 9], "theoretiker", 1, 0.5),
  bot("herr-lorenz", "Herr Lorenz", "herr-brandt", [9, 10, 10], "endspieler", -2, 0.5),
  bot("elias", "Elias", "noah", [10, 10, 9], "angreifer", 2, 0.3),
  bot("frau-wagner", "Frau Wagner", "frau-stein", [10, 10, 10], "vorsichtig", -1, 0.5),
  bot("arjun", "Arjun", "ravi", [10, 10, 10], "taktiker", 2, 0.1),
  bot("frau-prof-reich", "Frau Prof. Reich", "frau-doktor-ahl", [10, 10, 10], "traeumer", 0, 0.1),
];

/** Bots 57 bis 64 der Liste (vor 0.2.117 Stufe 8). */
const STUFE_8: readonly Gegner[] = [
  bot("gm-novak", "GM Novak", "gm-gruen", [10, 10, 10], "solide", 0, 0.1),
  bot("im-becker", "IM Becker", "im-vogt", [10, 10, 10], "stratege", -1, 0.1),
  bot("wgm-tanaka", "WGM Tanaka", "wgm-sato", [10, 10, 9], "taktiker", 1, 0.1),
  bot("fm-duarte", "FM Duarte", "fm-ortiz", [10, 10, 10], "angreifer", 2, 0),
  bot("gm-ivanova", "GM Ivanova", "gm-petrova", [10, 10, 10], "endspieler", -2, 0),
  bot("im-kraft", "IM Kraft", "im-haas", [9, 10, 10], "theoretiker", 1, 0),
  bot("wim-okafor", "WIM Okafor", "wim-nkemelu", [9, 10, 10], "vorsichtig", -1, 0),
  bot("gm-berglund", "GM Berglund", "gm-lindqvist", [10, 10, 10], "solide", 2, 0),
];

export const GEGNER_STUFE_5_BIS_8: readonly Gegner[] = [
  ...STUFE_5,
  ...STUFE_6,
  ...STUFE_7,
  ...STUFE_8,
];
