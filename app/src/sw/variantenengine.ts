/**
 * Die Variantenengine im Service Worker: Fairy-Stockfish einkernig (engine-varianten/) offline
 * vorhalten (Auftrag des Hauptchats, 26.11.2026).
 *
 * Rolle im Gesamtbild: Die Engine gehört nicht zur Installation (vite.config.ts, globIgnores
 * „engine-varianten/**“), sondern zum Zusatzpaket des Schach-Abenteuers. Jede Datei unter
 * engine-varianten/ wird beim ersten Abruf gespeichert und danach aus dem Speicher geliefert; im
 * Hintergrund holt der Service Worker die Fassung des Servers nach (veraltet, solange sie neu
 * kommt), denn die Dateinamen tragen keinen Hash. Die App ruft die beiden Dateien beim Laden des
 * Abenteuer-Pakets einmal ab (engine/fairyEngine.ts, ladeFairyVorab), damit Variantenpartien
 * auch ohne Netz gehen.
 * Abhängigkeiten: Workbox (routing).
 */
/// <reference lib="webworker" />
import { registerRoute } from "workbox-routing";

declare const self: ServiceWorkerGlobalScope;

/** Name des Speichers; die Zahl steigt, wenn sich das Format der Ablage ändert. */
export const VARIANTENENGINE_SPEICHER = "engine-varianten-1";
const ORDNER = "/engine-varianten/";

/** Gehört die Adresse zur Variantenengine? Beispiel: /app/engine-varianten/x.wasm → ja. */
export function istVariantenengine(pfad: string): boolean {
  return pfad.includes(ORDNER);
}

/** Holt die Datei vom Server und legt eine gute Antwort ab. */
async function holeUndLege(anfrage: Request, speicher: Cache): Promise<Response> {
  const antwort = await fetch(anfrage, { cache: "no-cache" });
  if (antwort.ok) await speicher.put(anfrage, antwort.clone());
  return antwort;
}

/** Aus dem Speicher, sonst aus dem Netz; mit Speicher im Hintergrund nachladen. */
async function liefere(anfrage: Request, ereignis: ExtendableEvent): Promise<Response> {
  const speicher = await caches.open(VARIANTENENGINE_SPEICHER);
  const vorhanden = await speicher.match(anfrage);
  if (!vorhanden) return holeUndLege(anfrage, speicher);
  // Offline schlägt das Nachladen fehl; die gespeicherte Fassung bleibt dann einfach.
  ereignis.waitUntil(holeUndLege(anfrage, speicher).catch(() => undefined));
  return vorhanden;
}

/** Meldet den Weg für engine-varianten/ an. */
export function richteVariantenengineEin(): void {
  registerRoute(
    ({ url }) => url.origin === self.location.origin && istVariantenengine(url.pathname),
    ({ request, event }) => liefere(request, event),
  );
}
