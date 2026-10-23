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
import { makeSanAndPlay, parseSan } from "chessops/san";
import { regelstellung } from "../spiel/zuege";

/** Deutsche Figurenbuchstaben → englische (Daten und chessops sind englisch). */
const DEUTSCH_ENGLISCH: Readonly<Record<string, string>> = {
  S: "N",
  L: "B",
  T: "R",
  D: "Q",
  K: "K",
};

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
 * Zusätzlich akzeptierte erste Züge, die das Buch stützt und die laut Engine-Prüfung gleich gut
 * sind (Rückfrage T1, nach Nachlesen im Buch). Übung 6 (Abb. 1.42): Das Buch empfiehlt „einen
 * Entwicklungszug, der selbst etwas angreift“; 4... Lb4+ ist so einer. Übung 15 (Abb. 3.81):
 * gesucht ist ein Zug, der dem Gambit die Kraft nimmt, „ohne weiteres Material zu nehmen“, und
 * 4... d5 nennt das Buch nur „die einfachste Antwort“; 4... Sf6 gilt ebenso. Übung 83
 * (Abb. 12.5): „ein ruhiger Zug wie 1. Dc2“; 1. Te1 ist laut Engine sogar besser.
 * Nicht: Übung 11 („Richtig ist 4... h5 oder 4... h6“), Übung 39 (1. Sxf6+ „lässt die Dame
 * allerdings stehen“), dazu keine frühen Damenzüge und kein 4... Sxd4 in Übung 6 (das Buch nennt
 * ihn „?!“).
 */
const BUCHGESTUETZT: Readonly<Record<string, readonly string[]>> = {
  "ueb:spannung-halten": ["Bb4+"],
  "ueb:goering": ["Nf6"],
  "ueb:kandidatenzuege": ["Re1"],
};

/**
 * Die zusätzlich akzeptierten ersten Züge einer Übung (englische Kurznotation); sonst leer.
 *
 * Beispiel: „ueb:spannung-halten“ (Übung 6) → [„Bb4+“].
 */
export function zusaetzlichAkzeptiert(uebung: string): string[] {
  return [...(BUCHGESTUETZT[uebung] ?? [])];
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
  return antwort === undefined
    ? { art: "geloest", linie: index }
    : { art: "weiter", antwort, linie: index };
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
