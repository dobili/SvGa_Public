/**
 * Merker „Die Seite wird gerade verlassen“ (Neuladen, Wegnavigieren, Schließen).
 *
 * Warum: Beim Neuladen bricht der Browser laufende Abrufe ab. WebKit meldet das als
 * „TypeError: Load failed“, und Bildschirme protokollierten es als echten Ladefehler, obwohl die
 * Seite schon ging (CI-Wackler „Partie: neu laden“, 18.11.2026). Wer lädt, fragt hier nach und
 * beendet das Laden dann still. Kommt die Seite aus dem Zwischenspeicher des Browsers zurück
 * (pageshow mit persisted), gilt sie wieder als aktiv.
 * Abhängigkeiten: keine.
 */

let verlassen = false;
let angemeldet = false;

/** Meldet die Ereignisse einmal an; ohne window (Node-Tests) passiert nichts. */
export function beobachteSeitenende(): void {
  if (angemeldet || typeof window === "undefined") return;
  angemeldet = true;
  const gehen = () => {
    verlassen = true;
  };
  window.addEventListener("beforeunload", gehen);
  window.addEventListener("pagehide", gehen);
  window.addEventListener("pageshow", (ereignis) => {
    if (ereignis.persisted) verlassen = false;
  });
}

/**
 * Wird die Seite gerade verlassen? Dann ist ein abgebrochener Abruf kein Fehler.
 * Beispiel: Leser tippt „Neu laden“, der Abruf des Kapitels endet mit „Load failed“ → true.
 */
export function seiteWirdVerlassen(): boolean {
  beobachteSeitenende();
  return verlassen;
}
