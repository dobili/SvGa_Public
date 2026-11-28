/**
 * Neuaufbau derselben Karte: Der Held bleibt auf dem Feld, auf dem er gerade steht.
 *
 * Warum (Befund des Autors, 28.11.2026): Nach dem ersten Gespräch mit Juno stand der Held wieder
 * vor der Haustür. Das Gespräch setzte `junoGetroffen`; damit schlug die Bedingung einer Figur des
 * Orts um (Juno im Clubraum), und die Oberwelt baute die Karte neu auf (useDialogende.ts,
 * kern.stelleNeuAuf). Der Neuaufbau setzt den Helden auf die Position des Spielstands, und die
 * stand noch auf dem Feld, auf dem er die Karte betreten hatte: Die Szene führt die Position beim
 * Laufen selbst, in den Spielstand kommt sie nur beim Verlassen, vor Partien und bei `#gehe`.
 * Deshalb nimmt jeder Neuaufbau zuerst das Feld aus der Szene in den Stand.
 * Abhängigkeiten: schnittstelle/spielstand.ts (Typen).
 */
import type { Abenteuerstand, Weltposition } from "../schnittstelle/spielstand";

/**
 * Der Stand, mit dem eine Karte neu aufgebaut wird.
 * Eingaben: der zuletzt geschriebene Stand und die Position aus der laufenden Szene (null, wenn
 * keine Szene läuft, etwa vor dem ersten Aufbau).
 * Ausgabe: der Stand mit dem Feld aus der Szene; ohne Szene oder auf einer anderen Karte (die
 * Szene gehört dann nicht mehr zum Stand) unverändert, als dasselbe Objekt, wenn sich nichts ändert.
 * Beispiel: Stand auf mapleFalls.aussen 23,19 (Haustür), Szene 53,24 (bei Juno) → Stand 53,24.
 */
export function standFuerNeuaufbau(
  stand: Abenteuerstand,
  szene: Weltposition | null,
): Abenteuerstand {
  if (!szene || szene.karte !== stand.position.karte) return stand;
  const alt = stand.position;
  if (alt.x === szene.x && alt.y === szene.y && alt.richtung === szene.richtung) return stand;
  return { ...stand, position: szene };
}
