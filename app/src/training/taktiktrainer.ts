/**
 * Taktiktrainer (Kapitel 7): Aufgaben nach Motiv oder gemischt, Zug für Zug lösen.
 *
 * Rolle im Gesamtbild: Trainer „taktik“ (Pflichtenheft 7, AP 13). Die Aufgaben stammen aus
 * inhalte/de/trainer/taktik.json (Fable): Buchaufgaben aus Kapitel 7 und Aufgaben der freien
 * Lichess-Datenbank (CC0), je mit Motiv, Mattbild, Schlüsselfeld und geeichter Schwierigkeit
 * 1 bis 5. Der Leser zieht seine Züge, die App antwortet mit der Gegenseite aus der Lösung.
 * Ein Matt in einem Zug ist immer richtig, auch wenn es nicht der Zug der Lösung ist; bei
 * Mattaufgaben auch jeder andere Zug, der beweisbar ebenso schnell mattsetzt (schach/mattsuche.ts,
 * Frage des Autors vom 6.11.2026: „Alle zulässigen Lösungen akzeptieren“). Reine Funktionen.
 * Abhängigkeiten: training/uebungsaufgabe.ts (Linien und Zugprüfung), schach/mattsuche.ts,
 * spiel/zuege.ts, training/zufall.ts.
 * Buchbezug: Kapitel 7, „Die zwölf Grundmotive“ und „Mattbilder“.
 */
import type { Taktikaufgabe } from "../daten/trainerdaten";
import { parseSan } from "chessops/san";
import { erzwingtMatt } from "../schach/mattsuche";
import { regelstellung } from "../spiel/zuege";
import { kanonischeLinie, pruefeZug, stellungNach, type Uebungsaufgabe } from "./uebungsaufgabe";
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

/** Ob eine Aufgabe zum Thema passt (auch für den Serienmodus, training/taktikserie.ts). */
export function passtZumThema(aufgabe: Taktikaufgabe, thema: Taktikthema): boolean {
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
  return new Map(TAKTIKTHEMEN.map((t) => [t, aufgaben.filter((a) => passtZumThema(a, t)).length]));
}

/** Alle Themen der Auswahl, in ihrer Reihenfolge: gemischt, Mattbilder, die zwölf Motive. */
export const TAKTIKTHEMEN: readonly Taktikthema[] = ["gemischt", "mattbilder", ...MOTIVE];

/**
 * Das vorgewählte Thema, wenn der Trainer mit Thema geöffnet wurde (ui/trainer/trainerthema.ts).
 *
 * Warum: „Üben“ aus „Dein nächster Schritt“ (P1) oder an einer Medaille (P3) soll gleich beim
 * Motiv landen, nicht bei „gemischt“.
 * Eingaben: Thema ohne Präfix („fesselung“) oder null, Zahl der Aufgaben je Thema.
 * Beispiele: „fesselung“ mit 30 Aufgaben → „fesselung“; null → „gemischt“.
 * Sonderfall: unbekanntes Thema („gabel“) oder eins ohne Aufgaben → „gemischt“.
 */
export function vorgewaehltesThema(
  thema: string | null,
  anzahl: ReadonlyMap<Taktikthema, number>,
): Taktikthema {
  const bekannt = TAKTIKTHEMEN.find((th) => th === thema);
  return bekannt !== undefined && (anzahl.get(bekannt) ?? 0) > 0 ? bekannt : "gemischt";
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
 * Eine Taktikaufgabe als Zugaufgabe; `matt`: Das Ziel ist Matt, dann gilt auch jeder Zug, der
 * ebenso schnell mattsetzt wie die Lösung.
 */
export type Taktikzugaufgabe = Extract<Uebungsaufgabe, { art: "zug" }> & {
  readonly matt?: boolean;
};

/**
 * Die Aufgabe als Zugaufgabe: die Lösung und jeder gleich gute erste Zug als eigene Linie.
 *
 * Sonderfall: Ist die Lösung ab der Stellung nicht spielbar (Datenfehler), null.
 */
export function alsZugaufgabe(aufgabe: Taktikaufgabe): Taktikzugaufgabe | null {
  const loesung = kanonischeLinie(aufgabe.fen, aufgabe.loesung);
  if (!loesung || loesung.length === 0) return null;
  const weitere = aufgabe.akzeptiert
    .map((zug) => kanonischeLinie(aufgabe.fen, [zug]))
    .filter((linie): linie is string[] => linie !== null);
  return {
    art: "zug",
    fen: aufgabe.fen,
    linien: [loesung, ...weitere],
    matt: aufgabe.ziel === "matt",
  };
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
 * Sonderfall: Bei Mattaufgaben ist auch ein anderer Zug richtig, der beweisbar in nicht mehr
 * eigenen Zügen mattsetzt als der Rest der Lösung (gleichwertiger Lösungszug, siehe
 * gleichschnellesMatt). Die Antwort der Gegenseite ist dann ihre zäheste Verteidigung.
 */
export function pruefeTaktikzug(
  aufgabe: Taktikzugaufgabe,
  bisher: readonly string[],
  zug: string,
): Taktikpruefung {
  if (zug.endsWith("#")) return { art: "geloest", antwort: null };
  const pruefung = pruefeZug(aufgabe, bisher, zug);
  if (pruefung.art === "falsch") return aufgabe.matt ? gleichschnellesMatt(aufgabe, bisher, zug) : pruefung;
  if (pruefung.art === "geloest") return { art: "geloest", antwort: null };
  const linie = aufgabe.linien[pruefung.linie] ?? [];
  // Endet die Lösung mit dem Zug der Gegenseite, ist sie nach dieser Antwort gelöst.
  const endetMitAntwort = linie.length <= bisher.length + 2;
  return endetMitAntwort
    ? { art: "geloest", antwort: pruefung.antwort }
    : { art: "weiter", antwort: pruefung.antwort };
}

/**
 * Prüft einen Zug außerhalb der Lösung einer Mattaufgabe: Setzt er ebenso schnell matt?
 *
 * Warum: Frage des Autors (6.11.2026): „Alle zulässigen Lösungen akzeptieren.“ Ein Zug, der in
 * nicht mehr Zügen mattsetzt als die Lösung, ist genauso gut (Abb. 7.60: nach 1. Th8+ Kxh8 auch
 * 2. Dh1+ statt 2. Dh5+). Ein langsameres Matt bleibt falsch, wie bei Lichess.
 * Eingaben: Zugaufgabe, bisherige Züge (auch schon außerhalb der Lösung), Zug des Lesers.
 * Ausgabe: „weiter“ mit der zähesten Antwort der Gegenseite oder „falsch“.
 * Sonderfall: Die Frist sind die eigenen Züge, die in der Lösung noch folgen (dieser
 * eingerechnet); wer schon abgewichen ist, behält die Frist der Lösung.
 */
function gleichschnellesMatt(
  aufgabe: Taktikzugaufgabe,
  bisher: readonly string[],
  zug: string,
): Taktikpruefung {
  const loesung = aufgabe.linien[0] ?? [];
  const frist = Math.ceil((loesung.length - bisher.length) / 2);
  const pos = regelstellung(stellungNach(aufgabe.fen, bisher));
  const gelesen = pos ? parseSan(pos, zug) : undefined;
  if (!pos || !gelesen || !("from" in gelesen) || frist <= 0) return { art: "falsch" };
  const beweis = erzwingtMatt(pos, gelesen, frist);
  if (beweis.art === "matt") return { art: "geloest", antwort: null };
  return beweis.art === "erzwungen" ? { art: "weiter", antwort: beweis.antwort } : { art: "falsch" };
}
