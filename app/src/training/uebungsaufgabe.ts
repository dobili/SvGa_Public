/**
 * Eine Übung des Buches als Aufgabe für die App: Stellung, erwartete Züge, Prüfung der Eingabe.
 *
 * Rolle im Gesamtbild: AP 13 (Konzept 9.2, Eingabeart „Zug ziehen“, genutzt von „Übungen“). Die
 * Lösung steht in der freigegebenen Erklärung (inhalte/de/texte/, Feld „loesung“) als Zugfolge in
 * deutscher Notation, etwa „1. cxd5! cxd5 2. exd5 exd5 3. Sxd5“, dazu gleichwertige Züge
 * („akzeptiert“). Der Leser zieht die Züge seiner Seite, die App antwortet mit den Zügen der
 * Gegenseite aus der Lösung. Übungen ohne Zugfolge ab ihrem Diagramm (Notation schreiben,
 * Fragen zum Plan) sind Denkaufgaben: erst selbst denken, dann Lösung ansehen und einschätzen.
 * Reine Funktionen.
 * Abhängigkeiten: chessops (über schach/stellung und spiel/zuege).
 */
import { makeFen } from "chessops/fen";
import type { Uebungspruefung } from "../daten/trainerdaten";
import { makeSanAndPlay, parseSan } from "chessops/san";
import { regelstellung } from "../spiel/zuege";

/** Deutsche Figurenbuchstaben → englische (Daten und chessops sind englisch). */
const DEUTSCH_ENGLISCH: Readonly<Record<string, string>> = { S: "N", L: "B", T: "R", D: "Q", K: "K" };

export type Uebungsaufgabe =
  | {
      readonly art: "zug";
      readonly fen: string;
      /** Die Lösung des Buches und jede akzeptierte Alternative, als Züge in Kurznotation. */
      readonly linien: readonly (readonly string[])[];
    }
  | { readonly art: "denken" };

/** Ergebnis eines Zuges des Lesers. */
export type Zugpruefung =
  /** Richtig, und die Linie geht weiter: Die App spielt `antwort`, dann ist der Leser wieder dran. */
  | { readonly art: "weiter"; readonly antwort: string; readonly linie: number }
  /** Richtig, die Linie ist zu Ende: gelöst. */
  | { readonly art: "geloest"; readonly linie: number }
  | { readonly art: "falsch" };

/**
 * Zerlegt eine Zugfolge in deutscher Notation in Züge in englischer Kurznotation.
 *
 * Beispiel: „1. cxd5! cxd5 2. exd5“ → [„cxd5“, „cxd5“, „exd5“]; „4... Sf6“ → [„Nf6“];
 * „2. Sh6++“ (Doppelschach, Abb. 7.55) → [„Nh6+“]; „e8=D“ → [„e8=Q“].
 */
export function zuegeAusText(text: string): string[] {
  const zuege: string[] = [];
  for (const roh of text.replace(/…/g, "...").split(/\s+/)) {
    const ohneNummer = roh.replace(/^\d+\.(\.\.)?/, "");
    const ohneZeichen = ohneNummer.replace(/[!?]+$/, "").replace(/\+\+$/, "+");
    if (ohneZeichen === "") continue;
    const englisch = ohneZeichen
      .replace(/^[SLTDK]/, (b) => DEUTSCH_ENGLISCH[b] ?? b)
      .replace(/=([SLTD])/, (_, b: string) => `=${DEUTSCH_ENGLISCH[b] ?? b}`)
      .replace(/^0-0-0/, "O-O-O")
      .replace(/^0-0/, "O-O");
    zuege.push(englisch);
  }
  return zuege;
}

/**
 * Spielt eine Linie ab einer Stellung und schreibt jeden Zug so, wie chessops ihn schreibt.
 *
 * Warum: Der Vergleich mit dem Zug des Lesers soll nicht an Schreibweisen scheitern (Schach-
 * zeichen, überflüssige Angaben wie „Sbd2“). Ausgabe: null, wenn ein Zug nicht passt.
 */
export function kanonischeLinie(fen: string, zuege: readonly string[]): string[] | null {
  const pos = regelstellung(fen);
  if (!pos) return null;
  const linie: string[] = [];
  for (const san of zuege) {
    const zug = parseSan(pos, san);
    if (!zug) return null;
    linie.push(makeSanAndPlay(pos, zug));
  }
  return linie;
}

/**
 * Die Aufgabe zu einer Übung.
 *
 * Eingaben: Stellung des ersten Diagramms (null bei Übungen ohne Diagramm), Lösung und akzeptierte
 * Züge aus der freigegebenen Erklärung (null, wenn es keine Zugfolge gibt).
 * Ausgabe: „zug“ mit allen spielbaren Linien, sonst „denken“.
 * Beispiel: Übung „Drohung ignoriert?“ (Abb. 1.40), „1. Sc7+!“ → zug mit [[„Nc7+“]].
 * Sonderfall: Eine akzeptierte Alternative, die ab der Stellung nicht spielbar ist, fällt weg.
 */
export function aufgabeZu(
  fen: string | null,
  loesung: string | null,
  akzeptiert: readonly string[],
): Uebungsaufgabe {
  if (!fen || !loesung) return { art: "denken" };
  const linien = [loesung, ...akzeptiert]
    .map((text) => kanonischeLinie(fen, zuegeAusText(text)))
    .filter((linie): linie is string[] => linie !== null && linie.length > 0);
  // Die Lösung des Buches muss spielbar sein; sonst ist es keine Zugaufgabe.
  if (linien.length === 0 || kanonischeLinie(fen, zuegeAusText(loesung)) === null) {
    return { art: "denken" };
  }
  return { art: "zug", fen, linien };
}

/**
 * Übungen, bei denen die App die gleich guten Züge der Engine-Prüfung zusätzlich gelten lässt
 * (Empfehlung T1, umgesetzt in 0.2.47): Übung 6 (Abb. 1.42), 11 (2.151), 15 (3.81), 39 (7.51).
 * Nicht bei den Technikübungen 60 und 66: Dort lehrt die Übung einen Weg.
 */
export const ENGINE_VORSCHLAEGE_UEBERNOMMEN: ReadonlySet<number> = new Set([6, 11, 15, 39]);

/**
 * Die zusätzlich akzeptierten ersten Züge einer Übung aus der Engine-Prüfung (englische
 * Kurznotation, etwa „Qf6“); leer ohne Prüfung oder außerhalb der übernommenen Übungen.
 *
 * Beispiel: Übung 6 (4... Sf6, Buch akzeptiert 4... Lc5) → [„Qf6“, „Bb4+“, „Nxd4“].
 */
export function engineAkzeptiert(pruefung: Uebungspruefung | null, uebung: string): string[] {
  const eintrag = pruefung?.uebungen.find((u) => u.uebung === uebung);
  if (!eintrag || !ENGINE_VORSCHLAEGE_UEBERNOMMEN.has(eintrag.nummer)) return [];
  return [...(eintrag.vorschlagAkzeptiert ?? [])];
}

const ohneSchach = (san: string) => san.replace(/[+#]$/, "");

/**
 * Prüft den nächsten Zug des Lesers.
 *
 * Eingaben: Aufgabe, bisherige Züge der Lösung (Leser und App abwechselnd), Zug des Leser in
 * Kurznotation (wie spieleZug ihn liefert).
 * Ausgabe: „weiter“ mit der Antwort der Gegenseite, „geloest“ oder „falsch“.
 * Beispiel: Übung „Zählen beim Vorstoß“ (Abb. 1.41), Lösung „1. cxd5! cxd5 2. exd5 exd5
 * 3. Sxd5“, akzeptiert „1. exd5“: „cxd5“ → weiter mit „cxd5“; „exd5“ als erster Zug → geloest.
 */
export function pruefeZug(
  aufgabe: Extract<Uebungsaufgabe, { art: "zug" }>,
  bisher: readonly string[],
  zug: string,
): Zugpruefung {
  const stelle = bisher.length;
  const index = aufgabe.linien.findIndex(
    (linie) =>
      linie.length > stelle &&
      bisher.every((z, i) => ohneSchach(z) === ohneSchach(linie[i] ?? "")) &&
      ohneSchach(linie[stelle] ?? "") === ohneSchach(zug),
  );
  if (index < 0) return { art: "falsch" };
  const linie = aufgabe.linien[index] ?? [];
  const antwort = linie[stelle + 1];
  return antwort === undefined ? { art: "geloest", linie: index } : { art: "weiter", antwort, linie: index };
}

/** Stellung nach den bisherigen Zügen (für das Brett). Unpassendes bleibt bei der Ausgangsstellung. */
export function stellungNach(fen: string, zuege: readonly string[]): string {
  const pos = regelstellung(fen);
  if (!pos) return fen;
  for (const san of zuege) {
    const zug = parseSan(pos, san);
    if (!zug) break;
    pos.play(zug);
  }
  return makeFen(pos.toSetup());
}
