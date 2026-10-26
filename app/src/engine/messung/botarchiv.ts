/**
 * Archiv: Bots des Satzes von 0.2.117, die beim Bot-Satz vom 24.10.2026 nicht gewählt wurden (Wunsch
 * des Autors: nicht löschen, Werte dauerhaft behalten). Nicht Teil der Gegnerwahl; ihre gemessenen
 * Zahlen stehen weiter in engine/botstaerke-daten.ts (ohne Sätze in den Sprachdateien).
 * Rolle im Gesamtbild: Nachschlagewerk für spätere Sätze.
 * Abhängigkeiten: engine/gegnerbau.ts (Typ, Helfer, Persönlichkeiten).
 */
import { bot, type Gegner } from "../gegnerbau";

export const BOTARCHIV: readonly Gegner[] = [
  // gemessen 783 (Schnellschach, 24.10.2026)
  bot("alt-marie", "Marie (alt)", "paula", [1, 1, 2], "vorsichtig", -1, "verteidiger"),
  // gemessen 519 (Schnellschach, 24.10.2026)
  bot("alt-tom", "Tom (alt)", "max", [1, 1, 1], "damenfan", 2, "draufgaenger"),
  // gemessen 952 (Schnellschach, 24.10.2026)
  bot("alt-luis", "Luis (alt)", "finn", [2, 1, 1], "materialist", 1, "taktiker"),
  // gemessen 867 (Schnellschach, 24.10.2026)
  bot("alt-oma-erna", "Oma Erna (alt)", "oma-gerda", [1, 1, 2], "endspieler", -2, "vereinfacher"),
  // gemessen 1391 (Schnellschach, 24.10.2026)
  bot("alt-lina", "Lina (alt)", "mia", [3, 3, 3], "traeumer", 0, "draufgaenger"),
  // gemessen 1285 (Schnellschach, 24.10.2026)
  bot("alt-moritz", "Moritz (alt)", "emil", [3, 3, 3], "hektiker", 1, "taktiker"),
  // gemessen 1072 (Schnellschach, 24.10.2026)
  bot(
    "alt-onkel-bernd",
    "Onkel Bernd (alt)",
    "onkel-rudi",
    [2, 2, 2],
    "materialist",
    0,
    "taktiker",
  ),
  // gemessen 983 (Schnellschach, 24.10.2026)
  bot("alt-clara", "Clara (alt)", "frieda", [2, 2, 2], "solide", 0, "universell"),
  // gemessen 1370 (Schnellschach, 24.10.2026)
  bot(
    "alt-herr-krause",
    "Herr Krause (alt)",
    "herr-lehmann",
    [4, 3, 3],
    "theoretiker",
    -1,
    "positionsspieler",
  ),
  // gemessen 1400 (Schnellschach, 24.10.2026)
  bot("alt-jakob", "Jakob (alt)", "pit", [3, 4, 4], "hektiker", 2, "taktiker"),
  // gemessen 1576 (Schnellschach, 24.10.2026)
  bot("alt-rolf", "Rolf (alt)", "karl", [4, 4, 4], "vorsichtig", -2, "verteidiger"),
  // gemessen 1327 (Schnellschach, 24.10.2026)
  bot("alt-derya", "Derya (alt)", "selin", [4, 4, 4], "angreifer", 2, "angreifer"),
  // gemessen 1752 (Schnellschach, 24.10.2026)
  bot("alt-svenja", "Svenja (alt)", "nina", [4, 4, 4], "solide", 0, "universell"),
  // gemessen 1662 (Schnellschach, 24.10.2026)
  bot("alt-felix", "Felix (alt)", "jonas", [3, 4, 5], "endspieler", -1, "vereinfacher"),
  // gemessen 1695 (Schnellschach, 24.10.2026)
  bot("alt-ronja", "Ronja (alt)", "greta", [5, 5, 5], "traeumer", 1, "draufgaenger"),
  // gemessen 1627 (Schnellschach, 24.10.2026)
  bot(
    "alt-herr-wolff",
    "Herr Wolff (alt)",
    "herr-nowak",
    [5, 5, 5],
    "stratege",
    -2,
    "positionsspieler",
  ),
  // gemessen 1650 (Schnellschach, 24.10.2026)
  bot("alt-pia", "Pia (alt)", "ida", [5, 5, 4], "damenfan", 1, "draufgaenger"),
  // gemessen 1673 (Schnellschach, 24.10.2026)
  bot("alt-yusuf", "Yusuf (alt)", "omar", [4, 5, 4], "taktiker", 1, "taktiker"),
  // gemessen 1975 (Schnellschach, 24.10.2026)
  bot("alt-holger", "Holger (alt)", "benno", [5, 5, 5], "solide", 0, "universell"),
  // gemessen 1886 (Schnellschach, 24.10.2026)
  bot("alt-dennis", "Dennis (alt)", "timo", [6, 5, 5], "angreifer", 2, "angreifer"),
  // gemessen 1865 (Schnellschach, 24.10.2026)
  bot(
    "alt-frau-albrecht",
    "Frau Albrecht (alt)",
    "frau-berger",
    [5, 5, 6],
    "vorsichtig",
    -2,
    "verteidiger",
  ),
  // gemessen 1761 (Schnellschach, 24.10.2026)
  bot("alt-philipp", "Philipp (alt)", "lukas", [5, 6, 6], "hektiker", 1, "taktiker"),
  // gemessen 1923 (Schnellschach, 24.10.2026)
  bot("alt-mara", "Mara (alt)", "zoe", [6, 6, 5], "taktiker", 1, "taktiker"),
  // gemessen 1879 (Schnellschach, 24.10.2026)
  bot("alt-erik", "Erik (alt)", "jan", [6, 6, 6], "materialist", 0, "taktiker"),
  // gemessen 2228 (Schnellschach, 24.10.2026)
  bot("alt-guenter", "Günter (alt)", "kurt", [6, 6, 7], "endspieler", -1, "vereinfacher"),
  // gemessen 2049 (Schnellschach, 24.10.2026)
  bot("alt-frau-romero", "Frau Romero (alt)", "frau-ortega", [6, 6, 6], "solide", 0, "universell"),
  // gemessen 1980 (Schnellschach, 24.10.2026)
  bot("alt-lars", "Lars (alt)", "nils", [7, 7, 7], "angreifer", 2, "angreifer"),
  // gemessen 2004 (Schnellschach, 24.10.2026)
  bot("alt-katrin", "Katrin (alt)", "hanna", [8, 7, 6], "theoretiker", 0, "positionsspieler"),
  // gemessen 2284 (Schnellschach, 24.10.2026)
  bot(
    "alt-herr-vogel",
    "Herr Vogel (alt)",
    "herr-weber",
    [7, 7, 7],
    "stratege",
    -2,
    "positionsspieler",
  ),
  // gemessen 2050 (Schnellschach, 24.10.2026)
  bot("alt-nele", "Nele (alt)", "lea", [6, 7, 6], "taktiker", 1, "taktiker"),
  // gemessen 1930 (Schnellschach, 24.10.2026)
  bot("alt-simon", "Simon (alt)", "paul", [6, 7, 7], "hektiker", 1, "taktiker"),
  // gemessen 2094 (Schnellschach, 24.10.2026)
  bot(
    "alt-frau-demir",
    "Frau Demir (alt)",
    "frau-kaya",
    [7, 7, 7],
    "vorsichtig",
    -1,
    "verteidiger",
  ),
  // gemessen 2158 (Schnellschach, 24.10.2026)
  bot("alt-jana", "Jana (alt)", "lena", [7, 7, 7], "solide", 0, "universell"),
  // gemessen 2236 (Schnellschach, 24.10.2026)
  bot("alt-igor", "Igor (alt)", "viktor", [9, 8, 8], "theoretiker", -1, "positionsspieler"),
  // gemessen 2236 (Schnellschach, 24.10.2026)
  bot("alt-miriam", "Miriam (alt)", "sara", [8, 8, 8], "traeumer", 1, "draufgaenger"),
  // gemessen 2339 (Schnellschach, 24.10.2026)
  bot(
    "alt-herr-hartmann",
    "Herr Hartmann (alt)",
    "herr-fischer",
    [7, 8, 9],
    "endspieler",
    -2,
    "vereinfacher",
  ),
  // gemessen 2215 (Schnellschach, 24.10.2026)
  bot("alt-luca", "Luca (alt)", "matteo", [8, 8, 7], "angreifer", 2, "angreifer"),
  // gemessen 2360 (Schnellschach, 24.10.2026)
  bot(
    "alt-frau-sommer",
    "Frau Sommer (alt)",
    "frau-lind",
    [8, 8, 8],
    "stratege",
    -1,
    "positionsspieler",
  ),
  // gemessen 2339 (Schnellschach, 24.10.2026)
  bot("alt-david", "David (alt)", "ben", [8, 8, 8], "materialist", 0, "taktiker"),
  // gemessen 2510 (Schnellschach, 24.10.2026)
  bot(
    "alt-doktor-falk",
    "Doktor Falk (alt)",
    "doktor-berg",
    [9, 9, 9],
    "stratege",
    -1,
    "positionsspieler",
    0.3,
  ),
  // gemessen 2599 (Schnellschach, 24.10.2026)
  bot(
    "alt-trainer-maier",
    "Trainer Maier (alt)",
    "trainer-koch",
    [9, 9, 9],
    "solide",
    0,
    "universell",
    0.5,
  ),
  // gemessen 2510 (Schnellschach, 24.10.2026)
  bot("alt-amaya", "Amaya (alt)", "yara", [9, 9, 9], "theoretiker", 1, "positionsspieler", 0.5),
  // gemessen 2427 (Schnellschach, 24.10.2026)
  bot(
    "alt-herr-lorenz",
    "Herr Lorenz (alt)",
    "herr-brandt",
    [9, 9, 9],
    "endspieler",
    -2,
    "vereinfacher",
    0.5,
  ),
  // gemessen 2649 (Schnellschach, 24.10.2026)
  bot("alt-elias", "Elias (alt)", "noah", [9, 9, 9], "angreifer", 2, "angreifer", 0.3),
  // gemessen 2763 (Schnellschach, 24.10.2026)
  bot(
    "alt-frau-wagner",
    "Frau Wagner (alt)",
    "frau-stein",
    [9, 9, 9],
    "vorsichtig",
    -1,
    "verteidiger",
    0.5,
  ),
  // gemessen 2763 (Schnellschach, 24.10.2026)
  bot(
    "alt-frau-prof-reich",
    "Frau Prof. Reich (alt)",
    "frau-doktor-ahl",
    [9, 9, 9],
    "traeumer",
    0,
    "draufgaenger",
    0.1,
  ),
  // gemessen 2510 (Schnellschach, 24.10.2026)
  bot("alt-gm-novak", "GM Novak (alt)", "gm-gruen", [9, 9, 9], "solide", 0, "universell", 0.1),
  // gemessen 2649 (Schnellschach, 24.10.2026)
  bot(
    "alt-im-becker",
    "IM Becker (alt)",
    "im-vogt",
    [9, 9, 9],
    "stratege",
    -1,
    "positionsspieler",
    0.1,
  ),
  // gemessen 2703 (Schnellschach, 24.10.2026)
  bot("alt-wgm-tanaka", "WGM Tanaka (alt)", "wgm-sato", [9, 9, 9], "taktiker", 1, "taktiker", 0.1),
];
