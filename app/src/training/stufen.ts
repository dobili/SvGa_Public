/**
 * Stufen leicht, mittel, schwer für die Trainer an den Buchstellungen, die bisher keine hatten:
 * Zielbilanz, LAP, Denkroutine, Feld finden (Punkt B2 des Nebenchats, Wunsch des Autors).
 *
 * Rolle im Gesamtbild: Jede Stufe misst, was die Aufgabe schwer macht, nicht nur die Zahl der
 * Figuren. Entscheidungen des Nebenchats (31.10.2026, zur Durchsicht durch den Autor):
 * - Zielbilanz: Zahl der „teils“-Felder in der Lösung (0 leicht, 1–2 mittel, ab 3 schwer), denn
 *   „teils“ verlangt genaues Hinsehen (Schild gelockert, zwei von vier Leichtfiguren …).
 * - LAP: Abstand der Lösung zur nächsten Leichtfigur in freien Feldern (Lösung zu Hause oder ab 3
 *   Feldern Abstand leicht, 1–2 mittel, Gleichstand schwer: dann entscheidet der Wert der Figur).
 * - Denkroutine: Zahl der legalen Züge (bis 25 leicht, bis 40 mittel, darüber schwer): Je mehr
 *   Züge, desto mehr Kandidaten muss man aussortieren.
 * - Feld finden: leicht nur aus Sicht von Weiß, mittel erst Weiß, dann Schwarz (wie bisher),
 *   schwer die Sicht wechselt zufällig (die Sichtanzeige leuchtet bei jedem Wechsel).
 * Abhängigkeiten: training/zufall.ts.
 */
import { mische, type Zufall } from "./zufall";

export type Trainerstufe = "leicht" | "mittel" | "schwer";
export const TRAINERSTUFEN: readonly Trainerstufe[] = ["leicht", "mittel", "schwer"];

/** Grenzen der Zielbilanz-Stufen (Zahl der „teils“). */
const ZIEL_LEICHT_BIS = 0;
const ZIEL_MITTEL_BIS = 2;
/** Grenzen der LAP-Stufen (Abstand in freien Feldern). */
const LAP_LEICHT_AB = 3;
const LAP_MITTEL_AB = 1;
/** Grenzen der Denkroutine-Stufen (legale Züge). */
const DENK_LEICHT_BIS = 25;
const DENK_MITTEL_BIS = 40;

/** Stufe der Zielbilanz nach der Zahl der „teils“. Beispiel: ja, teils, ja / ja, ja, ja → mittel. */
export function zielbilanzstufe(teils: number): Trainerstufe {
  if (teils <= ZIEL_LEICHT_BIS) return "leicht";
  return teils <= ZIEL_MITTEL_BIS ? "mittel" : "schwer";
}

/** Stufe der LAP-Aufgabe. Beispiel: Läufer c1 zu Hause → leicht; 2 gegen 3 Felder → mittel. */
export function lapstufe(zuHause: boolean, abstand: number): Trainerstufe {
  if (zuHause || abstand >= LAP_LEICHT_AB) return "leicht";
  return abstand >= LAP_MITTEL_AB ? "mittel" : "schwer";
}

/** Stufe der Denkroutine nach der Zahl der legalen Züge. */
export function denkstufe(zuege: number): Trainerstufe {
  if (zuege <= DENK_LEICHT_BIS) return "leicht";
  return zuege <= DENK_MITTEL_BIS ? "mittel" : "schwer";
}

/**
 * Eine Runde aus Aufgaben einer Stufe (oder gemischt, Stufe null); reicht die Stufe nicht,
 * füllen die nächstliegenden auf, damit die Runde nie leer bleibt.
 */
export function rundeNachStufe<T extends { readonly stufe: Trainerstufe }>(
  aufgaben: readonly T[],
  stufe: Trainerstufe | null,
  anzahl: number,
  zufall: Zufall,
): T[] {
  const gemischt = mische(aufgaben, zufall);
  if (stufe === null) return gemischt.slice(0, anzahl);
  const rang = (s: Trainerstufe) => Math.abs(TRAINERSTUFEN.indexOf(s) - TRAINERSTUFEN.indexOf(stufe));
  return [...gemischt].sort((a, b) => rang(a.stufe) - rang(b.stufe)).slice(0, anzahl);
}
