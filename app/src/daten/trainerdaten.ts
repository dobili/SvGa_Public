/**
 * Laden der Trainerdaten: Taktiktrainer, „Falle oder Köder“, Strukturerkenner, Endspieltrainer
 * und die Engine-Prüfung der Übungen.
 *
 * Rolle im Gesamtbild: Zuarbeit von Fable zu AP 13 (docs/TRAINERDATEN.md). Die Pipeline schreibt
 * die Aufgaben nach inhalte/de/trainer/; der Build kopiert sie nach public/daten/de/trainer/
 * (skripte/kopiere-trainerdaten.mjs). Offline kommen sie aus dem Speicher des Service Workers.
 * Abhängigkeiten: erzeugte Typen aus den Schemas.
 */
import type { AufgabenDesTrainersFalleOderKoder } from "./generiert/trainer-falle";
import type { AufgabenDesEndspieltrainers } from "./generiert/trainer-endspiel";
import type { AufgabenDesStrukturerkenners } from "./generiert/trainer-struktur";
import type { AufgabenDesTaktiktrainers } from "./generiert/trainer-taktik";
import type { EngineGegenprufungDerUbungen } from "./generiert/trainer-uebungen-engine";

export type Taktikdaten = AufgabenDesTaktiktrainers;
export type Fallendaten = AufgabenDesTrainersFalleOderKoder;
export type Strukturdaten = AufgabenDesStrukturerkenners;
export type Endspieldaten = AufgabenDesEndspieltrainers;
export type Uebungspruefung = EngineGegenprufungDerUbungen;
export type { Aufgabe as Taktikaufgabe } from "./generiert/trainer-taktik";
export type { Aufgabe as Fallenaufgabe } from "./generiert/trainer-falle";
export type { Aufgabe as Strukturaufgabe } from "./generiert/trainer-struktur";
export type {
  Aufgabe as Endspielaufgabe,
  Thema as Endspielthema,
  Stichwort as Endspielstichwort,
} from "./generiert/trainer-endspiel";
import { trainerdatensprache } from "../i18n/sprache";

const geladen = new Map<string, Promise<unknown>>();

/** Ordner der Trainerdaten in der Sprache der App, etwa „/daten/de/trainer“. */
function ordner(): string {
  return `/daten/${trainerdatensprache()}/trainer`;
}

/** Vergisst die geladenen Trainerdaten (nach einem Sprachwechsel). */
export function vergissTrainerdaten(): void {
  geladen.clear();
}

/** Lädt eine Datei einmal; ein Fehler wird nicht gemerkt, damit ein späterer Versuch neu lädt. */
function lade<T>(datei: string): Promise<T> {
  const bekannt = geladen.get(datei);
  if (bekannt) return bekannt as Promise<T>;
  const neu = fetch(`${ordner()}/${datei}`).then(async (antwort) => {
    if (!antwort.ok) throw new Error(`${datei}: ${antwort.status} ${antwort.statusText}`);
    return (await antwort.json()) as T;
  });
  geladen.set(datei, neu);
  neu.catch(() => geladen.delete(datei));
  return neu;
}

/** Aufgaben des Taktiktrainers (Beispiel: „taktik-b-7.6“, Spieß aus Abb. 7.6). */
export const ladeTaktik = () => lade<Taktikdaten>("taktik.json");
/** Aufgaben von „Falle oder Köder“ (Beispiel: „falle-b-4.2“, Klammerfalle). */
export const ladeFallen = () => lade<Fallendaten>("falle.json");
/** Aufgaben des Strukturerkenners (Beispiel: „struktur-b-5.3“, Kette). */
export const ladeStrukturen = () => lade<Strukturdaten>("struktur.json");
/** Aufgaben des Endspieltrainers (Beispiel: „endspiel-b-8.19“, Opposition aus Abb. 8.19). */
export const ladeEndspiele = () => lade<Endspieldaten>("endspiel.json");
/** Engine-Prüfung der 86 Übungen (einziger Zug, gleichwertige Züge). */
export const ladeUebungspruefung = () => lade<Uebungspruefung>("uebungen-engine.json");
