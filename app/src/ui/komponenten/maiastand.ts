/**
 * Stand von Maia für die Oberfläche (0.2.143): Ist das Zusatzpaket geladen, und spielt Maia mit?
 *
 * Rolle im Gesamtbild: Spielen.tsx merkt sich beim Beginn einer Partie, ob der Bot mit Maia wählt
 * (Partieeinstellung „maia“); die Einstellungen (MaiaWahl.tsx) zeigen Laden, Schalter und Löschen.
 * Seit 0.2.143 stellt die Hülle (app/App.tsx, useAnzeigesatz) damit auch den Zahlensatz der
 * Anzeige ein (engine/zahlensatz.ts): Mit Maia zeigen Gegnerwahl und Startstärke die Zahlen mit Maia.
 * Abhängigkeiten: app/maiapaket.ts, app/einstellungen.ts, engine/zahlensatz.ts.
 */
import { useSyncExternalStore } from "react";
import { useEinstellungen } from "../../app/einstellungen";
import { beiMaiaAenderung, maiaBereitJetzt } from "../../app/maiapaket";
import { setzeAnzeigesatz } from "../../engine/zahlensatz";

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

/**
 * Stellt beim Zeichnen den Zahlensatz der Anzeige ein (vor allen Bildschirmen, die ihn lesen).
 * Gibt zurück, ob Maia mitspielt, damit die Hülle bei einem Wechsel neu zeichnet.
 */
export function useAnzeigesatz(): boolean {
  const aktiv = useMaiaAktiv();
  setzeAnzeigesatz(aktiv);
  return aktiv;
}
