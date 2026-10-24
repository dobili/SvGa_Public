/**
 * Welche Tour gerade läuft: ein kleiner Speicher außerhalb von React, den Symbol, Hinweis,
 * Einstellungen und die Tour-Ebene gemeinsam nutzen.
 *
 * Rolle im Gesamtbild: Das Symbol sitzt in der Kopfzeile jedes Bildschirms, die Tour-Ebene einmal
 * in der Hülle der App (App.tsx). Statt eines React-Kontexts genügt ein Wert mit Abonnenten:
 * Starten und Beenden geht so von überall, auch aus dem Hinweis beim ersten Start.
 * Abhängigkeiten: React (useSyncExternalStore), touren.ts.
 */
import { useSyncExternalStore } from "react";
import type { TourKennung } from "./touren";

/** Die laufende Tour, oder null. */
let laufend: TourKennung | null = null;
const abonnenten = new Set<() => void>();

function benachrichtige(): void {
  abonnenten.forEach((abonnent) => abonnent());
}

function abonniere(abonnent: () => void): () => void {
  abonnenten.add(abonnent);
  return () => abonnenten.delete(abonnent);
}

function liesLaufend(): TourKennung | null {
  return laufend;
}

/** Startet eine Tour von ihrem ersten Schritt an; eine laufende Tour endet dabei. */
export function starteTour(kennung: TourKennung): void {
  laufend = kennung;
  benachrichtige();
}

/** Beendet die laufende Tour. */
export function beendeTour(): void {
  laufend = null;
  benachrichtige();
}

/** Die laufende Tour für eine Komponente. */
export function useLaufendeTour(): TourKennung | null {
  return useSyncExternalStore(abonniere, liesLaufend, liesLaufend);
}
