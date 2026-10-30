/**
 * Zusatzpartien für „Zug erraten“: berühmte Klassiker und aktuelle Turnierpartien.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (30.10.2026): Zum Raten gibt es neben den Meisterpartien
 * aus Kapitel 11 weitere Partien. Sie stehen in public/daten/zusatzpartien.json (erzeugt von
 * pipeline/zusatzpartien.py, für beide Sprachen, Texte je Sprache) und sind Zusatzinhalt, nicht
 * aus dem Buch: Jede trägt Quelle und Lizenz. Die Klassiker sind Partiezüge als Tatsachen, die
 * Turnierpartien kommen aus den Lichess-Übertragungen (CC BY-SA 4.0). Diese Datei prüft das
 * Format der Datei und macht aus einer Partie eine Aufgabe wie aus einer Buchpartie. Reine
 * Funktionen.
 * Abhängigkeiten: training/studientrainer.ts (Ratepartie), training/uebungsaufgabe.ts.
 * Buchbezug: Kapitel 12, „Zug erraten“ als Trainingsmethode (mit beliebigen Meisterpartien).
 */
import type { Color } from "chessops/types";
import { kanonischeLinie } from "./uebungsaufgabe";
import type { Ratepartie } from "./studientrainer";

/** Woher die Partien zum Raten kommen: aus dem Buch oder Zusatzinhalt. */
export type Partiequelle = "buch" | "klassiker" | "turnier";
export const PARTIEQUELLEN: readonly Partiequelle[] = ["buch", "klassiker", "turnier"];

/** Ein Text je Sprache, etwa {"de": "…", "en": "…"}. */
export type Sprachtext = Readonly<Record<string, string>>;

export interface Zusatzpartie {
  readonly id: string;
  readonly art: Exclude<Partiequelle, "buch">;
  readonly weiss: string;
  readonly schwarz: string;
  /** Wertungen von Weiß und Schwarz (nur Turnierpartien). */
  readonly elo?: readonly [number, number];
  readonly ereignis: Sprachtext;
  readonly runde?: string;
  /** Jahr („1851“) oder Tag („2026-09-12“). */
  readonly datum: string;
  readonly ergebnis: "1-0" | "0-1" | "1/2-1/2";
  readonly eroeffnung: Sprachtext;
  /** Englische Kurznotation ohne Zugnummern, durch Leerzeichen getrennt. */
  readonly zuege: string;
  /** Kurztext zur Partie (nur Klassiker): wer, wann, warum berühmt. */
  readonly text?: Sprachtext;
  /** Fundstellen (Adressen): bei Klassikern zwei unabhängige, bei Turnierpartien die Übertragung. */
  readonly quelle: readonly string[];
  readonly lizenz: string;
}

const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const ERGEBNISSE = new Set(["1-0", "0-1", "1/2-1/2"]);
const ARTEN = new Set(["klassiker", "turnier"]);

function istSprachtext(wert: unknown): wert is Sprachtext {
  return (
    typeof wert === "object" &&
    wert !== null &&
    Object.values(wert).every((x) => typeof x === "string")
  );
}

function istText(wert: unknown): wert is string {
  return typeof wert === "string" && wert.length > 0;
}

/** Hat ein Eintrag alle Pflichtfelder in der richtigen Form? */
function istZusatzpartie(p: Record<string, unknown>): boolean {
  return (
    [p.id, p.weiss, p.schwarz, p.datum, p.zuege, p.lizenz].every(istText) &&
    ARTEN.has(String(p.art)) &&
    ERGEBNISSE.has(String(p.ergebnis)) &&
    istSprachtext(p.ereignis) &&
    istSprachtext(p.eroeffnung) &&
    (p.text === undefined || istSprachtext(p.text)) &&
    Array.isArray(p.quelle) &&
    p.quelle.length > 0 &&
    p.quelle.every(istText)
  );
}

/**
 * Die Partien aus dem Inhalt von zusatzpartien.json; null, wenn das Format nicht passt.
 *
 * Warum: Eine kaputte Datei soll den Trainer nicht abstürzen lassen; die Buchpartien bleiben.
 * Sonderfall: Ein einzelner unvollständiger Eintrag macht die ganze Datei ungültig (sie wird
 * erzeugt und geprüft, ein Fehler dort ist ein Fehler im Skript).
 */
export function zusatzpartienAus(roh: unknown): readonly Zusatzpartie[] | null {
  if (typeof roh !== "object" || roh === null || !("partien" in roh)) return null;
  const partien = roh.partien;
  if (!Array.isArray(partien)) return null;
  const gueltig = partien.every(
    (p: unknown) => typeof p === "object" && p !== null && istZusatzpartie({ ...p }),
  );
  return gueltig ? (partien as Zusatzpartie[]) : null;
}

/** Der Text in der Sprache, sonst deutsch, sonst der erste. Beispiel: ({de: "a"}, "en") → „a“. */
export function inSprache(text: Sprachtext | undefined, sprachcode: string): string {
  if (!text) return "";
  return text[sprachcode] ?? text.de ?? Object.values(text)[0] ?? "";
}

/** Nachname für den Titel: „Caruana, Fabiano“ → „Caruana“, „Michail Tal“ → „Tal“. */
function nachname(name: string): string {
  const [vorKomma] = name.split(",");
  if (name.includes(",") && vorKomma) return vorKomma.trim();
  return name.trim().split(/\s+/).at(-1) ?? name;
}

/** Jahr aus dem Datum: „2026-09-12“ → „2026“. */
function jahr(datum: string): string {
  return datum.slice(0, "JJJJ".length);
}

/**
 * Titel einer Zusatzpartie für die Auswahl und den Verlauf, etwa
 * „Anderssen – Kieseritzky, London 1851“ oder „Caruana – So, GCT: Sinquefield Cup 2026 (2026)“.
 */
export function partietitel(partie: Zusatzpartie, sprachcode: string): string {
  const ereignis = inSprache(partie.ereignis, sprachcode);
  const zeit = ereignis.includes(jahr(partie.datum)) ? "" : ` ${jahr(partie.datum)}`;
  return `${nachname(partie.weiss)} – ${nachname(partie.schwarz)}, ${ereignis}${zeit}`;
}

/**
 * Die Zusatzpartien einer Quelle als Aufgaben für die gewählte Seite, wie die Buchpartien.
 *
 * Eingaben: alle Zusatzpartien, Quelle („klassiker“ oder „turnier“), Seite, Sprache der Titel.
 * Sonderfall: Eine Partie mit unlesbaren Zügen fällt weg (die Tests verhindern das).
 */
export function zusatzaufgaben(
  partien: readonly Zusatzpartie[],
  quelle: Exclude<Partiequelle, "buch">,
  seite: Color,
  sprachcode: string,
): Ratepartie[] {
  return partien
    .filter((p) => p.art === quelle)
    .flatMap((p) => {
      const linie = kanonischeLinie(START, p.zuege.split(" "));
      if (!linie) return [];
      return [{ titel: partietitel(p, sprachcode), startFen: START, linie, seite, zusatz: p }];
    });
}
