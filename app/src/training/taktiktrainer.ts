/**
 * Taktiktrainer (Kapitel 7): Aufgaben nach Motiv oder gemischt, Zug für Zug lösen.
 *
 * Rolle im Gesamtbild: Trainer „taktik“ (Pflichtenheft 7, AP 13). Die Aufgaben stammen aus
 * inhalte/de/trainer/taktik.json (Fable): Buchaufgaben aus Kapitel 7 und Aufgaben der freien
 * Lichess-Datenbank (CC0), je mit Motiv, Mattbild, Schlüsselfeld und geeichter Schwierigkeit
 * 1 bis 5. Der Leser zieht seine Züge, die App antwortet mit der Gegenseite aus der Lösung.
 * Ein Matt in einem Zug ist immer richtig, auch wenn es nicht der Zug der Lösung ist. Reine
 * Funktionen.
 * Abhängigkeiten: training/uebungsaufgabe.ts (Linien und Zugprüfung), training/zufall.ts.
 * Buchbezug: Kapitel 7, „Die zwölf Grundmotive“ und „Mattbilder“.
 */
import type { Taktikaufgabe } from "../daten/trainerdaten";
import { kanonischeLinie, pruefeZug, type Uebungsaufgabe } from "./uebungsaufgabe";
import { mische, type Zufall } from "./zufall";

/** Die Grundmotive aus Kapitel 7, in der Reihenfolge des Buches. */
export const MOTIVE = [
  "doppelangriff",
  "fesselung",
  "spiess",
  "abzug",
  "doppelschach",
  "hinlenkung",
  "beseitigung",
  "ueberlastung",
  "zwischenzug",
  "gefangen",
  "umwandlung",
  "rettung",
] as const;
export type Taktikmotiv = (typeof MOTIVE)[number];

/** Was der Leser übt: alle Motive gemischt, ein Motiv oder nur Mattbilder. */
export type Taktikthema = "gemischt" | "mattbilder" | Taktikmotiv;

export interface Taktikwahl {
  readonly thema: Taktikthema;
  /** Schwierigkeit 1 bis 5, null für alle. */
  readonly stufe: number | null;
}

function passtZumThema(aufgabe: Taktikaufgabe, thema: Taktikthema): boolean {
  if (thema === "gemischt") return true;
  if (thema === "mattbilder") return aufgabe.mattbild !== null;
  return aufgabe.motiv === thema;
}

/**
 * Wie viele Aufgaben es je Thema gibt (für die Auswahl).
 *
 * Beispiel: „spiess“ → 42 (Buch und Lichess zusammen).
 */
export function anzahlJeThema(aufgaben: readonly Taktikaufgabe[]): Map<Taktikthema, number> {
  const themen: Taktikthema[] = ["gemischt", "mattbilder", ...MOTIVE];
  return new Map(themen.map((t) => [t, aufgaben.filter((a) => passtZumThema(a, t)).length]));
}

/**
 * Eine Runde Aufgaben zum Thema, leichteste zuerst.
 *
 * Warum: Ein Themenblock wie im 30-Minuten-Plan (Kapitel 12) übt ein Motiv am Stück. Mit
 * gewählter Stufe kommen Aufgaben dieser Stufe; reichen sie nicht, die der Nachbarstufen.
 * Buchaufgaben gehen bei gleicher Stufe vor.
 * Ausgabe: höchstens `anzahl` Aufgaben, nach Schwierigkeit sortiert.
 */
export function taktikrunde(
  aufgaben: readonly Taktikaufgabe[],
  wahl: Taktikwahl,
  anzahl: number,
  zufall: Zufall,
): Taktikaufgabe[] {
  const zumThema = mische(
    aufgaben.filter((a) => passtZumThema(a, wahl.thema)),
    zufall,
  );
  const abstand = (a: Taktikaufgabe) =>
    wahl.stufe === null ? 0 : Math.abs(a.schwierigkeit - wahl.stufe);
  const buchZuerst = (a: Taktikaufgabe) => (a.herkunft.quelle === "buch" ? 0 : 1);
  const auswahl = [...zumThema]
    .sort((a, b) => abstand(a) - abstand(b) || buchZuerst(a) - buchZuerst(b))
    .slice(0, anzahl);
  return auswahl.sort((a, b) => a.schwierigkeit - b.schwierigkeit);
}

/**
 * Die Aufgabe als Zugaufgabe: die Lösung und jeder gleich gute erste Zug als eigene Linie.
 *
 * Sonderfall: Ist die Lösung ab der Stellung nicht spielbar (Datenfehler), null.
 */
export function alsZugaufgabe(
  aufgabe: Taktikaufgabe,
): Extract<Uebungsaufgabe, { art: "zug" }> | null {
  const loesung = kanonischeLinie(aufgabe.fen, aufgabe.loesung);
  if (!loesung || loesung.length === 0) return null;
  const weitere = aufgabe.akzeptiert
    .map((zug) => kanonischeLinie(aufgabe.fen, [zug]))
    .filter((linie): linie is string[] => linie !== null);
  return { art: "zug", fen: aufgabe.fen, linien: [loesung, ...weitere] };
}

export type Taktikpruefung =
  | { readonly art: "weiter"; readonly antwort: string }
  | { readonly art: "geloest"; readonly antwort: string | null }
  | { readonly art: "falsch" };

/**
 * Prüft einen Zug des Lesers.
 *
 * Eingaben: Zugaufgabe, bisherige Züge, Zug des Lesers (SAN, wie spieleZug ihn liefert).
 * Ausgabe: „weiter“ mit der Antwort der Gegenseite, „geloest“ (mit der letzten Antwort der
 * Gegenseite, falls die Lösung mit ihr endet) oder „falsch“.
 * Sonderfall: Ein Zug, der mattsetzt, löst die Aufgabe immer (Kapitel 7: Matt geht vor).
 */
export function pruefeTaktikzug(
  aufgabe: Extract<Uebungsaufgabe, { art: "zug" }>,
  bisher: readonly string[],
  zug: string,
): Taktikpruefung {
  if (zug.endsWith("#")) return { art: "geloest", antwort: null };
  const pruefung = pruefeZug(aufgabe, bisher, zug);
  if (pruefung.art === "falsch") return pruefung;
  if (pruefung.art === "geloest") return { art: "geloest", antwort: null };
  const linie = aufgabe.linien[pruefung.linie] ?? [];
  // Endet die Lösung mit dem Zug der Gegenseite, ist sie nach dieser Antwort gelöst.
  const endetMitAntwort = linie.length <= bisher.length + 2;
  return endetMitAntwort
    ? { art: "geloest", antwort: pruefung.antwort }
    : { art: "weiter", antwort: pruefung.antwort };
}
