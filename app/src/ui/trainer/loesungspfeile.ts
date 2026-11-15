/**
 * Die Lösung einer Taktikaufgabe als Pfeile statt Notation (Schach-Abenteuer, Spieltest
 * „einstieg“, R4, 15.11.2026).
 *
 * Rolle im Gesamtbild: ui/trainer/Taktikaufgabe.tsx zeigt nach „Ich komme nicht drauf“ im Spiel
 * diese Pfeile auf der aktuellen Stellung; die Buch-App zeigt weiter „Lösung: Sf5+ Ke4 Sxh4“.
 * Warum: Ein elfjähriges Kind liest keine Notation; Pfeile versteht es auf einen Blick.
 * Abhängigkeiten: analyse/werkzeug.ts (Markierung), schach/weiterspielen.ts,
 * training/uebungsaufgabe.ts.
 */
import type { Markierung } from "../../analyse/werkzeug";
import { zugFelder } from "../../schach/weiterspielen";
import { stellungNach } from "../../training/uebungsaufgabe";

/**
 * Die restlichen Züge der Lösung als Pfeile: eigene Züge grün, die Antworten des Gegners grau.
 * Eingaben: Startstellung der Aufgabe, Lösungslinie (SAN), wie viele Halbzüge schon gespielt sind.
 * Ausgabe: Pfeile in der Reihenfolge der Linie; ein unlesbarer Zug beendet die Liste.
 * Beispiel: Springergabel, Linie Sf5+ Ke4 Sxh4, nichts gespielt → grün d4–f5, grau e3–e4,
 * grün f5–h4.
 */
export function loesungspfeile(
  startFen: string,
  linie: readonly string[],
  gespielt: number,
): Markierung[] {
  const pfeile: Markierung[] = [];
  for (let i = gespielt; i < linie.length; i++) {
    const san = linie[i];
    const felder = san ? zugFelder(stellungNach(startFen, linie.slice(0, i)), san) : null;
    if (!felder) break;
    const eigener = (i - gespielt) % 2 === 0;
    pfeile.push({ typ: "pfeil", farbe: eigener ? "gruen" : "grau", ...felder });
  }
  return pfeile;
}
