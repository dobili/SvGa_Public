/**
 * Zentrumsschlag mit der Engine: Gewinnt das Schlagen eines angegriffenen Zentrumsbauern auch
 * nach der besten Antwort des Gegners Material?
 *
 * Rolle im Gesamtbild: Zweiter Schritt der Zentrumsprüfung im Werkzeug k2-zielbilanz
 * (Entscheidung des Autors zu C1.1). Die Zielbilanz zählt auf dem Feld des Bauern nur
 * Angreifer und Verteidiger (Kapitel 1); was danach passiert, sieht sie nicht. Abb. 2.40: Nach
 * 3... Sxe4?! holt 4. De2! den Bauern zurück; Abb. 2.113: 7. dxe5 dxe5 8. Dxd8 Txd8 9. Sxe5
 * Sxe4! gleicht aus; Abb. 2.24: 6... Sxe4? 7. dxc5 kostet eine Figur. Die Widerlegungen sind fünf
 * bis sieben Halbzüge tief, deshalb rechnet hier die Engine statt einer Suche in TypeScript.
 * Läuft auf jeder Engine mit „bewerte“ (App: Web Worker, Test: Stockfish unter Node).
 * Abhängigkeiten: chessops, engineDienst.ts (über die Schnittstelle Bewerter), fallenurteil.ts,
 * schach/stellung.ts (Figurenwerte).
 * Buchbezug: Kapitel 1, „Zählen von Angreifern und Verteidigern“; Kapitel 2, Zentrumsprüfung;
 * Kapitel 4, „Ist das Geschenk vergiftet?“.
 */
import type { Board } from "chessops/board";
import { Chess } from "chessops/chess";
import { makeFen, parseFen } from "chessops/fen";
import type { Color, Move, Square } from "chessops/types";
import { makeUci, parseSquare, parseUci } from "chessops/util";
import { FIGURENWERT, gegner } from "../schach/stellung";
import type { Bewerter } from "./fallenpruefung";
import { wertFuer } from "./fallenurteil";
import type { Wert } from "./uci";

/** Ab so viel Material (Bauerneinheiten) mehr nach der Folge gilt der Bauer als gewonnen. */
export const GEWINN_AB_BAUERN = FIGURENWERT.pawn;
/** Die Engine rechnet nur die beste Fortsetzung nach dem Schlag. */
const EINE_VARIANTE = 1;
/**
 * So viele Halbzüge nach dem Schlag zählen. Die Widerlegungen des Buches sind fünf bis sieben
 * Halbzüge tief (Abb. 2.113: 7... dxe5 8. Dxd8 Txd8 9. Sxe5 Sxe4); was die Engine danach noch
 * zurückholt (Abb. 2.40: irgendwann …Dxe5 gegen Entwicklungsrückstand), ist kein „gleich mit
 * Gewinn geschlagen“ mehr. Ohne diese Grenze schwankte das Urteil mit der Rechenzeit.
 */
const HORIZONT_HALBZUEGE = 10;

/** Ergebnis der Prüfung eines Schlages auf einen Zentrumsbauern. */
export interface Zentrumsschlag {
  /** Feld des Bauern, etwa „e4“. */
  readonly feld: string;
  /** Der Schlag (UCI), mit der billigsten Figur, die legal schlagen kann. */
  readonly schlag: string;
  /** Die beste Fortsetzung nach dem Schlag (UCI), beginnend mit der Antwort des Gegners. */
  readonly folge: readonly string[];
  /** Materialgewinn des Schlägers am ruhigen Ende der Folge (höchstens zehn Halbzüge), in Bauerneinheiten. */
  readonly gewinn: number;
  /** Bewertung der Engine nach dem Schlag (aus Sicht von Weiß). */
  readonly wert: Wert;
  /** Bringt der Schlag auch nach der besten Antwort mindestens einen Bauern ein? */
  readonly haengt: boolean;
}

/** Material einer Farbe minus Material des Gegners, ohne König (Faustwerte aus Kapitel 1). */
export function materialFuer(brett: Board, farbe: Color): number {
  let summe = 0;
  for (const [, figur] of brett) {
    if (figur.role === "king") continue;
    summe += (figur.color === farbe ? 1 : -1) * FIGURENWERT[figur.role];
  }
  return summe;
}

/** Der Schlag auf das Feld mit der billigsten Figur, die legal schlagen kann, oder null. */
export function billigsterSchlag(pos: Chess, ziel: Square): Move | null {
  let bester: { zug: Move; wert: number } | null = null;
  for (const [von, ziele] of pos.allDests()) {
    const figur = pos.board.get(von);
    if (!figur || !ziele.has(ziel)) continue;
    const wert = FIGURENWERT[figur.role];
    if (!bester || wert < bester.wert) bester = { zug: { from: von, to: ziel }, wert };
  }
  return bester?.zug ?? null;
}

/**
 * Material des Schlägers am ruhigen Ende einer Folge.
 *
 * Warum: Endet die Hauptvariante der Engine mitten in einem Abtausch, wäre die Bilanz verzerrt.
 * Gezählt wird deshalb nach dem letzten Zug, der nichts schlägt, in den ersten zehn Halbzügen
 * der Folge (HORIZONT_HALBZUEGE); schlägt jeder Zug, zählt das Ende. Eingaben: Stellung nach dem
 * Schlag, Folge (UCI), Farbe des Schlägers.
 * Beispiel: Abb. 2.24 nach 6... Sxe4 7. dxc5 O-O: Schwarz hat Läufer gegen Bauer verloren.
 */
function materialAmRuhigenEnde(nachSchlag: Chess, folge: readonly string[], farbe: Color): number {
  const pos = nachSchlag.clone();
  let ruhig: number | null = null;
  for (const uci of folge.slice(0, HORIZONT_HALBZUEGE)) {
    const zug = parseUci(uci);
    if (!zug || !pos.isLegal(zug)) break;
    // Ein Schlag trifft eine Figur des Gegners (die Rochade zieht auf den eigenen Turm).
    const schlaegt = "from" in zug && pos.board[gegner(pos.turn)].has(zug.to);
    pos.play(zug);
    if (!schlaegt) ruhig = materialFuer(pos.board, farbe);
  }
  return ruhig ?? materialFuer(pos.board, farbe);
}

/** Hängt der Bauer? Matt entscheidet vor dem Material, sonst zählt der Materialgewinn. */
function haengt(wert: Wert, gewinn: number, farbe: Color): boolean {
  if (wert.art === "matt") return wertFuer(wert, farbe) > 0;
  return gewinn >= GEWINN_AB_BAUERN;
}

/**
 * Prüft mit der Engine, ob der Schlag auf einen angegriffenen Zentrumsbauern Material gewinnt.
 *
 * Warum: Die Zielbilanz soll nicht zu einem Schlag einladen, vor dem das Buch warnt (Abb. 2.40,
 * „die berühmteste Falle“). Eingaben: Bewerter, Stellung (FEN, der Schläger ist am Zug), Feld
 * des Bauern, Rechenzeit. Ausgabe: Schlag, beste Folge, Materialgewinn und Urteil, oder null,
 * wenn keine Figur legal schlagen kann (etwa wegen einer Fesselung) oder die FEN ungültig ist.
 * Beispiel: Abb. 2.40, e4: 3... Sxe4 4. De2 De7 5. Dxe4 … → hängt nicht; Abb. 2.29, d5:
 * 11. Lxd5 … → hängt.
 * Sonderfälle: Gewertet wird das Material am ruhigen Ende der Hauptvariante; ein Matt für oder
 * gegen den Schläger entscheidet allein. Hat der Gegner nach dem Schlag keinen Zug (Matt oder
 * Patt), liefert die Engine keine Variante: dann null, die Karte schweigt zu diesem Bauern.
 */
export async function pruefeZentrumsschlag(
  bewerter: Bewerter,
  fen: string,
  feld: string,
  rechenzeitMs: number,
): Promise<Zentrumsschlag | null> {
  const setup = parseFen(fen);
  const ziel = parseSquare(feld);
  if (setup.isErr || ziel === undefined) return null;
  const start = Chess.fromSetup(setup.value);
  if (start.isErr) return null;
  const pos = start.value;
  const zug = billigsterSchlag(pos, ziel);
  if (!zug) return null;
  const farbe = pos.turn;
  const vorher = materialFuer(pos.board, farbe);
  const nachSchlag = pos.clone();
  nachSchlag.play(zug);
  const bewertung = await bewerter.bewerte(
    makeFen(nachSchlag.toSetup()),
    rechenzeitMs,
    EINE_VARIANTE,
  );
  const beste = bewertung.varianten[0];
  if (!beste) return null;
  const gewinn = materialAmRuhigenEnde(nachSchlag, beste.zuege, farbe) - vorher;
  return {
    feld,
    schlag: makeUci(zug),
    folge: beste.zuege,
    gewinn,
    wert: beste.wert,
    haengt: haengt(beste.wert, gewinn, farbe),
  };
}
