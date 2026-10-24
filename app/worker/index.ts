/**
 * Worker der Website: statische Dateien plus Meldungen, Prüfberichte und Dashboard (R57).
 *
 * Rolle im Gesamtbild: Bis 0.2.123 lieferte Cloudflare nur die Dateien aus dist/ aus. Seit R57
 * laufen nur diese Pfade zuerst durch den Worker (run_worker_first in wrangler.jsonc), alles
 * andere bleibt unverändert und schnell:
 * - POST /api/melden: Meldungen aus App und Website (öffentlich, gedrosselt).
 * - POST /api/bericht: Prüfbericht aus GitHub Actions (gemeinsamer Schlüssel).
 * - /api/admin/*: Schnittstellen des Dashboards (nur mit Cloudflare Access).
 * - /admin/: die Seite des Dashboards (statische Datei, nur mit Cloudflare Access).
 * Zeitplan: montags eine Wochenübersicht per Mail, falls der Mailversand eingerichtet ist.
 * Abhängigkeiten: alle Dateien in worker/.
 */
import { nimmBerichtAn } from "./bericht";
import { nimmMeldungAn } from "./meldungen";
import { schickeWochenuebersicht } from "./woche";
import { fehler, type Ausfuehrung, type Umgebung } from "./umgebung";
import { verwalte } from "./verwaltung";
import { zugangVon } from "./zugang";

const GESPERRT_TEXT =
  "Kein Zugang. Das Dashboard ist nur über Cloudflare Access unter schach-von-grund-auf.com/admin/ erreichbar.";

/** Nur der Autor (oder sein Service Token) kommt durch; sonst 403 ohne weitere Angaben. */
async function nurMitZugang(
  anfrage: Request,
  env: Umgebung,
  weiter: (wer: string) => Promise<Response>,
): Promise<Response> {
  const wer = await zugangVon(anfrage, env);
  if (!wer)
    return new Response(GESPERRT_TEXT, { status: 403, headers: { "Cache-Control": "no-store" } });
  return weiter(wer);
}

/** Antwort der statischen Seite /admin/, nie zwischengespeichert und nie eingebettet. */
async function adminseite(anfrage: Request, env: Umgebung): Promise<Response> {
  const datei = await env.ASSETS.fetch(anfrage);
  const antwort = new Response(datei.body, datei);
  antwort.headers.set("Cache-Control", "no-store");
  antwort.headers.set("X-Robots-Tag", "noindex");
  return antwort;
}

/** Verteilt eine Anfrage; Fehler landen im Protokoll und als 500 beim Aufrufer. */
async function beantworte(
  anfrage: Request,
  env: Umgebung,
  ausfuehrung: Ausfuehrung,
): Promise<Response> {
  const { pathname } = new URL(anfrage.url);
  if (pathname === "/api/melden") {
    return anfrage.method === "POST"
      ? nimmMeldungAn(anfrage, env, ausfuehrung)
      : fehler(405, "methode");
  }
  if (pathname === "/api/bericht") {
    return anfrage.method === "POST" ? nimmBerichtAn(anfrage, env) : fehler(405, "methode");
  }
  if (pathname.startsWith("/api/admin")) {
    return nurMitZugang(anfrage, env, (wer) => verwalte(anfrage, env, wer));
  }
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return nurMitZugang(anfrage, env, () => adminseite(anfrage, env));
  }
  if (pathname.startsWith("/api/")) return fehler(404, "unbekannt");
  return env.ASSETS.fetch(anfrage);
}

export default {
  async fetch(anfrage: Request, env: Umgebung, ausfuehrung: Ausfuehrung): Promise<Response> {
    try {
      return await beantworte(anfrage, env, ausfuehrung);
    } catch (grund) {
      console.error("Fehler im Worker", grund);
      return fehler(500, "intern");
    }
  },
  async scheduled(_ereignis: unknown, env: Umgebung, ausfuehrung: Ausfuehrung): Promise<void> {
    ausfuehrung.waitUntil(schickeWochenuebersicht(env));
  },
};
