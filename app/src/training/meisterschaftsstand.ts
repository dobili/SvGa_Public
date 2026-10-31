/**
 * Stand der Meisterschaft über alle Themen (Gamifizierung P3): Medaille je Thema, neue Stufen zum
 * Feiern, Zählungen für Erfahrung, Abzeichen und Extras.
 *
 * Rolle im Gesamtbild: training/meisterschaft.ts kennt die Regeln für ein Thema; diese Datei legt
 * sie über alle Themen der Nutzerdaten. Gelesen von der Profilkarte „Deine Themen“, der Meldung am
 * Rundenende, den Erfahrungspunkten (ERFAHRUNGSQUELLEN), den Abzeichen der Meisterschaft und der
 * Lage der Extras. Die Probe der Aufgabenseite kommt als eigene Eingabe dazu (Thema → Stufe) und
 * ändert nie die gespeicherten Daten.
 * Abhängigkeiten: training/meisterschaft.ts, training/kurzplaene.ts, speicher/gamifizierung.ts.
 */
import type { Gamifizierungsdaten, Themenstand } from "../speicher/gamifizierung";
import {
  ausVerdientSchluessel,
  AUFFRISCHEN_NACH_TAGEN,
  hoehereStufe,
  MEDAILLENSTUFEN,
  naechsteRegel,
  stufeAus,
  stufennummer,
  STUFENREGELN,
  verdientSchluessel,
  type Medaillenstufe,
  type Stufenfortschritt,
} from "./meisterschaft";

/** Was die Meisterschaft aus den Nutzerdaten liest. */
export type Meisterschaftsdaten = Pick<Gamifizierungsdaten, "themen" | "verdient">;

/** Probe der Aufgabenseite: Thema → Stufe, nur auf dem Gerät. */
export type Themenprobe = Readonly<Record<string, Medaillenstufe>>;

/** Die Medaille eines Themas. */
export interface Themenmedaille {
  readonly thema: string;
  readonly stufe: Medaillenstufe | null;
  /** Fortschritt zur nächsten Stufe; null nach Gold. */
  readonly naechste: (Stufenfortschritt & { readonly stufe: Medaillenstufe }) | null;
  /** Letzte richtige Antwort liegt mehr als 60 Tage zurück (leiser Hinweis, E4). */
  readonly auffrischen: boolean;
}

const LEER: Themenstand = { richtig: 0, falsch: 0, letzte: "", tage: [], zuletzt: "" };
const MS_JE_TAG = 86_400_000;

/** Höchste gefeierte Stufe je Thema aus „verdient“. */
export function gefeierteStufen(
  verdient: Readonly<Record<string, string>>,
): Readonly<Record<string, Medaillenstufe>> {
  const ergebnis: Record<string, Medaillenstufe> = {};
  for (const schluessel of Object.keys(verdient)) {
    const teil = ausVerdientSchluessel(schluessel);
    if (teil) ergebnis[teil.thema] = hoehereStufe(ergebnis[teil.thema] ?? null, teil.stufe) ?? teil.stufe;
  }
  return ergebnis;
}

/** Alle Themen: aus dem Protokoll, aus „verdient“ und aus der Probe, sortiert. */
export function themenDerMeisterschaft(daten: Meisterschaftsdaten, probe: Themenprobe = {}): string[] {
  const alle = new Set([
    ...Object.keys(daten.themen),
    ...Object.keys(gefeierteStufen(daten.verdient)),
    ...Object.keys(probe),
  ]);
  return [...alle].sort();
}

/** Liegt der letzte Tag mit richtiger Antwort mehr als 60 Tage vor `jetzt`? */
function auffrischen(stand: Themenstand, jetzt: Date): boolean {
  const letzter = [...stand.tage].sort().at(-1);
  if (!letzter) return false;
  const tage = (jetzt.getTime() - Date.parse(`${letzter}T00:00:00`)) / MS_JE_TAG;
  return tage > AUFFRISCHEN_NACH_TAGEN;
}

/**
 * Die Medaille eines Themas, mit Probe.
 * Beispiel: „taktik:fesselung“ mit 7 richtigen → Bronze, nächste Silber „7 von 15“.
 */
export function themenmedaille(
  daten: Meisterschaftsdaten,
  thema: string,
  jetzt: Date,
  probe: Themenprobe = {},
): Themenmedaille {
  const stand = daten.themen[thema] ?? LEER;
  const echt = stufeAus(stand, gefeierteStufen(daten.verdient)[thema] ?? null);
  const stufe = hoehereStufe(echt, probe[thema] ?? null);
  const regel = naechsteRegel(stufe);
  return {
    thema,
    stufe,
    naechste: regel ? { stufe: regel.stufe, ...regel.fortschritt(stand) } : null,
    auffrischen: stufe !== null && auffrischen(stand, jetzt),
  };
}

/** Alle Medaillen. */
export function themenmedaillen(
  daten: Meisterschaftsdaten,
  jetzt: Date,
  probe: Themenprobe = {},
): Themenmedaille[] {
  return themenDerMeisterschaft(daten, probe).map((t) => themenmedaille(daten, t, jetzt, probe));
}

/** Thema → erreichte Stufe (ohne Themen ohne Stufe), etwa für die Lage der Extras. */
export function themenstufen(
  daten: Meisterschaftsdaten,
  probe: Themenprobe = {},
): Readonly<Record<string, Medaillenstufe>> {
  const ergebnis: Record<string, Medaillenstufe> = {};
  for (const m of themenmedaillen(daten, new Date(0), probe)) if (m.stufe) ergebnis[m.thema] = m.stufe;
  return ergebnis;
}

/**
 * Wie viele Themen mindestens diese Stufe haben, wahlweise nur mit einem Präfix.
 * Beispiel: zaehleThemen(stufen, „gold“, „taktik“) → Taktikmotive in Gold.
 */
export function zaehleThemen(
  stufen: Readonly<Record<string, Medaillenstufe>>,
  stufe: Medaillenstufe,
  praefix: string | null = null,
): number {
  return Object.entries(stufen).filter(
    ([thema, s]) =>
      stufennummer(s) >= stufennummer(stufe) &&
      (praefix === null || thema.startsWith(`${praefix}:`) || thema === praefix),
  ).length;
}

/** Eine neu erreichte Stufe. */
export interface NeueStufe {
  readonly thema: string;
  readonly stufe: Medaillenstufe;
}

/**
 * Trägt alle erreichten, noch nicht gefeierten Stufen in „verdient“ ein (ohne Probe) und nennt je
 * Thema die erreichte Stufe, wenn sie selbst neu ist. Beispiel: Fesselung erstmals mit 15 richtigen und 80 % → Bronze und
 * Silber eingetragen, gemeldet „Silber“.
 */
export function mitNeuenStufen<T extends Meisterschaftsdaten>(
  daten: T,
  jetzt: Date,
): { daten: T; neue: NeueStufe[] } {
  const datum = jetzt.toISOString();
  const verdient: Record<string, string> = { ...daten.verdient };
  const neue: NeueStufe[] = [];
  for (const { thema, stufe } of themenmedaillen(daten, jetzt)) {
    const offen = MEDAILLENSTUFEN.slice(0, stufennummer(stufe) + 1).filter(
      (s) => verdient[verdientSchluessel(s, thema)] === undefined,
    );
    // Gemeldet wird nur die erreichte Stufe selbst; fehlende darunter kommen still dazu.
    if (stufe && offen.at(-1) === stufe) neue.push({ thema, stufe });
    for (const s of offen) verdient[verdientSchluessel(s, thema)] = datum;
  }
  const geaendert = Object.keys(verdient).length !== Object.keys(daten.verdient).length;
  return geaendert ? { daten: { ...daten, verdient }, neue } : { daten, neue };
}

/**
 * Erfahrungspunkte der Meisterschaft, je Stufe eine Quelle (Bronze 10, Silber 25, Gold 50 aus
 * STUFENREGELN), für ERFAHRUNGSQUELLEN. Ein Thema in Gold zählt in allen drei Quellen (85 Punkte),
 * weil es Bronze und Silber vorher erreicht hat. Gezählt wird ohne Probe.
 */
export const MEISTERSCHAFT_ERFAHRUNG: readonly {
  readonly kennung: string;
  readonly gewicht: number;
  readonly zaehle: (daten: Meisterschaftsdaten) => number;
}[] = STUFENREGELN.map((regel) => ({
  kennung: `meisterschaft-${regel.stufe}`,
  gewicht: regel.erfahrung,
  zaehle: (daten: Meisterschaftsdaten) => zaehleThemen(themenstufen(daten), regel.stufe),
}));
