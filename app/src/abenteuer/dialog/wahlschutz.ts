/**
 * Schutzzeit der Wahlen: Erscheinen Antworten neu, nehmen sie für einen Augenblick keinen Tipp an.
 *
 * Warum: Der eilige Spieler des Durchlaufs (tests/durchlauf/eilig.ts, 20.11.2026) tippte
 * „Weiter“ zweimal schnell hintereinander. Der erste Tipp brachte die Wahlen, der zweite traf die
 * Antwort, die jetzt an derselben Stelle lag: Bei Jo im Park begann so ungelesen „Erst noch eine
 * Partie.“. Ein Doppeltipp dauert unter einer Viertelsekunde; wer eine Antwort liest, braucht
 * länger als die Schutzzeit. Dasselbe gilt für die Tastatur (zweimal Eingabe).
 * Rolle im Gesamtbild: Hook für dialog/Dialog.tsx (die Wahlen sind so lange gesperrt,
 * wie „Weiter“ bei einer Pause).
 * Abhängigkeiten: keine.
 * Beispiel: Wahlen erscheinen um 1000 ms → bis 1300 ms gesperrt, ab dann frei.
 * Getestet im Browser (tests/e2e/abenteuer-doppeltipp.spec.ts); eine reine Logik gibt es nicht.
 */
import { useEffect, useState } from "react";

/** So lange nehmen neu erschienene Wahlen keinen Tipp an (ms): länger als ein Doppeltipp. */
export const WAHLSCHUTZ_MS = 300;

/**
 * Gesperrt, solange die Wahlen dieses Schritts noch keine WAHLSCHUTZ_MS lang tippbar sind.
 * Eingaben: der Schritt (jede neue Wahl beginnt die Schutzzeit neu) und ob eine Pause die Wahlen
 * schon sperrt (dann beginnt die Schutzzeit erst mit dem Ende der Pause).
 * Sonderfall: Ohne Wahlen ist nichts gesperrt.
 */
export function useWahlschutz(schritt: object, istWahl: boolean, pause: boolean): boolean {
  const aktiv = istWahl && !pause;
  // Der Schritt, dessen Schutzzeit abgelaufen ist. Ein neuer Schritt ist es nie: So sind neue
  // Wahlen schon beim ersten Zeichnen gesperrt, nicht erst nach dem Effekt.
  const [frei, setzeFrei] = useState<object | null>(null);
  useEffect(() => {
    if (!aktiv) return;
    const uhr = window.setTimeout(() => setzeFrei(schritt), WAHLSCHUTZ_MS);
    return () => window.clearTimeout(uhr);
  }, [schritt, aktiv]);
  return aktiv && frei !== schritt;
}
