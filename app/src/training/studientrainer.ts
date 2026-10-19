/**
 * Studien lösen (Kapitel 10) und Zug erraten (Kapitel 11): Zugfolgen des Buches als Aufgaben.
 *
 * Rolle im Gesamtbild: Trainer „studien“ und „zugErraten“ (Pflichtenheft 7, AP 13, Stufe 3).
 * Beide nehmen die Hauptvariante einer Zugfolge des Buches (`beispiele`, je Knoten die erste
 * Fortsetzung). Studien: die Seite am Zug findet die Lösung Zug für Zug, die App antwortet mit
 * dem Zug des Buches (wie der Repertoire-Trainer). Zug erraten: Meisterpartien aus Kapitel 11,
 * der Leser rät die Züge einer Seite, die App deckt den Partiezug auf und zählt die Treffer.
 * Reine Funktionen.
 * Abhängigkeiten: training/repertoiretrainer.ts (Aufgabenform), training/uebungsaufgabe.ts.
 * Buchbezug: Kapitel 10 (Studien) und Kapitel 12, „Zug erraten“ als Trainingsmethode.
 */
import type { Color } from "chessops/types";
import type { Beispiel, Knoten } from "../daten/generiert/beispiel";
import type { Kapitel } from "../daten/generiert/kapitel";
import type { Repertoireaufgabe } from "./repertoiretrainer";
import { kanonischeLinie } from "./uebungsaufgabe";
import { buchbeispiele } from "../daten/buchbeispiele";

/** Kürzere Zugfolgen sind Seitenblicke (eine Mattführung, ein Hinweis), keine Studie. */
const STUDIE_MINDESTENS = 3;
/** Eine Partie zum Zugerraten hat mindestens so viele Halbzüge (keine Vorläufe, keine Übungen). */
const PARTIE_MINDESTENS = 30;

function hauptpfad(knoten: readonly Knoten[]): string[] {
  const erster = knoten[0];
  return erster ? [erster.zug, ...hauptpfad(erster.weiter)] : [];
}

/** Die Seite am Zug in einer FEN. */
function amZug(fen: string): Color {
  return fen.split(" ")[1] === "b" ? "black" : "white";
}

/** Die Hauptvariante einer Zugfolge als Aufgabe für eine Seite; null, wenn sie nicht passt. */
function aufgabeAus(beispiel: Beispiel, seite: Color, mindestens: number): Repertoireaufgabe | null {
  const linie = kanonischeLinie(beispiel.startFen, hauptpfad(beispiel.zuege));
  if (!linie || linie.length < mindestens) return null;
  return { titel: beispiel.titel.replace(/\\,/g, " "), startFen: beispiel.startFen, linie, seite };
}

/** Zugfolgen eines Abschnitts des Kapitels (nicht der Übungen am Ende). */
function ausAbschnitten(kapitel: Kapitel): Beispiel[] {
  return buchbeispiele(kapitel).filter((b) => b.abschnitt?.startsWith(`${kapitel.kapitel}.`) === true);
}

/**
 * Die Studien des Kapitels: Seite am Zug der Startstellung, Hauptvariante des Buches.
 *
 * Beispiel: Kapitel 10 → Saavedra-Studie (Weiß, 1. c7 …), Réti-Studie, Heuäcker-Studie, ….
 */
export function studienAus(kapitel: Kapitel): Repertoireaufgabe[] {
  return ausAbschnitten(kapitel).flatMap(
    (b) => aufgabeAus(b, amZug(b.startFen), STUDIE_MINDESTENS) ?? [],
  );
}

/**
 * Die Meisterpartien des Kapitels zum Zugerraten, für die gewählte Seite.
 *
 * Beispiel: Kapitel 11 → Morphys Opernpartie, Colle–O'Hanlon, …, Botwinnik–Fischer.
 */
export function partienAus(kapitel: Kapitel, seite: Color): Repertoireaufgabe[] {
  return ausAbschnitten(kapitel).flatMap((b) => aufgabeAus(b, seite, PARTIE_MINDESTENS) ?? []);
}

/** Stand beim Zugerraten: wie viele eigene Züge geraten, wie viele getroffen. */
export interface Ratestand {
  readonly versuche: number;
  readonly treffer: number;
}

/** Gilt eine erratene Partie als gut gelöst? Ab der Hälfte der Züge getroffen. */
export function gutGeraten(stand: Ratestand): boolean {
  return stand.versuche > 0 && stand.treffer * 2 >= stand.versuche;
}
