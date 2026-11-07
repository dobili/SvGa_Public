/**
 * Hilfe für die Tests der Finde-Kategorien: baut eine Eingabe aus FEN und Zügen in
 * Kurznotation (SAN, englisch), wie sie die Engine als UCI liefern würde. Kein Test im Namen,
 * damit Vitest die Datei nicht als Testdatei sammelt.
 */
import { makeFen } from "chessops/fen";
import { parseSan } from "chessops/san";
import { makeUci } from "chessops/util";
import { regelstellung } from "../spiel/zuege";
import type { Findeeingabe } from "./findekategorien";

/** Eine Zugfolge (SAN) ab einer Stellung als UCI; wirft, wenn ein Zug nicht geht. */
export function alsUci(fen: string, san: readonly string[]): string[] {
  const pos = regelstellung(fen);
  if (!pos) throw new Error(`Stellung unlesbar: ${fen}`);
  return san.map((s) => {
    const zug = parseSan(pos, s);
    if (!zug) throw new Error(`Zug ${s} geht nicht in ${makeFen(pos.toSetup())}`);
    pos.play(zug);
    return makeUci(zug);
  });
}

/** Die Stellung nach einer Zugfolge (SAN) ab einer Stellung. */
export function fenNachSan(fen: string, san: readonly string[]): string {
  const pos = regelstellung(fen);
  if (!pos) throw new Error(`Stellung unlesbar: ${fen}`);
  for (const s of san) {
    const zug = parseSan(pos, s);
    if (!zug) throw new Error(`Zug ${s} geht nicht`);
    pos.play(zug);
  }
  return makeFen(pos.toSetup());
}

/** Die Grundstellung. */
export const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** Angaben eines Testfalls in Kurznotation. */
export interface Testfall {
  readonly fen: string;
  readonly best: readonly string[];
  readonly gespielt: readonly string[];
  readonly werte?: { readonly vorher: number; readonly best: number; readonly gespielt: number };
  readonly phase?: Findeeingabe["phase"];
  readonly fenDavor?: string;
  readonly abstandZweitbester?: number;
}

/** Werte eines klaren Fehlers: drei Bauern Verlust. */
const KLARER_FEHLER = { vorher: 3, best: 3, gespielt: 0 };

/**
 * Baut die Eingabe: `best` ist die Variante ab der Stellung (bester Zug zuerst), `gespielt` der
 * gespielte Zug mit seiner Widerlegung.
 */
export function eingabe(fall: Testfall): Findeeingabe {
  const besteUci = alsUci(fall.fen, fall.best);
  const gespieltUci = alsUci(fall.fen, fall.gespielt);
  const werte = fall.werte ?? KLARER_FEHLER;
  const [besterZugUci = "", ...restBest] = besteUci;
  const [gespielterZugUci = "", ...widerlegung] = gespieltUci;
  return {
    fenVorher: fall.fen,
    besterZugUci,
    gespielterZugUci,
    varianteBest: [besterZugUci, ...restBest],
    varianteNachGespielt: widerlegung,
    wertVorher: werte.vorher,
    wertNachBest: werte.best,
    wertNachGespielt: werte.gespielt,
    phase: fall.phase ?? "mittelspiel",
    ...(fall.fenDavor ? { fenDavor: fall.fenDavor } : {}),
    ...(fall.abstandZweitbester !== undefined
      ? { abstandZweitbester: fall.abstandZweitbester }
      : {}),
  };
}
