/**
 * Nebelschach (Landschaft L5, Bayou, Luftbootführer Theron): Jede Seite sieht nur die Felder ihrer
 * Figuren und die Felder, auf die diese ziehen können; der Rest liegt im Nebel. Es gibt kein Schach;
 * wer den König schlägt, gewinnt (Regel wie „Fog of War“ auf chess.com).
 *
 * Warum: Auftrag des Hauptchats (26.11.2026, Varianten Teil 3); docs/spiel/10, Abschnitt 3a. Die
 * Zuglogik ohne Schachregel steht in freistellung.ts, der Bot in nebelbot.ts.
 * Abhängigkeiten: freistellung.ts, chessops.
 *
 * Regel (L5): Sichtbar sind die eigenen Felder und alle Ziele eigener Figuren: Ein Läufer sieht
 * bis einschließlich der ersten Figur auf seiner Linie, ein Bauer das Feld vor sich, wenn es frei
 * ist, und schräg nur, wo er schlagen kann (auch en passant). Patt (kein Zug) ist remis, ebenso
 * fünfzig Züge ohne Bauernzug und Schlag.
 */
import { Board } from "chessops/board";
import { SquareSet } from "chessops/squareSet";
import type { Color, Square } from "chessops/types";
import { opposite } from "chessops/util";
import {
  ausFen,
  freizuege,
  hatKoenig,
  ziehe,
  ziele,
  type Freistellung,
  type Freizug,
} from "./freistellung";

/** Grundstellung, aus der eine Nebelpartie beginnt. */
export const NEBEL_START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
/** Halbzüge ohne Bauernzug und Schlag bis zum Remis (Fünfzig-Züge-Regel). */
const REMIS_HALBZUEGE = 100;

/** Wie eine Nebelpartie endete: Sieger (null bei Remis) und Grund. */
export interface Nebelende {
  readonly sieger: Color | null;
  readonly grund: "koenigGeschlagen" | "patt" | "fuenfzigZuege";
}

/** Die Partie: Stellung, gespielte Züge (UCI) und das Ende, sobald es feststeht. */
export interface Nebelpartie {
  readonly stellung: Freistellung;
  readonly zuege: readonly string[];
  readonly ende: Nebelende | null;
}

/** Eine neue Partie aus der Grundstellung (oder einer FEN, für Tests). */
export function neueNebelpartie(fen = NEBEL_START): Nebelpartie {
  return { stellung: ausFen(fen), zuege: [], ende: null };
}

/**
 * Die Felder, die `farbe` sieht: eigene Figuren und ihre Ziele (Regel L5, siehe Dateikopf).
 * Beispiel: Grundstellung, Weiß → Reihen 1 bis 4 (die Springer sehen a3, c3, f3, h3, die Bauern
 * ein und zwei Felder vor), 32 Felder.
 * Sonderfall: en passant zählt nur für die Seite am Zug.
 */
export function sicht(s: Freistellung, farbe: Color): SquareSet {
  const blick: Freistellung =
    s.amZug === farbe ? s : mitEnPassant({ ...s, amZug: farbe }, undefined);
  let felder = s.brett[farbe];
  for (const feld of s.brett[farbe]) felder = felder.union(ziele(blick, feld));
  return felder;
}

/** Die Stellung mit diesem Feld für en passant (oder ohne). */
function mitEnPassant(s: Freistellung, ep: Square | undefined): Freistellung {
  const grund = {
    brett: s.brett,
    amZug: s.amZug,
    rochaden: s.rochaden,
    halbzuege: s.halbzuege,
    zugnummer: s.zugnummer,
  };
  return ep === undefined ? grund : { ...grund, enPassant: ep };
}

/** Erlaubte Züge der Seite am Zug (jeder Zug nach Gangart, auch ins Schach). */
export function nebelzuege(p: Nebelpartie): Freizug[] {
  return p.ende ? [] : freizuege(p.stellung);
}

/** Ende nach einem Zug: König geschlagen, Patt oder fünfzig Züge. */
function endeNach(s: Freistellung): Nebelende | null {
  const gezogen = opposite(s.amZug);
  if (!hatKoenig(s, s.amZug)) return { sieger: gezogen, grund: "koenigGeschlagen" };
  if (s.halbzuege >= REMIS_HALBZUEGE) return { sieger: null, grund: "fuenfzigZuege" };
  if (freizuege(s).length === 0) return { sieger: null, grund: "patt" };
  return null;
}

/**
 * Spielt einen Zug; wirft, wenn er nicht erlaubt ist oder die Partie vorbei ist.
 * Beispiel: e2e4 aus der Grundstellung → Schwarz am Zug, kein Ende.
 */
export function spieleNebelzug(p: Nebelpartie, zug: Freizug, uci: string): Nebelpartie {
  const erlaubt = nebelzuege(p).some(
    (z) => z.von === zug.von && z.nach === zug.nach && z.umwandlung === zug.umwandlung,
  );
  if (!erlaubt) throw new Error(`Zug ${uci} ist im Nebel nicht erlaubt.`);
  const { stellung } = ziehe(p.stellung, zug);
  return { stellung, zuege: [...p.zuege, uci], ende: endeNach(stellung) };
}

/**
 * Die Stellung, wie `farbe` sie sieht: eigene Figuren, fremde nur auf sichtbaren Feldern, dazu der
 * fremde König auf `koenigVermutet` (zuletzt gesehen), damit die Engine eine gültige Stellung
 * bekommt. Rochaderechte nur für die eigene Seite.
 * Warum: Der Bot rechnet ehrlich nur mit dem, was er sieht (docs/spiel/10: „eigene Bot-Logik“).
 * Sonderfall: Steht auf dem vermuteten Feld eine eigene Figur, kommt der König auf sein wahres
 * Feld (selten; die Engine braucht zwei Könige).
 */
export function sichtstellung(s: Freistellung, farbe: Color, koenigVermutet: Square): Freistellung {
  const sichtbar = sicht(s, farbe);
  const brett = Board.empty();
  for (const [feld, figur] of s.brett) {
    if (figur.color === farbe || (sichtbar.has(feld) && figur.role !== "king"))
      brett.set(feld, figur);
  }
  const fremd = opposite(farbe);
  const wahr = s.brett.kingOf(fremd);
  const koenigFeld = sichtbar.has(wahr ?? -1) || brett.has(koenigVermutet) ? wahr : koenigVermutet;
  if (koenigFeld !== undefined) brett.set(koenigFeld, { color: fremd, role: "king" });
  const rochaden = s.rochaden.intersect(SquareSet.backrank(farbe));
  const ep = s.enPassant !== undefined && sichtbar.has(s.enPassant) ? s.enPassant : undefined;
  return mitEnPassant({ ...s, brett, rochaden }, ep);
}

/** Wo `farbe` den fremden König jetzt vermutet: sichtbar → sein Feld, sonst wie bisher. */
export function koenigGesehen(s: Freistellung, farbe: Color, bisher: Square): Square {
  const wahr = s.brett.kingOf(opposite(farbe));
  return wahr !== undefined && sicht(s, farbe).has(wahr) ? wahr : bisher;
}
