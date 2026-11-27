/**
 * Erinnerung nach einer Pause (regeln/wiedereinstieg.ts): Beim ersten Laden der Welt in dieser
 * Sitzung prüft die Oberwelt, wann zuletzt gespielt wurde. War es mehr als ein Tag, erscheint,
 * sobald die Welt frei ist, einmal eine Meldung mit Aufgabe und nächstem Schritt aus dem Tagebuch.
 *
 * Warum: Das Spiel wird über viele Tage gespielt; nach zwei Tagen weiß man nicht mehr, was der
 * Held gerade vorhatte (Durchgang „Wiedereinstieg“, 20.11.2026).
 * Rolle im Gesamtbild: Teil von oberwelt/Orientierung.tsx. „Einmal je Sitzung“ heißt einmal je
 * Laden der Seite und Spielstand: Der Merker liegt im Modul, nicht im Spielstand, und nennt den
 * Platz (Beginn des Stands). Lädt der Leser im Hauptmenü einen anderen Spielstand (27.11.2026),
 * prüft die Oberwelt für ihn neu: Gerade ein lange ruhender Stand braucht die Erinnerung.
 * Abhängigkeiten: kern.ts, regeln/wiedereinstieg.ts, texte/texte.ts.
 */
import { useEffect } from "react";
import { erinnerungNachPause } from "../regeln/wiedereinstieg";
import { tSpiel } from "../texte/texte";
import type { Oberweltkern } from "./kern";

/** Der Spielstand (Beginn), für den die Prüfung in dieser Sitzung schon lief; null: noch keiner. */
let geprueftFuer: string | null = null;

/** Nur für Tests: die Sitzung neu beginnen. */
export function neueSitzungFuerTests(): void {
  geprueftFuer = null;
}

/**
 * Ist die Prüfung für diesen Spielstand in dieser Sitzung noch offen? Merkt ihn dann als geprüft.
 * Beispiel: Stand Kim → true, noch einmal Kim → false, danach Stand Alex (Hauptmenü) → true.
 */
export function pruefungFaellig(stand: { readonly begonnen: string }): boolean {
  if (geprueftFuer === stand.begonnen) return false;
  geprueftFuer = stand.begonnen;
  return true;
}

/**
 * Zeigt die Erinnerung einmal je Sitzung, wenn die Pause lang genug war.
 * Eingaben: Kern der Oberwelt, ob die Welt frei ist (kein Fenster, keine Meldung).
 * Beispiel: zwei Tage Pause, „Ein Abend im neuen Haus“ läuft → Meldung „Willkommen zurück! Ein
 * Abend im neuen Haus: Schlafen gehen …“.
 * Sonderfall: Ohne Pause oder ohne laufende Aufgabe gilt die Sitzung trotzdem als geprüft; ein
 * späterer Kartenwechsel fragt nicht noch einmal. Ein anderer Spielstand (Hauptmenü) wird neu
 * geprüft.
 */
export function useWiedereinstieg(k: Oberweltkern, frei: boolean): void {
  const { stand, welt } = k;
  useEffect(() => {
    if (!stand || !welt || !frei || !pruefungFaellig(stand)) return;
    const zeile = erinnerungNachPause(stand, welt.daten.quests, new Date());
    if (!zeile) return;
    k.setzeMeldung(
      tSpiel("wiedereinstieg.meldung", {
        titel: tSpiel(zeile.titel),
        schritt: tSpiel(zeile.schritt),
      }),
    );
    // Kern bleibt gleich; es zählen Stand, Welt und ob sie frei ist.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stand, welt, frei]);
}
