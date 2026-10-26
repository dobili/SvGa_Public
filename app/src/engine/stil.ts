/**
 * Spielstil eines eigenen Gegners: aggressiv oder defensiv (Wunsch des Autors, 17.10.2026).
 *
 * Rolle im Gesamtbild: Ein Regler von −2 (sehr defensiv) bis +2 (sehr aggressiv). Die Zugwahl
 * (engine/zugwahl.ts) holt mehrere Kandidaten der Engine und wählt unter denen, die höchstens
 * 0,3 Bauerneinheiten je Reglerstufe vom Zug der Stufe entfernt liegen (dem Zug, den die Stufe
 * ohne Stil spielen würde), den Zug, der dem Stil am meisten entspricht. Bezug ist der Zug der
 * Stufe, nicht der beste Zug der Engine: Sonst spielten Bots mit Stil fast so gut wie die Engine
 * (Messung aller damaligen 64 Bots: Stil 0 im Mittel 3,1 von 6 Punkten gegen die eigene Stufe,
 * Stil ungleich 0 im Mittel 4,8). Aggressiv (Vorschlag des Autors): Zielfeld in der gegnerischen
 * Bretthälfte, im Viertel des gegnerischen Königs, ein Schlag oder ein Schach. Defensiv: Zielfeld
 * in der eigenen Hälfte, im Viertel des eigenen Königs, kein Schlag. Toleranz 0,3 je Reglerstufe
 * (Entscheidung des Autors zu S13): Der Stil wird spürbar. Weil er um den Zug der
 * Stufe herum nach oben wie nach unten wählen darf, ändert er die Stärke im Mittel wenig; nur auf
 * der stärksten Stufe (der Zug der Stufe ist der beste) kann er nur schlechter wählen: IM Haas
 * mit Stil −2 holte gegen die Stufe darunter nur 1,5 von 6 Punkten, sehr aggressiv oder sehr
 * defensiv kostet dort etwa eine Stufe.
 * Abhängigkeiten: chessops, engine/spielbewerter.ts (wertFuer), engine/uci.ts (Variante).
 */
import { Chess } from "chessops/chess";
import { parseFen } from "chessops/fen";
import type { Color, Square } from "chessops/types";
import { opposite, parseUci, squareFile, squareRank } from "chessops/util";
import { wertFuer } from "./spielbewerter";
import type { Variante } from "./uci";

/** Reglerstellung „sehr defensiv“. */
export const STIL_MIN = -2;
/** Reglerstellung „sehr aggressiv“. */
export const STIL_MAX = 2;
/** Reglerstellung ohne Stil: die Zugwahl der Stufe bleibt unverändert. */
export const STIL_NEUTRAL = 0;
/** Erlaubter Verlust je Reglerstufe in Bauerneinheiten. */
export const STIL_TOLERANZ = 0.3;
/** So viele Kandidaten holt die Zugwahl bei einem Stil ungleich 0. */
export const STIL_KANDIDATEN = 4;
/** Das Brett in zwei Hälften und vier Viertel: Linie und Reihe unter 4 oder ab 4. */
const MITTE = 4;
/** Punkte je Merkmal. */
const PUNKT_HAELFTE = 1;
const PUNKT_VIERTEL = 1;
const PUNKT_SCHLAG = 0.5;
const PUNKT_SCHACH = 0.5;

/** Liegt das Feld in der Bretthälfte dieser Farbe (Weiß: Reihen 1 bis 4)? */
function inHaelfteVon(feld: Square, farbe: Color): boolean {
  return farbe === "white" ? squareRank(feld) < MITTE : squareRank(feld) >= MITTE;
}

/** Liegt das Feld im selben Viertel des Bretts wie der König? */
function imViertelVon(feld: Square, koenig: Square | undefined): boolean {
  if (koenig === undefined) return false;
  return (
    squareFile(feld) < MITTE === squareFile(koenig) < MITTE &&
    squareRank(feld) < MITTE === squareRank(koenig) < MITTE
  );
}

/**
 * Wie gut ein Zug zum Stil passt (0 bis 3): bei aggressivem Stil Punkte für die gegnerische
 * Hälfte, das Viertel des gegnerischen Königs, Schlag und Schach; bei defensivem Stil für die
 * eigene Hälfte, das Viertel des eigenen Königs und keinen Schlag. Stil 0: immer 0.
 * Beispiel: Grundstellung, Stil +2, „e2e4“ → 1 (gegnerische Hälfte? nein, e4 ist Reihe 4: 0;
 * Viertel des Königs e8: ja, 1); „g1f3“ → 0.
 */
export function stilwert(fen: string, uci: string, stil: number): number {
  if (stil === STIL_NEUTRAL) return 0;
  const setup = parseFen(fen);
  const zug = parseUci(uci);
  if (setup.isErr || !zug || !("to" in zug)) return 0;
  const regeln = Chess.fromSetup(setup.value);
  if (regeln.isErr) return 0;
  const pos = regeln.value;
  const eigene = pos.turn;
  const schlag = pos.board.get(zug.to) !== undefined;
  if (stil > 0) {
    const nach = pos.clone();
    nach.play(zug);
    return (
      (inHaelfteVon(zug.to, opposite(eigene)) ? PUNKT_HAELFTE : 0) +
      (imViertelVon(zug.to, pos.board.kingOf(opposite(eigene))) ? PUNKT_VIERTEL : 0) +
      (schlag ? PUNKT_SCHLAG : 0) +
      (nach.isCheck() ? PUNKT_SCHACH : 0)
    );
  }
  return (
    (inHaelfteVon(zug.to, eigene) ? PUNKT_HAELFTE : 0) +
    (imViertelVon(zug.to, pos.board.kingOf(eigene)) ? PUNKT_VIERTEL : 0) +
    (schlag ? 0 : PUNKT_SCHLAG)
  );
}

/**
 * Wählt unter den Kandidaten der Engine (beste zuerst) den Zug nach dem Stil: unter allen, deren
 * Wert höchstens STIL_TOLERANZ · |Stil| vom Bezugszug abweicht, der mit dem höchsten Stilwert;
 * bei Gleichstand der Bezugszug oder der frühere. Bezug ist der Zug, den die Stufe ohne Stil
 * spielen würde, ohne Angabe der beste. Ausgabe: UCI oder null ohne Kandidaten;
 * steht der Bezugszug nicht unter den Kandidaten, bleibt er (ohne Wert kein Vergleich).
 * Beispiel: Stil +1 (Toleranz 0,3), Kandidaten e4 (+0,3), Sf3 (+0,25), a3 (−0,2) → e4 oder Sf3,
 * je nach Stilwert; a3 liegt zu weit zurück. Mit Bezug a3 kommen nur a3 und Züge bis +0,1 in
 * Frage, also weder e4 noch Sf3: Der Stil hebt einen schwachen Zug der Stufe nicht an.
 */
export function stilwahl(
  fen: string,
  varianten: readonly Variante[],
  stil: number,
  bezug?: string,
): string | null {
  const bezugsvariante = bezug ? varianten.find((v) => v.zuege[0] === bezug) : varianten[0];
  const ausgang = bezugsvariante?.zuege[0];
  if (!bezugsvariante || !ausgang) return bezug ?? null;
  const weissAmZug = fen.split(" ")[1] !== "b";
  const bezugswert = wertFuer(bezugsvariante.wert, weissAmZug);
  const toleranz = STIL_TOLERANZ * Math.abs(stil);
  let wahl = ausgang;
  let bestePunkte = stilwert(fen, ausgang, stil);
  for (const v of varianten) {
    const uci = v.zuege[0];
    if (!uci || uci === ausgang) continue;
    if (Math.abs(bezugswert - wertFuer(v.wert, weissAmZug)) > toleranz) continue;
    const punkte = stilwert(fen, uci, stil);
    if (punkte > bestePunkte) {
      wahl = uci;
      bestePunkte = punkte;
    }
  }
  return wahl;
}
