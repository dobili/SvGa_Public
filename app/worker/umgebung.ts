/**
 * Umgebung des Workers: Bindungen, Secrets und die kleinen Typen von Cloudflare, die er braucht.
 *
 * Rolle im Gesamtbild: Seit R57 (Admin-Dashboard, Wunsch des Autors 24.10.2026) hat die Website
 * einen kleinen Worker vor den statischen Dateien (wrangler.jsonc). Er nimmt Meldungen aus App
 * und Website an, speichert die Prüfberichte aus GitHub Actions und liefert das Dashboard unter
 * /admin/ aus. Die Typen stehen hier von Hand statt aus @cloudflare/workers-types, weil jenes
 * Paket die DOM-Typen der App überdecken würde; der Worker nutzt nur diesen kleinen Teil.
 * Abhängigkeiten: keine.
 */

/** Ergebnis einer Abfrage mit mehreren Zeilen (D1). */
export interface D1Ergebnis<T> {
  results: T[];
}

/** Eine vorbereitete Abfrage (D1), wie sie Cloudflare und der Testersatz anbieten. */
export interface D1Abfrage {
  bind(...werte: (string | number | null)[]): D1Abfrage;
  all<T = Record<string, unknown>>(): Promise<D1Ergebnis<T>>;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  run(): Promise<unknown>;
}

/** Die Datenbank `svga-admin` (Cloudflare D1, SQLite). */
export interface D1Datenbank {
  prepare(sql: string): D1Abfrage;
  batch(abfragen: D1Abfrage[]): Promise<unknown[]>;
}

/** Die statischen Dateien der Website (Bindung ASSETS). */
export interface Dateien {
  fetch(anfrage: Request): Promise<Response>;
}

/** Hält den Worker am Leben, bis eine Nebenaufgabe (etwa eine Mail) fertig ist. */
export interface Ausfuehrung {
  waitUntil(versprechen: Promise<unknown>): void;
}

/**
 * Alles, was Cloudflare dem Worker mitgibt.
 * Pflicht: ASSETS und ADMIN_DB (wrangler.jsonc). Alles andere ist optional; fehlt es, schaltet
 * der Worker den Teil ab statt zu scheitern:
 * - ACCESS_TEAM und ACCESS_AUD (Variablen in wrangler.jsonc, kein Geheimnis): ohne sie bleibt
 *   das Dashboard gesperrt.
 * - BERICHT_SCHLUESSEL (Secret): ohne ihn nimmt /api/bericht nichts an.
 * - TURNSTILE_SECRET (Secret): mit ihm verlangt /api/melden einen gültigen Turnstile-Nachweis.
 * - RESEND_KEY, MAIL_AN, MAIL_VON (Secrets): mit ihnen gehen Mails an den Autor.
 */
export interface Umgebung {
  ASSETS: Dateien;
  ADMIN_DB: D1Datenbank;
  ACCESS_TEAM?: string;
  ACCESS_AUD?: string;
  BERICHT_SCHLUESSEL?: string;
  TURNSTILE_SECRET?: string;
  RESEND_KEY?: string;
  MAIL_AN?: string;
  MAIL_VON?: string;
}

/** Antwort als JSON mit Statuscode; nie zwischenspeichern. */
export function jsonAntwort(daten: unknown, status = 200): Response {
  return new Response(JSON.stringify(daten), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

/** Fehlerantwort mit kurzem Grund (für die Konsole des Formulars, nicht für Leser). */
export function fehler(status: number, grund: string): Response {
  return jsonAntwort({ ok: false, grund }, status);
}
