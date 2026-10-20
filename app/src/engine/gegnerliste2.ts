/**
 * Die vorgefertigten Gegner der Stufen 5 bis 8 (Menschen um 1800 bis 2400, dazu die volle
 * Engine), je acht.
 *
 * Rolle im Gesamtbild: Teil von engine/gegnerliste.ts, neu gebaut seit 0.2.116 wie
 * engine/gegnerliste1.ts. In Stufe 8 spielt die volle Engine; die Bots unterscheiden sich dort
 * durch Stufe 7 in einzelnen Phasen und den Stil.
 * Abhängigkeiten: engine/gegnerbau.ts (Typ, Helfer, Persönlichkeiten).
 */
import { bot, type Gegner } from "./gegnerbau";

/** Stufe 5 (Menschen um 1800). */
const STUFE_5: readonly Gegner[] = [
  bot("guenter", "Günter", "kurt", [5, 5, 6], "endspieler", -1),
  bot("frau-romero", "Frau Romero", "frau-ortega", [5, 5, 5], "solide", 0),
  bot("lars", "Lars", "nils", [5, 5, 5], "angreifer", 2),
  bot("katrin", "Katrin", "hanna", [6, 5, 4], "theoretiker", 0),
  bot("herr-vogel", "Herr Vogel", "herr-weber", [5, 5, 5], "stratege", -2),
  bot("nele", "Nele", "lea", [5, 6, 5], "taktiker", 1),
  bot("simon", "Simon", "paul", [4, 5, 5], "hektiker", 1),
  bot("frau-demir", "Frau Demir", "frau-kaya", [5, 5, 5], "vorsichtig", -1),
];

/** Stufe 6 (Menschen um 2100). */
const STUFE_6: readonly Gegner[] = [
  bot("jana", "Jana", "lena", [6, 6, 6], "solide", 0),
  bot("igor", "Igor", "viktor", [7, 6, 6], "theoretiker", -1),
  bot("miriam", "Miriam", "sara", [6, 6, 6], "traeumer", 1),
  bot("herr-hartmann", "Herr Hartmann", "herr-fischer", [5, 6, 7], "endspieler", -2),
  bot("defne", "Defne", "elif", [6, 7, 6], "taktiker", 2),
  bot("luca", "Luca", "matteo", [6, 6, 5], "angreifer", 2),
  bot("frau-sommer", "Frau Sommer", "frau-lind", [6, 6, 6], "stratege", -1),
  bot("david", "David", "ben", [6, 6, 6], "materialist", 0),
];

/** Stufe 7 (Menschen um 2400). */
const STUFE_7: readonly Gegner[] = [
  bot("doktor-falk", "Doktor Falk", "doktor-berg", [7, 7, 7], "stratege", -1),
  bot("trainer-maier", "Trainer Maier", "trainer-koch", [7, 7, 7], "solide", 0),
  bot("amaya", "Amaya", "yara", [8, 7, 6], "theoretiker", 1),
  bot("herr-lorenz", "Herr Lorenz", "herr-brandt", [6, 7, 8], "endspieler", -2),
  bot("elias", "Elias", "noah", [7, 7, 6], "angreifer", 2),
  bot("frau-wagner", "Frau Wagner", "frau-stein", [7, 7, 7], "vorsichtig", -1),
  bot("arjun", "Arjun", "ravi", [7, 6, 7], "taktiker", 2),
  bot("frau-prof-reich", "Frau Prof. Reich", "frau-doktor-ahl", [7, 7, 7], "traeumer", 0),
];

/** Stufe 8 (volle Engine). */
const STUFE_8: readonly Gegner[] = [
  bot("gm-novak", "GM Novak", "gm-gruen", [8, 8, 8], "solide", 0),
  bot("im-becker", "IM Becker", "im-vogt", [8, 7, 8], "stratege", -1),
  bot("wgm-tanaka", "WGM Tanaka", "wgm-sato", [8, 8, 7], "taktiker", 1),
  bot("fm-duarte", "FM Duarte", "fm-ortiz", [8, 7, 8], "angreifer", 2),
  bot("gm-ivanova", "GM Ivanova", "gm-petrova", [8, 8, 8], "endspieler", -2),
  bot("im-kraft", "IM Kraft", "im-haas", [7, 8, 8], "theoretiker", 1),
  bot("wim-okafor", "WIM Okafor", "wim-nkemelu", [7, 8, 8], "vorsichtig", -1),
  bot("gm-berglund", "GM Berglund", "gm-lindqvist", [8, 8, 8], "solide", 2),
];

export const GEGNER_STUFE_5_BIS_8: readonly Gegner[] = [
  ...STUFE_5,
  ...STUFE_6,
  ...STUFE_7,
  ...STUFE_8,
];
