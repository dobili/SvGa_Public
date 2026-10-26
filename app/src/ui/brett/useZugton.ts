/**
 * Spielt beim Wechsel des letzten Zuges auf einem Brett den passenden Ton (app/ton.ts).
 *
 * Rolle im Gesamtbild: Einstellung „Ton“. Das Brett kennt den letzten Zug und die Figuren; ein
 * Zug, nach dem weniger Figuren auf dem Brett stehen, war ein Schlag. So klingt es überall gleich,
 * beim Ziehen, beim Nachspielen und in der Partie gegen die Engine, ohne dass jeder Bildschirm
 * selbst Töne auslöst. Das erste Zeichnen eines Brettes ist still.
 * Abhängigkeiten: app/ton.ts.
 */
import { useEffect, useRef } from "react";
import { spieleKlang, spieleZugton } from "../../app/ton";
import { tonartNach } from "../../spiel/zugton";

/**
 * Eingaben: Schlüssel des letzten Zuges („f3g5“, null ohne Zug), Zahl der Figuren auf dem Brett,
 * ob Töne an sind (Einstellung und bedienbares Brett), die Stellung nach dem Zug (für Schach,
 * Matt und Remis).
 * Beispiel: Abb. 1.26, Ziehen Sf3–g5: Schlüssel wechselt, 30 Figuren wie vorher → „zug“.
 * Sonderfall: Zurückblättern, bei dem wieder mehr Figuren stehen, klingt wie ein Zug.
 */
export function useZugton(
  zugschluessel: string | null,
  figurenzahl: number,
  an: boolean,
  fen = "",
): void {
  const vorher = useRef<{ zug: string | null; zahl: number } | null>(null);
  useEffect(() => {
    const alt = vorher.current;
    vorher.current = { zug: zugschluessel, zahl: figurenzahl };
    if (!an || !alt || zugschluessel === null || alt.zug === zugschluessel) return;
    const geschlagen = figurenzahl < alt.zahl;
    spieleZugton(geschlagen ? "schlag" : "zug");
    // Schach, Matt und Remis klingen nach dem Klacken (0.2.58).
    const art = tonartNach(fen, geschlagen);
    if (art === "schach" || art === "matt" || art === "remis") spieleKlang(art);
  }, [zugschluessel, figurenzahl, an, fen]);
}
