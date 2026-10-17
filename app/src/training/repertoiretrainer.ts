/**
 * Repertoire-Trainer (Kapitel 2): die Hauptvarianten einer Eröffnung Zug für Zug abfragen.
 *
 * Rolle im Gesamtbild: Trainer „repertoire“ (Pflichtenheft 7, AP 13). Die Varianten stammen aus
 * den Zugfolgen des Buches (Kapitel 2, `beispiele`, ein Baum je Eröffnung); die Eröffnungen sind
 * die Abschnitte mit Steckbrief. Der Leser wählt Eröffnung und Seite und zieht seine Züge, die App
 * antwortet mit den Zügen der Gegenseite aus dem Buch. Jeder Weg vom Anfang bis zu einem Blatt
 * des Baumes ist eine Variante. An den Zügen, zu denen eine Abbildung des Kapitels eine Warum-Frage
 * hat (vorbereitete Texte, AP 14), stellt der Trainer sie nach dem Zug (W10). Reine Funktionen.
 * Abhängigkeiten: training/uebungsaufgabe.ts (kanonischeLinie, stellungNach, zuegeAusText),
 * analyse/warumfragen.ts, erzeugte Typen.
 * Buchbezug: Kapitel 2, „Deine Entscheidung: Welche Eröffnungen spielst du?“.
 */
import type { Color } from "chessops/types";
import type { Vorbereitet } from "../analyse/warumfragen";
import type { Beispiel, Knoten } from "../daten/generiert/beispiel";
import type { Abbildung, Kapitel } from "../daten/generiert/kapitel";
import { kanonischeLinie, stellungNach, zuegeAusText } from "./uebungsaufgabe";

/** Kürzere Wege sind Seitenblicke im Text, keine Variante zum Üben. */
export const MINDESTENS_HALBZUEGE = 8;
/** Länger wird eine Variante nicht abgefragt (zwölf Züge je Seite). */
export const HOECHSTENS_HALBZUEGE = 24;

export interface Repertoireeroeffnung {
  readonly id: string;
  readonly titel: string;
  readonly beispiel: Beispiel;
}

/** Eine Warum-Frage an einem Zug der Variante (W10). */
export interface Schluesselfrage {
  /** Halbzug der Linie (ab 0), nach dem die Frage kommt. */
  readonly stelle: number;
  /** Der Zug in der Schreibweise der Daten, etwa „3... a6“. */
  readonly zug: string;
  readonly vorbereitet: Vorbereitet;
}

export interface Repertoireaufgabe {
  readonly titel: string;
  readonly startFen: string;
  /** Die Züge der Variante in Kurznotation, wie chessops sie schreibt. */
  readonly linie: readonly string[];
  /** Die Seite des Lesers. */
  readonly seite: Color;
  /** Die Warum-Fragen an Zügen der Linie, nach Halbzug geordnet (W10). */
  readonly fragen?: readonly Schluesselfrage[];
}

/** Brett und Seite am Zug einer FEN: daran erkennt der Trainer die Stellung einer Abbildung. */
function stellungsschluessel(fen: string): string {
  return fen.split(" ").slice(0, 2).join(" ");
}

/**
 * Die Warum-Fragen an den Zügen einer Linie: Steht vor einem Zug die Stellung einer Abbildung,
 * und gilt eine ihrer Fragen genau diesem Zug, kommt sie nach dem Zug.
 *
 * Warum: Pflichtenheft 7, Repertoire-Trainer: „Warum-Fragen an Schlüsselzügen“.
 * Beispiel: Spanische Partie, Linie über Abb. 2.2 → nach 3... a6 „Warum spielt Schwarz 3... a6?“.
 * Sonderfall: Fragen ohne Zug (zur Stellung) passen zu keinem Zug und fehlen hier.
 */
export function schluesselfragen(
  startFen: string,
  linie: readonly string[],
  abbildungen: readonly Abbildung[],
): Schluesselfrage[] {
  const mitFragen = abbildungen.filter((a) => (a.vorbereitet?.fragen.length ?? 0) > 0);
  const ohneSchachzeichen = (san: string) => san.replace(/[+#]$/, "");
  return linie.flatMap((zug, stelle) => {
    const schluessel = stellungsschluessel(stellungNach(startFen, linie.slice(0, stelle)));
    return mitFragen
      .filter((a) => stellungsschluessel(a.fen) === schluessel)
      .flatMap((a) => {
        const vorbereitet = a.vorbereitet;
        if (!vorbereitet) return [];
        return vorbereitet.fragen
          .filter((f) => f.zug && ohneSchachzeichen(zuegeAusText(f.zug)[0] ?? "") === ohneSchachzeichen(zug))
          .map((f) => ({ stelle, zug: f.zug ?? "", vorbereitet }));
      });
  });
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

/**
 * Die Aufgaben einer Runde: die Varianten der Eröffnung für die gewählte Seite, mit den
 * Warum-Fragen der Abbildungen des Kapitels an ihren Zügen (W10).
 */
export function repertoirerunde(
  eroeffnung: Repertoireeroeffnung,
  seite: Color,
  anzahl: number,
  abbildungen: readonly Abbildung[] = [],
): Repertoireaufgabe[] {
  const startFen = eroeffnung.beispiel.startFen;
  return varianten(eroeffnung.beispiel)
    .slice(0, anzahl)
    .map((linie) => ({
      titel: eroeffnung.titel,
      startFen,
      linie,
      seite,
      fragen: schluesselfragen(startFen, linie, abbildungen),
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
