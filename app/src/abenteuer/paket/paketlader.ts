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
 * Musik lädt erst beim Abspielen (Auftrag „Leistung“, 16.11.2026): `liesPaketdatei` holt eine
 * fehlende Datei des Verzeichnisses geprüft in den Cache, `haltePaketdateiVor` tut es ohne Lesen.
 * Adressen stehen in paketadresse.ts, das geprüfte Laden einer Datei in dateiladen.ts (aufgeteilt am
 * 20.11.2026, Regel 4).
 * Ton in zwei Fassungen (RO41, 26.11.2026): Das Gerät lädt nur Opus oder nur AAC (tonfassung.ts);
 * Aufrufer nennen den m4a-Namen, `geraetepfad` setzt ihn um, das Nachladen lässt die andere aus.
 * Abhängigkeiten: schnittstelle/paket.ts, app/sprachpaket.ts (Code-Baustein nachladen).
 */
import { ladeSprachpaket } from "../../app/sprachpaket";
import { PAKET_ABENTEUER } from "../../sw/dateiliste";
import {
  VERZEICHNIS_DATEI,
  type Ladefortschritt,
  type Paketverzeichnis,
  type Paketzustand,
} from "../schnittstelle/paket";
import { Spielfehler } from "../schnittstelle/spielfehler";
import { ladeDatei } from "./dateiladen";
import {
  bisZumFehler,
  gleichzeitigFuer,
  jeGleichzeitig,
  mitZeitlimit,
  protokollVon,
} from "./ladehilfen";
import { adresse, cachename, CACHE_PRAEFIX, mitCache } from "./paketadresse";
import { passtZurFassung, tonfassung, tonpfad } from "./tonfassung";

/** Das Verzeichnis vom Server (immer frisch, damit eine neue Version erkannt wird). */
async function verzeichnisVomServer(): Promise<Paketverzeichnis> {
  const antwort = await fetch(adresse(VERZEICHNIS_DATEI), { cache: "no-cache" });
  if (!antwort.ok) throw new Spielfehler("fehler.paket.verzeichnis", { status: antwort.status });
  return (await antwort.json()) as Paketverzeichnis;
}

type Paketdatei = Paketverzeichnis["dateien"][number];

/** Ein vollständig geladenes Paket: Cache-Name, Verzeichnis und seine Dateien je Pfad. */
interface GeladenesPaket {
  readonly name: string;
  readonly verzeichnis: Paketverzeichnis;
  readonly pfade: ReadonlySet<string>;
  readonly dateien: ReadonlyMap<string, Paketdatei>;
}

async function sucheGeladenesPaket(): Promise<GeladenesPaket | null> {
  if (!mitCache()) return null;
  for (const name of await caches.keys()) {
    if (!name.startsWith(CACHE_PRAEFIX)) continue;
    const speicher = await caches.open(name);
    const antwort = await speicher.match(adresse(VERZEICHNIS_DATEI));
    if (!antwort) continue;
    const verzeichnis = (await antwort.json()) as Paketverzeichnis;
    const dateien = new Map(verzeichnis.dateien.map((d) => [d.pfad, d] as const));
    return { name, verzeichnis, pfade: new Set(dateien.keys()), dateien };
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

/** Liegt ein vollständig geladenes Paket auf dem Gerät? (Ohne Paket lädt nichts nach.) */
export async function paketDa(): Promise<boolean> {
  return (await geladenesVerzeichnis()) !== null;
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
 * Der Pfad, den dieses Gerät liest: wie `paketpfad`, dazu Ton in der Fassung des Geräts.
 * Beispiel auf einem iPhone mit iOS 17.4: „musik/weg.m4a“ → „musik/weg.webm“ (wenn im Paket).
 */
async function geraetepfad(name: string, pfade: ReadonlySet<string> | undefined): Promise<string> {
  return tonpfad(paketpfad(name, pfade ?? null), await tonfassung(), pfade);
}

/** So lange wartet die Startkarte höchstens auf den Server; danach gilt das vorhandene Paket. */
const SERVER_ZEITLIMIT_MS = 3000;

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

/**
 * Zustand des Pakets für die Startkarte: vorhanden, veraltet (neue Version auf dem Server) oder
 * fehlt mit Größe. Ohne Netz gilt ein vorhandenes Paket als aktuell.
 */
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

/** Gleichzeitige Abrufe nach dem Protokoll von paket.json (ladehilfen.ts, gleichzeitigFuer). */
function gleichzeitig(): number {
  return gleichzeitigFuer(protokollVon(adresse(VERZEICHNIS_DATEI)));
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
  // Ton und Großbilder gehören nicht dazu: Das Spiel startet ohne sie, paket/aktton.ts lädt sie
  // im Hintergrund.
  const grundpaket = verzeichnis.dateien.filter((d) => d.akt === undefined && !d.hintergrund);
  // Nach einem Fehler meldet kein Abruf mehr Fortschritt (ladehilfen.ts, bisZumFehler).
  const melder = bisZumFehler(fortschritt);
  await jeGleichzeitig(grundpaket, gleichzeitig(), (datei) =>
    ladeDatei(speicher, datei, (bytes) => {
      geladen += bytes;
      melder.melde(Math.min(geladen, verzeichnis.bytes), verzeichnis.bytes);
    }),
  ).catch((fehler: unknown) => {
    melder.stoppe();
    throw fehler;
  });
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
  waehle: (datei: Paketdatei) => boolean,
  fortschritt: Ladefortschritt,
): Promise<boolean> {
  const geladen = await geladenesVerzeichnis();
  if (!geladen) return false;
  const passt = passtZurFassung(await tonfassung(), geladen.pfade);
  const auswahl = geladen.verzeichnis.dateien.filter((d) => waehle(d) && passt(d));
  const gesamt = auswahl.reduce((summe, d) => summe + d.bytes, 0);
  const speicher = await caches.open(geladen.name);
  let bisher = 0;
  const melder = bisZumFehler(fortschritt);
  await jeGleichzeitig(auswahl, gleichzeitig(), (datei) =>
    ladeDatei(speicher, datei, (bytes) => {
      bisher += bytes;
      melder.melde(Math.min(bisher, gesamt), gesamt);
    }),
  ).catch((fehler: unknown) => {
    melder.stoppe();
    throw fehler;
  });
  fortschritt(gesamt, gesamt);
  return true;
}

/** Die Dateien des geladenen Pakets, die noch nicht im Cache liegen (nach Auswahl). */
export async function fehlendeDateien(
  waehle: (datei: Paketdatei) => boolean,
): Promise<Paketverzeichnis["dateien"]> {
  const geladen = await geladenesVerzeichnis();
  if (!geladen) return [];
  const speicher = await caches.open(geladen.name);
  const fehlend: Paketdatei[] = [];
  const passt = passtZurFassung(await tonfassung(), geladen.pfade);
  for (const datei of geladen.verzeichnis.dateien.filter((d) => waehle(d) && passt(d))) {
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

/** Laufende Abrufe einzelner Dateien in den Cache, damit eine Datei nicht doppelt lädt. */
const behalten = new Map<string, Promise<void>>();

/**
 * Holt eine Datei des geladenen Pakets in dessen Cache, falls sie noch fehlt (geprüft wie beim
 * Laden des Pakets). Warum: Musik lädt erst, wenn sie gespielt wird (Auftrag „Leistung“,
 * 16.11.2026); danach liegt sie offline bereit wie das übrige Paket.
 */
function behalte(geladen: GeladenesPaket, datei: Paketdatei): Promise<void> {
  const schluessel = `${geladen.name}:${datei.pfad}`;
  let vorgang = behalten.get(schluessel);
  if (!vorgang) {
    vorgang = caches
      .open(geladen.name)
      .then((speicher) => ladeDatei(speicher, datei, () => undefined))
      .finally(() => behalten.delete(schluessel));
    behalten.set(schluessel, vorgang);
  }
  return vorgang;
}

/**
 * Legt eine Datei des geladenen Pakets vorab in den Cache, ohne sie zu lesen (Musik des nächsten
 * Orts, ton/vorabladen.ts). Ausgabe: true, wenn sie danach im Cache liegt; ohne geladenes Paket,
 * bei unbekanntem Pfad oder Netzfehler false.
 */
export async function haltePaketdateiVor(name: string): Promise<boolean> {
  const geladen = await geladenesVerzeichnis();
  const datei = geladen?.dateien.get(await geraetepfad(name, geladen.pfade));
  if (!geladen || !datei) return false;
  return behalte(geladen, datei).then(
    () => true,
    () => false,
  );
}

/** Status für „Datei fehlt, der Server lieferte die Startseite“ (wie 404). */
const KEINE_DATEI = 404;

/** Ist die Antwort die Startseite statt der Datei (HTML für eine Datei, die kein HTML ist)? */
export function alsStartseite(pfad: string, antwort: Response): boolean {
  const art = antwort.headers.get("content-type") ?? "";
  return art.startsWith("text/html") && !/\.html?$/.test(pfad);
}

/**
 * Liest eine Datei des Pakets: aus dem geladenen Cache. Fehlt sie dort, aber steht sie im
 * Verzeichnis (Musik, die erst beim Abspielen lädt), kommt sie geprüft in den Cache und von dort.
 * Sonst vom Server (Entwicklung oder verlorener Cache; der Spielstand bleibt davon unberührt).
 */
export async function liesPaketdatei(name: string): Promise<Response> {
  const geladen = await geladenesVerzeichnis();
  const pfad = await geraetepfad(name, geladen?.pfade);
  if (geladen) {
    const speicher = await caches.open(geladen.name);
    const antwort = await speicher.match(adresse(pfad));
    if (antwort) return antwort;
    const datei = geladen.dateien.get(pfad);
    // Ohne Netz bleibt nur der Versuch unten; er meldet den Fehler.
    const behalten = datei
      ? await behalte(geladen, datei).then(
          () => true,
          () => false,
        )
      : false;
    const nachgeladen = behalten ? await speicher.match(adresse(pfad)) : undefined;
    if (nachgeladen) return nachgeladen;
  }
  const antwort = await fetch(adresse(pfad));
  if (!antwort.ok) throw new Spielfehler("fehler.paket.datei", { pfad, status: antwort.status });
  // Fehlt eine Datei, liefert der Server statt 404 oft die Startseite (HTML, Status 200). Ein
  // Porträt ohne Bild zeigte dann ein kaputtes Bild (Abspann: Owen Fisk, Ivy; 20.11.2026).
  if (alsStartseite(pfad, antwort)) {
    throw new Spielfehler("fehler.paket.datei", { pfad, status: KEINE_DATEI });
  }
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

/** Meldet jede Änderung am Paket (geladen, neue Version, gelöscht); Ausgabe: Abmelden. */
export function beiPaketAenderung(b: () => void): () => void {
  beobachter.add(b);
  return () => beobachter.delete(b);
}
