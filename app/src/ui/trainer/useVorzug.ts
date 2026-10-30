/**
 * Spielt bei Zusatzaufgaben den Zug des Gegners vor, bevor der Leser zieht.
 *
 * Rolle im Gesamtbild: Lichess-Aufgaben beginnen mit dem Zug des Gegners, der die Taktik erst
 * möglich macht (Paket 8, Zusatzaufgaben). Wie auf Lichess sieht der Leser kurz die Stellung
 * davor; dann gleitet der Gegnerzug über das Brett (Zuganimation des Brettes, R37) und erst
 * danach darf er ziehen. So sieht er, was der Gegner gerade getan hat.
 * Abhängigkeiten: React.
 */
import { useEffect, useState } from "react";

/** So lange steht die Stellung vor dem Gegnerzug (ms): Zeit, sie zu erfassen. */
export const VORZUG_PAUSE_MS = 700;

/**
 * True, sobald der Gegnerzug gespielt ist; ohne Gegnerzug (Buchaufgaben) sofort true.
 * Eingabe: ob die Aufgabe einen Gegnerzug mitbringt.
 */
export function useVorzug(mitVorzug: boolean): boolean {
  const [gespielt, setzeGespielt] = useState(!mitVorzug);
  useEffect(() => {
    if (!mitVorzug) return undefined;
    const uhr = window.setTimeout(() => setzeGespielt(true), VORZUG_PAUSE_MS);
    return () => window.clearTimeout(uhr);
  }, [mitVorzug]);
  return gespielt || !mitVorzug;
}
