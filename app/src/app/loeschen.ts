/**
 * Alle Daten der App auf diesem Gerät löschen: Offline-Dateien, Service Worker, Merker, Datenbanken.
 *
 * Rolle im Gesamtbild: Knopf „Alle Daten dieser App löschen“ im Bereich Ich. Der Autor wünschte
 * beim Handytest von AP 1 einen Weg, die App rückstandsfrei zu entfernen. Das Symbol auf dem
 * Startbildschirm kann eine Web-App nicht selbst entfernen; das erklärt die Anleitung daneben.
 * Abhängigkeiten: speicher/datenbank.ts (eigene Verbindung schließen), Browser-Schnittstellen.
 */
import { DATENBANK, schliesse } from "../speicher/datenbank";

/** Ein Schritt des Löschens, der nicht geklappt hat, mit der Meldung des Browsers. */
export interface Loeschfehler {
  readonly schritt: "service-worker" | "offline-dateien" | "merker" | "datenbanken";
  readonly meldung: string;
}

function alsMeldung(fehler: unknown): string {
  return fehler instanceof Error ? fehler.message : String(fehler);
}

async function meldeServiceWorkerAb(): Promise<void> {
  if (!("serviceWorker" in navigator)) return;
  const registrierungen = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrierungen.map((registrierung) => registrierung.unregister()));
}

async function loescheOfflineDateien(): Promise<void> {
  if (!("caches" in window)) return;
  const namen = await caches.keys();
  await Promise.all(namen.map((name) => caches.delete(name)));
}

async function loescheMerker(): Promise<void> {
  window.localStorage.clear();
  window.sessionStorage.clear();
  return Promise.resolve();
}

async function loescheDatenbanken(): Promise<void> {
  if (!("indexedDB" in window)) return;
  // Die eigene offene Verbindung blockierte sonst das Löschen bis zum Neuladen.
  await schliesse();
  // Ältere Browser kennen indexedDB.databases() nicht; dann wenigstens die Nutzerdaten.
  const datenbanken =
    typeof indexedDB.databases === "function" ? await indexedDB.databases() : [{ name: DATENBANK }];
  await Promise.all(
    datenbanken
      .map((datenbank) => datenbank.name)
      .filter((name): name is string => typeof name === "string")
      .map(
        (name) =>
          new Promise<void>((erfuellen, ablehnen) => {
            const anfrage = indexedDB.deleteDatabase(name);
            anfrage.onsuccess = () => erfuellen();
            anfrage.onerror = () => ablehnen(anfrage.error ?? new Error(name));
            // Blockiert ein anderer Tab die Datenbank, löscht der Browser sie nach dessen Schließen.
            anfrage.onblocked = () => erfuellen();
          }),
      ),
  );
}

/**
 * Löscht alles, was die App auf dem Gerät gespeichert hat.
 *
 * Warum: Wer die App abgeben, neu aufsetzen oder Speicher freigeben will, braucht einen Weg ohne
 * Browsereinstellungen. Danach lädt die App beim nächsten Öffnen mit Internet alles neu.
 * Ausgabe: die Schritte, die nicht geklappt haben (leer, wenn alles gelöscht ist).
 * Sonderfälle: Jeder Schritt läuft auch dann, wenn ein früherer scheitert; die Fehler werden
 * gesammelt gemeldet statt verschluckt. Die Seite wird absichtlich nicht neu geladen, sonst
 * meldete sich der Service Worker sofort wieder an und lüde alles erneut.
 */
export async function loescheAlleDaten(): Promise<Loeschfehler[]> {
  const schritte: [Loeschfehler["schritt"], () => Promise<void>][] = [
    ["service-worker", meldeServiceWorkerAb],
    ["offline-dateien", loescheOfflineDateien],
    ["merker", loescheMerker],
    ["datenbanken", loescheDatenbanken],
  ];
  const fehler: Loeschfehler[] = [];
  for (const [schritt, ausfuehren] of schritte) {
    try {
      await ausfuehren();
    } catch (grund) {
      console.error(`Löschen (${schritt}) fehlgeschlagen:`, grund);
      fehler.push({ schritt, meldung: alsMeldung(grund) });
    }
  }
  return fehler;
}
