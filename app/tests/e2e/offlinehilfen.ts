/**
 * Echtes Offline für die Oberflächentests: Netz sperren auch für den Service Worker.
 *
 * Warum: `context.setOffline(true)` sperrt in Playwright nur die Abrufe der Seite, nicht die des
 * Service Workers (Fehlertest f3, 01.11.2026: eine nicht vorgehaltene Datei kam „offline“ mit
 * 200). Ein Offline-Test konnte so grün sein, obwohl eine Datei nur aus dem Netz kam. Mit
 * `PW_EXPERIMENTAL_SERVICE_WORKER_NETWORK_EVENTS=1` (playwright.config.ts) laufen in Chromium
 * auch die Abrufe des Service Workers durch `context.route`; dort bricht `sperreNetz` alles ab.
 * WebKit kennt diesen Weg nicht, und dort fängt die Route schon die Abrufe der Seite ab, bevor
 * der Service Worker sie beantwortet (CI 1.11.2026: „page.goto: Blocked by Web Inspector“). In
 * WebKit bleibt es deshalb bei setOffline, und die Gegenprobe `netzGesperrtFuerWorker` läuft nur
 * in Chromium.
 */
import type { BrowserContext, Page } from "@playwright/test";

/** Jede Adresse, auch die der Service Worker. */
const ALLES = "**/*";

/** Ob der Kontext in Chromium läuft (nur dort trifft die Route den Service Worker). */
function istChromium(kontext: BrowserContext): boolean {
  return kontext.browser()?.browserType().name() === "chromium";
}

/** Sperrt das Netz für Seite und Service Worker (in Chromium auch per Route) bis `gibNetzFrei`. */
export async function sperreNetz(kontext: BrowserContext): Promise<void> {
  await kontext.setOffline(true);
  if (istChromium(kontext)) await kontext.route(ALLES, (weg) => weg.abort("internetdisconnected"));
}

/** Gibt das Netz wieder frei. */
export async function gibNetzFrei(kontext: BrowserContext): Promise<void> {
  if (istChromium(kontext)) await kontext.unroute(ALLES);
  await kontext.setOffline(false);
}

/**
 * Gegenprobe, dass die Sperre auch den Service Worker trifft: Eine vorgehaltene Datei wird aus
 * dem Speicher entfernt und abgerufen; der Service Worker fällt dann aufs Netz zurück, und das
 * muss scheitern. Ausgabe: true, wenn der Abruf scheiterte (Netz wirklich gesperrt).
 * Sonderfall: Die Datei (ein großes Symbol der Installation) braucht kein anderer Schritt.
 */
export function netzGesperrtFuerWorker(seite: Page): Promise<boolean> {
  return seite.evaluate(async () => {
    const datei = "symbole/symbol-512.png";
    for (const name of await caches.keys()) {
      const speicher = await caches.open(name);
      for (const schluessel of await speicher.keys()) {
        if (schluessel.url.includes(datei)) await speicher.delete(schluessel);
      }
    }
    try {
      const antwort = await fetch(`/${datei}`, { cache: "no-store" });
      return !antwort.ok;
    } catch {
      return true;
    }
  });
}
