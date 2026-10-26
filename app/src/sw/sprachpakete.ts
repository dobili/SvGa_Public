/**
 * Sprachpakete im Service Worker: Dateien einer weiteren Sprache erst laden, wenn sie gebraucht
 * werden, und dann offline vorhalten.
 *
 * Rolle im Gesamtbild: Das Gerät lädt nur den Kern vorab (sw.ts, sw/dateiliste.ts; V4,
 * Nutzungsprüfung 25.10.2026). Englisch (Buch- und Trainerdaten, Sprachdatei der Oberfläche, etwa
 * 6 MB) kommt erst, wenn der Leser es wählt: Jede Datei wird beim ersten Abruf gespeichert, und die
 * App bittet nach der Wahl, das ganze Paket nachzuladen (app/sprachpaket.ts), damit Englisch danach
 * auch ohne Netz vollständig ist. Der Speicher hält jede Datei unter Adresse plus Revision; eine
 * neue Fassung der App räumt veraltete Dateien beim Aktivieren weg.
 * Nachrichten: „SPRACHPAKET_STAND“ und „SPRACHPAKET_LADEN“ mit { sprache }, Antwort über den
 * mitgeschickten Port: { gesamt, vorhanden }.
 * Abhängigkeiten: Workbox (routing), sw/dateiliste.ts.
 */
/// <reference lib="webworker" />
import { registerRoute } from "workbox-routing";
import type { Paketdatei, Paketstand } from "./dateiliste";

declare const self: ServiceWorkerGlobalScope;

/** Name des Speichers je Sprache, etwa „sprachpaket-en“. */
const SPEICHER_PRAEFIX = "sprachpaket-";
/** So viele Dateien lädt das Nachladen eines Pakets gleichzeitig (schont schwache Netze). */
const GLEICHZEITIG = 4;

/** Die Pakete dieser Fassung, je Sprache die Dateien mit Revision. */
type Pakete = Readonly<Record<string, readonly Paketdatei[]>>;

function speichername(sprache: string): string {
  return `${SPEICHER_PRAEFIX}${sprache}`;
}

/** Absolute Adresse einer Datei der Liste. */
function adresse(datei: Paketdatei): URL {
  return new URL(datei.url, self.location.href);
}

/** Schlüssel im Speicher: Adresse mit Revision, damit eine neue Fassung die alte nicht trifft. */
function schluessel(datei: Paketdatei): string {
  const ziel = adresse(datei);
  if (datei.revision) ziel.searchParams.set("__rev", datei.revision);
  return ziel.href;
}

/**
 * Liefert eine Datei des Pakets: aus dem Speicher oder, beim ersten Mal, aus dem Netz (und
 * speichert sie). Dateien ohne Hash im Namen werden beim Server nachgefragt („no-cache“), damit
 * kein veralteter Stand aus dem Zwischenspeicher des Browsers ins Paket gerät.
 */
async function holeDatei(sprache: string, datei: Paketdatei): Promise<Response> {
  const speicher = await caches.open(speichername(sprache));
  const vorhanden = await speicher.match(schluessel(datei));
  if (vorhanden) return vorhanden;
  const antwort = await fetch(adresse(datei).href, {
    cache: datei.revision ? "no-cache" : "default",
  });
  if (antwort.ok) await speicher.put(schluessel(datei), antwort.clone());
  return antwort;
}

/** Wie viele Dateien des Pakets schon im Speicher liegen. */
async function stand(sprache: string, dateien: readonly Paketdatei[]): Promise<Paketstand> {
  const speicher = await caches.open(speichername(sprache));
  const treffer = await Promise.all(dateien.map((d) => speicher.match(schluessel(d))));
  return { gesamt: dateien.length, vorhanden: treffer.filter(Boolean).length };
}

/**
 * Lädt alle fehlenden Dateien des Pakets nach. Bricht das Netz ab, bleibt der Teil im Speicher,
 * der schon da ist; der nächste Aufruf macht dort weiter.
 */
async function ladePaket(sprache: string, dateien: readonly Paketdatei[]): Promise<Paketstand> {
  const offen = [...dateien];
  const arbeiter = Array.from({ length: GLEICHZEITIG }, async () => {
    for (let datei = offen.shift(); datei; datei = offen.shift()) {
      const antwort = await holeDatei(sprache, datei);
      if (!antwort.ok) throw new Error(`${datei.url}: ${antwort.status}`);
    }
  });
  try {
    await Promise.all(arbeiter);
  } catch (fehler) {
    console.warn(`Sprachpaket ${sprache} unvollständig geladen:`, fehler);
  }
  return stand(sprache, dateien);
}

/** Entfernt Dateien, die nicht mehr zu dieser Fassung gehören, und Pakete ohne Sprache. */
async function raeumeAuf(pakete: Pakete): Promise<void> {
  for (const name of await caches.keys()) {
    if (!name.startsWith(SPEICHER_PRAEFIX)) continue;
    const dateien = pakete[name.slice(SPEICHER_PRAEFIX.length)];
    if (!dateien) {
      await caches.delete(name);
      continue;
    }
    const gueltig = new Set(dateien.map(schluessel));
    const speicher = await caches.open(name);
    for (const anfrage of await speicher.keys()) {
      if (!gueltig.has(anfrage.url)) await speicher.delete(anfrage);
    }
  }
}

/** Liest eine Nachricht der App, falls sie ein Sprachpaket betrifft. */
function paketnachricht(daten: unknown): { art: string; sprache: string } | null {
  if (typeof daten !== "object" || daten === null) return null;
  const { type: art, sprache } = daten as { type?: unknown; sprache?: unknown };
  if (art !== "SPRACHPAKET_STAND" && art !== "SPRACHPAKET_LADEN") return null;
  return typeof sprache === "string" ? { art, sprache } : null;
}

/**
 * Richtet die Sprachpakete im Service Worker ein: Weg für ihre Dateien, Aufräumen beim Aktivieren,
 * Antworten auf die Fragen der App.
 *
 * Warum: Englisch braucht nur, wer es wählt; alle anderen sparen etwa 6 MB beim ersten Besuch.
 * Eingabe: die Pakete aus teileDateiliste (sw/dateiliste.ts).
 * Beispiel: Der Leser wählt Englisch; die App lädt assets/sprachpaket-en-….js (Weg unten, erstes Mal
 * aus dem Netz) und schickt „SPRACHPAKET_LADEN“ für „en“; danach geht Englisch auch offline.
 * Sonderfall: Eine Datei, die nicht in der Liste steht, geht wie bisher direkt ans Netz.
 */
export function richteSprachpaketeEin(pakete: Pakete): void {
  const nachPfad = new Map<string, { sprache: string; datei: Paketdatei }>();
  for (const [sprache, dateien] of Object.entries(pakete)) {
    for (const datei of dateien) nachPfad.set(adresse(datei).pathname, { sprache, datei });
  }
  registerRoute(
    ({ url, request }) =>
      request.method === "GET" && url.origin === self.location.origin && nachPfad.has(url.pathname),
    async ({ url, request }) => {
      const fund = nachPfad.get(url.pathname);
      return fund ? holeDatei(fund.sprache, fund.datei) : fetch(request);
    },
  );
  self.addEventListener("activate", (ereignis) => ereignis.waitUntil(raeumeAuf(pakete)));
  self.addEventListener("message", (ereignis: ExtendableMessageEvent) => {
    const nachricht = paketnachricht(ereignis.data);
    const antwortweg = ereignis.ports[0];
    if (!nachricht || !antwortweg) return;
    const dateien = pakete[nachricht.sprache] ?? [];
    const arbeit =
      nachricht.art === "SPRACHPAKET_LADEN"
        ? ladePaket(nachricht.sprache, dateien)
        : stand(nachricht.sprache, dateien);
    ereignis.waitUntil(arbeit.then((ergebnis) => antwortweg.postMessage(ergebnis)));
  });
}
