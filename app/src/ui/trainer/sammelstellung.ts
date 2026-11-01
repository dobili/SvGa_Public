/**
 * Die Stellung der laufenden Trainer-Aufgabe, für „In die Lernsammlung“ im Rundenrahmen.
 *
 * Rolle im Gesamtbild: Nach jeder beantworteten Aufgabe lässt sich ihre Stellung in die
 * Lernsammlung legen (AP 15). Der Rundenrahmen kennt die Aufgaben nicht; jede Aufgabe meldet
 * ihre Stellung über diesen Kontext. Außerhalb einer Runde (Fehlerdatenbank, Lernsammlung)
 * fehlt der Kontext, und die Meldung bewirkt nichts. Seit Stufe 4 des Variationsbrowsers meldet
 * eine Aufgabe auf Wunsch auch ihre Lösungslinie; nach der Antwort öffnet „Als Variante öffnen“
 * dann Stellung und Lösung (vorher bliebe die Lösung nicht verborgen).
 * Abhängigkeiten: React.
 */
import { createContext, useContext, useEffect } from "react";

/** Die Lösung einer Aufgabe: Startstellung und Züge (englische Kurznotation). */
export interface Loesungslinie {
  readonly fen: string;
  readonly zuege: readonly string[];
}

/** Nimmt Stellung und Lösung der Aufgabe entgegen; null außerhalb einer Runde. */
export const SammelstellungKontext = createContext<
  ((fen: string, linie: Loesungslinie | null) => void) | null
>(null);

/**
 * Meldet die Stellung der Aufgabe an den Rundenrahmen.
 * Beispiel: Taktikaufgabe meldet die Ausgangsstellung, damit die Sammlung die Aufgabe zeigt,
 * nicht die gelöste Stellung, und ihre Lösung (für „Als Variante öffnen“ nach der Antwort).
 */
export function useSammelstellung(fen: string, linie: Loesungslinie | null = null): void {
  const melde = useContext(SammelstellungKontext);
  const startFen = linie?.fen ?? "";
  const zuege = linie?.zuege.join(" ") ?? "";
  useEffect(
    () => melde?.(fen, zuege ? { fen: startFen, zuege: zuege.split(" ") } : null),
    [melde, fen, startFen, zuege],
  );
}
