/**
 * „Eröffnung fremd“ (Regelwerk R13c): Aus mehreren Eröffnungen einer Begegnung die wählen, die der
 * Leser in seinen Partien am seltensten hatte (Wunsch des Autors, 17.11.2026: „aus dem
 * Eröffnungsprofil der App, wenn vorhanden“).
 *
 * Rolle im Gesamtbild: Reine Regel. Die Anbindung (anbindung/vorratsstellung.ts) gibt die
 * Zugfolgen der Partien des Lesers aus der Partienliste der App mit; ein eigenes Eröffnungsprofil
 * gibt es in der App nicht, die Liste genügt dafür.
 * Abhängigkeiten: keine.
 * Beispiel: Kandidaten Caro-Kann (1. e4 c6) und Englisch (1. c4); der Leser spielte zwölfmal 1. e4
 * c6 und nie 1. c4 → Englisch.
 */

/** So viele Halbzüge vom Anfang zählen als „dieselbe Eröffnung“. */
export const VERGLEICHSHALBZUEGE = 2;

/**
 * Wie oft der Leser eine Eröffnung hatte: Partien, die mit denselben ersten Halbzügen beginnen.
 * Beispiel: ["e4", "c6", …] gegen Partien [["e4", "c6", "d4"], ["d4", "d5"]] → 1.
 */
export function haeufigkeit(
  eroeffnung: readonly string[],
  partien: readonly (readonly string[])[],
): number {
  const anfang = eroeffnung.slice(0, VERGLEICHSHALBZUEGE);
  return partien.filter((p) => anfang.every((san, i) => p[i] === san)).length;
}

/**
 * Die seltenste Eröffnung; bei Gleichstand entscheidet der Zufall unter den seltensten.
 * Eingaben: Kandidaten (Zugfolgen ab der Grundstellung), Zugfolgen der Partien des Lesers, Zufall.
 * Ausgabe: eine der Zugfolgen. Sonderfall: ohne Kandidaten eine leere Folge.
 */
export function seltensteEroeffnung(
  kandidaten: readonly (readonly string[])[],
  partien: readonly (readonly string[])[],
  zufall: () => number,
): readonly string[] {
  const zaehlung = kandidaten.map((k) => haeufigkeit(k, partien));
  const wenigste = Math.min(...zaehlung);
  const seltene = kandidaten.filter((_, i) => zaehlung[i] === wenigste);
  return seltene[Math.floor(zufall() * seltene.length)] ?? kandidaten[0] ?? [];
}
