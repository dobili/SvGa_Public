/**
 * Abstand der Blitz- und Klassisch-Wertung zur Schnellschach-Wertung desselben Menschen bei Lichess,
 * je 200er-Band (erzeugt am 2026-10-25 aus 871364 Lichess-Profilen,
 * buch/arbeit/wertungsvergleich/tabelle.py; nicht von Hand ändern).
 *
 * Rolle im Gesamtbild: Daten für engine/zeitklassenabstand.ts. Je Punkt: Mitte des Bandes (Mittel
 * beider Wertungen eines Spielers), gewählter Abstand, Zahl der Spieler, effektive Zahl, Median und
 * Spanne der mittleren 95 % der Spieler (2,5. bis 97,5. Perzentil), alles gewichtet mit dem
 * Verhältnis der Partienzahlen in beiden Zeitklassen (kleinere durch größere; Wunsch des Autors:
 * wer ähnlich viel beides spielt, zählt mehr). Gewählt ist der Median, in Blitz aber
 * höchstens −50, in Klassisch mindestens +50 (Wunsch des Autors: Blitz < Schnellschach <
 * Klassisch für jeden Bot, Werte aus der Spanne; 50 ist eine Anzeigestufe). Gezählt sind Spieler mit
 * mindestens 20 Partien und fester Wertung in beiden Zeitklassen (196052 für
 * Blitz, 43283 für Klassisch). Herleitung: docs/ENTSCHEIDUNGEN.md, „Bots als ein
 * Mensch mit drei Wertungen“.
 * Abhängigkeiten: keine.
 */

/**
 * Mitte des Bandes, gewählter Abstand, Spieler, effektive Zahl nach Gewichtung, gewichteter
 * Median, gewichtetes 2,5. und 97,5. Perzentil (Elo).
 */
export type Abstandspunkt = readonly [number, number, number, number, number, number, number];

/** Je Zeitklasse (Blitz, Klassisch) die Abstandspunkte zur Schnellschach-Wertung, je Band. */
export const ABSTAND_ZU_SCHNELLSCHACH: Readonly<
  Record<"blitz" | "classical", readonly Abstandspunkt[]>
> = {
  blitz: [
    [500, -50, 1468, 1160, -45, -266, 212],
    [700, -79, 8113, 5976, -79, -332, 293],
    [900, -108, 16916, 11719, -108, -395, 304],
    [1100, -157, 24000, 16118, -157, -455, 265],
    [1300, -180, 28427, 19023, -180, -483, 182],
    [1500, -174, 31250, 20723, -174, -464, 155],
    [1700, -149, 30876, 20432, -149, -434, 127],
    [1900, -130, 26017, 16707, -130, -399, 115],
    [2100, -104, 18555, 10858, -104, -368, 111],
    [2300, -66, 8432, 4363, -66, -312, 167],
    [2500, -50, 1640, 822, -22, -267, 213],
    [2700, -50, 233, 129, 7, -234, 284],
  ],
  classical: [
    [700, 213, 354, 265, 213, -23, 472],
    [900, 229, 1849, 1317, 229, -67, 558],
    [1100, 232, 4391, 2939, 232, -77, 594],
    [1300, 208, 6974, 4352, 208, -76, 512],
    [1500, 149, 9037, 5360, 149, -136, 411],
    [1700, 86, 9349, 5235, 86, -174, 338],
    [1900, 50, 6903, 3839, 12, -229, 273],
    [2100, 50, 3281, 1955, -26, -246, 232],
    [2300, 50, 879, 554, -70, -272, 151],
    [2500, 50, 144, 101, -137, -381, 76],
  ],
};
