/**
 * Abstand der Blitz- und Klassisch-Wertung zur Schnellschach-Wertung desselben Menschen bei Lichess,
 * je 200er-Band (erzeugt am 2026-10-25 aus 29690 Lichess-Profilen,
 * buch/arbeit/wertungsvergleich/tabelle.py; nicht von Hand ändern).
 *
 * Rolle im Gesamtbild: Daten für engine/zeitklassenabstand.ts. Je Punkt: Mitte des Bandes (Mittel
 * beider Wertungen eines Spielers), Median des Abstands, Zahl der Spieler. Gezählt sind Spieler mit
 * mindestens 20 Partien und fester Wertung in beiden Zeitklassen (11139 für
 * Blitz, 4240 für Klassisch). Herleitung: docs/ENTSCHEIDUNGEN.md, „Bots als ein
 * Mensch mit drei Wertungen“.
 * Abhängigkeiten: keine.
 */

/** Mitte des Bandes, Median des Abstands (Elo), Zahl der Spieler. */
export type Abstandspunkt = readonly [number, number, number];

export const ABSTAND_ZU_SCHNELLSCHACH: Readonly<
  Record<"blitz" | "classical", readonly Abstandspunkt[]>
> = {
  blitz: [
    [700, -139, 221],
    [900, -163, 769],
    [1100, -196, 1507],
    [1300, -215, 2009],
    [1500, -200, 2204],
    [1700, -160, 2039],
    [1900, -131, 1447],
    [2100, -99, 633],
    [2300, -87, 181],
  ],
  classical: [
    [900, 238, 147],
    [1100, 224, 412],
    [1300, 202, 706],
    [1500, 140, 918],
    [1700, 70, 950],
    [1900, 11, 665],
    [2100, -39, 280],
    [2300, -62, 78],
  ],
};
