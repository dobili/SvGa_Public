/**
 * Übliche Anteile der Zugklassen (Prozent der eigenen Züge) je Zeitklasse und Wertungsband aus den
 * Spielerprofilen (77 000 Lichess-Partien, 3 900 Spieler; je Band und Zeitklasse 160 bis 430 Spieler mit
 * mindestens 100 Zügen), erzeugt aus buch/arbeit/spielerprofil/zugklassen.json (nur lokal), nicht von Hand
 * ändern. Je Klasse [5-%-Quantil, Median, 95-%-Quantil] über die Spieler; „bester“ enthält dort alle Züge
 * ohne Verlust (auch Buchzüge, starke und brillante Züge), was spiel/zugklassenvergleich.ts herausrechnet.
 * Bänder: Untergrenzen 400 bis 2400 (je 400 breit); Klassisch unter 800 ohne genug Spieler.
 */
import type { Wertungstempo } from "./elomodell-daten";

export type Quantilklasse =
  "bester" | "sehrGut" | "gut" | "ungenau" | "fehler" | "verpasst" | "patzer";

export const ZUGKLASSEN_UEBLICH: Readonly<
  Record<
    Wertungstempo,
    Readonly<Record<string, Readonly<Record<Quantilklasse, readonly [number, number, number]>>>>
  >
> = {
  blitz: {
    "400": {
      bester: [32.1, 39.2, 47.6],
      sehrGut: [5.4, 7.5, 11.9],
      gut: [11.4, 15.9, 21.5],
      ungenau: [9.3, 13.7, 18.4],
      fehler: [6.1, 10.4, 14.8],
      verpasst: [3.3, 6.0, 9.2],
      patzer: [3.1, 6.5, 9.8],
    },
    "800": {
      bester: [34.0, 40.4, 47.5],
      sehrGut: [6.2, 8.7, 13.0],
      gut: [12.6, 16.5, 21.0],
      ungenau: [10.3, 14.3, 18.3],
      fehler: [5.6, 9.4, 13.3],
      verpasst: [2.9, 4.8, 7.0],
      patzer: [2.8, 5.1, 7.9],
    },
    "1200": {
      bester: [37.1, 42.7, 49.4],
      sehrGut: [7.2, 10.4, 13.8],
      gut: [12.7, 16.4, 20.8],
      ungenau: [10.9, 14.2, 18.0],
      fehler: [5.5, 8.0, 11.7],
      verpasst: [2.3, 3.8, 5.6],
      patzer: [2.2, 3.8, 6.0],
    },
    "1600": {
      bester: [38.0, 44.3, 50.4],
      sehrGut: [8.4, 11.4, 14.8],
      gut: [13.1, 15.9, 19.7],
      ungenau: [10.7, 14.2, 18.0],
      fehler: [4.8, 7.3, 10.4],
      verpasst: [1.6, 3.1, 5.0],
      patzer: [1.5, 3.1, 4.6],
    },
    "2000": {
      bester: [42.3, 48.5, 57.4],
      sehrGut: [9.1, 12.6, 16.2],
      gut: [12.0, 15.1, 18.4],
      ungenau: [9.3, 12.8, 16.6],
      fehler: [3.2, 6.2, 8.6],
      verpasst: [0.7, 2.2, 3.6],
      patzer: [0.6, 2.2, 3.8],
    },
    "2400": {
      bester: [47.9, 53.3, 69.2],
      sehrGut: [10.7, 13.9, 17.2],
      gut: [9.8, 13.7, 17.2],
      ungenau: [4.4, 10.4, 13.5],
      fehler: [0.8, 4.8, 7.0],
      verpasst: [0.1, 1.5, 2.5],
      patzer: [0.1, 1.5, 2.5],
    },
  },
  rapid: {
    "400": {
      bester: [31.3, 38.7, 45.4],
      sehrGut: [4.2, 6.8, 10.1],
      gut: [11.0, 16.0, 21.7],
      ungenau: [9.3, 13.5, 17.1],
      fehler: [7.3, 10.7, 14.8],
      verpasst: [4.0, 6.8, 9.8],
      patzer: [4.6, 7.1, 10.6],
    },
    "800": {
      bester: [35.0, 41.2, 48.7],
      sehrGut: [5.6, 8.3, 11.8],
      gut: [12.0, 15.7, 20.5],
      ungenau: [9.7, 13.9, 17.6],
      fehler: [6.0, 9.6, 13.6],
      verpasst: [2.9, 4.8, 8.2],
      patzer: [3.1, 5.5, 8.3],
    },
    "1200": {
      bester: [37.8, 43.6, 49.6],
      sehrGut: [7.1, 10.4, 13.9],
      gut: [12.7, 15.9, 20.0],
      ungenau: [10.6, 13.8, 17.8],
      fehler: [5.4, 8.2, 11.0],
      verpasst: [2.1, 3.5, 5.3],
      patzer: [2.3, 3.9, 5.7],
    },
    "1600": {
      bester: [40.5, 45.9, 52.6],
      sehrGut: [8.7, 11.8, 15.2],
      gut: [12.8, 15.5, 18.5],
      ungenau: [10.5, 13.7, 17.4],
      fehler: [4.9, 7.1, 9.7],
      verpasst: [1.5, 2.8, 4.3],
      patzer: [1.3, 2.8, 4.3],
    },
    "2000": {
      bester: [44.2, 50.7, 61.3],
      sehrGut: [9.8, 12.9, 16.4],
      gut: [12.0, 14.4, 17.5],
      ungenau: [8.1, 12.2, 15.7],
      fehler: [2.2, 5.6, 8.2],
      verpasst: [0.6, 1.8, 3.1],
      patzer: [0.3, 1.7, 3.1],
    },
    "2400": {
      bester: [50.4, 57.7, 72.1],
      sehrGut: [11.0, 14.1, 18.1],
      gut: [9.4, 12.9, 16.4],
      ungenau: [4.4, 9.1, 12.2],
      fehler: [0.7, 3.6, 5.7],
      verpasst: [0.0, 0.9, 2.0],
      patzer: [0.0, 0.9, 2.1],
    },
  },
  classical: {
    "800": {
      bester: [32.3, 39.4, 49.0],
      sehrGut: [4.8, 7.7, 12.0],
      gut: [9.6, 15.6, 21.5],
      ungenau: [9.2, 14.3, 19.5],
      fehler: [6.8, 10.8, 15.2],
      verpasst: [2.5, 5.4, 8.9],
      patzer: [2.8, 6.1, 9.9],
    },
    "1200": {
      bester: [35.6, 42.5, 51.5],
      sehrGut: [6.2, 9.8, 13.7],
      gut: [11.7, 16.5, 21.8],
      ungenau: [10.1, 14.5, 19.5],
      fehler: [4.7, 8.4, 12.5],
      verpasst: [1.6, 3.5, 6.5],
      patzer: [1.5, 3.8, 6.8],
    },
    "1600": {
      bester: [39.7, 46.1, 53.7],
      sehrGut: [7.3, 11.5, 16.0],
      gut: [11.7, 15.7, 20.1],
      ungenau: [9.3, 13.9, 18.3],
      fehler: [3.4, 6.8, 10.1],
      verpasst: [0.8, 2.5, 4.1],
      patzer: [0.8, 2.4, 4.5],
    },
    "2000": {
      bester: [46.0, 55.8, 67.2],
      sehrGut: [8.5, 13.1, 18.6],
      gut: [9.1, 13.9, 19.0],
      ungenau: [4.6, 10.4, 15.6],
      fehler: [1.1, 4.0, 7.4],
      verpasst: [0.0, 1.0, 2.6],
      patzer: [0.0, 0.9, 2.5],
    },
  },
};
