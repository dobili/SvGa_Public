/**
 * Verbindung zwischen Spielmenü und Oberwelt fürs Warten (Spieluhr, Wunsch des Autors, 22.11.2026).
 *
 * Warum ein eigener kleiner Speicher: Das Spielmenü liegt in der Hülle (anbindung/), die Oberwelt
 * darunter; beide kennen einander nicht. Die Oberwelt meldet hier, ob Warten gerade geht (freie
 * Welt) und wie spät es ist, und nimmt Wünsche entgegen (useWarten.tsx). Das Menü liest die Lage
 * und schickt den Wunsch (anbindung/Wartefeld.tsx).
 * Rolle im Gesamtbild: Bindeglied ohne React-Kontext. Abhängigkeiten: React (useSyncExternalStore).
 */
import { useSyncExternalStore } from "react";

/** Wohin gewartet wird (Stunde in regeln/spieluhr.ts, ZIELE). */
export type Warteziel = "morgen" | "mittag" | "abend" | "nacht";
export const WARTEZIELE: readonly Warteziel[] = ["morgen", "mittag", "abend", "nacht"];

/** Was das Menü wissen muss: ob Warten geht und die Uhrzeit für die Anzeige. */
export interface Wartelage {
  readonly moeglich: boolean;
  readonly stunde: number;
  readonly tag: number;
}

let lage: Wartelage | null = null;
let ausfuehren: ((ziel: Warteziel) => void) | null = null;
const zuhoerer = new Set<() => void>();

/** Die Oberwelt meldet ihre Lage (null: keine Oberwelt) und wie sie wartet. */
export function meldeWartelage(
  neu: Wartelage | null,
  wie: ((ziel: Warteziel) => void) | null,
): void {
  ausfuehren = wie;
  if (neu?.moeglich === lage?.moeglich && neu?.stunde === lage?.stunde && neu?.tag === lage?.tag) {
    return;
  }
  lage = neu;
  for (const z of zuhoerer) z();
}

/** Das Menü wartet bis zum Ziel (nur wenn es gerade geht). */
export function warte(ziel: Warteziel): void {
  if (lage?.moeglich) ausfuehren?.(ziel);
}

/** Die aktuelle Lage für React. */
export function useWartelage(): Wartelage | null {
  return useSyncExternalStore(
    (z) => {
      zuhoerer.add(z);
      return () => zuhoerer.delete(z);
    },
    () => lage,
  );
}
