/**
 * Finde-Kategorien des Endspiels: F6 Opposition und Schlüsselfelder, F7 Freibauer und Quadrat.
 *
 * Rolle im Gesamtbild: Teil der Erkennungsschicht (findekategorien.ts). Bei König und Bauer gegen
 * König entscheidet die Datenbank (schach/kpk.ts), ob der beste Zug das Ergebnis hält und der
 * gespielte nicht; die Regel des Buches (Opposition, Schlüsselfeld) muss den besten Zug zusätzlich
 * erklären. Mit mehr Bauern gilt dieselbe Regel ohne Datenbank, dann nur ab einem Bauern Verlust.
 * Das Quadrat urteilt nur, wenn die Bauernseite außer dem König keine Figuren hat, sonst halten
 * Figuren den Bauern auf (Konzept 3.2: „hoch im Bauernendspiel, mittel mit Figuren“).
 * Abhängigkeiten: schach/kpk.ts, schach/opposition.ts, schach/schluesselfelder.ts,
 * schach/quadrat.ts, schach/bauernschwaechen.ts.
 * Buchbezug: Kapitel 8, Regel 2 (Opposition), Schlüsselfelder, „Die Regel des Quadrats“,
 * Freibauern, Regel 6.
 */
import type { Board } from "chessops/board";
import type { Color, Square } from "chessops/types";
import { makeSquare } from "chessops/util";
import { bauernschwaechen } from "../schach/bauernschwaechen";
import { istKpk, kpkErgebnis, type KpkErgebnis } from "../schach/kpk";
import { oppositionslage } from "../schach/opposition";
import { quadrat } from "../schach/quadrat";
import { schluesselfelder } from "../schach/schluesselfelder";
import { gegner } from "../schach/stellung";
import {
  stellungNach,
  type Findelage,
  type Findetreffer,
  type Halbzug,
} from "./findekategorien-lage";

/** Stehen nur noch Könige und Bauern auf dem Brett (reines Bauernendspiel)? */
function reinesBauernendspiel(brett: Board): boolean {
  return brett.occupied.diff(brett.king).diff(brett.pawn).isEmpty();
}

/** Hat die Farbe außer König und Bauern keine Figur mehr? */
function nurKoenigUndBauern(brett: Board, farbe: Color): boolean {
  return brett[farbe].diff(brett.king).diff(brett.pawn).isEmpty();
}

/** Das Ergebnis nach dem Zug laut Datenbank; ohne Bauern ist es remis. */
function kpkNach(h: Halbzug): KpkErgebnis | null {
  if (h.nachher.board.pawn.isEmpty()) return "remis";
  return kpkErgebnis(h.nachher.board, h.nachher.turn);
}

/** Die Schlüsselfelder der eigenen Freibauern (bei König und Bauer gegen König: des Bauern). */
function eigeneSchluesselfelder(brett: Board, farbe: Color): Square[] {
  const freie = bauernschwaechen(brett, farbe).freibauern;
  return freie.flatMap((f) => [...schluesselfelder(f.feld, farbe).felder]);
}

/** Welche Regel ein Königszug erfüllt: Opposition nehmen oder ein Schlüsselfeld betreten. */
function koenigsidee(lage: Findelage, h: Halbzug): "opposition" | "schluesselfeld" | null {
  if (h.figur.role !== "king") return null;
  const fremder = h.nachher.board.kingOf(gegner(lage.seite));
  if (fremder !== undefined && oppositionslage(h.zug.to, fremder)) return "opposition";
  const felder = eigeneSchluesselfelder(lage.regeln.board, lage.seite);
  return felder.includes(h.zug.to) ? "schluesselfeld" : null;
}

/** Bei König und Bauer gegen König: Hält der beste Zug das Ergebnis und der gespielte nicht? */
function datenbankEntscheidet(lage: Findelage): boolean {
  const bauer = lage.regeln.board.pawn.first();
  const bauernseite = bauer === undefined ? undefined : lage.regeln.board.get(bauer)?.color;
  const gut: KpkErgebnis = bauernseite === lage.seite ? "gewinn" : "remis";
  return kpkNach(lage.best) === gut && kpkNach(lage.gespielt) !== gut;
}

/**
 * F6 Opposition und Schlüsselfelder: reines Bauernendspiel, der beste Zug ist ein Königszug, der
 * die Opposition nimmt oder ein Schlüsselfeld betritt. Bei König und Bauer gegen König zeigt die
 * Datenbank, dass nur der beste Zug das Ergebnis hält; mit mehr Bauern erfüllt der gespielte Zug
 * die Regel nicht und verliert mindestens einen Bauern.
 *
 * Regel: Kapitel 8, Regel 2 („Wer die Opposition hat …“) und Schlüsselfelder.
 * Beispiel: Abb. 8.23 (Kg2, Bd2 gegen Kf7): Nur 1. Kf3! (Fernopposition) gewinnt; 1. Kg3 nicht.
 */
export function f6Opposition(lage: Findelage): Findetreffer | null {
  if (!reinesBauernendspiel(lage.regeln.board)) return null;
  const idee = koenigsidee(lage, lage.best);
  if (!idee) return null;
  const datenbank = istKpk(lage.regeln.board);
  if (datenbank && !datenbankEntscheidet(lage)) return null;
  if (!datenbank) {
    if (lage.verlust < lage.schwellen.oppositionVerlustAb) return null;
    if (koenigsidee(lage, lage.gespielt) !== null) return null;
  }
  const feld = makeSquare(lage.best.zug.to);
  return { kennung: "F6", details: { zug: lage.best.san, feld, idee, datenbank } };
}

/** Zieht der Zug einen Freibauern, den der gegnerische König laut Quadratregel nicht einholt? */
function laeuftDurch(lage: Findelage, h: Halbzug): boolean {
  if (h.figur.role !== "pawn" || h.zug.promotion) return false;
  if (!nurKoenigUndBauern(h.nachher.board, gegner(lage.seite))) return false;
  const frei = bauernschwaechen(h.nachher.board, lage.seite).freibauern;
  const stellung = stellungNach(h);
  if (!stellung || !frei.some((f) => f.feld === h.zug.to)) return false;
  const q = quadrat(stellung, h.zug.to);
  return q.haeltAuf === false && q.ausnahme === null;
}

/** Wandelt die Seite in der Folge um, und steht die neue Figur am Ende der Folge noch? */
function wandeltUm(lage: Findelage, folge: readonly Halbzug[]): boolean {
  const ende = folge.at(-1)?.nachher;
  return folge.some((h) => {
    if (h.figur.color !== lage.seite || !h.zug.promotion) return false;
    const steht = ende?.board.get(h.zug.to);
    return steht?.role === h.zug.promotion && steht.color === lage.seite;
  });
}

/** Die gegnerischen Freibauern, die der eigene König nach dem Zug laut Quadratregel einholt. */
function eingeholte(lage: Findelage, h: Halbzug): Square[] {
  const feind = gegner(lage.seite);
  if (!nurKoenigUndBauern(h.nachher.board, feind)) return [];
  const stellung = stellungNach(h);
  if (!stellung) return [];
  return bauernschwaechen(h.nachher.board, feind)
    .freibauern.map((f) => f.feld)
    .filter((feld) => {
      const q = quadrat(stellung, feld);
      return q.haeltAuf === true && q.ausnahme === null;
    });
}

/** Freibauern des Gegners, die nach dem Zug noch stehen und die der König nicht einholt. */
function verpassteQuadrate(h: Halbzug, kandidaten: readonly Square[]): Square[] {
  const stellung = stellungNach(h);
  if (!stellung) return [];
  return kandidaten.filter((feld) => {
    const stein = h.nachher.board.get(feld);
    return stein?.role === "pawn" && quadrat(stellung, feld).haeltAuf === false;
  });
}

/**
 * F7 Freibauer und Quadrat (nur im Endspiel): Der beste Zug zieht einen Freibauern, den der
 * gegnerische König nicht mehr einholt, oder die Fortsetzung wandelt um, oder der beste
 * Königszug betritt das Quadrat eines gegnerischen Freibauern, das der gespielte Zug verfehlt.
 * Der gespielte Zug erfüllt die jeweilige Idee nicht.
 *
 * Regel: Kapitel 8, „Die Regel des Quadrats“, Freibauern, Regel 6.
 * Beispiel: Abb. 8.35 (Bauer b4, Weiß am Zug): 1. b5 läuft durch. Abb. 8.36 (Schwarz am Zug):
 * 1... Kf6 betritt das Quadrat, 1... Kh5 nicht.
 */
export function f7Freibauer(lage: Findelage): Findetreffer | null {
  if (lage.eingabe.phase !== "endspiel") return null;
  const { best, gespielt } = lage;
  const zug = best.san;
  if (laeuftDurch(lage, best) && !laeuftDurch(lage, gespielt))
    return { kennung: "F7", details: { zug, feld: makeSquare(best.zug.to), idee: "freibauer" } };
  if (wandeltUm(lage, lage.folgeBest) && !wandeltUm(lage, lage.folgeGespielt))
    return { kennung: "F7", details: { zug, idee: "umwandlung" } };
  if (best.figur.role !== "king") return null;
  const verpasst = verpassteQuadrate(gespielt, eingeholte(lage, best));
  const bauer = verpasst[0];
  if (bauer === undefined) return null;
  return { kennung: "F7", details: { zug, feld: makeSquare(bauer), idee: "quadrat" } };
}
