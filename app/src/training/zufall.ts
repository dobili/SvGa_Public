/**
 * Zufall für die Trainer: mischen und auswählen, in Tests wiederholbar.
 *
 * Rolle im Gesamtbild: Jeder Trainer stellt Aufgaben in zufälliger Folge (Konzept 9.2 „naechste“).
 * Die Funktionen bekommen die Zufallsquelle als Eingabe; die App nimmt Math.random, die Tests eine
 * feste Saat, damit jedes Ergebnis nachprüfbar ist.
 * Abhängigkeiten: keine.
 */

/** Eine Zufallsquelle: liefert Zahlen in [0, 1). */
export type Zufall = () => number;

/** Die Zufallsquelle der App. */
export const ZUFALL: Zufall = Math.random;

/** Faktor und Verschiebungen des Verfahrens „mulberry32“ (bekannte, gut verteilte Konstanten). */
const MULBERRY_SCHRITT = 0x6d2b79f5;
const MULBERRY_VERSCHIEBUNGEN = [15, 7, 14] as const;
const MULBERRY_ODER = 61;
const ZWEI_HOCH_32 = 4294967296;

/**
 * Eine wiederholbare Zufallsquelle für Tests.
 *
 * Beispiel: festerZufall(1) liefert bei jedem Lauf dieselbe Folge.
 */
export function festerZufall(saat: number): Zufall {
  let zustand = saat >>> 0;
  const [a, b, c] = MULBERRY_VERSCHIEBUNGEN;
  return () => {
    zustand = (zustand + MULBERRY_SCHRITT) >>> 0;
    let z = zustand;
    z = Math.imul(z ^ (z >>> a), z | 1);
    z ^= z + Math.imul(z ^ (z >>> b), z | MULBERRY_ODER);
    return ((z ^ (z >>> c)) >>> 0) / ZWEI_HOCH_32;
  };
}

/** Eine ganze Zahl in [0, grenze). */
export function zahlBis(grenze: number, zufall: Zufall): number {
  return Math.min(Math.floor(zufall() * grenze), grenze - 1);
}

/** Eine gemischte Kopie der Liste (Fisher-Yates). */
export function mische<T>(liste: readonly T[], zufall: Zufall): T[] {
  const kopie = [...liste];
  for (let i = kopie.length - 1; i > 0; i -= 1) {
    const j = zahlBis(i + 1, zufall);
    const tmp = kopie[i] as T;
    kopie[i] = kopie[j] as T;
    kopie[j] = tmp;
  }
  return kopie;
}

/** Ein zufälliges Element, bei leerer Liste undefined. */
export function waehle<T>(liste: readonly T[], zufall: Zufall): T | undefined {
  return liste.length === 0 ? undefined : liste[zahlBis(liste.length, zufall)];
}
