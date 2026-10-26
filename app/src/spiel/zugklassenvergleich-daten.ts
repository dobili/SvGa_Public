/**
 * Übliche Anteile aller zehn Zugklassen (Prozent der eigenen Züge) je Zeitklasse und Elo-Band aus
 * den Spielerprofilen (77 000 Lichess-Partien, 3 900 Spieler), erzeugt am 2026-10-26 vom Messlauf
 * spiel/zugklassen.messung.ts (nicht von Hand ändern). Die Klasse jedes Zuges ist mit der Regel
 * der App bestimmt (spiel/auswertung.ts, klasseVon; Opfer, Theoriekette und Gambit wie in der
 * App). Je Klasse [5-%-Quantil, Median, 95-%-Quantil] über die Spieler mit mindestens 100
 * Zügen in Band und Zeitklasse; ist der Median 0 (seltene Klassen wie brillant), steht in der
 * Mitte das Mittel der Spieler. Bänder 400 breit nach der Elo der Partie, mit mindestens 30
 * Spielern.
 */
import type { Wertungstempo } from "./elomodell-daten";

export type Quantilklasse =
  | "brillant"
  | "stark"
  | "bester"
  | "sehrGut"
  | "gut"
  | "buch"
  | "ungenau"
  | "fehler"
  | "verpasst"
  | "patzer";

export const ZUGKLASSEN_UEBLICH: Readonly<
  Record<
    Wertungstempo,
    Readonly<Record<string, Readonly<Record<Quantilklasse, readonly [number, number, number]>>>>
  >
> = {
  blitz: {
    "400": {
      brillant: [0, 0.13, 0.53],
      stark: [4.91, 7.13, 9.36],
      bester: [16.33, 20.94, 26.96],
      sehrGut: [9.82, 13.96, 19.26],
      gut: [10.34, 14.96, 19.93],
      buch: [3.17, 5.64, 9.77],
      ungenau: [8.95, 13.66, 18.22],
      fehler: [6.07, 10.36, 14.79],
      verpasst: [3.25, 6.01, 9.24],
      patzer: [3.07, 6.47, 9.77],
    },
    "800": {
      brillant: [0, 0.13, 0.62],
      stark: [4.89, 7.55, 10.28],
      bester: [17.93, 22.71, 27.48],
      sehrGut: [10.12, 14.57, 20.22],
      gut: [11.27, 15.27, 19.87],
      buch: [2.46, 5.34, 9.81],
      ungenau: [10.12, 14.22, 18.19],
      fehler: [5.59, 9.35, 13.31],
      verpasst: [2.93, 4.78, 7.02],
      patzer: [2.81, 5.09, 7.94],
    },
    "1200": {
      brillant: [0, 0.22, 0.61],
      stark: [5.96, 8.43, 10.7],
      bester: [20.05, 24.2, 28.59],
      sehrGut: [11.81, 15.91, 20.1],
      gut: [11.82, 15.14, 18.73],
      buch: [2.34, 5.8, 9.29],
      ungenau: [10.81, 13.98, 18.05],
      fehler: [5.51, 8.03, 11.65],
      verpasst: [2.29, 3.83, 5.63],
      patzer: [2.16, 3.84, 5.95],
    },
    "1600": {
      brillant: [0, 0.28, 0.89],
      stark: [6.38, 8.55, 11.06],
      bester: [21.64, 25.48, 29.81],
      sehrGut: [12.47, 16.67, 21.35],
      gut: [12.01, 14.81, 17.83],
      buch: [2.67, 5.83, 9.09],
      ungenau: [10.74, 13.99, 17.82],
      fehler: [4.81, 7.32, 10.41],
      verpasst: [1.62, 3.1, 4.97],
      patzer: [1.48, 3.06, 4.58],
    },
    "2000": {
      brillant: [0, 0.42, 1.01],
      stark: [6.76, 9.08, 11.2],
      bester: [24.39, 28.27, 35.1],
      sehrGut: [13.51, 18.06, 22.81],
      gut: [11.03, 13.9, 16.94],
      buch: [3.27, 6.28, 10.51],
      ungenau: [9.21, 12.69, 16.57],
      fehler: [3.23, 6.15, 8.64],
      verpasst: [0.68, 2.17, 3.6],
      patzer: [0.65, 2.25, 3.83],
    },
    "2400": {
      brillant: [0.1, 0.54, 1.12],
      stark: [6.52, 9.35, 11.44],
      bester: [27.14, 31.1, 42.22],
      sehrGut: [15.88, 19.76, 29.88],
      gut: [9.06, 12.6, 15.66],
      buch: [3.86, 7.23, 10.78],
      ungenau: [4.36, 10.4, 13.48],
      fehler: [0.78, 4.79, 6.98],
      verpasst: [0.15, 1.45, 2.5],
      patzer: [0.13, 1.51, 2.53],
    },
  },
  rapid: {
    "400": {
      brillant: [0, 0.11, 0.51],
      stark: [3.77, 6.38, 9.11],
      bester: [15.08, 20.03, 24.02],
      sehrGut: [9.99, 14.82, 21.98],
      gut: [10.48, 14.83, 20.31],
      buch: [2.49, 4.85, 7.99],
      ungenau: [9.21, 13.33, 17.12],
      fehler: [7.35, 10.74, 14.76],
      verpasst: [3.95, 6.85, 9.82],
      patzer: [4.58, 7.12, 10.59],
    },
    "800": {
      brillant: [0, 0.15, 0.65],
      stark: [5.16, 7.59, 10.39],
      bester: [18.16, 22.77, 26.94],
      sehrGut: [9.94, 14.21, 19.27],
      gut: [11.05, 14.62, 19.12],
      buch: [2.93, 5.98, 9.74],
      ungenau: [9.64, 13.73, 17.59],
      fehler: [6.01, 9.64, 13.57],
      verpasst: [2.9, 4.84, 8.15],
      patzer: [3.06, 5.46, 8.32],
    },
    "1200": {
      brillant: [0, 0.23, 0.71],
      stark: [6.44, 8.53, 10.79],
      bester: [20.37, 24.37, 28.28],
      sehrGut: [11.27, 15.41, 20.55],
      gut: [11.48, 14.76, 18.51],
      buch: [3.13, 6.47, 10.22],
      ungenau: [10.6, 13.72, 17.72],
      fehler: [5.38, 8.21, 11.03],
      verpasst: [2.12, 3.5, 5.29],
      patzer: [2.26, 3.85, 5.72],
    },
    "1600": {
      brillant: [0, 0.33, 0.9],
      stark: [7.09, 8.85, 11.08],
      bester: [23.08, 26.3, 30.63],
      sehrGut: [13.18, 16.88, 21.37],
      gut: [11.54, 14.43, 17.33],
      buch: [3.2, 6.18, 9.84],
      ungenau: [10.41, 13.59, 17.3],
      fehler: [4.9, 7.1, 9.67],
      verpasst: [1.54, 2.85, 4.33],
      patzer: [1.33, 2.81, 4.28],
    },
    "2000": {
      brillant: [0, 0.5, 1.13],
      stark: [6.64, 9.21, 11.37],
      bester: [25.14, 29.22, 38.75],
      sehrGut: [14.46, 18.37, 24.65],
      gut: [10.83, 13.32, 16.01],
      buch: [4.19, 6.92, 10.93],
      ungenau: [8.07, 12.05, 15.64],
      fehler: [2.23, 5.57, 8.22],
      verpasst: [0.56, 1.78, 3.07],
      patzer: [0.29, 1.74, 3.1],
    },
    "2400": {
      brillant: [0.02, 0.7, 1.64],
      stark: [6.04, 9.35, 12.57],
      bester: [27.74, 33.33, 44.04],
      sehrGut: [16.02, 21.38, 28.83],
      gut: [8.67, 11.95, 15.4],
      buch: [4.12, 7.38, 11.84],
      ungenau: [4.41, 9, 12.22],
      fehler: [0.73, 3.61, 5.69],
      verpasst: [0.01, 0.93, 2.03],
      patzer: [0, 0.9, 2.11],
    },
  },
  classical: {
    "800": {
      brillant: [0, 0.14, 0.59],
      stark: [3.07, 6.95, 10.91],
      bester: [17, 21.56, 27.71],
      sehrGut: [7.96, 14.13, 22.42],
      gut: [8.4, 14.38, 20.37],
      buch: [2.23, 5.37, 10.33],
      ungenau: [9.09, 14.17, 19.42],
      fehler: [6.83, 10.76, 15.2],
      verpasst: [2.47, 5.39, 8.89],
      patzer: [2.8, 6.08, 9.86],
    },
    "1200": {
      brillant: [0, 0.22, 0.78],
      stark: [4.62, 7.94, 11.6],
      bester: [18.57, 24.04, 29.25],
      sehrGut: [9.98, 15.45, 20.91],
      gut: [11.06, 15.34, 20.33],
      buch: [2.83, 5.83, 10.27],
      ungenau: [9.97, 14.44, 19.33],
      fehler: [4.71, 8.45, 12.49],
      verpasst: [1.61, 3.5, 6.45],
      patzer: [1.53, 3.77, 6.84],
    },
    "1600": {
      brillant: [0, 0.27, 1.15],
      stark: [5.98, 8.93, 11.54],
      bester: [21.63, 26.55, 32.68],
      sehrGut: [11.95, 17.01, 22.94],
      gut: [10.27, 14.56, 18.93],
      buch: [3.24, 6.32, 11.12],
      ungenau: [9.25, 13.83, 18.16],
      fehler: [3.41, 6.84, 10.06],
      verpasst: [0.82, 2.5, 4.13],
      patzer: [0.82, 2.36, 4.48],
    },
    "2000": {
      brillant: [0, 0.49, 1.61],
      stark: [5.21, 9.39, 14.32],
      bester: [25.74, 32.15, 41.88],
      sehrGut: [12.83, 19.18, 29.03],
      gut: [8.01, 12.77, 17.49],
      buch: [3.2, 7.08, 14],
      ungenau: [4.58, 10.39, 15.56],
      fehler: [1.1, 4.01, 7.36],
      verpasst: [0, 1.03, 2.58],
      patzer: [0, 0.87, 2.53],
    },
  },
};
