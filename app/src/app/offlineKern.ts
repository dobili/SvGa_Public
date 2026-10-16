/**
 * Offline-Stand und Updates ohne React: Service Worker anmelden, Fortschritt abfragen, neue
 * Version melden.
 *
 * Rolle im Gesamtbild: Kern von app/offline.ts. Die statische Startseite des Buches
 * (src/startseite/) nutzt ihn ohne React, die App über den Hook useOfflineStand (Konzept 6.6,
 * „pruefeUpdate“, und 11.1 bis 11.3). Der Stand ist ein kleiner Speicher mit Abonnenten.
 * Abhängigkeiten: vite-plugin-pwa (registerSW).
 */
import { registerSW } from "virtual:pwa-register";

/** Was die Oberfläche über Offline-Nutzung und Updates weiß. */
export interface OfflineStand {
  /** false im Entwicklungsmodus oder in Browsern ohne Service Worker. */
  readonly verfuegbar: boolean;
  /** Anteil der vorab geladenen Dateien, 0 bis 100. */
  readonly prozent: number;
  readonly bereit: boolean;
  readonly updateVerfuegbar: boolean;
}

/** Abstand der Abfragen, solange noch Dateien laden. */
const ABFRAGE_ABSTAND_MS = 400;
/** So lange wartet die Seite auf eine Antwort des Service Workers. */
const ANTWORT_FRIST_MS = 2000;
const VOLL = 100;

let stand: OfflineStand = { verfuegbar: false, prozent: 0, bereit: false, updateVerfuegbar: false };
const abonnenten = new Set<() => void>();
let aktualisiere: ((neuLaden?: boolean) => Promise<void>) | null = null;
let registrierung: ServiceWorkerRegistration | null = null;

function setze(neu: Partial<OfflineStand>): void {
  stand = { ...stand, ...neu };
  abonnenten.forEach((abonnent) => abonnent());
}

/** Fragt den Service Worker, wie viele Dateien schon vorliegen. */
function frageStand(worker: ServiceWorker): Promise<{ gesamt: number; vorhanden: number } | null> {
  return new Promise((erfuellen) => {
    const kanal = new MessageChannel();
    const frist = setTimeout(() => erfuellen(null), ANTWORT_FRIST_MS);
    kanal.port1.onmessage = (ereignis: MessageEvent<{ gesamt: number; vorhanden: number }>) => {
      clearTimeout(frist);
      erfuellen(ereignis.data);
    };
    worker.postMessage({ type: "OFFLINE_STAND" }, [kanal.port2]);
  });
}

/** Fragt so lange nach dem Fortschritt, bis alle Dateien da sind. */
async function verfolgeFortschritt(): Promise<void> {
  const reg = registrierung;
  const worker = reg?.installing ?? reg?.waiting ?? reg?.active;
  if (!reg || !worker || stand.bereit) {
    return;
  }
  const antwort = await frageStand(worker);
  if (antwort && antwort.gesamt > 0) {
    const prozent = Math.floor((antwort.vorhanden / antwort.gesamt) * VOLL);
    const fertig = antwort.vorhanden === antwort.gesamt && reg.active !== null;
    setze({ prozent: fertig ? VOLL : Math.min(prozent, VOLL - 1), bereit: fertig });
    if (fertig) return;
  }
  setTimeout(() => void verfolgeFortschritt(), ABFRAGE_ABSTAND_MS);
}

/**
 * Meldet den Service Worker an. Einmal beim Start der App aufrufen.
 *
 * Warum: Erst damit lädt das Gerät alle Dateien für die Offline-Nutzung und erfährt von neuen
 * Versionen. Im Entwicklungsmodus gibt es keinen Service Worker; dann bleibt „verfuegbar“ false.
 */
export function starteOffline(): void {
  if (!("serviceWorker" in navigator) || import.meta.env.DEV) {
    return;
  }
  setze({ verfuegbar: true });
  aktualisiere = registerSW({
    immediate: true,
    onNeedRefresh: () => setze({ updateVerfuegbar: true }),
    onOfflineReady: () => setze({ bereit: true, prozent: VOLL }),
    onRegisteredSW: (_adresse, reg) => {
      registrierung = reg ?? null;
      void verfolgeFortschritt();
    },
    onRegisterError: (fehler: unknown) => {
      console.error("Service Worker konnte nicht angemeldet werden:", fehler);
      setze({ verfuegbar: false });
    },
  });
}

/** Aktiviert die neue Version und lädt die App neu (nur nach Tippen, Konzept 11.3). */
export async function aktualisiereJetzt(): Promise<void> {
  if (aktualisiere) {
    await aktualisiere(true);
  }
}

/**
 * Sucht sofort nach einer neuen Version (Knopf in den Einstellungen).
 * Ausgabe: true, wenn eine neue Version gefunden wurde und nun bereitsteht.
 */
export async function sucheUpdate(): Promise<boolean> {
  if (!registrierung) {
    return false;
  }
  await registrierung.update();
  return registrierung.waiting !== null || registrierung.installing !== null;
}

/** Der aktuelle Stand (für die Startseite und den Hook der App). */
export function offlineStand(): OfflineStand {
  return stand;
}

/** Meldet jede Änderung des Stands; gibt eine Funktion zum Abmelden zurück. */
export function abonniereOffline(abonnent: () => void): () => void {
  abonnenten.add(abonnent);
  return () => abonnenten.delete(abonnent);
}
