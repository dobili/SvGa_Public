/**
 * Das Maia-Zusatzpaket: auf Wunsch laden, offline vorhalten, wieder löschen (0.2.143, Entscheidung
 * des Autors 25.10.2026: „Komplettpaket, in den Einstellungen ausschaltbar“).
 *
 * Rolle im Gesamtbild: Maia-2 (engine/maia.ts) rechnet mit zwei Netzen (Blitz, Schnellschach, je
 * 42 MB) und der WebAssembly-Laufzeit von onnxruntime-web (11 MB). Das gehört nicht zur
 * Installation (vite.config.ts, globIgnores „maia/**“), sondern kommt erst, wenn der Leser es in
 * den Einstellungen lädt. Die Dateien liegen danach im Speicher „maia-1“ des Browsers (Cache
 * Storage) und gehen auch ohne Netz. Die Netze sind auf dem Server in Teile zu 15 MB zerlegt
 * (Cloudflare nimmt höchstens 25 MiB je Datei); public/maia/maia.json nennt Teile und Prüfsummen.
 * Sonderfall: Bricht das Laden ab, bleibt das Paket „unvollständig“ und zählt als nicht geladen;
 * erneutes Laden holt nur, was fehlt.
 * Abhängigkeiten: engine/maia.ts (Typ des Modells), public/maia/maia.json.
 */
import type { Maiamodell } from "../engine/maia";

const SPEICHER = "maia-1";
/** Die Laufzeit (Datei aus skripte/kopiere-maia-laufzeit.mjs). */
export const MAIA_LAUFZEIT = "ort/ort-wasm-simd-threaded.wasm";

/** Inhalt von public/maia/maia.json. */
export interface Maiaverzeichnis {
  readonly version: string;
  readonly modelle: Readonly<
    Record<
      Maiamodell,
      { readonly teile: readonly string[]; readonly bytes: number; readonly sha256: string }
    >
  >;
}

function basis(): string {
  return `${import.meta.env.BASE_URL}maia/`;
}

function adresse(datei: string): string {
  return new URL(`${basis()}${datei}`, window.location.href).href;
}

/** Das Verzeichnis des Pakets: aus dem Speicher (offline) oder vom Server. */
export async function maiaverzeichnis(): Promise<Maiaverzeichnis> {
  const speicher = await caches.open(SPEICHER);
  const gespeichert = await speicher.match(adresse("maia.json"));
  const antwort = gespeichert ?? (await fetch(adresse("maia.json"), { cache: "no-cache" }));
  if (!antwort.ok) throw new Error(`Maia-Verzeichnis nicht erreichbar (${antwort.status})`);
  return (await antwort.json()) as Maiaverzeichnis;
}

/** Alle Dateien des Pakets (Teile beider Netze und die Laufzeit). */
function dateienAus(verzeichnis: Maiaverzeichnis): string[] {
  return [...verzeichnis.modelle.blitz.teile, ...verzeichnis.modelle.rapid.teile, MAIA_LAUFZEIT];
}

/** Ist das Paket vollständig im Speicher? Ohne Cache Storage (alte Browser) immer nein. */
export async function maiaGeladen(): Promise<boolean> {
  if (!("caches" in window)) return false;
  const speicher = await caches.open(SPEICHER);
  if (!(await speicher.match(adresse("maia.json")))) return false;
  const verzeichnis = await maiaverzeichnis();
  const da = await Promise.all(dateienAus(verzeichnis).map((d) => speicher.match(adresse(d))));
  return da.every((antwort) => antwort !== undefined);
}

/** Fortschritt beim Laden in Bytes; gesamt ist eine Schätzung, bis die Laufzeit angefangen hat. */
export type Ladefortschritt = (geladen: number, gesamt: number) => void;

/** Ungefähre Größe der Laufzeit für die Anzeige vor dem Laden (11 MB). */
const LAUFZEIT_BYTES = 11_246_032;

/** Gesamtgröße des Pakets in Bytes (für „etwa 96 MB“ in den Einstellungen). */
export function paketBytes(verzeichnis: Maiaverzeichnis): number {
  return verzeichnis.modelle.blitz.bytes + verzeichnis.modelle.rapid.bytes + LAUFZEIT_BYTES;
}

/** Lädt eine Datei mit Fortschritt und legt sie in den Speicher. */
async function ladeDatei(
  speicher: Cache,
  datei: string,
  weiter: (bytes: number) => void,
): Promise<void> {
  if (await speicher.match(adresse(datei))) return;
  const antwort = await fetch(adresse(datei), { cache: "no-cache" });
  if (!antwort.ok || !antwort.body) throw new Error(`${datei}: ${antwort.status}`);
  const teile: Uint8Array<ArrayBuffer>[] = [];
  const leser = antwort.body.getReader();
  for (;;) {
    const { done, value } = await leser.read();
    if (done) break;
    teile.push(value);
    weiter(value.byteLength);
  }
  const typ = antwort.headers.get("content-type") ?? "application/octet-stream";
  await speicher.put(
    adresse(datei),
    new Response(new Blob(teile), { headers: { "content-type": typ } }),
  );
}

/** Prüfsumme eines Netzes aus seinen Teilen (schützt vor abgebrochenen oder veränderten Teilen). */
async function pruefeModell(
  speicher: Cache,
  verzeichnis: Maiaverzeichnis,
  modell: Maiamodell,
): Promise<void> {
  const bytes = await modellAusSpeicher(speicher, verzeichnis, modell);
  const summe = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
  const hex = [...summe].map((b) => b.toString(16).padStart(2, "0")).join("");
  if (hex !== verzeichnis.modelle[modell].sha256) {
    await Promise.all(verzeichnis.modelle[modell].teile.map((t) => speicher.delete(adresse(t))));
    throw new Error(`Maia-Netz ${modell}: Prüfsumme stimmt nicht, bitte erneut laden`);
  }
}

/**
 * Lädt das ganze Paket (nur Fehlendes), prüft die Netze und legt zuletzt das Verzeichnis ab, das
 * „geladen“ bedeutet. Wirft bei Netzfehlern; der Teil, der schon da ist, bleibt erhalten.
 */
export async function ladeMaia(fortschritt: Ladefortschritt): Promise<void> {
  const verzeichnis = (await (
    await fetch(adresse("maia.json"), { cache: "no-cache" })
  ).json()) as Maiaverzeichnis;
  const speicher = await caches.open(SPEICHER);
  const gesamt = paketBytes(verzeichnis);
  let geladen = 0;
  for (const datei of dateienAus(verzeichnis)) {
    await ladeDatei(speicher, datei, (bytes) => {
      geladen += bytes;
      fortschritt(Math.min(geladen, gesamt), gesamt);
    });
  }
  await pruefeModell(speicher, verzeichnis, "blitz");
  await pruefeModell(speicher, verzeichnis, "rapid");
  await speicher.put(adresse("maia.json"), new Response(JSON.stringify(verzeichnis)));
  fortschritt(gesamt, gesamt);
}

/** Löscht das Paket vom Gerät. */
export async function loescheMaia(): Promise<void> {
  if ("caches" in window) await caches.delete(SPEICHER);
}

async function modellAusSpeicher(
  speicher: Cache,
  verzeichnis: Maiaverzeichnis,
  modell: Maiamodell,
): Promise<ArrayBuffer> {
  const teile = await Promise.all(
    verzeichnis.modelle[modell].teile.map(async (t) => {
      const antwort = await speicher.match(adresse(t));
      if (!antwort) throw new Error(`Maia: Teil fehlt (${t})`);
      return antwort.arrayBuffer();
    }),
  );
  return new Blob(teile).arrayBuffer();
}

/** Ein Netz aus dem Speicher, zusammengesetzt (für engine/maia-web.ts). */
export async function maiamodellBytes(modell: Maiamodell): Promise<ArrayBuffer> {
  const speicher = await caches.open(SPEICHER);
  return modellAusSpeicher(speicher, await maiaverzeichnis(), modell);
}

/** Die Laufzeit aus dem Speicher (für engine/maia-web.ts). */
export async function maialaufzeitBytes(): Promise<ArrayBuffer> {
  const speicher = await caches.open(SPEICHER);
  const antwort = await speicher.match(adresse(MAIA_LAUFZEIT));
  if (!antwort) throw new Error("Maia: Laufzeit fehlt");
  return antwort.arrayBuffer();
}

/** Stand des Pakets für die Oberfläche: null, solange noch nicht nachgesehen. */
let bereit: boolean | null = null;
const hoerer = new Set<() => void>();

/** Sieht im Speicher nach, ob das Paket vollständig ist, und benachrichtigt die Oberfläche. */
export async function pruefeMaia(): Promise<boolean> {
  const neu = await maiaGeladen().catch(() => false);
  if (neu !== bereit) {
    bereit = neu;
    for (const h of hoerer) h();
  }
  return neu;
}

/** Ist das Paket geladen? Für useSyncExternalStore (useMaiaBereit in ui/komponenten/einstellungen/MaiaWahl.tsx). */
export function maiaBereitJetzt(): boolean {
  return bereit === true;
}

/** Meldet sich für Änderungen des Paketstands an; gibt die Abmeldung zurück. */
export function beiMaiaAenderung(h: () => void): () => void {
  hoerer.add(h);
  if (bereit === null) void pruefeMaia();
  return () => hoerer.delete(h);
}
