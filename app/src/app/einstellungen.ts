/**
 * Einstellungen des Lesers: Brettfarben, Figurensatz, Ton und Maia.
 *
 * Rolle im Gesamtbild: Pflichtenheft 4 „Einstellungen“. Teil der Nutzerdaten im Speicher
 * (speicher/speicher.ts, AP 12), damit sie mit der Datensicherung umziehen; Merker aus den ersten
 * Versionen der App werden beim ersten Laden übernommen (speicher/format.ts). Komponenten
 * abonnieren sie mit useEinstellungen und zeichnen sich bei einer Änderung neu. Die Auflage folgt,
 * sobald es die Inhalte dafür gibt.
 * Abhängigkeiten: speicher/speicher.ts, speicher/format.ts.
 */
import type { Einstellungen } from "../speicher/format";
import { aendere, useSpeicher } from "../speicher/speicher";

export type {
  Bildsatz,
  Brettfarben,
  Einstellungen,
  Figurensatz,
  Maiaschalter,
  Ton,
} from "../speicher/format";
export { BILDSAETZE } from "../speicher/format";

/** Ändert einzelne Einstellungen und speichert sie sofort (Fehler erscheinen als Hinweis). */
export function aendereEinstellungen(teil: Partial<Einstellungen>): void {
  void aendere((daten) => ({ ...daten, einstellungen: { ...daten.einstellungen, ...teil } }));
}

/** Abonniert die Einstellungen in einer Komponente. */
export function useEinstellungen(): Einstellungen {
  return useSpeicher((zustand) => zustand.daten.einstellungen);
}
