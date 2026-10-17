/**
 * Dauerschach als Wiederholung: Kann die schachgebende Seite die Stellung mit einem Schach
 * wiederholen, entkommt der König den Schachs nicht.
 *
 * Rolle im Gesamtbild: Baustein für das Motiv Dauerschach (taktikmotive.ts, rettungsmotive).
 * Abhängigkeiten: chessops.
 * Buchbezug: Glossar und Kapitel 0, Dauerschach („der König entkommt den Schachs nicht“);
 * Kapitel 9, Abb. 9.34: Schwarz liegt nur einen Bauern zurück und rettet sich durch Dauerschach.
 */
import type { Chess } from "chessops/chess";
import { makeFen } from "chessops/fen";
import type { Color } from "chessops/types";
import { FIGURENWERT } from "./stellung";

/** Stellung ohne Zugzähler (Felder, Seite am Zug, Rochade, en passant). */
const KERNFELDER = 4;

function kern(pos: Chess): string {
  return makeFen(pos.toSetup()).split(" ").slice(0, KERNFELDER).join(" ");
}

/**
 * Wiederholt sich die Stellung durch Schachs? Entweder steht in der Folge dieselbe Stellung
 * zweimal, oder die schachgebende Seite ist am Ende am Zug und kann mit einem Schach eine
 * frühere Stellung der Folge wiederherstellen.
 *
 * Eingaben: alle Stellungen der Folge (vor dem ersten Zug bis nach dem letzten) und die
 * schachgebende Farbe. Ausgabe: true bei Wiederholung.
 * Beispiel: Abb. 9.34, 1... Dd1+ 2. Dg1 Df3+ 3. Dg2: Dd1+ stellt die Stellung nach dem ersten
 * Schach wieder her, der König entkommt nicht.
 */
export function wiederholtMitSchach(stellungen: readonly Chess[], farbe: Color): boolean {
  const gesehen = new Set<string>();
  for (const pos of stellungen) {
    const schluessel = kern(pos);
    if (gesehen.has(schluessel)) return true;
    gesehen.add(schluessel);
  }
  const ende = stellungen.at(-1);
  if (!ende || ende.turn !== farbe) return false;
  for (const [von, ziele] of ende.allDests()) {
    for (const nach of ziele) {
      const kopie = ende.clone();
      kopie.play({ from: von, to: nach });
      if (kopie.isCheck() && gesehen.has(kern(kopie))) return true;
    }
  }
  return false;
}

/** Materialstand einer Farbe in Bauerneinheiten (ohne Könige). */
export function materialstand(pos: Chess, farbe: Color): number {
  let summe = 0;
  for (const feld of pos.board.occupied) {
    const figur = pos.board.get(feld);
    if (figur && figur.role !== "king")
      summe += (figur.color === farbe ? 1 : -1) * FIGURENWERT[figur.role];
  }
  return summe;
}
