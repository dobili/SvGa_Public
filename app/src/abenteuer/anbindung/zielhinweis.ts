/**
 * Merker „Zielhinweis an oder aus“ (Spieltest „einstieg“, 15.11.2026, R1). Vorgabe: an.
 *
 * Rolle im Gesamtbild: Der Schalter im Spielmenü (anbindung/Zielhinweiswahl.tsx) schreibt ihn, die
 * Oberwelt (oberwelt/useZielhinweis.ts) liest ihn. Eine Bequemlichkeit des Geräts, kein Spielstand.
 * Abhängigkeiten: app/merker.ts.
 */
import { useSyncExternalStore } from "react";
import { beobachteMerker, liesMerker, schreibeMerker } from "../../app/merker";

/** Merker auf dem Gerät: „aus“ schaltet den Zielhinweis ab, alles andere heißt an. */
export const MERKER_ZIELHINWEIS = "abenteuer.zielhinweis";
const AUS = "aus";
const AN = "an";

/** Ob der Zielhinweis an ist; ändert sich mit dem Merker (auch aus dem Spielmenü heraus). */
export function useZielhinweisAn(): boolean {
  return useSyncExternalStore(
    (melde) => beobachteMerker((name) => name === MERKER_ZIELHINWEIS && melde()),
    () => liesMerker(MERKER_ZIELHINWEIS) !== AUS,
  );
}

/** Schaltet den Zielhinweis an oder aus. */
export function schalteZielhinweis(an: boolean): void {
  schreibeMerker(MERKER_ZIELHINWEIS, an ? AN : AUS);
}
