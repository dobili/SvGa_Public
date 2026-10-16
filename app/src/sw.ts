/**
 * Service Worker: lädt alle Dateien für die Offline-Nutzung und liefert sie offline aus.
 *
 * Rolle im Gesamtbild: Nach dem ersten Aufruf braucht die App kein Netz mehr (Konzept 11).
 * vite-plugin-pwa trägt beim Build die Liste aller Dateien ein (self.__WB_MANIFEST).
 * Zusätzlich beantwortet er die Frage der Installationsseite, wie viele Dateien schon da sind
 * („Für die Offline-Nutzung vorbereitet: 63 %“), und aktiviert eine neue Version erst, wenn der
 * Leser auf „Jetzt aktualisieren“ tippt (Konzept 11.3).
 * Abhängigkeiten: Workbox (precaching, routing).
 */
/// <reference lib="webworker" />
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  getCacheKeyForURL,
  precacheAndRoute,
} from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { cacheNames } from "workbox-core";

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: (string | { url: string; revision: string | null })[];
};

const DATEILISTE = self.__WB_MANIFEST;

precacheAndRoute(DATEILISTE);
cleanupOutdatedCaches();
// Jede Adresse unter /app/ liefert die App aus (sie hat keine Unterseiten, Konzept 6.6). Die
// statischen Seiten (/, /installieren/, /impressum/, /datenschutz/) beantwortet die Vorab-Liste
// selbst, auch offline (Entscheidung 15.10.2026).
registerRoute(
  new NavigationRoute(createHandlerBoundToURL("app/index.html"), { allowlist: [/^\/app(\/|$)/] }),
);

/** Zählt, wie viele Dateien der Liste schon im Speicher liegen. */
async function offlineStand(): Promise<{ gesamt: number; vorhanden: number }> {
  const speicher = await caches.open(cacheNames.precache);
  let vorhanden = 0;
  for (const eintrag of DATEILISTE) {
    const adresse = typeof eintrag === "string" ? eintrag : eintrag.url;
    const schluessel = getCacheKeyForURL(adresse);
    if (schluessel && (await speicher.match(schluessel))) {
      vorhanden += 1;
    }
  }
  return { gesamt: DATEILISTE.length, vorhanden };
}

self.addEventListener("message", (ereignis: ExtendableMessageEvent) => {
  const nachricht: unknown = ereignis.data;
  if (typeof nachricht !== "object" || nachricht === null || !("type" in nachricht)) {
    return;
  }
  // „SKIP_WAITING“ schickt registerSW aus vite-plugin-pwa, wenn der Leser aktualisiert.
  if (nachricht.type === "SKIP_WAITING") {
    void self.skipWaiting();
  }
  const antwortweg = ereignis.ports[0];
  if (nachricht.type === "OFFLINE_STAND" && antwortweg) {
    ereignis.waitUntil(offlineStand().then((stand) => antwortweg.postMessage(stand)));
  }
});
