/**
 * Weitere Sprungziele in der Adresse (Gamifizierung G5), etwa „#aufgabe-taktik-<id>“ für eine
 * geteilte Herausforderung (P9), als Liste zum Eintragen.
 *
 * Rolle im Gesamtbild: App.tsx kennt fest #lizenzen, #aufgaben, #abb-… und #trainer-…; was Pakete
 * oder spätere Werkzeuge an Sprüngen brauchen, tragen sie hier mit einer Zeile ein: ein Muster und
 * die Ansicht dazu. Der erste passende Eintrag gewinnt; der Bereich bestimmt, wohin „Zurück“ führt.
 * Abhängigkeiten: app/stapel.ts (Typen).
 */
import type { Ansicht, Bereich } from "./stapel";

/** Ein Sprungziel: Muster der Adresse und die Ansicht aus dem Treffer. */
export interface Sprung {
  readonly muster: RegExp;
  readonly bereich: Bereich;
  readonly ansicht: (treffer: RegExpExecArray) => Ansicht | null;
}

/** Alle zusätzlichen Sprünge; je Paket eine Zeile. */
export const SPRUENGE: readonly Sprung[] = [];

/** Ansicht und Bereich zu einem Sprungziel aus der Liste, oder null. */
export function zusatzsprung(
  hash: string,
  liste: readonly Sprung[] = SPRUENGE,
): { ansicht: Ansicht; bereich: Bereich } | null {
  for (const sprung of liste) {
    const treffer = sprung.muster.exec(hash);
    const ansicht = treffer ? sprung.ansicht(treffer) : null;
    if (ansicht) return { ansicht, bereich: sprung.bereich };
  }
  return null;
}
