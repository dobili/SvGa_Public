/**
 * Zusatzpaket des Abenteuers laden, vorhalten, lesen und löschen (docs/spiel/04_Architektur.md,
 * Abschnitt 7; Vertrag in schnittstelle/paket.ts).
 *
 * Rolle im Gesamtbild: Vorbild ist app/maiapaket.ts. Unterschiede: Das Verzeichnis paket.json
 * trägt eine Version und je Datei eine Prüfsumme; der Cache heißt „abenteuer-<version>“, ältere
 * Caches werden nach erfolgreichem Laden gelöscht. Der Code des Spiels (assets/abenteuer-*.js)
 * geht den Weg der Sprachpakete über den Service Worker (sw/dateiliste.ts); hier bitten wir ihn
 * nach dem Laden der Daten, auch den Code vollständig vorzuhalten.
 * Lesen: `liesPaketdatei` nimmt die Datei aus dem Cache; fehlt sie (Entwicklung, Cache geleert),
 * aus dem Netz. So läuft das Spiel in der Entwicklung ohne „Download“.
 * Abhängigkeiten: schnittstelle/paket.ts, app/sprachpaket.ts (Code-Baustein nachladen).
 */
import { ladeSprachpaket } from "../../app/sprachpaket";
import { PAKET_ABENTEUER } from "../../sw/dateiliste";
import {
  PAKET_PFAD,
  VERZEICHNIS_DATEI,
  type Ladefortschritt,
  type Paketverzeichnis,
  type Paketzustand,
} from "../schnittstelle/paket";
import { Spielfehler } from "../schnittstelle/spielfehler";

const CACHE_PRAEFIX = "abenteuer-";

function basis(): string {
  return `${import.meta.env.BASE_URL}${PAKET_PFAD}`;
}

function adresse(pfad: string): string {
  return new URL(`${basis()}${pfad}`, window.location.href).href;
}

function cachename(version: string): string {
  return `${CACHE_PRAEFIX}${version}`;
}

/** Gibt es Cache Storage (alte Browser und manche Testläufe nicht)? */
function mitCache(): boolean {
  return typeof window !== "undefined" && "caches" in window;
}

/** Das Verzeichnis vom Server (immer frisch, damit eine neue Version erkannt wird). */
async function verzeichnisVomServer(): Promise<Paketverzeichnis> {
  const antwort = await fetch(adresse(VERZEICHNIS_DATEI), { cache: "no-cache" });
  if (!antwort.ok) throw new Spielfehler("fehler.paket.verzeichnis", { status: antwort.status });
  return (await antwort.json()) as Paketverzeichnis;
}

/** Der vollständig geladene Cache auf dem Gerät (sein Verzeichnis liegt darin), sonst null. */
async function geladenesVerzeichnis(): Promise<{
  name: string;
  verzeichnis: Paketverzeichnis;
} | null> {
  if (!mitCache()) return null;
  for (const name of await caches.keys()) {
    if (!name.startsWith(CACHE_PRAEFIX)) continue;
    const speicher = await caches.open(name);
    const antwort = await speicher.match(adresse(VERZEICHNIS_DATEI));
    if (antwort) return { name, verzeichnis: (await antwort.json()) as Paketverzeichnis };
  }
  return null;
}

/**
 * Der Zustand des Pakets für die Startkarte: fehlt, vorhanden oder veraltet (nur mit Netz
 * erkennbar; ohne Netz gilt ein vorhandenes Paket als aktuell).
 */
export async function paketzustand(): Promise<Paketzustand> {
  const geladen = await geladenesVerzeichnis();
  if (!geladen) return { art: "fehlt" };
  const { version, bytes } = geladen.verzeichnis;
  try {
    const neu = await verzeichnisVomServer();
    if (neu.version !== version) return { art: "veraltet", version, neu: neu.version };
  } catch {
    // Ohne Netz bleibt das vorhandene Paket gültig; das ist der Sinn des Caches.
  }
  return { art: "vorhanden", version, bytes };
}

/** SHA-256 eines Blobs als Hexzahl. */
async function pruefsumme(bytes: ArrayBuffer): Promise<string> {
  const summe = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
  return [...summe].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Lädt eine Datei mit Fortschritt, prüft sie und legt sie in den Cache. */
async function ladeDatei(
  speicher: Cache,
  datei: Paketverzeichnis["dateien"][number],
  weiter: (bytes: number) => void,
): Promise<void> {
  if (await speicher.match(adresse(datei.pfad))) {
    weiter(datei.bytes);
    return;
  }
  const antwort = await fetch(adresse(datei.pfad), { cache: "no-cache" });
  if (!antwort.ok || !antwort.body)
    throw new Spielfehler("fehler.paket.laden", { pfad: datei.pfad, status: antwort.status });
  const teile: Uint8Array<ArrayBuffer>[] = [];
  const leser = antwort.body.getReader();
  for (;;) {
    const { done, value } = await leser.read();
    if (done) break;
    teile.push(value);
    weiter(value.byteLength);
  }
  const blob = new Blob(teile);
  if ((await pruefsumme(await blob.arrayBuffer())) !== datei.sha256) {
    throw new Spielfehler("fehler.paket.pruefsumme", { pfad: datei.pfad });
  }
  const typ = antwort.headers.get("content-type") ?? "application/octet-stream";
  await speicher.put(adresse(datei.pfad), new Response(blob, { headers: { "content-type": typ } }));
}

/**
 * Lädt das Paket der aktuellen Version (nur Fehlendes), legt zuletzt das Verzeichnis ab (das
 * heißt „vollständig“), löscht ältere Versionen und bittet den Service Worker um den Code.
 * Wirft bei Netzfehlern; Geladenes bleibt für den nächsten Versuch erhalten.
 */
export async function ladePaket(fortschritt: Ladefortschritt): Promise<void> {
  if (!mitCache()) throw new Spielfehler("fehler.paket.ohneSpeicher");
  const verzeichnis = await verzeichnisVomServer();
  const speicher = await caches.open(cachename(verzeichnis.version));
  let geladen = 0;
  for (const datei of verzeichnis.dateien) {
    await ladeDatei(speicher, datei, (bytes) => {
      geladen += bytes;
      fortschritt(Math.min(geladen, verzeichnis.bytes), verzeichnis.bytes);
    });
  }
  await speicher.put(adresse(VERZEICHNIS_DATEI), new Response(JSON.stringify(verzeichnis)));
  for (const name of await caches.keys()) {
    if (name.startsWith(CACHE_PRAEFIX) && name !== cachename(verzeichnis.version)) {
      await caches.delete(name);
    }
  }
  fortschritt(verzeichnis.bytes, verzeichnis.bytes);
  // Der Code-Baustein liegt beim Service Worker; ohne ihn (Entwicklung) ist nichts zu tun.
  await ladeSprachpaket(PAKET_ABENTEUER);
  melde();
}

/** Löscht alle Versionen des Pakets; der Spielstand bleibt in den Nutzerdaten. */
export async function loeschePaket(): Promise<void> {
  if (!mitCache()) return;
  for (const name of await caches.keys()) {
    if (name.startsWith(CACHE_PRAEFIX)) await caches.delete(name);
  }
  melde();
}

/**
 * Liest eine Datei des Pakets: aus dem geladenen Cache, sonst vom Server (Entwicklung oder
 * verlorener Cache; der Spielstand bleibt davon unberührt).
 */
export async function liesPaketdatei(pfad: string): Promise<Response> {
  const geladen = await geladenesVerzeichnis();
  if (geladen) {
    const antwort = await (await caches.open(geladen.name)).match(adresse(pfad));
    if (antwort) return antwort;
  }
  const antwort = await fetch(adresse(pfad));
  if (!antwort.ok) throw new Spielfehler("fehler.paket.datei", { pfad, status: antwort.status });
  return antwort;
}

/** Eine JSON-Datei des Pakets. */
export async function liesPaketJson<T>(pfad: string): Promise<T> {
  return (await (await liesPaketdatei(pfad)).json()) as T;
}

/** Eine Datei des Pakets als Objekt-Adresse für Bilder (Phaser lädt sie wie eine Netzadresse). */
export async function paketdateiAlsAdresse(pfad: string): Promise<string> {
  return URL.createObjectURL(await (await liesPaketdatei(pfad)).blob());
}

/**
 * Wie `paketdateiAlsAdresse`, aber null, wenn das Paket die Datei nicht enthält: für Bilder, die
 * nur mit der gekauften Grafik da sind (Figuren, Porträts). Ein geladenes Paket wird zuerst im
 * Verzeichnis gefragt, damit fehlende Bilder keine Anfragen an den Server auslösen.
 */
export async function paketdateiAlsAdresseOderNull(pfad: string): Promise<string | null> {
  const geladen = await geladenesVerzeichnis();
  if (geladen && !geladen.verzeichnis.dateien.some((d) => d.pfad === pfad)) return null;
  return paketdateiAlsAdresse(pfad).catch(() => null);
}

/** Beobachter des Paketzustands (für useSyncExternalStore in der Startkarte). */
const beobachter = new Set<() => void>();

function melde(): void {
  for (const b of beobachter) b();
}

export function beiPaketAenderung(b: () => void): () => void {
  beobachter.add(b);
  return () => beobachter.delete(b);
}
