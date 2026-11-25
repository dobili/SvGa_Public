/**
 * Entenschach (Landschaft L6, Prärie, Sturmjäger Ray Castillo, „der Twister“): Nach jedem Zug setzt
 * der Ziehende die Ente auf ein anderes leeres Feld. Auf und über die Ente zieht niemand. Es gibt
 * kein Schach; wer den König schlägt, gewinnt.
 *
 * Warum: Auftrag des Hauptchats (26.11.2026, Varianten Teil 3); docs/spiel/10, Abschnitt 3a. Die
 * Regeln folgen duckchess.com und Fairy-Stockfish (`duck`, src/variant.cpp), damit der Bot mit der
 * Engine dieselbe Partie spielt.
 * Abhängigkeiten: freistellung.ts, chessops.
 *
 * Regel (L6): Ein Zug hat zwei Teile, erst die Figur, dann die Ente (sie muss das Feld wechseln).
 * Wer am Zug keinen Figurenzug hat, gewinnt (Fairy-Stockfish: stalemateValue = Matt für den Patten).
 * Fünfzig Züge ohne Bauernzug und Schlag sind remis. Schreibweise eines ganzen Zuges wie
 * Fairy-Stockfish: „e2e4,e4d5“ (Zug, dann Zielfeld und Feld der Ente).
 */
import { SquareSet } from "chessops/squareSet";
import type { Color, Square } from "chessops/types";
import { makeSquare, opposite, parseSquare } from "chessops/util";
import {
  alsFen,
  alsUci,
  ausFen,
  ausUci,
  freizuege,
  gleich,
  hatKoenig,
  ziehe,
  type Freistellung,
  type Freizug,
} from "./freistellung";

/** Grundstellung ohne Ente (die erste setzt Weiß nach dem ersten Zug). */
export const ENTEN_START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const REMIS_HALBZUEGE = 100;
const FELDER = 64;
const REIHE = 8;

/** Wie eine Entenpartie endete. */
export interface Entenende {
  readonly sieger: Color | null;
  readonly grund: "koenigGeschlagen" | "ohneZug" | "fuenfzigZuege";
}

/**
 * Die Partie. `phase` „zug“: die Seite am Zug zieht eine Figur; „ente“: dieselbe Seite setzt die
 * Ente (in der Stellung ist dann schon der Gegner am Zug).
 */
export interface Entenpartie {
  readonly stellung: Freistellung;
  readonly ente: Square | null;
  readonly phase: "zug" | "ente";
  /** Der halbe Zug vor dem Setzen der Ente (nur in Phase „ente“). */
  readonly offen?: string;
  readonly zuege: readonly string[];
  readonly ende: Entenende | null;
}

/** Eine neue Partie (oder aus FEN und Entenfeld, für Tests). */
export function neueEntenpartie(fen = ENTEN_START, ente: Square | null = null): Entenpartie {
  return { stellung: ausFen(fen), ente, phase: "zug", zuege: [], ende: null };
}

/** Die Ente als Sperre (leer, solange sie noch nicht steht). */
function sperre(p: Entenpartie): SquareSet {
  return p.ente === null ? SquareSet.empty() : SquareSet.fromSquare(p.ente);
}

/** Figurenzüge der Seite am Zug, die Ente versperrt Feld und Weg. */
export function entenzuege(p: Entenpartie): Freizug[] {
  return p.ende || p.phase !== "zug" ? [] : freizuege(p.stellung, sperre(p));
}

/** Felder, auf die die Ente jetzt darf: leer und nicht ihr bisheriges Feld. */
export function entenfelder(p: Entenpartie): Square[] {
  if (p.ende || p.phase !== "ente") return [];
  const felder: Square[] = [];
  for (let f = 0; f < FELDER; f++) {
    if (!p.stellung.brett.has(f) && f !== p.ente) felder.push(f);
  }
  return felder;
}

/** Ende nach einem Figurenzug (König geschlagen) oder nach dem Setzen der Ente. */
function endeNachZug(s: Freistellung): Entenende | null {
  return hatKoenig(s, s.amZug) ? null : { sieger: opposite(s.amZug), grund: "koenigGeschlagen" };
}

function endeNachEnte(s: Freistellung, ente: Square): Entenende | null {
  if (s.halbzuege >= REMIS_HALBZUEGE) return { sieger: null, grund: "fuenfzigZuege" };
  if (freizuege(s, SquareSet.fromSquare(ente)).length === 0) {
    return { sieger: s.amZug, grund: "ohneZug" };
  }
  return null;
}

/**
 * Erster Teil: eine Figur ziehen. Schlägt der Zug den König, ist die Partie aus, ohne Ente.
 * Wirft bei einem nicht erlaubten Zug. Beispiel: e2e4 → Phase „ente“.
 */
export function zieheFigur(p: Entenpartie, zug: Freizug): Entenpartie {
  if (!entenzuege(p).some((z) => gleich(z, zug))) {
    throw new Error(`Zug ${alsUci(zug)} ist mit der Ente nicht erlaubt.`);
  }
  const { stellung } = ziehe(p.stellung, zug);
  const ende = endeNachZug(stellung);
  const uci = alsUci(zug);
  if (ende) return { ...p, stellung, zuege: [...p.zuege, uci], ende };
  return { ...p, stellung, phase: "ente", offen: uci };
}

/**
 * Zweiter Teil: die Ente setzen. Wirft auf einem besetzten oder ihrem alten Feld.
 * Beispiel: nach e2e4 Ente auf e5 → Zug „e2e4,e4e5“, Schwarz zieht.
 */
export function setzeEnte(p: Entenpartie, feld: Square): Entenpartie {
  if (!entenfelder(p).includes(feld)) {
    throw new Error(`Die Ente darf nicht auf ${makeSquare(feld)}.`);
  }
  const zug = `${p.offen ?? ""},${(p.offen ?? "").slice(2, 4)}${makeSquare(feld)}`;
  return {
    stellung: p.stellung,
    ente: feld,
    phase: "zug",
    zuege: [...p.zuege, zug],
    ende: endeNachEnte(p.stellung, feld),
  };
}

/** Ein ganzer Zug in Fairy-Stockfish-Schreibweise („e2e4,e4d5“) → Figurenzug und Entenfeld. */
export function ausEntenUci(text: string): { zug: Freizug; ente: Square } | null {
  const [teil, entenTeil] = text.split(",");
  const zug = ausUci(teil ?? "");
  const ente = parseSquare((entenTeil ?? "").slice(2, 4));
  return zug && ente !== undefined ? { zug, ente } : null;
}

/** Spielt einen ganzen Zug („e2e4,e4d5“); wirft, wenn ein Teil nicht erlaubt ist. */
export function spieleEntenzug(p: Entenpartie, text: string): Entenpartie {
  const teile = ausEntenUci(text);
  if (!teile) throw new Error(`Entenzug ${text} ist unlesbar.`);
  const nach = zieheFigur(p, teile.zug);
  return nach.ende ? nach : setzeEnte(nach, teile.ente);
}

/**
 * FEN für Fairy-Stockfish (`UCI_Variant duck`): die Ente als „*“ im Brett.
 * Beispiel: Ente auf e5 nach 1. e4 → „…/4*3/4P3/…“.
 */
export function entenFen(p: Entenpartie): string {
  const fen = alsFen(p.stellung);
  if (p.ente === null) return fen;
  const [brett = "", ...rest] = fen.split(" ");
  return [setzeZeichen(brett, p.ente, "*"), ...rest].join(" ");
}

/** Setzt ein Zeichen auf ein leeres Feld einer Brett-FEN (Ziffern werden aufgeteilt). */
function setzeZeichen(brett: string, feld: Square, zeichen: string): string {
  const reihen = brett.split("/");
  const index = reihen.length - 1 - Math.floor(feld / REIHE);
  const zeilen = (reihen[index] ?? "").replace(/\d/g, (n) => ".".repeat(Number(n)));
  const neu = zeilen.slice(0, feld % REIHE) + zeichen + zeilen.slice((feld % REIHE) + 1);
  reihen[index] = neu.replace(/\.+/g, (punkte) => String(punkte.length));
  return reihen.join("/");
}
