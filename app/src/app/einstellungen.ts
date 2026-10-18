/**
 * Einstellungen des Lesers: Brettfarben, Figurensatz, Ton und Strenge des Modus „Erst selbst
 * denken“.
 *
 * Rolle im Gesamtbild: Pflichtenheft 4 „Einstellungen“. Seit AP 12 Teil der Nutzerdaten im
 * Speicher (speicher/speicher.ts), damit sie mit der Datensicherung umziehen; bis 0.2.20 lagen
 * sie als Merker auf dem Gerät und werden beim ersten Laden übernommen. Komponenten abonnieren
 * sie mit useEinstellungen und zeichnen sich bei einer Änderung neu. Sprache und Auflage folgen,
 * sobald es die Inhalte dafür gibt; Figurensatz und Ton gibt es seit 0.2.33.
 * Abhängigkeiten: speicher/speicher.ts, speicher/format.ts.
 */
import type { Einstellungen } from "../speicher/format";
import { aendere, useSpeicher } from "../speicher/speicher";

export type { Bildsatz, Brettfarben, Einstellungen, Figurensatz, Strenge, Ton } from "../speicher/format";
export { BILDSAETZE } from "../speicher/format";

/** Ändert einzelne Einstellungen und speichert sie sofort (Fehler erscheinen als Hinweis). */
export function aendereEinstellungen(teil: Partial<Einstellungen>): void {
  void aendere((daten) => ({ ...daten, einstellungen: { ...daten.einstellungen, ...teil } }));
}

/** Abonniert die Einstellungen in einer Komponente. */
export function useEinstellungen(): Einstellungen {
  return useSpeicher((zustand) => zustand.daten.einstellungen);
}
