/**
 * Name und Profil des Lesers für die Anzeige: der eigene Name, sonst „Du“.
 *
 * Rolle im Gesamtbild: Partieuhr, Partienliste, PGN und Profilseite fragen hier, wie der Leser
 * heißt, statt überall „Du“ einzusetzen (Wunsch des Autors, 25.10.2026).
 * Abhängigkeiten: speicher/profil.ts, speicher/speicher.ts, i18n.
 */
import { t } from "../../i18n/sprache";
import type { Spielerprofil } from "../../speicher/profil";
import { useSpeicher } from "../../speicher/speicher";

/** Das gespeicherte Profil des Lesers. */
export function useSpielerprofil(): Spielerprofil {
  return useSpeicher((z) => z.daten.profil);
}

/** Der Name zur Anzeige: der eigene, sonst „Du“. Beispiel: Name „Dana“ → „Dana“; leer → „Du“. */
export function spielername(profil: Spielerprofil): string {
  return profil.name || t("partie.du");
}
