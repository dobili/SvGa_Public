/**
 * Repertoire-Trainer (Kapitel 2): die Hauptvarianten einer Eröffnung Zug für Zug abfragen.
 *
 * Rolle im Gesamtbild: Trainer „repertoire“ (Pflichtenheft 7, AP 13). Die Varianten stammen aus
 * den Zugfolgen des Buches (Kapitel 2, `beispiele`, ein Baum je Eröffnung); die Eröffnungen sind
 * die Abschnitte mit Steckbrief. Der Leser wählt Eröffnung und Seite und zieht seine Züge, die App
 * antwortet mit den Zügen der Gegenseite aus dem Buch. Jeder Weg vom Anfang bis zu einem Blatt
 * des Baumes ist eine Variante. Reine Funktionen.
 * Abhängigkeiten: training/uebungsaufgabe.ts (kanonischeLinie), erzeugte Typen.
 * Buchbezug: Kapitel 2, „Deine Entscheidung: Welche Eröffnungen spielst du?“.
 */
import type { Color } from "chessops/types";
import type { Beispiel, Knoten } from "../daten/generiert/beispiel";
import type { Kapitel } from "../daten/generiert/kapitel";
import { kanonischeLinie } from "./uebungsaufgabe";

/** Kürzere Wege sind Seitenblicke im Text, keine Variante zum Üben. */
export const MINDESTENS_HALBZUEGE = 8;
/** Länger wird eine Variante nicht abgefragt (zwölf Züge je Seite). */
export const HOECHSTENS_HALBZUEGE = 24;

export interface Repertoireeroeffnung {
  readonly id: string;
  readonly titel: string;
  readonly beispiel: Beispiel;
}

export interface Repertoireaufgabe {
  readonly titel: string;
  readonly startFen: string;
  /** Die Züge der Variante in Kurznotation, wie chessops sie schreibt. */
  readonly linie: readonly string[];
  /** Die Seite des Lesers. */
  readonly seite: Color;
}

/** Titel ohne LaTeX-Abstände („1.\,d4“ → „1. d4“). */
function titelVon(beispiel: Beispiel): string {
  return beispiel.titel.replace(/\\,/g, " ");
}

/**
 * Die Eröffnungen des Kapitels: je Abschnitt mit Steckbrief die Zugfolgen dazu.
 *
 * Beispiel: Kapitel 2 → Spanische Partie, Italienische Partie, …, Nimzo-Indische Verteidigung.
 * Sonderfall: Übungen und „Zugumstellungen“ haben keinen Steckbrief und fehlen.
 */
export function eroeffnungenAus(kapitel: Kapitel): Repertoireeroeffnung[] {
  const abschnitte = new Set(kapitel.steckbriefe.map((s) => s.abschnitt));
  return kapitel.beispiele
    .filter((b) => abschnitte.has(b.abschnitt))
    .map((b) => ({ id: b.id, titel: titelVon(b), beispiel: b }));
}

function wege(knoten: readonly Knoten[], pfad: readonly string[]): string[][] {
  if (knoten.length === 0) return [[...pfad]];
  return knoten.flatMap((k) => wege(k.weiter, [...pfad, k.zug]));
}

/** Die Varianten eines Baumes, Hauptvariante zuerst, gekürzt und regelgerecht geschrieben. */
export function varianten(beispiel: Beispiel): string[][] {
  const gesehen = new Set<string>();
  return wege(beispiel.zuege, [])
    .filter((w) => w.length >= MINDESTENS_HALBZUEGE)
    .map((w) => kanonischeLinie(beispiel.startFen, w.slice(0, HOECHSTENS_HALBZUEGE)))
    .filter((linie): linie is string[] => linie !== null)
    .filter((linie) => {
      const schluessel = linie.join(" ");
      if (gesehen.has(schluessel)) return false;
      gesehen.add(schluessel);
      return true;
    });
}

/** Die Aufgaben einer Runde: die Varianten der Eröffnung für die gewählte Seite. */
export function repertoirerunde(
  eroeffnung: Repertoireeroeffnung,
  seite: Color,
  anzahl: number,
): Repertoireaufgabe[] {
  return varianten(eroeffnung.beispiel)
    .slice(0, anzahl)
    .map((linie) => ({
      titel: eroeffnung.titel,
      startFen: eroeffnung.beispiel.startFen,
      linie,
      seite,
    }));
}

/** Ist an dieser Stelle der Linie die Gegenseite am Zug? (Halbzug 0 ist Weiß bei Grundstellung.) */
export function gegnerAmZug(aufgabe: Repertoireaufgabe, stelle: number): boolean {
  const weissBeginnt = aufgabe.startFen.split(" ")[1] !== "b";
  const weissAmZug = (stelle % 2 === 0) === weissBeginnt;
  return (aufgabe.seite === "white") !== weissAmZug;
}

const ohneSchach = (san: string) => san.replace(/[+#]$/, "");

/** Stimmt der Zug des Lesers mit dem Buch an dieser Stelle? */
export function istBuchzug(aufgabe: Repertoireaufgabe, stelle: number, zug: string): boolean {
  const erwartet = aufgabe.linie[stelle];
  return erwartet !== undefined && ohneSchach(erwartet) === ohneSchach(zug);
}

/**
 * Die Züge nach einem richtigen Zug des Lesers: sein Zug und die Antwort der Gegenseite, falls
 * die Linie weitergeht.
 *
 * Beispiel: Spanisch als Weiß, bisher [] , Zug „e4“ → [„e4“, „e5“].
 */
export function mitAntwort(aufgabe: Repertoireaufgabe, bisher: readonly string[]): string[] {
  const stelle = bisher.length;
  const eigener = aufgabe.linie[stelle];
  if (eigener === undefined) return [...bisher];
  const antwort = aufgabe.linie[stelle + 1];
  return antwort === undefined ? [...bisher, eigener] : [...bisher, eigener, antwort];
}

/** Die Züge am Anfang: Beginnt die Gegenseite, steht ihr erster Zug schon auf dem Brett. */
export function anfang(aufgabe: Repertoireaufgabe): string[] {
  const erster = aufgabe.linie[0];
  return gegnerAmZug(aufgabe, 0) && erster !== undefined ? [erster] : [];
}
