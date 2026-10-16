/**
 * Plan des Gegners mit der Engine: Was würde er spielen, wenn er jetzt am Zug wäre (Nullzug)?
 *
 * Rolle im Gesamtbild: liefert die Züge für die Karte GegnerKarte (Werkzeug k6-gegner,
 * Pflichtenheft 6.3: „Die Engine zeigt, was der Gegner spielen würde, wenn er jetzt am Zug
 * wäre.“). Läuft auf jeder Engine mit „bewerte“, im Test mit Stockfish unter Node.
 * Abhängigkeiten: chessops, engineDienst.ts (Bewertung), schach/drohungen.ts (Nullzug).
 * Buchbezug: Kapitel 6, „Frage 2: Was will mein Gegner?“ (Abb. 6.12: Schwarz plant ...Lb4;
 * Abb. 6.13: Weiß droht Lxh7+).
 */
import { Chess } from "chessops/chess";
import { makeFen, parseFen } from "chessops/fen";
import type { Bewertung } from "./engineDienst";
import type { Variante } from "./uci";

/** Was die Rechnung von der Engine braucht. */
export interface Bewerter {
  bewerte(fen: string, rechenzeitMs: number, varianten: number): Promise<Bewertung>;
}

export interface Gegnerplan {
  /** Die Stellung mit dem Gegner am Zug (FEN). */
  readonly fenGegner: string;
  /** Seine besten Züge mit Wert und Folge, bester zuerst. */
  readonly varianten: readonly Variante[];
}

/** Die Stellung mit der anderen Seite am Zug, oder null, wenn die Seite am Zug im Schach steht. */
export function fenNullzug(fen: string): string | null {
  const setup = parseFen(fen);
  if (setup.isErr) return null;
  const pos = Chess.fromSetup(setup.value);
  if (pos.isErr || pos.value.isCheck()) return null;
  const kopie = pos.value.clone();
  kopie.turn = kopie.turn === "white" ? "black" : "white";
  kopie.epSquare = undefined;
  return makeFen(kopie.toSetup());
}

/**
 * Rechnet den Plan des Gegners: seine besten Züge, als wäre er am Zug.
 *
 * Eingaben: Bewerter, Stellung (FEN), Rechenzeit, Zahl der Varianten. Ausgabe: Gegnerplan, oder
 * null, wenn die Seite am Zug im Schach steht (dann hat der Gegner keinen „Nullzug“).
 * Beispiel: Abb. 6.13 (Schwarz am Zug): Weiß würde Lxh7+ spielen.
 */
export async function rechneGegnerplan(
  bewerter: Bewerter,
  fen: string,
  rechenzeitMs: number,
  varianten: number,
): Promise<Gegnerplan | null> {
  const fenGegner = fenNullzug(fen);
  if (fenGegner === null) return null;
  const bewertung = await bewerter.bewerte(fenGegner, rechenzeitMs, varianten);
  return { fenGegner, varianten: bewertung.varianten.filter((v) => v.zuege.length > 0) };
}
