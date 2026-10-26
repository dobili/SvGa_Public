/**
 * Fortsetzung einer festgelegten Eröffnung nach dem Buch: Züge derselben Familie aus der
 * Lichess-Liste (R24).
 *
 * Rolle im Gesamtbild: Der Leser kann dem Bot eine Eröffnung aus dem Buch vorgeben
 * (usePartie.ts). Das Buch kennt aber nur wenige Züge je Eröffnung. Wunsch des Autors (R24):
 * Ohne Buchzug bleibt der Bot in derselben Eröffnung, mit Zügen aus der freien Eröffnungsliste
 * von Lichess (3864 benannte Stellungen), statt irgendeinen Buchzug oder selbst zu spielen. Die
 * Familie (der Teil des Namens vor dem Doppelpunkt, etwa „Spanische Partie“) steht an der letzten
 * Stellung der Hauptlinie des Buches, die Lichess kennt.
 * Abhängigkeiten: chessops, schach/eroeffnungsindex.ts, schach/eroeffnungsnamen.ts.
 */
import { Chess } from "chessops/chess";
import { makeFen, parseFen } from "chessops/fen";
import { makeSan, parseSan } from "chessops/san";
import { squareRank } from "chessops/util";
import type { Move } from "chessops/types";
import { hauptlinieVon, stellungsschluessel, type Eroeffnungsindex } from "./eroeffnungsindex";
import type { Eroeffnungsnamen } from "./eroeffnungsnamen";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
/** Reihen, auf denen ein Bauer umwandelt (1. und 8. Reihe, von 0 gezählt). */
const ERSTE_REIHE = 0;
const LETZTE_REIHE = 7;

/** „Spanische Partie: Berliner Verteidigung“ → „Spanische Partie“. */
export function familieVon(name: string): string {
  return (name.split(":")[0] ?? name).trim();
}

function stellungAus(fen: string): Chess | null {
  const setup = parseFen(fen);
  if (setup.isErr) return null;
  const stellung = Chess.fromSetup(setup.value);
  return stellung.isOk ? stellung.value : null;
}

/**
 * Die Familie einer Eröffnung des Buches nach der Lichess-Liste; null, wenn keine Stellung ihrer
 * Hauptlinie dort steht.
 * Beispiel: „Spanische Partie“ (1. e4 e5 2. Sf3 Sc6 3. Lb5 …) → „Spanische Partie“ (oder der
 * Familienname, den die Liste für diese Stellungen führt).
 */
export function familieDerBucheroeffnung(
  index: Eroeffnungsindex,
  bekannte: Eroeffnungsnamen,
  name: string,
): string | null {
  const stellung = stellungAus(GRUNDSTELLUNG);
  if (!stellung) return null;
  let familie: string | null = null;
  for (const san of hauptlinieVon(index, name)) {
    const zug = parseSan(stellung, san);
    if (!zug) break;
    stellung.play(zug);
    const eintrag = bekannte.get(stellungsschluessel(makeFen(stellung.toSetup())));
    if (eintrag) familie = familieVon(eintrag.name);
  }
  return familie;
}

/** Alle legalen Züge einer Stellung. */
function legaleZuege(stellung: Chess): Move[] {
  const zuege: Move[] = [];
  for (const [von, ziele] of stellung.allDests()) {
    for (const nach of ziele) {
      const reihe = squareRank(nach);
      const istUmwandlung =
        stellung.board.getRole(von) === "pawn" && (reihe === ERSTE_REIHE || reihe === LETZTE_REIHE);
      zuege.push(
        istUmwandlung ? { from: von, to: nach, promotion: "queen" } : { from: von, to: nach },
      );
    }
  }
  return zuege;
}

/**
 * Die Züge ab einer Stellung, die in eine Lichess-Stellung derselben Familie führen (englische
 * Kurznotation wie die Buchzüge); leer, wenn keiner dorthin führt.
 * Beispiel: Spanische Partie nach 1. e4 e5 2. Sf3 Sc6 3. Lb5 a6 4. La4 Sf6 5. O-O, ohne Buchzug →
 * etwa „Be7“, „b5“, „Nxe4“ (Varianten der Spanischen Partie in der Liste).
 * Sonderfall: ungültige Stellung → leer.
 */
export function zuegeDerFamilie(
  bekannte: Eroeffnungsnamen,
  fen: string,
  familie: string,
): string[] {
  const stellung = stellungAus(fen);
  if (!stellung) return [];
  const zuege: string[] = [];
  for (const zug of legaleZuege(stellung)) {
    const danach = stellung.clone();
    danach.play(zug);
    const eintrag = bekannte.get(stellungsschluessel(makeFen(danach.toSetup())));
    if (eintrag && familieVon(eintrag.name) === familie) zuege.push(makeSan(stellung, zug));
  }
  return zuege;
}
