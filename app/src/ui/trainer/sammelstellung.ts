/**
 * Die Stellung der laufenden Trainer-Aufgabe, für „In die Lernsammlung“ im Rundenrahmen.
 *
 * Rolle im Gesamtbild: Seit 0.2.92 lässt sich nach jeder beantworteten Aufgabe ihre Stellung in
 * die Lernsammlung legen (AP 15). Der Rundenrahmen kennt die Aufgaben nicht; jede Aufgabe meldet
 * ihre Stellung über diesen Kontext. Außerhalb einer Runde (Fehlerdatenbank, Lernsammlung)
 * fehlt der Kontext, und die Meldung bewirkt nichts.
 * Abhängigkeiten: React.
 */
import { createContext, useContext, useEffect } from "react";

/** Nimmt die Stellung der Aufgabe entgegen; null außerhalb einer Runde. */
export const SammelstellungKontext = createContext<((fen: string) => void) | null>(null);

/**
 * Meldet die Stellung der Aufgabe an den Rundenrahmen.
 * Beispiel: Taktikaufgabe meldet die Ausgangsstellung, damit die Sammlung die Aufgabe zeigt,
 * nicht die gelöste Stellung.
 */
export function useSammelstellung(fen: string): void {
  const melde = useContext(SammelstellungKontext);
  useEffect(() => melde?.(fen), [melde, fen]);
}
