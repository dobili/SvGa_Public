/**
 * Wann der einmalige Hinweis auf Maia kommt (MaiaHinweis.tsx, Wunsch des Autors 26.10.2026).
 *
 * Rolle im Gesamtbild: Beim ersten Antippen eines vorgefertigten Bots erfährt der Leser, wozu
 * Maia gut ist und wo man sie einschaltet. Ein Merker auf dem Gerät hält fest, dass der Hinweis
 * kam; ist Maia schon an, kommt er gar nicht.
 * Abhängigkeiten: app/merker.ts.
 */
import { liesMerker, schreibeMerker } from "../../../app/merker";

export const MERKER_MAIA_HINWEIS = "maiaHinweis";
const GEZEIGT = "gezeigt";

/**
 * Soll der Hinweis kommen? Nur, wenn er noch nie kam und Maia nicht schon spielt.
 * Beispiel: erster Start, Maia nicht geladen → ja; Maia an → nein.
 */
export function sollMaiaHinweisKommen(merker: string | null, maiaAktiv: boolean): boolean {
  return merker !== GEZEIGT && !maiaAktiv;
}

/**
 * Beim Antippen eines Bots: true, wenn der Hinweis jetzt kommt; der Merker wird dann gleich
 * gesetzt, damit ein Neuladen ihn nicht wiederholt.
 */
export function maiaHinweisFaellig(maiaAktiv: boolean): boolean {
  if (!sollMaiaHinweisKommen(liesMerker(MERKER_MAIA_HINWEIS), maiaAktiv)) return false;
  schreibeMerker(MERKER_MAIA_HINWEIS, GEZEIGT);
  return true;
}
