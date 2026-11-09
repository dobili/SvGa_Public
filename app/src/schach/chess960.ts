/**
 * Schach960 (Zufallsschach): Startstellungen und die Schreibweise der Rochade für die Engine.
 *
 * Rolle im Gesamtbild: Das Schach-Abenteuer spielt am Varianten-Tisch Schach960
 * (docs/spiel/10_Sprueche_Schauplaetze_Varianten.md, V1). chessops kennt die Regeln schon
 * (Rochade als „König auf Turm“); Stockfish braucht dafür den Modus UCI_Chess960 und schreibt die
 * Rochade dann ebenfalls als „König auf Turm“. Diese Datei entscheidet, wann der Modus nötig ist,
 * und baut die Startstellungen.
 * Wirkung ohne Schach960: keine. In jeder Stellung des gewöhnlichen Schachs (König auf e, Türme
 * mit Rochaderecht auf a und h) liefert `brauchtChess960` false, alles bleibt wie bisher.
 * Abhängigkeiten: chessops.
 * Buchbezug: keiner (Varianten haben keinen Buchbezug, R37); Regel der Rochade wie Kapitel 0.
 */
import { Chess } from "chessops/chess";
import { parseFen } from "chessops/fen";
import type { NormalMove } from "chessops/types";
import { makeUci, squareFile } from "chessops/util";

/** Anzahl der Startstellungen im Schach960. */
export const ANZAHL_STARTSTELLUNGEN = 960;
/** Nummer der gewöhnlichen Grundstellung im Schach960 (Zählung nach Scharnagl). */
export const NUMMER_GRUNDSTELLUNG = 518;

const LINIE_E = 4;
const LINIE_A = 0;
const LINIE_H = 7;
const AUF_REIHE = 8;
/** Linien des Königs nach der kurzen (g) und der langen (c) Rochade im gewöhnlichen Schach. */
const KOENIG_KURZ = 6;
const KOENIG_LANG = 2;

/**
 * Braucht diese Stellung den Schach960-Modus der Engine?
 *
 * Warum: Nur wenn ein Rochaderecht zu einem König außerhalb der e-Linie oder zu einem Turm
 * außerhalb der a- oder h-Linie gehört, versteht Stockfish die Stellung ohne den Modus falsch.
 * Eingabe: Stellung mit Regeln. Ausgabe: true, wenn mindestens ein solches Rochaderecht besteht.
 * Beispiel: Grundstellung → false; „bqnbrkrn/…“ mit Rochaderechten → true.
 * Sonderfall: ohne Rochaderechte immer false (dann ist es gewöhnliches Schach).
 */
export function brauchtChess960Stellung(pos: Chess): boolean {
  for (const turm of pos.castles.castlingRights) {
    const farbe = pos.board.getColor(turm);
    const koenig = farbe ? pos.board.kingOf(farbe) : undefined;
    if (koenig === undefined) continue;
    const linie = squareFile(turm);
    if (squareFile(koenig) !== LINIE_E || (linie !== LINIE_A && linie !== LINIE_H)) return true;
  }
  return false;
}

/** Wie `brauchtChess960Stellung`, aber aus einer FEN; unlesbare FEN → false. */
export function brauchtChess960(fen: string): boolean {
  const setup = parseFen(fen);
  if (setup.isErr) return false;
  const pos = Chess.fromSetup(setup.value);
  return pos.isOk ? brauchtChess960Stellung(pos.value) : false;
}

/**
 * Eine Rochade in der UCI-Schreibweise der Engine.
 *
 * Eingaben: Stellung, Zug „König auf Turm“ (Schreibweise von chessops).
 * Ausgabe: Im Schach960-Modus bleibt „König auf Turm“ (b1a1), sonst der Königszug um zwei Felder
 * (e1g1), wie Stockfish im gewöhnlichen Modus schreibt.
 */
export function rochadeUci(pos: Chess, zug: NormalMove): string {
  if (brauchtChess960Stellung(pos)) return makeUci(zug);
  const reihe = zug.from - (zug.from % AUF_REIHE);
  return makeUci({ from: zug.from, to: reihe + (zug.to > zug.from ? KOENIG_KURZ : KOENIG_LANG) });
}

/** Setzt einen Stein auf das `index`-te noch freie Feld der Grundreihe (Verteilen nach Scharnagl). */
function setzeFrei(reihe: (string | null)[], index: number, stein: string): void {
  const frei = reihe.flatMap((s, linie) => (s === null ? [linie] : []));
  const linie = frei[index];
  if (linie === undefined) throw new Error(`Schach960: kein freies Feld Nummer ${index}`);
  reihe[linie] = stein;
}

/** Die zehn Verteilungen von zwei Springern auf fünf freie Felder (Scharnagl, Tabelle N5N). */
const SPRINGERPAARE: readonly (readonly [number, number])[] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [1, 2],
  [1, 3],
  [1, 4],
  [2, 3],
  [2, 4],
  [3, 4],
];
const LAEUFERLINIEN = 4;
const DAMENPLAETZE = 6;

/**
 * Die Grundreihe einer Startstellung (Zählung nach Scharnagl, 0 bis 959), als Buchstaben von a bis h.
 *
 * Beispiel: 518 → „RNBQKBNR“ (gewöhnliche Grundstellung). Sonderfall: Nummer außerhalb → Rest von 960.
 */
export function grundreihe960(nummer: number): string {
  const gesamt = ANZAHL_STARTSTELLUNGEN;
  let n = ((Math.floor(nummer) % gesamt) + gesamt) % gesamt;
  const reihe: (string | null)[] = Array<string | null>(AUF_REIHE).fill(null);
  reihe[(n % LAEUFERLINIEN) * 2 + 1] = "B";
  n = Math.floor(n / LAEUFERLINIEN);
  reihe[(n % LAEUFERLINIEN) * 2] = "B";
  n = Math.floor(n / LAEUFERLINIEN);
  setzeFrei(reihe, n % DAMENPLAETZE, "Q");
  const [s1, s2] = SPRINGERPAARE[Math.floor(n / DAMENPLAETZE)] ?? [0, 1];
  // Der zweite Springer zuerst, damit sich die Zählung der freien Felder nicht verschiebt.
  setzeFrei(reihe, s2, "N");
  setzeFrei(reihe, s1, "N");
  ["R", "K", "R"].forEach((stein) => setzeFrei(reihe, 0, stein));
  return reihe.join("");
}

/**
 * Die FEN einer Startstellung im Schach960, mit allen vier Rochaderechten.
 *
 * Warum: Begegnungen mit `variante: "schach960"` starten hier. Die Rochaderechte stehen als
 * Linienbuchstaben (Shredder-FEN), damit sie auch bei Türmen außerhalb a und h eindeutig sind.
 * Beispiel: 518 → Grundstellung mit „HAha“.
 */
export function startFen960(nummer: number): string {
  const weiss = grundreihe960(nummer);
  const linien = [...weiss].flatMap((stein, linie) =>
    stein === "R" ? ["abcdefgh".charAt(linie)] : [],
  );
  const [lang = "a", kurz = "h"] = linien;
  const rechte = `${kurz.toUpperCase()}${lang.toUpperCase()}${kurz}${lang}`;
  return `${weiss.toLowerCase()}/pppppppp/8/8/8/8/PPPPPPPP/${weiss} w ${rechte} - 0 1`;
}

/** Eine zufällige Startstellung (Nummer 0 bis 959); `zufall` austauschbar für Tests. */
export function zufallsnummer960(zufall: () => number = Math.random): number {
  return Math.floor(zufall() * ANZAHL_STARTSTELLUNGEN) % ANZAHL_STARTSTELLUNGEN;
}
