/**
 * Stand von Maia für die Oberfläche (0.2.141): Ist das Zusatzpaket geladen, und spielt Maia mit?
 *
 * Rolle im Gesamtbild: Spielen.tsx merkt sich beim Beginn einer Partie, ob der Bot mit Maia wählt
 * (Partieeinstellung „maia“); die Einstellungen (MaiaWahl.tsx) zeigen Laden, Schalter und Löschen.
 * Abhängigkeiten: app/maiapaket.ts, app/einstellungen.ts.
 */
import { useSyncExternalStore } from "react";
import { useEinstellungen } from "../../app/einstellungen";
import { beiMaiaAenderung, maiaBereitJetzt } from "../../app/maiapaket";

/** Ist das Paket vollständig auf dem Gerät? */
export function useMaiaBereit(): boolean {
  return useSyncExternalStore(beiMaiaAenderung, maiaBereitJetzt, () => false);
}

/** Spielt Maia mit (Paket geladen und Schalter an)? */
export function useMaiaAktiv(): boolean {
  const bereit = useMaiaBereit();
  const schalter = useEinstellungen().maia;
  return bereit && schalter === "an";
}
