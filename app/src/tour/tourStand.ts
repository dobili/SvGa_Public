/**
 * Welche Tour gerade läuft: ein kleiner Speicher außerhalb von React, den Symbol, Hinweis,
 * Einstellungen und die Tour-Ebene gemeinsam nutzen.
 *
 * Rolle im Gesamtbild: Das Symbol sitzt in der Kopfzeile jedes Bildschirms, die Tour-Ebene einmal
 * in der Hülle der App (App.tsx). Statt eines React-Kontexts genügt ein Wert mit Abonnenten:
 * Starten und Beenden geht so von überall, auch aus dem Hinweis beim ersten Start. Dazu der Merker,
 * ob die Startwahl auf Wunsch offen ist (Einstellungen › Hilfe, seit 0.3.43).
 * Abhängigkeiten: React (useSyncExternalStore), touren.ts.
 */
import { useSyncExternalStore } from "react";
import type { TourKennung } from "./touren";

/** Die laufende Tour, oder null. */
let laufend: TourKennung | null = null;
/** Ob die Startwahl („Wie möchtest du starten?“) auf Wunsch offen ist (Einstellungen › Hilfe). */
let startwahl = false;
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

/** Öffnet die Startwahl erneut (Einstellungen › Hilfe › Rundgang). */
export function oeffneStartwahl(): void {
  laufend = null;
  startwahl = true;
  benachrichtige();
}

/** Schließt die Startwahl. */
export function schliesseStartwahl(): void {
  startwahl = false;
  benachrichtige();
}

function liesStartwahl(): boolean {
  return startwahl;
}

/** Ob die Startwahl auf Wunsch offen ist, für eine Komponente. */
export function useStartwahlOffen(): boolean {
  return useSyncExternalStore(abonniere, liesStartwahl, liesStartwahl);
}

/** Die laufende Tour für eine Komponente. */
export function useLaufendeTour(): TourKennung | null {
  return useSyncExternalStore(abonniere, liesLaufend, liesLaufend);
}
