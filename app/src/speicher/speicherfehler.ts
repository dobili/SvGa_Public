/**
 * Fehler beim Schreiben des Speichers in Worte fassen: Art (voll oder sonst) und Meldung.
 *
 * Rolle im Gesamtbild: Hilfen von speicher/speicher.ts, ausgelagert, damit der Speicher unter 400
 * Zeilen bleibt (18.11.2026). Reine Funktionen ohne Zustand.
 * Abhängigkeiten: keine.
 */

/**
 * Art eines Fehlers beim Schreiben: „voll“, wenn der Browser den Speicher des Geräts voll meldet
 * (QuotaExceededError), sonst „speichern“.
 * Beispiel: DOMException „QuotaExceededError“ → „voll“; TypeError → „speichern“.
 */
export function speicherfehlerArt(fehler: unknown): "speichern" | "voll" {
  return fehler instanceof Error && fehler.name === "QuotaExceededError" ? "voll" : "speichern";
}

/** Fehler als kurze Meldung für den Hinweis an den Leser („Name: Text“). */
export function alsMeldung(fehler: unknown): string {
  return fehler instanceof Error ? `${fehler.name}: ${fehler.message}` : String(fehler);
}
