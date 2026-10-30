/**
 * Laden der Buchdaten (Verzeichnis und Kapitel) aus public/daten/.
 *
 * Rolle im Gesamtbild: Die App liest nur Daten, die die Pipeline aus dem LaTeX erzeugt hat
 * (Konzept 6.1, „ladeIndex“ und „ladeKapitel“). Offline kommen die Dateien aus dem Speicher
 * des Service Workers, die Funktionen merken davon nichts. Der Ordner liegt bei der
 * Sprache der App (/daten/<sprache>/a1); beim Sprachwechsel vergisst vergissBuchdaten alles
 * Geladene, damit die App die Daten der neuen Sprache holt.
 * Abhängigkeiten: erzeugte Typen aus den Schemas, i18n/sprache.ts.
 */
import { datensprache, trainerdatensprache } from "../i18n/sprache";
import type { Datenverzeichnis } from "./generiert/index";
import type { Eroeffnungsliste } from "./generiert/eroeffnungsliste";
import { praxisbuchAus, type Praxisbuch } from "../engine/praxisbuch";
import {
  alsPraxiseintraege,
  eroeffnungsbaenderAus,
  type Eroeffnungsbaender,
} from "../spiel/eroeffnungsbaender";
import { zusatzpartienAus, type Zusatzpartie } from "../training/zusatzpartien";
import type { Glossar } from "./generiert/glossar";
import {
  alsZusatzaufgabe,
  zusatzeintraegeAus,
  type Zusatzaufgabe,
} from "../training/zusatzaufgaben";
import type { Kapitel } from "./generiert/kapitel";
import type { Nachschlagen } from "./generiert/nachschlagen";

export type { Datenverzeichnis, Eroeffnungsliste, Glossar, Kapitel, Nachschlagen };
export type { Eintrag as Glossareintrag } from "./generiert/glossar";
export type { Abbildung, Textteil } from "./generiert/abbildung";

/** Auflage der Buchdaten (Konzept 11.4). */
const AUFLAGE = "a1";

/**
 * Ordner der Daten, die nicht aus dem Buch kommen (etwa die Eröffnungsliste von Lichess). Sie gibt
 * es in denselben Sprachen wie die Trainerdaten; deshalb gilt hier die Sprache der Trainerdaten.
 */
function sprachordner(): string {
  return `/daten/${trainerdatensprache()}`;
}

/** Ordner der Buchdaten für Sprache und Auflage, etwa „/daten/de/a1“. */
function datenordner(): string {
  return `/daten/${datensprache()}/${AUFLAGE}`;
}

const geladeneKapitel = new Map<number, Promise<Kapitel>>();
let verzeichnis: Promise<Datenverzeichnis> | null = null;

/** Lädt eine JSON-Datei und meldet Fehler verständlich, statt sie zu verschlucken. */
async function ladeJson<T>(pfad: string): Promise<T> {
  const antwort = await fetch(pfad);
  if (!antwort.ok) {
    throw new Error(`${pfad}: ${antwort.status} ${antwort.statusText}`);
  }
  return (await antwort.json()) as T;
}

/**
 * Lädt das Verzeichnis aller Kapitel und Abbildungen.
 *
 * Warum: Das Nummernfeld „Abbildung öffnen“ muss wissen, welche Abbildungen es gibt, ohne alle
 * Kapitel zu laden.
 * Ausgabe: Verzeichnis (index.json); wird nur einmal geladen.
 * Sonderfälle: Ein Fehler wird nicht gemerkt, damit ein späterer Versuch neu lädt.
 */
export function ladeIndex(): Promise<Datenverzeichnis> {
  if (!verzeichnis) {
    verzeichnis = ladeJson<Datenverzeichnis>(`${datenordner()}/index.json`).catch(
      (fehler: unknown) => {
        verzeichnis = null;
        throw fehler;
      },
    );
  }
  return verzeichnis;
}

/**
 * Lädt alle Daten eines Kapitels.
 *
 * Eingabe: Kapitelnummer. Ausgabe: Kapitel mit Abschnitten und Abbildungen.
 * Beispiel: ladeKapitel(1) liefert 43 Abbildungen, darunter Abb. 1.26.
 * Sonderfälle: Unbekanntes Kapitel → Fehler mit Grund. Geladene Kapitel bleiben im Speicher.
 */
export async function ladeKapitel(nummer: number): Promise<Kapitel> {
  const bekannt = geladeneKapitel.get(nummer);
  if (bekannt) {
    return bekannt;
  }
  const index = await ladeIndex();
  const eintrag = index.kapitel.find((k) => k.kapitel === nummer);
  if (!eintrag) {
    throw new Error(`Kapitel ${nummer} ist in den Daten nicht enthalten.`);
  }
  const ladevorgang = ladeJson<Kapitel>(`${datenordner()}/${eintrag.datei}`);
  geladeneKapitel.set(nummer, ladevorgang);
  ladevorgang.catch(() => geladeneKapitel.delete(nummer));
  return ladevorgang;
}

/** Dateien, die nur einmal geladen werden (Glossar, Nachschlagen); Fehler werden nicht gemerkt. */
const einmalGeladen = new Map<string, Promise<unknown>>();

function einmal<T>(datei: string): Promise<T> {
  const bekannt = einmalGeladen.get(datei);
  if (bekannt) return bekannt as Promise<T>;
  const ladevorgang = ladeJson<T>(`${datenordner()}/${datei}`);
  einmalGeladen.set(datei, ladevorgang);
  ladevorgang.catch(() => einmalGeladen.delete(datei));
  return ladevorgang;
}

/**
 * Lädt das Glossar (255 Einträge im Anhang des Buches).
 *
 * Beispiel: Eintrag „Abschneiden“ mit Stelle „Abschnitt 9.1“ und Abb. 9.1.
 */
export async function ladeGlossar(): Promise<Glossar> {
  const index = await ladeIndex();
  return einmal<Glossar>(index.glossar);
}

/**
 * Lädt Denkroutine (Kopiervorlage) und Gesamt-Checkliste (Kapitel 12).
 *
 * Beispiel: Denkroutine mit den vier Schritten „Stellung erfassen.“ bis „Bewerten und vergleichen.“.
 */
export async function ladeNachschlagen(): Promise<Nachschlagen> {
  const index = await ladeIndex();
  return einmal<Nachschlagen>(index.nachschlagen);
}

let eroeffnungsliste: Promise<Eroeffnungsliste> | null = null;

/**
 * Lädt die Namen der Eröffnungen außerhalb des Buches (freie Liste von Lichess).
 *
 * Beispiel: Eintrag „Sizilianische Verteidigung: Najdorf Variation“ (B90).
 * Sonderfälle: Ein Fehler wird nicht gemerkt, damit ein späterer Versuch neu lädt.
 */
export function ladeEroeffnungsliste(): Promise<Eroeffnungsliste> {
  if (!eroeffnungsliste) {
    eroeffnungsliste = ladeJson<Eroeffnungsliste>(`${sprachordner()}/eroeffnungen-lichess.json`);
    eroeffnungsliste.catch(() => {
      eroeffnungsliste = null;
    });
  }
  return eroeffnungsliste;
}

let praxisbuch: Promise<Praxisbuch> | null = null;
let eroeffnungsbaender: Promise<Eroeffnungsbaender> | null = null;

/**
 * Lädt die Eröffnungen nach Spielstärke (spiel/eroeffnungsbaender.ts), unabhängig von der Sprache.
 * Einmal geladen; ein Fehler wird nicht gemerkt, damit ein späterer Versuch neu lädt.
 */
export function ladeEroeffnungsbaender(): Promise<Eroeffnungsbaender> {
  if (!eroeffnungsbaender) {
    eroeffnungsbaender = ladeJson<unknown>("/daten/eroeffnungsbaender.json").then((roh) => {
      const daten = eroeffnungsbaenderAus(roh);
      if (!daten) throw new Error("/daten/eroeffnungsbaender.json: unbekanntes Format");
      return daten;
    });
    eroeffnungsbaender.catch(() => {
      eroeffnungsbaender = null;
    });
  }
  return eroeffnungsbaender;
}

/**
 * Hängt die Eröffnungen nach Spielstärke an die benannten Eröffnungen des Praxisbuchs an (seit
 * 0.3.10, Varianten und Gambits seit 0.3.11), damit ein Bot ihnen folgt wie den bisherigen.
 * Vorhandene Namen bleiben, wie sie sind; angehängte tragen das Gewicht 0.
 * Fehlt die Datei, bleibt das Praxisbuch unverändert.
 */
async function mitEroeffnungsbaendern(buch: Praxisbuch): Promise<Praxisbuch> {
  const baender = await ladeEroeffnungsbaender().catch((fehler: unknown) => {
    console.warn("Eröffnungen nach Spielstärke nicht geladen:", fehler);
    return null;
  });
  if (!baender) return buch;
  const bekannt = new Set((buch.eroeffnungen ?? []).map(([name]) => name));
  const neu = alsPraxiseintraege(baender).filter(([name]) => {
    if (bekannt.has(name)) return false;
    bekannt.add(name);
    return true;
  });
  return { ...buch, eroeffnungen: [...(buch.eroeffnungen ?? []), ...neu] };
}

/**
 * Lädt das Praxisbuch (engine/praxisbuch.ts): Eröffnungszüge echter Menschen je
 * Zeitklasse und Wertungsband, unabhängig von der Sprache. Einmal geladen; ein Fehler wird nicht
 * gemerkt, damit ein späterer Versuch neu lädt.
 */
export function ladePraxisbuch(): Promise<Praxisbuch> {
  if (!praxisbuch) {
    praxisbuch = ladeJson<unknown>("/daten/praxisbuch.json").then((roh) => {
      const buch = praxisbuchAus(roh);
      if (!buch) throw new Error("/daten/praxisbuch.json: unbekanntes Format");
      return mitEroeffnungsbaendern(buch);
    });
    praxisbuch.catch(() => {
      praxisbuch = null;
    });
  }
  return praxisbuch;
}

let zusatzpartien: Promise<readonly Zusatzpartie[]> | null = null;

/**
 * Lädt die Zusatzpartien für „Zug erraten“ (training/zusatzpartien.ts): berühmte Klassiker und
 * aktuelle Turnierpartien, nicht aus dem Buch, eine Datei für beide Sprachen (Texte je Sprache).
 * Einmal geladen; ein Fehler wird nicht gemerkt, damit ein späterer Versuch neu lädt.
 */
export function ladeZusatzpartien(): Promise<readonly Zusatzpartie[]> {
  if (!zusatzpartien) {
    zusatzpartien = ladeJson<unknown>("/daten/zusatzpartien.json").then((roh) => {
      const partien = zusatzpartienAus(roh);
      if (!partien) throw new Error("/daten/zusatzpartien.json: unbekanntes Format");
      return partien;
    });
    zusatzpartien.catch(() => {
      zusatzpartien = null;
    });
  }
  return zusatzpartien;
}

let zusatzaufgaben: Promise<Zusatzaufgabe[]> | null = null;

/**
 * Lädt die Zusatzaufgaben des Taktiktrainers (Lichess, nicht aus dem Buch, training/
 * zusatzaufgaben.ts), unabhängig von der Sprache. Aufgaben mit unspielbaren Zügen fallen weg.
 * Einmal geladen; ein Fehler wird nicht gemerkt, damit ein späterer Versuch neu lädt.
 */
export function ladeZusatzaufgaben(): Promise<Zusatzaufgabe[]> {
  if (!zusatzaufgaben) {
    zusatzaufgaben = ladeJson<unknown>("/daten/zusatzaufgaben.json").then((roh) => {
      const eintraege = zusatzeintraegeAus(roh);
      if (!eintraege) throw new Error("/daten/zusatzaufgaben.json: unbekanntes Format");
      return eintraege.flatMap((e) => alsZusatzaufgabe(e) ?? []);
    });
    zusatzaufgaben.catch(() => {
      zusatzaufgaben = null;
    });
  }
  return zusatzaufgaben;
}

/**
 * Vergisst alle geladenen Buchdaten (Verzeichnis, Kapitel, Glossar, Nachschlagen, Eröffnungen).
 *
 * Warum: Nach einem Sprachwechsel gehören die gemerkten Daten zur alten Sprache.
 */
export function vergissBuchdaten(): void {
  verzeichnis = null;
  geladeneKapitel.clear();
  einmalGeladen.clear();
  eroeffnungsliste = null;
}
