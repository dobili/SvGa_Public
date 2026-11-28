/**
 * Rivale Victor oder Rivalin Victoria, beim Spielbeginn ausgelost (Wunsch des Autors, 28.11.2026:
 * „Geschlecht des Rivalen zufällig“). Bis dahin wählte der Leser auf der Startkarte; jetzt bleibt
 * der Rivale eine Überraschung bis zur ersten Begegnung, und das Spielmenü verrät ihn nicht.
 * Beide Fassungen sind gleich wahrscheinlich.
 * Tests steuern die Fassung fest über einen Testschalter (wie TESTSCHALTER_OHNE_HAUPTMENUE in
 * spielsitzung.ts), nie über den Zufall; die Gesamtsimulation setzt die Dialogvariable selbst
 * (ABENTEUER_RIVALIN).
 * Abhängigkeiten: keine.
 */

/** Wahrscheinlichkeit der Rivalin: die Hälfte. */
const HAELFTE = 0.5;

/**
 * Testschalter für Oberflächentests: true heißt Rivalin Victoria, false Rivale Victor; ohne ihn
 * entscheidet der Zufall.
 */
export const TESTSCHALTER_RIVALIN = "__abenteuerRivalin";

/**
 * Lost aus, ob das neue Spiel die Rivalin hat.
 * Eingabe: eine Zufallsquelle mit Werten von 0 bis unter 1 (Vorgabe Math.random, in Tests fest).
 * Ausgabe: true für Victoria. Beispiel: zufallsrivalin(() => 0.2) → true, (() => 0.7) → false.
 * Sonderfall: Ist der Testschalter gesetzt (true oder false), gilt er.
 */
export function zufallsrivalin(zufall: () => number = Math.random): boolean {
  const schalter =
    typeof window === "undefined" ? undefined : Reflect.get(window, TESTSCHALTER_RIVALIN);
  if (typeof schalter === "boolean") return schalter;
  return zufall() < HAELFTE;
}
