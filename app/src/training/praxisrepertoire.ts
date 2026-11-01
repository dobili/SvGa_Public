/**
 * Repertoire-Trainer mit Eröffnungen aus der Praxis (Lichess): gewählte Varianten nach
 * Spielstärke Zug für Zug abfragen.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (1.11.2026): „optional auch aus der Eröffnungsdatenbank
 * wählen, die die App für die Bots schon hat“. Die Daten sind die „Eröffnungen nach Spielstärke“
 * (spiel/eroeffnungsbaender.ts, Lichess-Monat, CC0); gewählt wird wie beim Bot mit Werten
 * „praxis:Name“ (Variantenbaum mit Schnellwahl und Einzelhaken). Diese Datei macht aus den
 * gewählten Werten die Linien und aus den Linien die Aufgaben des Repertoire-Trainers
 * (training/repertoiretrainer.ts). Die Züge stammen nicht aus dem Buch; die Aufgaben tragen
 * deshalb die Herkunft „praxis“, die Oberfläche kennzeichnet sie. Reine Funktionen.
 * Seit dem Wunsch des Autors zu N2538 (1.11.2026) geht jede Linie nach dem Namen mit den
 * häufigsten Folgezügen im Band des Lesers weiter (training/praxisfortsetzung.ts).
 * Abhängigkeiten: spiel/eroeffnungsbaender.ts, spiel/partie.ts (Vorsilbe), training/zufall.ts,
 * training/uebungsaufgabe.ts (kanonischeLinie), training/praxisfortsetzung.ts.
 */
import type { Color } from "chessops/types";
import { alsPraxiseintraege, type Eroeffnungsbaender } from "../spiel/eroeffnungsbaender";
import { PRAXIS_VORSILBE } from "../spiel/partie";
import { GRUNDSTELLUNG } from "../spiel/stellungsbau";
import { folgezuege, type Praxisfortsetzungen } from "./praxisfortsetzung";
import type { Repertoireaufgabe } from "./repertoiretrainer";
import { kanonischeLinie } from "./uebungsaufgabe";
import { mische, type Zufall } from "./zufall";

/** Eine gewählte Variante aus der Praxis: Anzeigename und Züge ab der Grundstellung. */
export interface Praxislinie {
  /** Wert der Wahl, etwa „praxis:Sicilian Defense: Old Sicilian“. */
  readonly wert: string;
  /** Name zum Anzeigen, auf Deutsch mit deutschem Familiennamen. */
  readonly titel: string;
  /** Züge in englischer Kurznotation, regelgerecht geschrieben (mit Schachzeichen). */
  readonly linie: readonly string[];
  /** So viele Halbzüge am Ende sind häufigste Folgezüge nach dem Namen (0: nicht verlängert). */
  readonly angehaengt: number;
}

/** Womit verlängert wird: die Fortsetzungen und der Index des Bandes (des Lesers). */
export interface Verlaengerung {
  readonly daten: Praxisfortsetzungen;
  readonly band: number;
}

/** Trennzeichen der gemerkten Wahl (Lichess-Namen enthalten keinen Zeilenumbruch). */
const TRENNER = "\n";

/** Die gemerkte Wahl als Text für den Gerätemerker. */
export function wahlAlsText(werte: readonly string[]): string {
  return werte.join(TRENNER);
}

/** Die gemerkte Wahl aus dem Text; nur Werte mit der Vorsilbe „praxis:“. */
export function wahlAusText(text: string): string[] {
  return text.split(TRENNER).filter((w) => w.startsWith(PRAXIS_VORSILBE));
}

/**
 * Der Name einer Eröffnung, Variante oder eines Gambits zum Anzeigen: Auf Deutsch ersetzt der
 * deutsche Familienname den englischen am Anfang.
 *
 * Beispiel: „Sicilian Defense: Old Sicilian“ → „Sizilianische Verteidigung: Old Sicilian“.
 * Sonderfall: Ohne passende Familie bleibt der Lichess-Name.
 */
export function praxisname(daten: Eroeffnungsbaender, name: string, deutsch: boolean): string {
  if (!deutsch) return name;
  const familie = daten.familien
    .filter((f) => name === f.name || name.startsWith(`${f.name}:`))
    .sort((a, b) => b.name.length - a.name.length)[0];
  return familie ? `${familie.nameDe}${name.slice(familie.name.length)}` : name;
}

/**
 * Ohne Doppelte und ohne Linien, die echter Anfang einer anderen sind (ganze Züge). Warum über
 * Mengen: Mit „Alle Varianten“ sind es Hunderte Linien; der paarweise Vergleich kostete auf dem
 * Handy spürbar Zeit, so sind es höchstens 20 Anfänge je Linie.
 */
function ohneAnfaengeUndDoppelte<T extends { readonly linie: readonly string[] }>(
  linien: readonly T[],
): T[] {
  const anfaenge = new Set<string>();
  for (const { linie } of linien) {
    for (let laenge = 1; laenge < linie.length; laenge++) anfaenge.add(linie.slice(0, laenge).join(" "));
  }
  const gesehen = new Set<string>();
  return linien.filter(({ linie }) => {
    const text = linie.join(" ");
    if (anfaenge.has(text) || gesehen.has(text)) return false;
    gesehen.add(text);
    return true;
  });
}

/**
 * Die Linie zu einer Zugfolge, verlängert um die häufigsten Folgezüge im Band; ist die
 * Verlängerung regelwidrig (Daten passen nicht), bleibt die Linie bis zum Namen.
 * Beispiel: „e4 c5 Nf3 Nc6“, Band 1200 → e4 c5 Nf3 Nc6 Bc4 e6 O-O d5 … (9 angehängt).
 */
function linieZu(
  folge: string,
  verlaengerung: Verlaengerung | null,
): { linie: string[]; angehaengt: number } | null {
  const name = folge.split(" ");
  const dazu = verlaengerung ? folgezuege(verlaengerung.daten, folge, verlaengerung.band) : [];
  const lang = dazu.length > 0 ? kanonischeLinie(GRUNDSTELLUNG, [...name, ...dazu]) : null;
  if (lang) return { linie: lang, angehaengt: dazu.length };
  const kurz = kanonischeLinie(GRUNDSTELLUNG, name);
  return kurz ? { linie: kurz, angehaengt: 0 } : null;
}

/**
 * Die Linien zu den gewählten Werten, in der Reihenfolge der Wahl, auf Wunsch verlängert.
 * Doppelte Zugfolgen und Linien, die Anfang einer anderen gewählten Linie sind, fallen weg: Wer
 * „Old Sicilian“ und „Open“ wählt, übt die längere und zieht die kürzere dabei mit. Verglichen
 * wird nach der Verlängerung: Führt die Fortsetzung der kürzeren in die längere, bleibt nur diese.
 *
 * Eingaben: Daten der Eröffnungen nach Spielstärke, gewählte Werte („praxis:Name“), Sprache,
 * Verlängerung (null: nur bis zum Namen, etwa solange die Fortsetzungen laden).
 * Beispiel: [„praxis:Italian Game“], ohne Verlängerung → [{ titel: „Italienische Partie“,
 * linie: e4 e5 Nf3 Nc6 Bc4, angehaengt: 0 }].
 * Sonderfall: Unbekannte Werte (etwa nach neuen Daten) und regelwidrige Folgen fallen weg.
 */
export function praxislinien(
  daten: Eroeffnungsbaender,
  werte: readonly string[],
  deutsch: boolean,
  verlaengerung: Verlaengerung | null = null,
): Praxislinie[] {
  const folgen = new Map<string, string>();
  for (const [name, folge] of alsPraxiseintraege(daten)) if (!folgen.has(name)) folgen.set(name, folge);
  const linien = werte.flatMap((wert) => {
    const name = wert.slice(PRAXIS_VORSILBE.length);
    const folge = folgen.get(name);
    const zu = folge ? linieZu(folge, verlaengerung) : null;
    return zu ? [{ wert, titel: praxisname(daten, name, deutsch), ...zu }] : [];
  });
  return ohneAnfaengeUndDoppelte(linien);
}

/** Hat der Leser auf dieser Seite in der Linie mindestens einen Zug? (Weiß beginnt.) */
function mitEigenemZug(linie: readonly string[], seite: Color): boolean {
  return linie.length > (seite === "white" ? 0 : 1);
}

/**
 * Die Aufgaben einer Runde: bis zu `anzahl` der gewählten Linien in zufälliger Reihenfolge, für
 * die gewählte Seite. Warum zufällig: Wer viele Varianten anhakt, übt mit „Nochmal“ andere.
 *
 * Beispiel: drei Varianten der Sizilianischen Verteidigung, Schwarz → drei Aufgaben, 1. e4 steht.
 * Sonderfall: Linien ohne eigenen Zug (Schwarz bei „1. d4“) fallen weg.
 */
export function praxisrunde(
  linien: readonly Praxislinie[],
  seite: Color,
  anzahl: number,
  zufall: Zufall,
): Repertoireaufgabe[] {
  return mische(
    linien.filter((l) => mitEigenemZug(l.linie, seite)),
    zufall,
  )
    .slice(0, anzahl)
    .map((l) => ({
      titel: l.titel,
      startFen: GRUNDSTELLUNG,
      linie: l.linie,
      seite,
      herkunft: "praxis" as const,
    }));
}

/** Wie viele Aufgaben die Runde für diese Seite hat (für den Startknopf). */
export function praxisanzahl(linien: readonly Praxislinie[], seite: Color, anzahl: number): number {
  return Math.min(anzahl, linien.filter((l) => mitEigenemZug(l.linie, seite)).length);
}
