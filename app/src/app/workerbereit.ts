/**
 * Kleine Hilfen für den Offline-Kern ohne Abhängigkeit von vite-plugin-pwa, damit sie in Node
 * testbar sind: Warten auf einen wirklich aktiven Service Worker und der Takt der Update-Suche.
 *
 * Rolle im Gesamtbild: app/offlineKern.ts nutzt sie (V1 und V3, Nutzungsprüfung 25.10.2026).
 * Abhängigkeiten: keine.
 */

/** Der Teil von ServiceWorkerContainer, den das Warten braucht (für Tests nachbildbar). */
export interface WorkerContainer {
  readonly ready: Promise<{ readonly active: ServiceWorker | null }>;
}

/** Zustände, in denen ein Worker nicht mehr aktiv werden kann oder es schon ist. */
const ENDZUSTAENDE: readonly ServiceWorkerState[] = ["activated", "redundant"];

/**
 * Wartet, bis ein Service Worker die Seite wirklich bedienen kann.
 *
 * Zweck: „Offline bereit“ erst melden, wenn es stimmt.
 * Warum: vite-plugin-pwa ruft onOfflineReady schon beim Zustand „installed“, also bevor der
 * Worker aktiviert ist. Schließt der Leser die App in diesem Moment, gibt es beim nächsten
 * Öffnen ohne Netz womöglich noch keinen aktiven Worker. `navigator.serviceWorker.ready` liefert
 * die Registrierung, sobald ein Worker aktiv wird („activating“); erst „activated“ heißt fertig.
 * Eingabe: der Container (im Browser navigator.serviceWorker).
 * Ausgabe: true, sobald der aktive Worker „activated“ ist; false, wenn er unterwegs „redundant“
 * wird (dann übernimmt meist ein neuerer Worker, und die Fortschrittsabfrage fragt weiter).
 * Beispiel: erster Besuch, Dateien geladen, Worker „activating“ → erfüllt kurz darauf mit true.
 * Sonderfälle: Ein schon aktivierter Worker (jeder spätere Start) → sofort true.
 */
export async function warteAufAktivenWorker(container: WorkerContainer): Promise<boolean> {
  const { active: worker } = await container.ready;
  if (!worker) return false;
  if (ENDZUSTAENDE.includes(worker.state)) return worker.state === "activated";
  return new Promise<boolean>((erfuellen) => {
    const beiWechsel = () => {
      if (!ENDZUSTAENDE.includes(worker.state)) return;
      worker.removeEventListener("statechange", beiWechsel);
      erfuellen(worker.state === "activated");
    };
    worker.addEventListener("statechange", beiWechsel);
  });
}
