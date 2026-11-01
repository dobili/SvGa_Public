/**
 * Wächter beim Wechsel des Bereichs (untere Leiste): Ein Bildschirm mit ungespeicherter Arbeit
 * kann vorher nachfragen.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (1.11.2026): Ob eine Variante gespeichert wird, entscheidet
 * der Leser per Abfrage. „Zurück“ und die Zurück-Taste fragen schon im Bildschirm selbst
 * (ui/komponenten/varianten/useSpeicherfrage.ts); ein Tipp auf die untere Leiste geht über den
 * NavigationsRahmen (navigation.tsx) und fragt hier: Ist ein Wächter angemeldet, entscheidet er,
 * ob und wann der Wechsel geschieht.
 * Abhängigkeiten: keine (React nur im Hook).
 */
import { useEffect, useRef } from "react";

/** Ein Wächter bekommt den Wechsel als Rückruf und führt ihn aus, wenn er will. */
type Waechter = (weiter: () => void) => void;

let aktuell: Waechter | null = null;

/**
 * Führt einen Wechsel aus oder übergibt ihn dem angemeldeten Wächter.
 * Beispiel: Variante mit ungespeichertem Zug, Tipp auf „Buch“ → Rückfrage „Variante speichern?“.
 */
export function bewacheWechsel(weiter: () => void): void {
  if (aktuell) aktuell(weiter);
  else weiter();
}

/** Meldet einen Wächter an, solange `aktiv` gilt (der jeweils neueste Rückruf zählt). */
export function useVerlassenswaechter(aktiv: boolean, waechter: Waechter): void {
  const neuester = useRef(waechter);
  useEffect(() => {
    neuester.current = waechter;
  });
  useEffect(() => {
    if (!aktiv) return;
    const eintrag: Waechter = (weiter) => neuester.current(weiter);
    aktuell = eintrag;
    return () => {
      if (aktuell === eintrag) aktuell = null;
    };
  }, [aktiv]);
}
