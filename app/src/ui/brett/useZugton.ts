/**
 * Spielt beim Wechsel des letzten Zuges auf einem Brett den passenden Ton (app/ton.ts).
 *
 * Rolle im Gesamtbild: Einstellung „Ton“ (seit 0.2.33). Das Brett kennt den letzten Zug und die
 * Figuren; ein Zug, nach dem weniger Figuren auf dem Brett stehen, war ein Schlag. So klingt es
 * überall gleich, beim Ziehen, beim Nachspielen und in der Partie gegen die Engine, ohne dass jeder
 * Bildschirm selbst Töne auslöst. Das erste Zeichnen eines Brettes ist still.
 * Abhängigkeiten: app/ton.ts.
 */
import { useEffect, useRef } from "react";
import { spieleZugton } from "../../app/ton";

/**
 * Eingaben: Schlüssel des letzten Zuges („f3g5“, null ohne Zug), Zahl der Figuren auf dem Brett,
 * ob Töne an sind (Einstellung und bedienbares Brett).
 * Beispiel: Abb. 1.26, Ziehen Sf3–g5: Schlüssel wechselt, 30 Figuren wie vorher → „zug“.
 * Sonderfall: Zurückblättern, bei dem wieder mehr Figuren stehen, klingt wie ein Zug.
 */
export function useZugton(zugschluessel: string | null, figurenzahl: number, an: boolean): void {
  const vorher = useRef<{ zug: string | null; zahl: number } | null>(null);
  useEffect(() => {
    const alt = vorher.current;
    vorher.current = { zug: zugschluessel, zahl: figurenzahl };
    if (!an || !alt || zugschluessel === null || alt.zug === zugschluessel) return;
    spieleZugton(figurenzahl < alt.zahl ? "schlag" : "zug");
  }, [zugschluessel, figurenzahl, an]);
}
