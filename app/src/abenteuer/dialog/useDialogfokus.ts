/**
 * Fokus im Dialogfenster für Tastatur und Vorleser (Prüfung „zugang“, 15.11.2026).
 *
 * Warum: Öffnete sich ein Gespräch, blieb der Fokus auf dem Aktionsknopf unter dem Fenster; kam
 * die Auswahl, verschwand „Weiter“ samt Fokus, und Tab begann wieder oben auf der Seite. Wer mit
 * Tastatur, Schaltersteuerung oder Vorleser spielt, musste das Fenster jedes Mal suchen.
 * Jetzt: Bei jedem neuen Schritt und am Ende einer Pause kommt der Fokus auf den ersten
 * bedienbaren Knopf des Fensters („Weiter“ oder die erste Wahl). Ausnahme: Ein Eingabefeld oder
 * ein Fenster darüber (Tagebuch) behält ihn.
 * Abhängigkeiten: React. Benutzt von dialog/Dialog.tsx.
 */
import { useEffect, type RefObject } from "react";

/** Elemente, deren Fokus der Dialog nicht stiehlt: Eingabefelder. */
const FOKUS_BEHALTEN = "input, textarea, select";

/** Darf der Dialog den Fokus nehmen? Nicht, wenn er schon drin ist oder ein Feld ihn hat. */
function darfFokussieren(fenster: HTMLElement): boolean {
  const aktiv = document.activeElement;
  if (!aktiv || aktiv === document.body) return true;
  if (fenster.contains(aktiv)) return aktiv.matches(":disabled");
  if (aktiv.matches(FOKUS_BEHALTEN)) return false;
  // Ein anderes Fenster (Tagebuch über dem Gespräch) behält den Fokus.
  return !aktiv.closest("[role='dialog']");
}

/**
 * Setzt den Fokus auf den ersten bedienbaren Knopf des Fensters, wenn sich Schritt, Zeile oder Pause ändern.
 * Eingaben: Ref auf das Fenster, der Schritt und die Zeile der Geschichte, ob „Weiter“ gesperrt ist.
 */
export function useDialogfokus(
  fenster: RefObject<HTMLElement | null>,
  schritt: unknown,
  zeile: unknown,
  wartet: boolean,
): void {
  useEffect(() => {
    const element = fenster.current;
    if (!element || !darfFokussieren(element)) return;
    element.querySelector<HTMLButtonElement>("button:not(:disabled)")?.focus();
  }, [fenster, schritt, zeile, wartet]);
}
