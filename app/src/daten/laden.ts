/**
 * Laden der Buchdaten (Verzeichnis und Kapitel) aus public/daten/.
 *
 * Rolle im Gesamtbild: Die App liest nur Daten, die die Pipeline aus dem LaTeX erzeugt hat
 * (Konzept 6.1, „ladeIndex“ und „ladeKapitel“). Offline kommen die Dateien aus dem Speicher
 * des Service Workers, die Funktionen merken davon nichts. Seit 0.2.94 liegt der Ordner bei der
 * Sprache der App (/daten/<sprache>/a1); beim Sprachwechsel vergisst vergissBuchdaten alles
 * Geladene, damit die App die Daten der neuen Sprache holt.
 * Abhängigkeiten: erzeugte Typen aus den Schemas, i18n/sprache.ts.
 */
import { datensprache } from "../i18n/sprache";
import type { Datenverzeichnis } from "./generiert/index";
import type { Eroeffnungsliste } from "./generiert/eroeffnungsliste";
import type { Glossar } from "./generiert/glossar";
import type { Kapitel } from "./generiert/kapitel";
import type { Nachschlagen } from "./generiert/nachschlagen";

export type { Datenverzeichnis, Eroeffnungsliste, Glossar, Kapitel, Nachschlagen };
export type { Eintrag as Glossareintrag } from "./generiert/glossar";
export type { Abbildung, Textteil } from "./generiert/abbildung";

/** Auflage der Buchdaten (Konzept 11.4). */
const AUFLAGE = "a1";

/** Ordner der Daten einer Sprache (Daten, die nicht aus dem Buch kommen, etwa die Eröffnungsliste). */
function sprachordner(): string {
  return `/daten/${datensprache()}`;
}

/** Ordner der Buchdaten für Sprache und Auflage, etwa „/daten/de/a1“. */
function datenordner(): string {
  return `${sprachordner()}/${AUFLAGE}`;
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
 * Lädt die Namen der Eröffnungen außerhalb des Buches (freie Liste von Lichess, seit 0.2.32).
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
