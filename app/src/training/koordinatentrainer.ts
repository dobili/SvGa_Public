/**
 * Trainer „Koordinaten, Notation, Gangarten“ (Kapitel 0): Felder finden, Züge aufschreiben und
 * ausführen, alle Zielfelder einer Figur antippen.
 *
 * Rolle im Gesamtbild: Trainer „koordinaten“ (Pflichtenheft 7, AP 13), vier Übungsarten:
 *   felder      Feld nennen und antippen, aus beiden Brettperspektiven, auf Zeit,
 *   notieren    gezeigten Zug in der Notation des Buches aufschreiben,
 *   ausfuehren  notierten Zug auf dem Brett ausführen (mit Rochade, en passant, Umwandlung),
 *   gangarten   alle Zielfelder einer Figur antippen.
 * Stellungen kommen aus dem Buch, auch die Sonderzüge (Kapitel 0: Abb. 0.12 bis 0.19, U5,
 * Entscheidung des Autors 17.10.2026); zwei eigene kurze Stellungen ergänzen, was dort fehlt
 * (en passant für Schwarz, Umwandlung mit Schlag). Reine Funktionen.
 * Abhängigkeiten: chessops, schach/drohungen.ts, schach/weiterspielen.ts, training/zufall.ts.
 * Buchbezug: Kapitel 0, „Das Schachbrett“, „Wie ziehen die Figuren?“, „Wie liest man Schachzüge?“.
 */
import { makeSan, parseSan } from "chessops/san";
import { makeSquare } from "chessops/util";
import { GRUNDSPRACHE, sprache } from "../i18n/sprache";
import { legaleZuege } from "../schach/drohungen";
import { legaleZiele, zugFelder } from "../schach/weiterspielen";
import { regelstellung } from "../spiel/zuege";
import type { Buchstellung } from "./buchstellungen";
import { zuegeAusText } from "./uebungsaufgabe";
import { mische, waehle, zahlBis, type Zufall } from "./zufall";

export type Koordinatenart = "felder" | "notieren" | "ausfuehren" | "gangarten";
export const KOORDINATENARTEN: readonly Koordinatenart[] = [
  "felder",
  "notieren",
  "ausfuehren",
  "gangarten",
];

const LINIEN = "abcdefgh";
const REIHEN = 8;
/** Anteil der Aufgaben „ausführen“, die einen Sonderzug verlangen. */
const ANTEIL_SONDERZUEGE = 0.3;
/** So oft kommt ein Sonderzug aus den eigenen Stellungen statt aus dem Buch (U5: ergänzend). */
const ANTEIL_EIGENE_SONDERZUEGE = 0.25;
/** Anteil der Aufgaben mit einem besonderen Zug (Schlag, Schach, Rochade, Umwandlung). */
const ANTEIL_BESONDERE = 0.5;

/** Eine Aufgabe „Feld finden“; `gedreht`: Schwarz unten. */
export interface Feldaufgabe {
  readonly feld: string;
  readonly gedreht: boolean;
}

/**
 * Eine Runde „Feld finden“: erst aus Sicht von Weiß, dann aus Sicht von Schwarz.
 *
 * Beispiel: Anzahl 4 → zwei Felder mit Weiß unten, zwei mit Schwarz unten.
 */
export function feldrunde(anzahl: number, zufall: Zufall): Feldaufgabe[] {
  const haelfte = Math.ceil(anzahl / 2);
  return Array.from({ length: anzahl }, (_, i) => ({
    feld: `${LINIEN.charAt(zahlBis(LINIEN.length, zufall))}${zahlBis(REIHEN, zufall) + 1}`,
    gedreht: i >= haelfte,
  }));
}

/** Eine Zugaufgabe: Stellung und Zug (SAN englisch wie in den Daten). */
export interface Zugaufgabe {
  readonly nummer: string | null;
  readonly fen: string;
  readonly san: string;
  readonly von: string;
  readonly nach: string;
}

/**
 * Sonderzüge an den Buchstellungen aus Kapitel 0 (U5): kurze und lange Rochade für beide
 * Seiten (Abb. 0.12 bis 0.15), en passant (Abb. 0.17), Umwandlung (Abb. 0.19).
 * Regel: Kapitel 0, Sonderzüge Rochade, Schlagen im Vorbeigehen und Umwandlung.
 */
export const BUCHSONDERZUEGE: readonly { nummer: string; san: string }[] = [
  { nummer: "0.12", san: "O-O" },
  { nummer: "0.14", san: "O-O-O" },
  { nummer: "0.13", san: "O-O-O" },
  { nummer: "0.15", san: "O-O" },
  { nummer: "0.17", san: "exd6" },
  { nummer: "0.19", san: "a8=Q" },
];

/**
 * Eigene kurze Stellungen (keine Buchstellungen) nur für das, was Kapitel 0 nicht zeigt:
 * en passant für Schwarz und Umwandlung mit Schlag.
 */
export const SONDERZUEGE: readonly { fen: string; san: string }[] = [
  { fen: "rnbqkbnr/pppp1ppp/8/8/3PpP2/8/PPP1P1PP/RNBQKBNR b KQkq f3 0 3", san: "exf3" },
  { fen: "3r4/4P1k1/8/8/8/8/5K2/8 w - - 0 1", san: "exd8=Q" },
];

/** Ist ein Zug „besonders“ für die Notation: Schlag, Schach, Rochade, Umwandlung, Zusatzangabe? */
function besonders(san: string): boolean {
  return /[x+#=]|O-O|^[NBRQK][a-h1-8][a-h]/.test(san);
}

/** Eine Zugaufgabe zu Stellung und Zug, mit Feldern (bei der Rochade Zielfeld des Königs). */
function zugaufgabe(nummer: string | null, fen: string, san: string): Zugaufgabe | null {
  const felder = zugFelder(fen, san);
  return felder ? { nummer, fen, san, ...felder } : null;
}

/** Ein Zug aus einer Buchstellung, halb so oft ein besonderer. */
function zugAusBuch(buch: Buchstellung, zufall: Zufall): Zugaufgabe | null {
  const regeln = buch.stellung.regeln;
  if (!regeln) return null;
  const zuege = legaleZuege(regeln).map((zug) => makeSan(regeln, zug));
  const besondere = zuege.filter(besonders);
  const auswahl = besondere.length > 0 && zufall() < ANTEIL_BESONDERE ? besondere : zuege;
  const san = waehle(auswahl, zufall);
  return san ? zugaufgabe(buch.nummer, buch.stellung.fen, san) : null;
}

/** Eine Sonderzug-Aufgabe; die Schreibweise kommt von chessops (mit Schachzeichen). */
function sonderzug(eintrag: { nummer: string | null; fen: string; san: string }): Zugaufgabe | null {
  const regeln = regelstellung(eintrag.fen);
  const zug = regeln ? parseSan(regeln, eintrag.san) : undefined;
  if (!regeln || !zug) return null;
  return zugaufgabe(eintrag.nummer, eintrag.fen, makeSan(regeln, zug));
}

const istAufgabe = (a: Zugaufgabe | null): a is Zugaufgabe => a !== null;

/** Die eigenen Sonderzug-Aufgaben (en passant für Schwarz, Umwandlung mit Schlag). */
export function sonderzugaufgaben(): Zugaufgabe[] {
  return SONDERZUEGE.map((e) => sonderzug({ nummer: null, ...e })).filter(istAufgabe);
}

/** Die Sonderzug-Aufgaben an den Buchstellungen aus Kapitel 0, soweit geladen. */
export function buchsonderzugaufgaben(stellungen: readonly Buchstellung[]): Zugaufgabe[] {
  return BUCHSONDERZUEGE.map(({ nummer, san }) => {
    const buch = stellungen.find((b) => b.nummer === nummer);
    return buch ? sonderzug({ nummer, fen: buch.stellung.fen, san }) : null;
  }).filter(istAufgabe);
}

/** Sonderzüge für eine Runde: aus dem Buch, je Platz zu einem Viertel aus den eigenen. */
function sonderzugauswahl(
  stellungen: readonly Buchstellung[],
  anzahl: number,
  zufall: Zufall,
): Zugaufgabe[] {
  const buch = mische(buchsonderzugaufgaben(stellungen), zufall);
  const eigene = mische(sonderzugaufgaben(), zufall);
  const auswahl: Zugaufgabe[] = [];
  for (let i = 0; i < anzahl; i++) {
    const ergaenzend = zufall() < ANTEIL_EIGENE_SONDERZUEGE || buch.length === 0;
    const naechste = (ergaenzend ? eigene.shift() : buch.shift()) ?? buch.shift() ?? eigene.shift();
    if (naechste) auswahl.push(naechste);
  }
  return auswahl;
}

/**
 * Eine Runde Zugaufgaben („notieren“ oder „ausführen“).
 *
 * Eingaben: Buchstellungen, Anzahl, mit Sonderzügen (nur beim Ausführen), Zufall.
 * Ausgabe: Aufgaben; etwa ein Drittel Sonderzüge, wenn gewünscht, vor allem an den
 * Buchstellungen aus Kapitel 0 (U5).
 */
export function zugrunde(
  stellungen: readonly Buchstellung[],
  anzahl: number,
  mitSonderzuegen: boolean,
  zufall: Zufall,
): Zugaufgabe[] {
  const sonder = mitSonderzuegen
    ? sonderzugauswahl(stellungen, Math.round(anzahl * ANTEIL_SONDERZUEGE), zufall)
    : [];
  const aus = mische(stellungen, zufall)
    .map((buch) => zugAusBuch(buch, zufall))
    .filter((a): a is Zugaufgabe => a !== null)
    .slice(0, anzahl - sonder.length);
  return mische([...aus, ...sonder], zufall);
}

/** Ohne Schach- und Mattzeichen, für den Vergleich. */
function ohneZeichen(san: string): string {
  return san.replace(/[+#]+$/, "");
}

/**
 * Prüft einen aufgeschriebenen Zug.
 *
 * Warum: Das Buch schreibt Züge mit deutschen Figurenbuchstaben (Kapitel 0). Schach- und
 * Mattzeichen gehören dazu; fehlen sie, gilt der Zug trotzdem als richtig, die App erinnert daran.
 * Englische Buchstaben gelten ebenfalls als richtig, mit dem Hinweis auf S, L, T, D: Kapitel 0
 * sagt selbst „Nf3 ist also dasselbe wie unser Sf3“ (Rückfrage U6, nachgelesen 17.10.2026).
 * Beispiel: Grundstellung, Zug „Nf3“: „Sf3“ → richtig; „Nf3“ → richtig mit Hinweis; „f3“ → falsch.
 * Rochade als „0-0“ oder „O-O“.
 */
export function pruefeNotation(aufgabe: Zugaufgabe, eingabe: string) {
  const text = eingabe.trim().replace(/\s*e\.\s*p\.?$/i, "");
  const englischerBuchstabe = /^[NBRQ]/.test(text);
  const zug = zuegeAusText(text)[0] ?? "";
  const richtig = ohneZeichen(zug) === ohneZeichen(aufgabe.san);
  const schachVergessen = richtig && /[+#]$/.test(aufgabe.san) && !/[+#]$/.test(zug);
  // In der englischen Fassung sind englische Buchstaben die Regel, kein Hinweis nötig (0.2.104).
  const hinweisEnglisch = richtig && englischerBuchstabe && sprache() === GRUNDSPRACHE;
  return { richtig, schachVergessen, englisch: hinweisEnglisch };
}

/** Prüft einen ausgeführten Zug (SAN der App gegen SAN der Aufgabe). */
export function pruefeAusfuehrung(aufgabe: Zugaufgabe, gespielt: string): boolean {
  return ohneZeichen(gespielt) === ohneZeichen(aufgabe.san);
}

/** Eine Aufgabe „Gangarten“: Figur auf einem Feld, alle Felder, auf die sie ziehen darf. */
export interface Gangartaufgabe {
  readonly nummer: string;
  readonly fen: string;
  readonly feld: string;
  readonly ziele: readonly string[];
}

/** Eine Gangart-Aufgabe zu einer Buchstellung: eine zufällige Figur der Seite am Zug. */
function gangart(buch: Buchstellung, zufall: Zufall): Gangartaufgabe | null {
  const { stellung } = buch;
  const figuren = [...stellung.brett[stellung.amZug]]
    .map((index) => ({ index, feld: makeSquare(index) }))
    .map((f) => ({ ...f, ziele: legaleZiele(stellung.fen, f.feld) }))
    .filter((f) => f.ziele.length > 0);
  // Bauern sind leicht; sie kommen nur dran, wenn keine andere Figur ziehen kann.
  const ohneBauern = figuren.filter((f) => !stellung.brett.pawn.has(f.index));
  const gewaehlt = waehle(ohneBauern.length > 0 ? ohneBauern : figuren, zufall);
  return gewaehlt
    ? { nummer: buch.nummer, fen: stellung.fen, feld: gewaehlt.feld, ziele: gewaehlt.ziele }
    : null;
}

/** Eine Runde „Gangarten“. */
export function gangartrunde(
  stellungen: readonly Buchstellung[],
  anzahl: number,
  zufall: Zufall,
): Gangartaufgabe[] {
  return mische(stellungen, zufall)
    .map((buch) => gangart(buch, zufall))
    .filter((a): a is Gangartaufgabe => a !== null)
    .slice(0, anzahl);
}
