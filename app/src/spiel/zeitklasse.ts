/**
 * Zeitklasse einer Partie aus ihrer Bedenkzeit (R51, Anzeigeteil).
 *
 * Rolle im Gesamtbild: Wunsch des Autors (23.10.2026): Partien nach Bullet, Blitz, Schnellschach
 * und klassisch unterscheiden. Die Klasse wird nur aus der gespeicherten Bedenkzeit abgeleitet
 * (kein neues Speicherformat); Wertung und „besiegt“ je Zeitklasse stehen in spiel/wertung.ts
 * und speicher/besiegt.ts.
 * Regel wie bei Lichess: geschätzte Dauer = Grundzeit + 40 × Zuschlag; unter 3 Minuten Bullet,
 * unter 8 Blitz, unter 25 Schnellschach, sonst klassisch.
 * Abhängigkeiten: spiel/uhr.ts (Uhreinstellung).
 */
import type { Uhreinstellung } from "./uhr";

/** Die Zeitklassen nach Lichess, von der schnellsten zur langsamsten. */
export const ZEITKLASSEN = ["bullet", "blitz", "schnell", "klassisch"] as const;
export type Zeitklasse = (typeof ZEITKLASSEN)[number];

const SEKUNDE_MS = 1000;
/** Lichess rechnet mit 40 Zügen je Partie für den Zuschlag. */
const ZUEGE_FUER_ZUSCHLAG = 40;
/** Obergrenzen der geschätzten Dauer in Sekunden (Lichess). */
const GRENZE_BULLET_S = 180;
const GRENZE_BLITZ_S = 480;
const GRENZE_SCHNELL_S = 1500;

/**
 * Die Zeitklasse einer Bedenkzeit; null ohne Uhr.
 * Beispiel: 3 + 2 → 3 Minuten + 80 Sekunden = 260 s → Blitz; 10 + 0 → 600 s → Schnellschach;
 * 60 + 0 → klassisch.
 */
export function zeitklasse(uhr: Uhreinstellung | null | undefined): Zeitklasse | null {
  if (!uhr) return null;
  const dauer = (uhr.grundzeitMs + ZUEGE_FUER_ZUSCHLAG * uhr.zuschlagMs) / SEKUNDE_MS;
  if (dauer < GRENZE_BULLET_S) return "bullet";
  if (dauer < GRENZE_BLITZ_S) return "blitz";
  if (dauer < GRENZE_SCHNELL_S) return "schnell";
  return "klassisch";
}
