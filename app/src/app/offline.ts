/**
 * Offline-Stand und Updates in der App: der Hook useOfflineStand auf dem Kern app/offlineKern.ts.
 *
 * Rolle im Gesamtbild: Einstellungen (Ich) und der Update-Hinweis lesen ihren Stand von hier
 * (Konzept 6.6 und 11.1 bis 11.3). Die Logik steht im Kern, damit die statische Startseite sie
 * ohne React nutzen kann.
 * Abhängigkeiten: app/offlineKern.ts, React.
 */
import { useSyncExternalStore } from "react";
import { abonniereOffline, offlineStand, type OfflineStand } from "./offlineKern";

export { aktualisiereJetzt, starteOffline, sucheUpdate, type OfflineStand } from "./offlineKern";

/** Abonniert den Offline-Stand in einer Komponente. */
export function useOfflineStand(): OfflineStand {
  return useSyncExternalStore(abonniereOffline, offlineStand);
}
