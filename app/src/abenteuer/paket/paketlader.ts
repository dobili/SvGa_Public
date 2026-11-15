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
 * Leistung auf einfachen Handys (Prüfung „zugang“, 15.11.2026): Das Verzeichnis (gut 500 KB JSON)
 * wird einmal gelesen und gemerkt, nicht bei jedem Bild; jede Bildadresse entsteht einmal je
 * Datei und Sitzung (vorher bei jedem Kartenwechsel neu, ohne Freigabe: der Speicher wuchs mit
 * jeder Karte). Rasterbilder liegen im Paket als verlustfreies WebP (skripte/paketbilder.mjs);
 * Aufrufer nennen weiter den Namen der Quelle („moebel/sofa.png“), `paketpfad` setzt ihn um.
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

/** Ein vollständig geladenes Paket: Cache-Name, Verzeichnis und die Menge seiner Pfade. */
interface GeladenesPaket {
  readonly name: string;
  readonly verzeichnis: Paketverzeichnis;
  readonly pfade: ReadonlySet<string>;
}

async function sucheGeladenesPaket(): Promise<GeladenesPaket | null> {
  if (!mitCache()) return null;
  for (const name of await caches.keys()) {
    if (!name.startsWith(CACHE_PRAEFIX)) continue;
    const speicher = await caches.open(name);
    const antwort = await speicher.match(adresse(VERZEICHNIS_DATEI));
    if (!antwort) continue;
    const verzeichnis = (await antwort.json()) as Paketverzeichnis;
    return { name, verzeichnis, pfade: new Set(verzeichnis.dateien.map((d) => d.pfad)) };
  }
  return null;
}

/** Das gemerkte Ergebnis von sucheGeladenesPaket; `vergiss` setzt es zurück. */
let gemerktesPaket: Promise<GeladenesPaket | null> | null = null;

/**
 * Der vollständig geladene Cache auf dem Gerät (sein Verzeichnis liegt darin), sonst null.
 * Gemerkt bis zur nächsten Änderung am Paket (melde); ein Fehler wird nicht gemerkt.
 */
function geladenesVerzeichnis(): Promise<GeladenesPaket | null> {
  if (!gemerktesPaket) {
    const suche = sucheGeladenesPaket();
    gemerktesPaket = suche;
    suche.catch(() => {
      if (gemerktesPaket === suche) gemerktesPaket = null;
    });
  }
  return gemerktesPaket;
}

/**
 * Der Pfad einer Datei im Paket: PNG der Quellen liegt dort als WebP. Ein Paket aus der Zeit
 * davor (nur der PNG-Name im Verzeichnis) behält den alten Namen, bis es erneuert ist.
 * Beispiel: „moebel/sofa.png“ → „moebel/sofa.webp“; „karten/park.json“ bleibt.
 */
export function paketpfad(pfad: string, pfade: ReadonlySet<string> | null = null): string {
  const webp = pfad.replace(/\.png$/, ".webp");
  if (webp === pfad || !pfade) return webp;
  return !pfade.has(webp) && pfade.has(pfad) ? pfad : webp;
}

/**
 * Der Zustand des Pakets für die Startkarte: fehlt, vorhanden oder veraltet (nur mit Netz
 * erkennbar; ohne Netz gilt ein vorhandenes Paket als aktuell).
 */
/** So lange wartet die Startkarte höchstens auf den Server; danach gilt das vorhandene Paket. */
const SERVER_ZEITLIMIT_MS = 3000;

/** Ein Versprechen mit Zeitlimit: Nach `ms` Millisekunden wird es mit einem Fehler abgelehnt. */
function mitZeitlimit<T>(versprechen: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((erfuellt, abgelehnt) => {
    const uhr = setTimeout(() => abgelehnt(new Error(`Zeitlimit ${ms} ms`)), ms);
    versprechen.then(
      (wert) => {
        clearTimeout(uhr);
        erfuellt(wert);
      },
      (fehler: unknown) => {
        clearTimeout(uhr);
        abgelehnt(fehler instanceof Error ? fehler : new Error(String(fehler)));
      },
    );
  });
}

/**
 * „Fehlt“ mit der Größe des Grundpakets vom Server, damit die Startkarte sie vor dem Laden nennt
 * (Spieltest „einstieg“, 15.11.2026, R9: die 45 MB standen erst nach dem Tippen da). Ohne Netz
 * oder bei hängendem Server ohne Größe.
 */
async function fehltMitGroesse(): Promise<Paketzustand> {
  try {
    const verzeichnis = await mitZeitlimit(verzeichnisVomServer(), SERVER_ZEITLIMIT_MS);
    return typeof verzeichnis.bytes === "number"
      ? { art: "fehlt", bytes: verzeichnis.bytes }
      : { art: "fehlt" };
  } catch {
    // Ohne Netz bleibt nur „fehlt“; das Laden meldet seinen Fehler dann selbst.
    return { art: "fehlt" };
  }
}

export async function paketzustand(): Promise<Paketzustand> {
  const geladen = await geladenesVerzeichnis();
  if (!geladen) return fehltMitGroesse();
  const { version, bytes } = geladen.verzeichnis;
  try {
    const neu = await mitZeitlimit(verzeichnisVomServer(), SERVER_ZEITLIMIT_MS);
    if (neu.version !== version) return { art: "veraltet", version, neu: neu.version };
  } catch {
    // Ohne Netz oder bei hängendem Netz bleibt das vorhandene Paket gültig (Sinn des Caches).
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
 * So viele Dateien lädt das Paket gleichzeitig. Warum: Das Paket hat rund 2000 kleine Dateien
 * (Möbel, Porträts); einzeln nacheinander kostete jede eine ganze Netzrunde, das Laden dauerte
 * dadurch auf dem Handy Minuten (Prüfung nach dem großen Merge, 10.11.2026). Sechs entspricht den
 * gleichzeitigen Verbindungen eines Browsers je Server unter HTTP/1.1.
 */
const GLEICHZEITIG = 6;

/**
 * Führt `aufgabe` für alle Einträge aus, höchstens `anzahl` zugleich; der erste Fehler bricht ab
 * (die übrigen laufenden Aufgaben enden noch, ihr Ergebnis bleibt im Cache).
 * Beispiel: 2000 Dateien, anzahl 6 → sechs Arbeiter nehmen sich der Reihe nach die nächste Datei.
 */
export async function jeGleichzeitig<T>(
  eintraege: readonly T[],
  anzahl: number,
  aufgabe: (eintrag: T) => Promise<void>,
): Promise<void> {
  let naechster = 0;
  const arbeiter = async (): Promise<void> => {
    for (let i = naechster++; i < eintraege.length; i = naechster++) {
      await aufgabe(eintraege[i] as T);
    }
  };
  await Promise.all(Array.from({ length: Math.min(anzahl, eintraege.length) }, arbeiter));
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
  // Ton gehört nicht dazu: Das Spiel startet ohne ihn, paket/aktton.ts lädt ihn im Hintergrund.
  const grundpaket = verzeichnis.dateien.filter((d) => d.akt === undefined);
  await jeGleichzeitig(grundpaket, GLEICHZEITIG, (datei) =>
    ladeDatei(speicher, datei, (bytes) => {
      geladen += bytes;
      fortschritt(Math.min(geladen, verzeichnis.bytes), verzeichnis.bytes);
    }),
  );
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

/**
 * Lädt Dateien eines geladenen Pakets in dessen Cache nach (Ton eines Akts). Ohne
 * geladenes Paket nichts. Ausgabe: true, wenn alle Dateien da sind. Wirft bei Netzfehlern.
 */
export async function ladeNach(
  waehle: (datei: Paketverzeichnis["dateien"][number]) => boolean,
  fortschritt: Ladefortschritt,
): Promise<boolean> {
  const geladen = await geladenesVerzeichnis();
  if (!geladen) return false;
  const auswahl = geladen.verzeichnis.dateien.filter(waehle);
  const gesamt = auswahl.reduce((summe, d) => summe + d.bytes, 0);
  const speicher = await caches.open(geladen.name);
  let bisher = 0;
  await jeGleichzeitig(auswahl, GLEICHZEITIG, (datei) =>
    ladeDatei(speicher, datei, (bytes) => {
      bisher += bytes;
      fortschritt(Math.min(bisher, gesamt), gesamt);
    }),
  );
  fortschritt(gesamt, gesamt);
  return true;
}

/** Die Dateien des geladenen Pakets, die noch nicht im Cache liegen (nach Auswahl). */
export async function fehlendeDateien(
  waehle: (datei: Paketverzeichnis["dateien"][number]) => boolean,
): Promise<Paketverzeichnis["dateien"]> {
  const geladen = await geladenesVerzeichnis();
  if (!geladen) return [];
  const speicher = await caches.open(geladen.name);
  const fehlend: Paketverzeichnis["dateien"][number][] = [];
  for (const datei of geladen.verzeichnis.dateien.filter(waehle)) {
    if (!(await speicher.match(adresse(datei.pfad)))) fehlend.push(datei);
  }
  return fehlend;
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
export async function liesPaketdatei(name: string): Promise<Response> {
  const geladen = await geladenesVerzeichnis();
  const pfad = paketpfad(name, geladen?.pfade);
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

/** Bildadressen je Name, einmal je Sitzung und Paket (Kartenwechsel ohne neue Blobs). */
const adressen = new Map<string, Promise<string>>();

/**
 * Eine Datei des Pakets als Objekt-Adresse für Bilder (Phaser lädt sie wie eine Netzadresse).
 * Dieselbe Datei ergibt dieselbe Adresse; Aufrufer geben sie nicht frei (das tut `vergiss`).
 */
export function paketdateiAlsAdresse(pfad: string): Promise<string> {
  const bekannt = adressen.get(pfad);
  if (bekannt) return bekannt;
  const neu = liesPaketdatei(pfad)
    .then((antwort) => antwort.blob())
    .then((blob) => URL.createObjectURL(blob));
  adressen.set(pfad, neu);
  neu.catch(() => {
    if (adressen.get(pfad) === neu) adressen.delete(pfad);
  });
  return neu;
}

/** Nach einer Änderung am Paket: Verzeichnis neu lesen, alte Bildadressen freigeben. */
function vergiss(): void {
  gemerktesPaket = null;
  for (const adresse of adressen.values()) {
    void adresse.then(
      (a) => URL.revokeObjectURL(a),
      () => undefined,
    );
  }
  adressen.clear();
}

/**
 * Wie `paketdateiAlsAdresse`, aber null, wenn das Paket die Datei nicht enthält: für Bilder, die
 * nur mit der gekauften Grafik da sind (Figuren, Porträts). Ein geladenes Paket wird zuerst im
 * Verzeichnis gefragt, damit fehlende Bilder keine Anfragen an den Server auslösen.
 */
export async function paketdateiAlsAdresseOderNull(pfad: string): Promise<string | null> {
  const geladen = await geladenesVerzeichnis();
  if (geladen && !geladen.pfade.has(paketpfad(pfad, geladen.pfade))) return null;
  return paketdateiAlsAdresse(pfad).catch(() => null);
}

/** Beobachter des Paketzustands (für useSyncExternalStore in der Startkarte). */
const beobachter = new Set<() => void>();

function melde(): void {
  vergiss();
  for (const b of beobachter) b();
}

export function beiPaketAenderung(b: () => void): () => void {
  beobachter.add(b);
  return () => beobachter.delete(b);
}
