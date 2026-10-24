/**
 * Zeitnot der Bots als Temperatur des Wahlmodells (0.2.124, Restplan 8b), je Zeitklasse, Restzeitstufe
 * (unter 10, 30, 60 s) und Wertungsband (Untergrenzen 400 bis 2400): der Faktor auf die Temperatur, der die
 * Fehlerrate (ab einem Bauern) so anhebt, wie die Spielerprofile es in Zeitnot zeigen (Faktoren je Gruppe
 * unter 1000, 1000 bis 1799, ab 1800; Zellen mit unter 3 000 Zügen nehmen Blitz, je Gruppe nicht fallend
 * mit knapperer Zeit). Blitz ab 1800: Fehler ×1,25 unter 60 s, ×1,33 unter 30 s, ×1,55 unter 10 s.
 * Erzeugt aus buch/arbeit/bedenkzeit/zeitnot.py und zugwahl/temperatur.py (nur lokal), nicht von Hand ändern.
 */
import type { Wertungstempo } from "../spiel/elomodell-daten";

export const ZEITNOT_TEMPERATUR: Readonly<
  Record<Wertungstempo, Readonly<Record<"0" | "10" | "30", readonly number[]>>>
> = {
  blitz: {
    "0": [1.155, 1.134, 1.116, 1.44, 1.374, 1.328, 1.285, 1.6, 1.6, 1.564, 1.48],
    "10": [1.155, 1.134, 1.116, 1.372, 1.322, 1.282, 1.245, 1.429, 1.362, 1.316, 1.273],
    "30": [1.155, 1.134, 1.116, 1.372, 1.322, 1.282, 1.245, 1.318, 1.268, 1.235, 1.206],
  },
  rapid: {
    "0": [1.225, 1.168, 1.133, 1.495, 1.394, 1.332, 1.276, 1.339, 1.271, 1.239, 1.21],
    "10": [1.225, 1.168, 1.133, 1.415, 1.339, 1.285, 1.237, 1.16, 1.132, 1.118, 1.104],
    "30": [1.225, 1.168, 1.133, 1.415, 1.339, 1.285, 1.237, 1.16, 1.132, 1.118, 1.104],
  },
  classical: {
    "0": [1.249, 1.193, 1.153, 1.573, 1.432, 1.336, 1.261, 1.6, 1.469, 1.384, 1.306],
    "10": [1.249, 1.193, 1.153, 1.481, 1.366, 1.287, 1.225, 1.359, 1.268, 1.226, 1.183],
    "30": [1.249, 1.193, 1.153, 1.481, 1.366, 1.287, 1.225, 1.268, 1.203, 1.172, 1.14],
  },
};
