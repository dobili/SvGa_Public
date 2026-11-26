/**
 * Läuft gerade ein Kameraschwenk? (Wunsch des Autors, 26.11.2026, oberwelt/schwenk.ts) Ein kleiner
 * Speicher ohne Phaser, damit der Dialog ihn lesen kann: Solange die Kamera zum Ziel fährt, wartet
 * die Zeile (dialog/Dialog.tsx blendet sie aus), und ein Tippen lässt die Fahrt ans Ziel springen.
 * Gesetzt wird er von oberwelt/schwenkschicht.ts und oberwelt/useBuehne.ts.
 * Abhängigkeiten: React (useSyncExternalStore).
 */
import { useSyncExternalStore } from "react";

/** Läuft gerade eine Fahrt zu einem Ziel (die Zeile wartet)? Mit den Zuhörern des Dialogs. */
let faehrt = false;
let springe: (() => void) | null = null;
const zuhoerer = new Set<() => void>();

/** Setzt, ob eine Fahrt läuft, und wie man sie ans Ziel springen lässt. */
export function setzeFahrt(laeuft: boolean, sprung: (() => void) | null = null): void {
  springe = laeuft ? sprung : null;
  if (faehrt === laeuft) return;
  faehrt = laeuft;
  for (const z of zuhoerer) z();
}

/**
 * Für den Dialog: ob eine Fahrt läuft (dann wartet die Zeile) und das Springen ans Ziel.
 * Außerhalb der Oberwelt immer false.
 */
export function useSchwenkfahrt(): { readonly laeuft: boolean; readonly springe: () => void } {
  const laeuft = useSyncExternalStore(
    (z) => {
      zuhoerer.add(z);
      return () => zuhoerer.delete(z);
    },
    () => faehrt,
    () => false,
  );
  return { laeuft, springe: () => springe?.() };
}
