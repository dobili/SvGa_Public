/**
 * Tab bleibt in einem Dialog der Tour (Tourkarte, Hinweis beim ersten Start).
 *
 * Rolle im Gesamtbild: Ein modaler Dialog hält den Fokus bei sich (WCAG 2.4.3); sonst landete Tab
 * hinter der Sperre bei Knöpfen, die gerade nicht bedienbar sind.
 * Abhängigkeiten: React (Typ des Tastenereignisses).
 */
import type { KeyboardEvent } from "react";

/** Tab bleibt in der Karte: vom letzten Knopf zum ersten und umgekehrt. */
export function haltFokus(ereignis: KeyboardEvent<HTMLDivElement>): void {
  const knoepfe = [
    ...ereignis.currentTarget.querySelectorAll<HTMLElement>("button:not(:disabled)"),
  ];
  const erster = knoepfe[0];
  const letzter = knoepfe[knoepfe.length - 1];
  if (!erster || !letzter) return;
  const aktiv = document.activeElement;
  if (ereignis.shiftKey && (aktiv === erster || aktiv === ereignis.currentTarget)) {
    ereignis.preventDefault();
    letzter.focus();
  } else if (!ereignis.shiftKey && aktiv === letzter) {
    ereignis.preventDefault();
    erster.focus();
  }
}
