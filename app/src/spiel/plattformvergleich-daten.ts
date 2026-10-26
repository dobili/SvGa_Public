/**
 * Gemessene Bereiche der eigenen Wertung (Lichess-Maßstab) auf FIDE und chess.com, je Zeitklasse.
 * Erzeugt von pipeline/wertungsvergleich/auswerten.py am 26.10.2026, nicht von Hand ändern.
 *
 * Herkunft: 0 öffentliche Lichess-Profile mit FIDE-Angabe oder chess.com-Link aus den
 * Mitgliederlisten großer Lichess-Teams. FIDE: abgeglichen mit der offiziellen FIDE-Liste
 * (Klarname und Zahl), offizielle Standard-Wertung, nur aktive Spieler. chess.com: verlinkte
 * Konten mit ihrer aktuellen Wertung (Klassisch → chess.com Schnellschach).
 * Je Zeile [Lichess, von, Mitte, bis, Spieler]: Median und Viertel (25 %, 75 %) der Zielwertung bei
 * Spielern mit Lichess-Zahl ±100, die Ränder um eine Standardabweichung der Messung (Bootstrap)
 * nach außen geschoben. Paare je Zeitklasse: fide blitz 0, rapid 0, classical 0; chesscom blitz 0, rapid 0, classical 0.
 * Abhängigkeiten: spiel/elomodell-daten.ts (Zeitklasse).
 */
import type { Wertungstempo } from "./elomodell-daten";

/** Eine Zeile: [Lichess, von, Mitte, bis, Zahl der Spieler im Fenster]. */
export type Vergleichsband = readonly [number, number, number, number, number];

/** Je Liste und Zeitklasse die Bänder, aufsteigend; leer, wo zu wenige Paare sind. */
export const GEMESSEN: Readonly<
  Record<"fide" | "chesscom", Readonly<Record<Wertungstempo, readonly Vergleichsband[]>>>
> = {
  fide: {
    blitz: [],
    rapid: [],
    classical: [],
  },
  chesscom: {
    blitz: [],
    rapid: [],
    classical: [],
  },
};
