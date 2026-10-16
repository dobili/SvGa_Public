/**
 * Datensicherung: alle eigenen Daten als eine Datei exportieren und wieder einspielen.
 *
 * Rolle im Gesamtbild: exportiere und importiere aus Konzept 6.4; Pflichtenheft 4, Stufe 2
 * „Datensicherung: Export und Import aller eigenen Daten als eine Datei“ mit dem Abnahmepunkt
 * „Export auf einem Gerät und Import auf einem anderen“. Die Datei ist JSON mit Kennung,
 * App-Version, Zeitpunkt und den Nutzerdaten (Konzept 4.7: „Export schreibt alle Daten mit
 * schemaVersion und App-Version“). Beim Einspielen gilt dieselbe Umwandlung wie beim Laden.
 * Abhängigkeiten: speicher/format.ts, speicher/speicher.ts.
 */
import { wandleUm, type Nutzerdaten } from "./format";
import { aendere, speichere, speicherzustand } from "./speicher";

/** Kennung im Kopf jeder Sicherungsdatei; Dateien ohne sie werden als fremd abgelehnt. */
export const DATEIKENNUNG = "schach-von-grund-auf/nutzerdaten";
/** Einrückung der Datei, damit sie sich zur Not auch von Hand lesen lässt. */
const EINRUECKUNG = 2;
/** Nach so vielen Tagen ohne Sicherung erscheint der sanfte Hinweis (Konzept 9.4). */
export const HINWEIS_NACH_TAGEN = 28;
const MS_JE_TAG = 86_400_000;

export interface Sicherungsdatei {
  readonly art: typeof DATEIKENNUNG;
  readonly appVersion: string;
  readonly exportiert: string;
  readonly daten: Nutzerdaten;
}

export type Sicherungspruefung =
  | {
      readonly ok: true;
      readonly daten: Nutzerdaten;
      readonly appVersion: string;
      readonly exportiert: string;
    }
  | { readonly ok: false; readonly grund: "keinJson" | "fremd" | "kaputt" | "neuer" };

/** Kurzbeschreibung einer Sicherung für die Rückfrage vor dem Einspielen. */
export interface Inhaltsangabe {
  readonly abbildungen: number;
  readonly uebungen: number;
  readonly lernziele: number;
}

/** Dateiname mit Datum, etwa „schach-von-grund-auf-sicherung-2026-10-15.json“. */
export function dateiname(jetzt: Date): string {
  return `schach-von-grund-auf-sicherung-${jetzt.toISOString().slice(0, "JJJJ-MM-TT".length)}.json`;
}

/** Die Sicherungsdatei als Text (rein, für Tests). */
export function sicherungAlsText(daten: Nutzerdaten, appVersion: string, jetzt: Date): string {
  const datei: Sicherungsdatei = {
    art: DATEIKENNUNG,
    appVersion,
    exportiert: jetzt.toISOString(),
    daten,
  };
  return JSON.stringify(datei, null, EINRUECKUNG);
}

function istObjekt(wert: unknown): wert is Record<string, unknown> {
  return typeof wert === "object" && wert !== null && !Array.isArray(wert);
}

function liesJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    // Kein Fehler der App: Der Leser hat eine andere Datei gewählt; pruefeSicherung meldet es.
    return undefined;
  }
}

/**
 * Prüft eine Sicherungsdatei und wandelt ihre Daten in das aktuelle Format um.
 *
 * Warum: Eine Datei kann von einer älteren App stammen, von einer neueren, oder gar keine
 * Sicherung sein; nichts davon darf die Daten auf dem Gerät beschädigen.
 * Eingaben: Text der Datei, Zeitpunkt. Ausgabe: Daten mit App-Version und Datum, oder Grund.
 * Beispiel: eine Datei aus 0.2.22 auf einem zweiten Gerät → ok mit allen Haken und Abbildungen.
 * Sonderfälle: „keinJson“ (Bild, PDF …), „fremd“ (JSON ohne Kennung), „neuer“ (Format einer
 * späteren App: erst aktualisieren), „kaputt“ (Kennung da, Daten unbrauchbar).
 */
export function pruefeSicherung(text: string, jetzt: Date): Sicherungspruefung {
  const roh = liesJson(text);
  if (roh === undefined) return { ok: false, grund: "keinJson" };
  if (!istObjekt(roh) || roh.art !== DATEIKENNUNG) return { ok: false, grund: "fremd" };
  const ergebnis = wandleUm(roh.daten, jetzt);
  if (!ergebnis.ok) return { ok: false, grund: ergebnis.grund };
  return {
    ok: true,
    daten: ergebnis.daten,
    appVersion: typeof roh.appVersion === "string" ? roh.appVersion : "?",
    exportiert: typeof roh.exportiert === "string" ? roh.exportiert : "",
  };
}

/** Was in einer Sicherung steckt (für die Rückfrage „Ersetzen?“). */
export function inhaltsangabe(daten: Nutzerdaten): Inhaltsangabe {
  return {
    abbildungen: Object.keys(daten.fortschritt.gesehen).length,
    uebungen: Object.values(daten.fortschritt.uebungen).filter((s) => s.geloest).length,
    lernziele: Object.values(daten.lernstand).reduce((summe, punkte) => summe + punkte.length, 0),
  };
}

/**
 * Ist es Zeit für den sanften Hinweis „Daten sichern“ (Konzept 9.4: alle vier Wochen)?
 *
 * Gezählt wird ab der letzten Sicherung, ohne Sicherung ab dem ersten Start; ohne eigene Daten
 * gibt es nichts zu sichern.
 */
export function sicherungFaellig(daten: Nutzerdaten, jetzt: Date): boolean {
  const angabe = inhaltsangabe(daten);
  if (angabe.abbildungen + angabe.uebungen + angabe.lernziele === 0) return false;
  const seit = daten.letzteSicherung ?? daten.angelegt;
  const tage = (jetzt.getTime() - new Date(seit).getTime()) / MS_JE_TAG;
  return tage >= HINWEIS_NACH_TAGEN;
}

/**
 * Exportiert alle eigenen Daten als Text und merkt das Datum der Sicherung.
 *
 * Ausgabe: der Dateiinhalt; das Herunterladen übernimmt die Oberfläche.
 */
export async function exportiere(appVersion: string, jetzt: Date = new Date()): Promise<string> {
  await aendere((daten) => ({ ...daten, letzteSicherung: jetzt.toISOString() }));
  return sicherungAlsText(speicherzustand().daten, appVersion, jetzt);
}

/**
 * Ersetzt alle eigenen Daten durch eine geprüfte Sicherung (nach der Rückfrage).
 *
 * Ausgabe: true, wenn gespeichert; sonst steht der Fehler im Speicherhinweis.
 */
export function importiere(daten: Nutzerdaten): Promise<boolean> {
  return speichere(daten);
}
