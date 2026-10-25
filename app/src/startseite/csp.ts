/**
 * Content Security Policy für die öffentlichen Seiten (T4, Nutzungsprüfung vom 25.10.2026).
 *
 * Rolle im Gesamtbild: Die Seiten laden nur eigene Dateien (keine fremden Server, keine Analyse).
 * Eine Content Security Policy schreibt das fest: Ein eingeschleustes fremdes Skript liefe nicht.
 * Sie gilt zunächst nur beobachtend („Report-Only“), damit eine falsche Regel die App nicht
 * lahmlegt; ein Oberflächentest (tests/e2e/csp.spec.ts) erzwingt sie probeweise. Die beiden
 * kleinen eingebetteten Skripte der Startseite und der App erlaubt die Regel über ihre Prüfsumme,
 * die vite.config.ts beim Bauen berechnet und mit dieser Regel in dist/_headers schreibt.
 * Abhängigkeiten: keine (reine Textfunktionen, testbar ohne Browser).
 */

/** Teile der Regel, die nicht vom Build abhängen. */
const FESTE_REGELN: readonly string[] = [
  "default-src 'self'",
  // React setzt Stile als Attribut, app/index.html hat einen kleinen Stilblock für den Start.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  // Die Engine (Stockfish) läuft als WebAssembly in einem Worker.
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
];

/**
 * Inhalte aller eingebetteten Skripte einer HTML-Seite (ohne src-Attribut).
 * Beispiel: '<script>a()</script><script src="/x.js"></script>' → ["a()"].
 */
export function eingebetteteSkripte(html: string): string[] {
  const muster = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g;
  return [...html.matchAll(muster)].map((treffer) => treffer[1] ?? "").filter((s) => s !== "");
}

/**
 * Die ganze Regel mit den Prüfsummen der eingebetteten Skripte.
 * Eingaben: Prüfsummen in Base64 (SHA-256), Reihenfolge egal, doppelte zählen einmal.
 * Beispiel: ["abc="] → "default-src 'self'; script-src 'self' 'wasm-unsafe-eval' 'sha256-abc='; …".
 */
export function sicherheitsregel(pruefsummen: readonly string[]): string {
  const skripte = [...new Set(pruefsummen)].sort().map((p) => `'sha256-${p}'`);
  const skriptRegel = ["script-src 'self' 'wasm-unsafe-eval'", ...skripte].join(" ");
  return [FESTE_REGELN[0], skriptRegel, ...FESTE_REGELN.slice(1)].join("; ");
}
