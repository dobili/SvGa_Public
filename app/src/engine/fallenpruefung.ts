/**
 * Fallenprüfung mit der Engine: bewertet den Schlag und den besten anderen Zug.
 *
 * Rolle im Gesamtbild: liefert die Werte für fallenurteil.ts (Werkzeug k4-falle, Pflichtenheft
 * 6.2). Läuft auf jeder Engine mit „bewerte“, im Test mit Stockfish unter Node.
 * Abhängigkeiten: chessops, engineDienst.ts (Bewertung), fallenurteil.ts.
 */
import type { Color } from "chessops/types";
import { makeFen, parseFen } from "chessops/fen";
import { Chess } from "chessops/chess";
import { parseUci } from "chessops/util";
import type { Bewertung } from "./engineDienst";
import { beurteile, type Fallenurteil } from "./fallenurteil";
import type { Variante, Wert } from "./uci";

/** So viele Varianten fragt die Prüfung ab, damit der Schlag meist schon darunter ist. */
const VARIANTEN = 4;

/** Was die Prüfung von der Engine braucht. */
export interface Bewerter {
  bewerte(fen: string, rechenzeitMs: number, varianten: number): Promise<Bewertung>;
}

export interface Fallenpruefung {
  readonly urteil: Fallenurteil;
  readonly wertNachSchlag: Wert;
  /** Bester anderer Zug (UCI) und sein Wert, oder null. */
  readonly rettung: { readonly zug: string; readonly wert: Wert } | null;
  /** Beste Fortsetzung nach dem Schlag (UCI), beginnend mit der Antwort des Gegners. */
  readonly folge: readonly string[];
}

/** Die Stellung nach einem Zug (UCI), oder null. */
function fenNach(fen: string, uci: string): string | null {
  const setup = parseFen(fen);
  const zug = parseUci(uci);
  if (setup.isErr || !zug) return null;
  const pos = Chess.fromSetup(setup.value);
  if (pos.isErr || !pos.value.isLegal(zug)) return null;
  pos.value.play(zug);
  return makeFen(pos.value.toSetup());
}

/** Wert und Folge nach dem Schlag: aus den Varianten, sonst mit einer zweiten Rechnung. */
async function nachDemSchlag(
  bewerter: Bewerter,
  fen: string,
  schlag: string,
  varianten: readonly Variante[],
  ms: number,
): Promise<{ wert: Wert; folge: readonly string[] } | null> {
  const eigene = varianten.find((v) => v.zuege[0] === schlag);
  if (eigene) return { wert: eigene.wert, folge: eigene.zuege.slice(1) };
  const danach = fenNach(fen, schlag);
  if (!danach) return null;
  const b = await bewerter.bewerte(danach, ms, 1);
  const beste = b.varianten[0];
  return beste ? { wert: beste.wert, folge: beste.zuege } : null;
}

/**
 * Prüft, ob ein angebotener Schlag eine Falle ist.
 *
 * Eingaben: Bewerter, Stellung, Schlag (UCI), Seite am Zug, Rechenzeit je Rechnung.
 * Ausgabe: Urteil, Werte und die beste Folge nach dem Schlag, oder null, wenn der Schlag nicht
 * geht. Beispiel: Abb. 4.11, Lxf3 (g4f3): Falle, Rettung etwa 8... Dxb5? (je nach Engine).
 */
export async function pruefeFalle(
  bewerter: Bewerter,
  fen: string,
  schlag: string,
  farbe: Color,
  rechenzeitMs: number,
): Promise<Fallenpruefung | null> {
  const wurzel = await bewerter.bewerte(fen, rechenzeitMs, VARIANTEN);
  const nach = await nachDemSchlag(bewerter, fen, schlag, wurzel.varianten, rechenzeitMs);
  if (!nach) return null;
  const andere = wurzel.varianten.find((v) => v.zuege[0] !== schlag);
  const rettung = andere?.zuege[0] ? { zug: andere.zuege[0], wert: andere.wert } : null;
  return {
    urteil: beurteile(nach.wert, rettung?.wert ?? null, farbe),
    wertNachSchlag: nach.wert,
    rettung,
    folge: nach.folge,
  };
}
