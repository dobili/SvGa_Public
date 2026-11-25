/**
 * Regelschicht aus chessops (Auftrag des Hauptchats, 26.11.2026): Zuglegalität, Kurznotation und
 * Ende für alle Varianten, die chessops kennt (Schach, Schach960, Drei-Schach, Atomschach, König
 * der Hügel, Königsrennen, Räuberschach, Einsetzschach).
 *
 * Warum: chessops rechnet die Regeln jeder dieser Varianten schon richtig (Explosion, Hügel,
 * Ziellinie, Schlagzwang, Zähler der Schachgebote); die App braucht nur einen einheitlichen Zugang
 * über UCI-Züge und FEN, damit Partie, Bot und Spielhülle nicht je Variante verzweigen.
 * Eingaben: FEN (bei Drei-Schach mit Zähler „3+3“, bei Einsetzschach mit Tasche „[Pn]“), Züge in UCI.
 * Abhängigkeiten: chessops.
 */
import type { Position } from "chessops/chess";
import { makeFen, parseFen } from "chessops/fen";
import { makeSanAndPlay } from "chessops/san";
import type { Rules } from "chessops/types";
import { makeSquare, makeUci, parseUci } from "chessops/util";
import { setupPosition } from "chessops/variant";
import type { Regelschicht, Variantenende } from "./variante";

/** Figuren, in die ein Bauer umwandeln darf (im Räuberschach auch der König). */
const UMWANDLUNG = ["q", "r", "b", "n"] as const;
const UMWANDLUNG_RAEUBER = [...UMWANDLUNG, "k"] as const;
const LETZTE_REIHEN = [0, 7];
const AUF_REIHE = 8;

/** Die Stellung zur FEN unter diesen Regeln; null bei ungültiger FEN oder Stellung. */
export function stellungMit(rules: Rules, fen: string): Position | null {
  const setup = parseFen(fen);
  if (setup.isErr) return null;
  const pos = setupPosition(rules, setup.value);
  return pos.isOk ? pos.value : null;
}

/**
 * Alle legalen Züge in UCI, mit Umwandlungen und Einsetzzügen.
 * Beispiel: Königsrennen, Startstellung → 21 Züge (alle ohne Schach).
 */
export function legaleZuegeVon(pos: Position): string[] {
  const zuege: string[] = [];
  for (const [von, ziele] of pos.allDests()) {
    const stein = pos.board.get(von);
    for (const nach of ziele) {
      const umwandeln =
        stein?.role === "pawn" && LETZTE_REIHEN.includes(Math.floor(nach / AUF_REIHE));
      if (!umwandeln) {
        zuege.push(`${makeSquare(von)}${makeSquare(nach)}`);
        continue;
      }
      const figuren = pos.rules === "antichess" ? UMWANDLUNG_RAEUBER : UMWANDLUNG;
      for (const f of figuren) zuege.push(`${makeSquare(von)}${makeSquare(nach)}${f}`);
    }
  }
  return [...zuege, ...einsetzzuege(pos)];
}

/** Einsetzzüge im Einsetzschach (Tasche): `P@e4` für jedes freie, erlaubte Feld. */
function einsetzzuege(pos: Position): string[] {
  if (!pos.pockets) return [];
  const zuege: string[] = [];
  const tasche = pos.pockets[pos.turn];
  for (const role of ["pawn", "knight", "bishop", "rook", "queen"] as const) {
    if (tasche[role] <= 0) continue;
    for (const feld of pos.dropDests()) {
      const uci = makeUci({ role, to: feld });
      if (pos.isLegal({ role, to: feld })) zuege.push(uci);
    }
  }
  return zuege;
}

/** Ende aus chessops: Matt, Patt, zu wenig Material, oder das Ende der Variante. */
function endeVon(pos: Position, kennung: string): Variantenende | null {
  const ausgang = pos.outcome();
  if (!ausgang) return null;
  const sieger =
    ausgang.winner === "white" ? "weiss" : ausgang.winner === "black" ? "schwarz" : null;
  if (pos.isVariantEnd()) return { sieger, grund: `variante.${kennung}.ende` };
  if (pos.isCheckmate()) return { sieger, grund: "variante.matt" };
  if (pos.isStalemate()) return { sieger, grund: "variante.patt" };
  return { sieger, grund: "variante.remis" };
}

/**
 * Die Regelschicht für chessops-Regeln. `kennung` ist die Kennung der Variante (für den Text des
 * Endes, etwa „variante.dreischach.ende“).
 */
export function chessopsRegeln(rules: Rules, kennung: string): Regelschicht {
  return {
    chessops: rules,
    stellung: (fen) => stellungMit(rules, fen),
    legaleZuege: (fen) => {
      const pos = stellungMit(rules, fen);
      return pos ? legaleZuegeVon(pos) : [];
    },
    ziehe: (fen, uci) => {
      const pos = stellungMit(rules, fen);
      const zug = parseUci(uci);
      if (!pos || !zug || !pos.isLegal(zug)) return null;
      const san = makeSanAndPlay(pos, zug);
      return { fen: makeFen(pos.toSetup()), san };
    },
    ende: (fen) => {
      const pos = stellungMit(rules, fen);
      return pos ? endeVon(pos, kennung) : null;
    },
  };
}
