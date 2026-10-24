/**
 * Die vorgefertigten Gegner der Gruppen 1 bis 5 (Bot-Satz vom 24.10.2026: je Gruppe acht Bots, jeder
 * Stil einmal plus ein zweiter Universeller, gewählt aus 64 Bestandsbots und 272 Kandidaten nach der
 * gemessenen Zahl; Auswahl in buch/arbeit/botelo4/auswahl.py, Zahlen in engine/botstaerke-daten.ts).
 * Die Stufen je Phase sind die Grundstärke, die Persönlichkeit (engine/gegnerbau.ts) verschiebt
 * einzelne Fehlerarten und Flecken, der Stil wählt unter gleich guten Zügen; der letzte Wert ist der
 * Faktor auf die Fehlerhäufigkeit (seltener oder häufiger als Menschen der Stufe).
 * Rolle im Gesamtbild: Teil von engine/gegnerliste.ts.
 * Abhängigkeiten: engine/gegnerbau.ts (Typ, Helfer, Persönlichkeiten).
 */
import { bot, type Gegner } from "./gegnerbau";

export const GEGNER_GRUPPE_1_BIS_5: readonly Gegner[] = [
  bot("tom", "Tom", "max", [1, 1, 1], "angreifer", 0, "angreifer", 2.5),
  bot("marie", "Marie", "paula", [1, 1, 1], "stratege", 0, "positionsspieler", 2.5),
  bot("oma-erna", "Oma Erna", "oma-gerda", [1, 1, 1], "taktiker", 0, "taktiker", 2.5),
  bot("luis", "Luis", "finn", [1, 1, 1], "vorsichtig", 0, "verteidiger", 2.5),
  bot("clara", "Clara", "frieda", [1, 1, 1], "damenfan", 0, "draufgaenger", 2.5),
  bot("onkel-bernd", "Onkel Bernd", "onkel-rudi", [1, 1, 1], "endspieler", 0, "vereinfacher", 2.5),
  bot("henry", "Henry", "leon", [1, 1, 1], "angreifer", 2, "angreifer"),
  bot("moritz", "Moritz", "emil", [1, 1, 1], "stratege", 0, "positionsspieler"),
  bot("derya", "Derya", "selin", [1, 1, 1], "taktiker", 0, "taktiker", 1.6),
  bot("herr-krause", "Herr Krause", "herr-lehmann", [1, 1, 1], "vorsichtig", 0, "verteidiger"),
  bot("lina", "Lina", "mia", [1, 1, 2], "koenigswanderer", 0, "draufgaenger"),
  bot("jakob", "Jakob", "pit", [1, 1, 1], "endspieler", 0, "vereinfacher", 1.6),
  bot("rolf", "Rolf", "karl", [1, 1, 1], "traeumer", 0, "universell", 1.6),
  bot("herr-wolff", "Herr Wolff", "herr-nowak", [1, 1, 1], "solide", 0, "universell", 1.6),
  bot("pia", "Pia", "ida", [2, 1, 1], "damenfan", 0, "angreifer"),
  bot("felix", "Felix", "jonas", [1, 1, 2], "theoretiker", 0, "positionsspieler"),
  bot("yusuf", "Yusuf", "omar", [1, 1, 1], "taktiker", 0, "taktiker"),
  bot("ronja", "Ronja", "greta", [1, 1, 2], "solide", 0, "verteidiger"),
  bot("svenja", "Svenja", "nina", [2, 1, 1], "traeumer", 0, "draufgaenger"),
  bot("philipp", "Philipp", "lukas", [1, 1, 1], "materialist", 0, "vereinfacher"),
  bot("frau-albrecht", "Frau Albrecht", "frau-berger", [2, 1, 1], "traeumer", 0, "universell"),
  bot("ella", "Ella", "lotta", [1, 1, 1], "solide", 0, "universell"),
  bot("erik", "Erik", "jan", [2, 3, 3], "hektiker", 0, "angreifer"),
  bot("dennis", "Dennis", "timo", [3, 3, 2], "stratege", 0, "positionsspieler"),
  bot("leyla", "Leyla", "ayse", [2, 3, 2], "taktiker", 1, "taktiker"),
  bot("mara", "Mara", "zoe", [3, 3, 2], "vorsichtig", 0, "verteidiger"),
  bot("simon", "Simon", "paul", [4, 3, 2], "traeumer", 0, "draufgaenger"),
  bot("opa-heinz", "Opa Heinz", "opa-hans", [2, 2, 3], "endspieler", -1, "vereinfacher"),
  bot("holger", "Holger", "benno", [2, 3, 4], "solide", 0, "universell"),
  bot("lars", "Lars", "nils", [3, 3, 4], "solide", 0, "universell"),
  bot("katrin", "Katrin", "hanna", [5, 4, 3], "damenfan", 0, "angreifer"),
  bot("marco", "Marco", "tobias", [5, 4, 4], "theoretiker", 0, "positionsspieler"),
  bot("frau-romero", "Frau Romero", "frau-ortega", [4, 4, 5], "materialist", 0, "taktiker"),
  bot("nele", "Nele", "lea", [2, 3, 4], "solide", 0, "verteidiger"),
  bot("johanna", "Johanna", "sophie", [4, 4, 4], "koenigswanderer", 1, "draufgaenger"),
  bot("frau-demir", "Frau Demir", "frau-kaya", [3, 4, 4], "stratege", 0, "vereinfacher"),
  bot("jana", "Jana", "lena", [4, 3, 2], "traeumer", 0, "universell"),
  bot("luca", "Luca", "matteo", [3, 3, 2], "theoretiker", 0, "universell"),
];
