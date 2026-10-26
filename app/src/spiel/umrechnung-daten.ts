/**
 * Wertungsvergleich von chessgoals.com (Stand Juli 2026, abgerufen am 26.10.2026): die Tabellen
 * „Chess.com vs. FIDE and USCF“ und „Lichess Ratings vs. Chess.com“, dazu die Streuung je Spalte.
 *
 * Rolle im Gesamtbild: Grundlage der Bereiche „etwa 1320 bis 1530 auf chess.com“ (spiel/umrechnung.ts).
 * Woher die Zahlen kommen: Umfrage unter fast 20 000 aktiven Spielern mit Selbstangaben (Profile
 * auf beiden Seiten, Lichess nur mit RD unter 150). Jede Spalte ist für sich gegen chess.com Blitz
 * ausgewertet; chess.com Blitz ist deshalb die gemeinsame Brücke, über die auch die Quelle selbst
 * ihre dritte Tabelle „Lichess vs. FIDE“ zusammensetzt. Übernommen sind nur die Zahlen (Fakten),
 * Quelle in der App und in docs/LIZENZEN.md.
 * Genauigkeit: Die Quelle nennt je Spalte ein „±“, in dem etwa die Hälfte der aktiven Spieler liegt
 * (eine Zahl für die ganze Spalte, keine Angabe je Zeile). Dünn sind Lichess Klassisch (N = 240)
 * und FIDE unter etwa 1550 (dort hat die Quelle keine Zeilen, „--“ in der Tabelle).
 * Von Hand übertragen; umrechnung.test.ts prüft, dass jede Spalte steigt und Stichproben stimmen.
 * Abhängigkeiten: keine.
 */

/**
 * Eine Zeile: [chess.com Blitz, chess.com Schnellschach, FIDE oder null, Lichess Blitz,
 * Lichess Schnellschach, Lichess Klassisch].
 */
export type Vergleichszeile = readonly [number, number, number | null, number, number, number];

/** Die Spalten der Tabelle mit ihrer Stelle in der Zeile. */
export const SPALTE = {
  chesscomBlitz: 0,
  chesscomSchnell: 1,
  fide: 2,
  lichessBlitz: 3,
  lichessSchnell: 4,
  lichessKlassisch: 5,
} as const;

/** Name einer Spalte. */
export type Spalte = keyof typeof SPALTE;

/**
 * Streuung je Spalte: die halbe Breite des Fensters, in dem etwa 50 % der aktiven Spieler mit
 * derselben chess.com-Blitz-Zahl liegen (Angabe „(+/-)“ der Quelle, in Punkten der Spalte).
 * chess.com Blitz ist die Brücke selbst und hat deshalb 0. In Klammern die Zahl der Spieler.
 */
export const STREUUNG: Readonly<Record<Spalte, number>> = {
  chesscomBlitz: 0,
  chesscomSchnell: 115, // N = 10 156
  fide: 75, // N = 1923
  lichessBlitz: 70, // N = 1935
  lichessSchnell: 90, // N = 1066
  lichessKlassisch: 90, // N = 240
};

/** Die Tabelle, aufsteigend nach chess.com Blitz (500 bis 3000). */
export const VERGLEICHSTABELLE: readonly Vergleichszeile[] = [
  [500, 815, null, 1090, 1290, 1505],
  [600, 905, null, 1160, 1360, 1540],
  [700, 995, null, 1225, 1425, 1575],
  [800, 1085, null, 1290, 1490, 1610],
  [900, 1170, null, 1360, 1555, 1650],
  [1000, 1255, null, 1425, 1615, 1690],
  [1100, 1340, 1660, 1490, 1680, 1730],
  [1150, 1380, 1665, 1525, 1710, 1750],
  [1200, 1420, 1670, 1555, 1740, 1770],
  [1250, 1460, 1675, 1590, 1765, 1795],
  [1300, 1500, 1685, 1620, 1795, 1815],
  [1350, 1540, 1700, 1655, 1825, 1835],
  [1400, 1580, 1710, 1685, 1850, 1860],
  [1450, 1620, 1725, 1720, 1880, 1880],
  [1500, 1655, 1740, 1755, 1905, 1900],
  [1550, 1690, 1760, 1785, 1935, 1925],
  [1600, 1730, 1780, 1820, 1960, 1945],
  [1650, 1765, 1800, 1850, 1990, 1970],
  [1700, 1800, 1820, 1885, 2015, 1990],
  [1750, 1835, 1840, 1915, 2040, 2015],
  [1800, 1870, 1865, 1950, 2065, 2035],
  [1850, 1900, 1890, 1980, 2090, 2055],
  [1900, 1935, 1915, 2015, 2115, 2080],
  [1950, 1965, 1940, 2045, 2140, 2100],
  [2000, 1995, 1965, 2080, 2165, 2120],
  [2100, 2055, 2020, 2145, 2215, 2165],
  [2200, 2110, 2075, 2210, 2260, 2205],
  [2300, 2165, 2135, 2275, 2310, 2245],
  [2400, 2215, 2190, 2340, 2355, 2280],
  [2500, 2260, 2245, 2410, 2400, 2320],
  [2600, 2300, 2300, 2475, 2445, 2350],
  [2700, 2340, 2350, 2540, 2490, 2385],
  [2800, 2375, 2400, 2610, 2530, 2415],
  [2900, 2405, 2445, 2675, 2575, 2440],
  [3000, 2430, 2485, 2745, 2615, 2465],
];
