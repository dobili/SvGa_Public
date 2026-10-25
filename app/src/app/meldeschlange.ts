/**
 * Warteschlange für Meldungen, die ohne Netz nicht hinausgingen (V9, Nutzungsprüfung 25.10.2026).
 *
 * Rolle im Gesamtbild: app/melden.ts legt eine Meldung hier ab, wenn das Senden mangels Netz
 * scheitert, und schickt sie beim Ereignis `online` und beim nächsten Start nach. Die Schlange
 * liegt als Merker im Gerätespeicher (`svga.meldungen.warten`), nicht in IndexedDB: Das Format der
 * Nutzerdaten bleibt unverändert, und „Alle Daten löschen“ entfernt sie mit allen Merkern.
 * Datenschutz: Die Meldung bleibt auf dem Gerät, bis sie gesendet ist; höchstens zehn Einträge,
 * höchstens 30 Tage (Datenschutzerklärung, „Meldungen aus der App“).
 * Abhängigkeiten: app/merker.ts.
 */
import { liesMerker, schreibeMerker } from "./merker";

/** Was an die Schnittstelle geht: Art, Text und auf Wunsch weitere Angaben, alles Texte. */
export type Meldekoerper = Readonly<Record<string, string>> & {
  readonly art: string;
  readonly text: string;
};

/** Eine wartende Meldung mit Kennung (zum Entfernen nach dem Senden) und Zeitpunkt. */
export interface Vorgemerkt {
  readonly kennung: string;
  readonly zeit: string;
  readonly koerper: Meldekoerper;
}

const MERKER = "meldungen.warten";
/** Höchstens so viele Meldungen warten; die ältesten fallen weg. */
export const HOECHSTZAHL = 10;
const TAG_MS = 24 * 60 * 60 * 1000;
/** Ältere Meldungen sendet die App nicht mehr nach (sie wären überholt). */
export const HOECHSTALTER_MS = 30 * TAG_MS;

function istObjekt(wert: unknown): wert is Record<string, unknown> {
  return typeof wert === "object" && wert !== null && !Array.isArray(wert);
}

/** Ein gespeicherter Körper, wenn alle Werte Texte sind und Art und Text dastehen. */
function koerperAus(roh: unknown): Meldekoerper | null {
  if (!istObjekt(roh)) return null;
  if (!Object.values(roh).every((wert) => typeof wert === "string")) return null;
  const texte = roh as Record<string, string>;
  return typeof texte.art === "string" && typeof texte.text === "string"
    ? (texte as Meldekoerper)
    : null;
}

function eintragAus(roh: unknown, jetzt: Date): Vorgemerkt | null {
  if (!istObjekt(roh) || typeof roh.kennung !== "string" || typeof roh.zeit !== "string") {
    return null;
  }
  const alter = jetzt.getTime() - new Date(roh.zeit).getTime();
  const koerper = koerperAus(roh.koerper);
  if (!koerper || Number.isNaN(alter) || alter > HOECHSTALTER_MS) return null;
  return { kennung: roh.kennung, zeit: roh.zeit, koerper };
}

/**
 * Liest die Schlange aus dem Text des Merkers.
 *
 * Warum: Der Gerätespeicher kann Reste älterer Versionen oder beschädigte Werte enthalten; die
 * App soll daran nie scheitern.
 * Eingaben: Text des Merkers (oder null), jetzt. Ausgabe: gültige Einträge, älteste zuerst.
 * Beispiel: zwei Meldungen vom Vortag → beide; eine von vor 40 Tagen → fällt weg.
 * Sonderfälle: kein Merker, kein JSON oder keine Liste → leere Schlange; unbrauchbare Einträge
 * fallen einzeln weg.
 */
export function schlangeAus(text: string | null, jetzt: Date): Vorgemerkt[] {
  if (!text) return [];
  let roh: unknown;
  try {
    roh = JSON.parse(text);
  } catch (fehler) {
    console.warn("Wartende Meldungen unlesbar, verworfen:", fehler);
    return [];
  }
  if (!Array.isArray(roh)) return [];
  return roh
    .map((eintrag) => eintragAus(eintrag, jetzt))
    .filter((eintrag): eintrag is Vorgemerkt => eintrag !== null);
}

/**
 * Hängt eine Meldung an; bei mehr als HOECHSTZAHL fallen die ältesten weg.
 * Beispiel: zehn wartende Meldungen und eine neue → die erste fällt weg, zehn bleiben.
 */
export function mitNeuer(schlange: readonly Vorgemerkt[], neu: Vorgemerkt): Vorgemerkt[] {
  return [...schlange, neu].slice(-HOECHSTZAHL);
}

/** Die Schlange ohne den Eintrag mit dieser Kennung (nach dem Senden). */
export function ohne(schlange: readonly Vorgemerkt[], kennung: string): Vorgemerkt[] {
  return schlange.filter((eintrag) => eintrag.kennung !== kennung);
}

/** Die wartenden Meldungen auf diesem Gerät. */
export function liesSchlange(jetzt: Date): Vorgemerkt[] {
  return schlangeAus(liesMerker(MERKER), jetzt);
}

/** Schreibt die Schlange; leer wird sie als leere Liste gespeichert. */
export function schreibeSchlange(schlange: readonly Vorgemerkt[]): void {
  schreibeMerker(MERKER, JSON.stringify(schlange));
}

/** Eine eindeutige Kennung; randomUUID fehlt außerhalb sicherer Verbindungen (http). */
function neueKennung(jetzt: Date): string {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${jetzt.toISOString()}-${Math.random()}`;
}

/** Legt eine Meldung in die Schlange (ohne Netz gescheitert) und gibt den Eintrag zurück. */
export function merkeVor(koerper: Meldekoerper, jetzt: Date): Vorgemerkt {
  const eintrag = { kennung: neueKennung(jetzt), zeit: jetzt.toISOString(), koerper };
  schreibeSchlange(mitNeuer(liesSchlange(jetzt), eintrag));
  return eintrag;
}
