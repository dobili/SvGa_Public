/**
 * Fragen der App an den Service Worker nach dem Sprachpaket einer weiteren Sprache.
 *
 * Rolle im Gesamtbild: Seit V4 (Nutzungsprüfung 25.10.2026) lädt das Gerät Englisch erst, wenn
 * der Leser es wählt (sw/sprachpakete.ts). Die Sprachwahl (app/sprachwahl.ts) fragt hier, ob das
 * Paket schon vollständig auf dem Gerät liegt (dann geht der Wechsel auch offline) und bittet nach
 * dem Wechsel, es ganz nachzuladen.
 * Abhängigkeiten: sw/dateiliste.ts (nur der Typ), Service-Worker-Schnittstelle des Browsers.
 */
import type { Paketstand } from "../sw/dateiliste";

/** So lange wartet die Frage nach dem Stand auf den Service Worker (wie offlineKern.ts). */
const ANTWORT_FRIST_MS = 2000;

/** Der aktive Service Worker dieser Seite, auch wenn er sie (beim ersten Besuch) nicht steuert. */
async function aktiverDienst(): Promise<ServiceWorker | null> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return null;
  const registrierung = await navigator.serviceWorker.getRegistration();
  return registrierung?.active ?? null;
}

/** Schickt eine Nachricht und wartet auf die Antwort; null ohne Dienst oder nach der Frist. */
async function frage(
  art: "SPRACHPAKET_STAND" | "SPRACHPAKET_LADEN",
  sprache: string,
  fristMs: number | null,
): Promise<Paketstand | null> {
  const dienst = await aktiverDienst();
  if (!dienst) return null;
  return new Promise((erfuellen) => {
    const kanal = new MessageChannel();
    const frist = fristMs === null ? null : setTimeout(() => erfuellen(null), fristMs);
    kanal.port1.onmessage = (ereignis: MessageEvent<Paketstand>) => {
      if (frist !== null) clearTimeout(frist);
      erfuellen(ereignis.data);
    };
    dienst.postMessage({ type: art, sprache }, [kanal.port2]);
  });
}

/**
 * Liegt das Sprachpaket vollständig auf dem Gerät?
 *
 * Warum: Nur dann darf der Wechsel ohne Netz gelingen; sonst wäre die App halb englisch (Texte
 * englisch, aber Abbildungen ohne Daten).
 * Eingabe: Sprachcode wie „en“. Ausgabe: true, false oder null, wenn es keinen Service Worker gibt
 * (Entwicklung, alter Browser) oder er nicht antwortet (etwa eine ältere Fassung ohne Pakete).
 * Beispiel: nach einmal Englisch mit Netz → true; frisch installiert → false.
 */
export async function sprachpaketVollstaendig(sprache: string): Promise<boolean | null> {
  const stand = await frage("SPRACHPAKET_STAND", sprache, ANTWORT_FRIST_MS);
  return stand === null ? null : stand.gesamt > 0 && stand.vorhanden === stand.gesamt;
}

/**
 * Bittet den Service Worker, das ganze Sprachpaket nachzuladen (im Hintergrund).
 *
 * Warum: Jede Datei wird zwar beim ersten Abruf gespeichert, aber erst das ganze Paket macht die
 * Sprache offline vollständig. Bereits gespeicherte Dateien lädt er nicht noch einmal.
 * Eingabe: Sprachcode. Ausgabe: Stand nach dem Laden, null ohne Service Worker.
 * Sonderfall: Ohne Frist, denn etwa 6 MB brauchen im schwachen Netz eine Weile.
 */
export function ladeSprachpaket(sprache: string): Promise<Paketstand | null> {
  return frage("SPRACHPAKET_LADEN", sprache, null);
}
