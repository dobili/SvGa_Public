/**
 * Zufallszüge der Spaß-Bots: ein beliebiger legaler Zug statt des Zuges der Stufe.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (18.10.2026 abends): eine Spaßkategorie unter den
 * Einsteigern mit vier Bots um 500 bis 1000, „richtig schlecht“. Stufe 1 liegt auf der Skala von
 * „Deine Spielstärke“ bei etwa 1200 (engine/botstaerke-daten.ts); schwächer wird ein Bot am
 * einfachsten wie die schwächsten Bots von chess.com: In einem Teil der Züge zieht er irgendeinen
 * legalen Zug. Den Rest spielt er wie Stufe 1, damit er nicht nur Unsinn zieht. engine/zugwahl.ts
 * würfelt vor allem anderen (auch vor dem Buch) und ruft dann `zufallszug`.
 * Abhängigkeiten: chessops, engine/spielbewerter.ts (Typ Zugwahl).
 */
import { Chess } from "chessops/chess";
import { parseFen } from "chessops/fen";
import type { NormalMove } from "chessops/types";
import { makeUci, squareRank } from "chessops/util";
import type { Zugwahl } from "./spielbewerter";

/** Grundreihen, auf denen ein Bauer umwandelt (Reihe 8 für Weiß, Reihe 1 für Schwarz). */
const LETZTE_REIHE_WEISS = 7;
const LETZTE_REIHE_SCHWARZ = 0;

/**
 * Alle legalen Züge der Seite am Zug, Umwandlungen immer in eine Dame (ein Zufallszug soll den
 * Bauern nicht zum Springer machen, das wäre Absicht, kein Zufall).
 */
function legaleZuegeMitUmwandlung(pos: Chess): NormalMove[] {
  const zuege: NormalMove[] = [];
  for (const [von, ziele] of pos.allDests()) {
    const bauer = pos.board.get(von)?.role === "pawn";
    for (const nach of ziele) {
      const reihe = squareRank(nach);
      const wandelt = bauer && (reihe === LETZTE_REIHE_WEISS || reihe === LETZTE_REIHE_SCHWARZ);
      zuege.push(wandelt ? { from: von, to: nach, promotion: "queen" } : { from: von, to: nach });
    }
  }
  return zuege;
}

/**
 * Ein zufälliger legaler Zug.
 *
 * Warum: Spaß-Bots spielen einen Teil ihrer Züge ohne jeden Gedanken (Wunsch des Autors).
 * Eingaben: Stellung als FEN, Zufallsquelle (für Tests fest). Ausgabe: der Zug als Fehlerzug
 * ohne Fehlerart (er passt zu keiner Fehlerart der Bücher), Verlust unbekannt und deshalb 0;
 * null ohne legalen Zug oder bei unlesbarer Stellung.
 * Beispiel: Grundstellung, Zufall 0 → der erste der 20 legalen Züge.
 */
export function zufallszug(fen: string, zufall: () => number): Zugwahl | null {
  const setup = parseFen(fen);
  if (setup.isErr) return null;
  const regeln = Chess.fromSetup(setup.value);
  if (regeln.isErr) return null;
  const zuege = legaleZuegeMitUmwandlung(regeln.value);
  const zug = zuege[Math.floor(zufall() * zuege.length)];
  return zug ? { uci: makeUci(zug), quelle: "fehler", fehler: null, verlust: 0 } : null;
}
